import { useAuth } from "@/context/AuthContext";
import { useRoomContext } from "@/context/RoomContext";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import { gameWebSocket } from "@/lib/websocket";

export const useRoomController = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { addPlayer, removePlayer } = useRoomContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const isTransitioning = useRef(false);

  useEffect(() => {
    // 他のプレイヤーが参加した時
    gameWebSocket.on("PLAYER_JOINED", (data) => {
      console.log("👤 プレイヤー参加:", data);
      if (data.newUser) {
        addPlayer(data.newUser);
      }
    });

    // プレイヤーが退出した時
    gameWebSocket.on("PLAYER_LEFT", (data) => {
      console.log("👤 プレイヤー退出:", data);
      if (data.userId) {
        removePlayer(data.userId);
      }
    });

    // ゲームサーバへの移動指示を受信
    gameWebSocket.on("GO_TO_GAME_SERVER", (data) => {
      // 重複実行防止
      if (isTransitioning.current) {
        console.log("⚠️ 既に遷移中です");
        return;
      }
      isTransitioning.current = true;

      console.log("🎮 ゲームサーバへ移動:", data);
      setIsLoading(true);

      const roomId = data.roomId;
      const gameUrl = `${data.nextEndpoint}&userId=${user}`;

      console.log("🔗 接続先:", gameUrl);

      // ゲームサーバに接続
      gameWebSocket.connectToGameServer(gameUrl);

      // 接続成功後に JOIN_GAME を送信してページ遷移
      let attempts = 0;
      const maxAttempts = 50; // 5秒間

      const checkConnection = setInterval(() => {
        attempts++;

        if (gameWebSocket.isGameServerConnected()) {
          clearInterval(checkConnection);

          // JOIN_GAME メッセージを送信
          gameWebSocket.sendToGameServer({
            type: "JOIN_GAME",
            userId: user,
            roomId: roomId,
          });

          console.log("📤 JOIN_GAME 送信:", { userId: user, roomId });

          // 少し待ってからゲーム画面へ遷移
          setTimeout(() => {
            console.log("🚀 ゲーム画面へ遷移:", `/game/${roomId}`);
            router.push(`/game/${roomId}`);
          }, 300);
        }

        if (attempts >= maxAttempts) {
          clearInterval(checkConnection);
          if (!gameWebSocket.isGameServerConnected()) {
            console.error("❌ ゲームサーバへの接続タイムアウト");
            setError("ゲームサーバへの接続に失敗しました");
            setIsLoading(false);
            isTransitioning.current = false;
          }
        }
      }, 100);
    });

    return () => {
      gameWebSocket.off("PLAYER_JOINED");
      gameWebSocket.off("PLAYER_LEFT");
      gameWebSocket.off("GO_TO_GAME_SERVER");
    };
  }, [router, user, addPlayer, removePlayer]);

  const startGame = useCallback(
    (roomId: string) => {
      // 重複実行防止
      if (isLoading || isTransitioning.current) {
        console.log("⚠️ 既にゲーム開始処理中です");
        return;
      }

      setIsLoading(true);
      setError("");

      gameWebSocket.send({
        type: "START_GAME",
        userId: user!,
        roomId: roomId,
      });

      console.log("📤 START_GAME 送信:", { userId: user, roomId });
    },
    [user, isLoading]
  );

  const leaveRoom = useCallback(() => {
    router.push("/lobby");
  }, [router]);

  return { isLoading, error, startGame, leaveRoom };
};
