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
    const offPlayerJoined = gameWebSocket.on("PLAYER_JOINED", (data) => {
      console.log(" プレイヤー参加:", data);
      if (data.newUser) {
        addPlayer(data.newUser);
      }
    });

    // プレイヤーが退出した時
    const offPlayerLeft = gameWebSocket.on("PLAYER_LEFT", (data) => {
      console.log(" プレイヤー退出:", data);
      if (data.userId) {
        removePlayer(data.userId);
      }
    });

    // ゲームサーバへの移動指示を受信
    const offGoToGame = gameWebSocket.on("GO_TO_GAME_SERVER", (data) => {
      // 重複実行防止
      if (isTransitioning.current) {
        console.log(" 既に遷移中です");
        return;
      }
      isTransitioning.current = true;

      console.log("ゲームサーバへ移動:", data);
      setIsLoading(true);

      const roomId = data.roomId;
      const gameUrl = `${data.nextEndpoint}&userId=${user}`;

      console.log(" 接続先:", gameUrl);

      // ゲームサーバに接続
      gameWebSocket.connectToGameServer(gameUrl);

      // 接続成功後に JOIN_GAME を送信してページ遷移
      let attempts = 0;
      const maxAttempts = 50; // 5秒間

      const checkConnection = setInterval(() => {
        attempts++;

        if (gameWebSocket.isGameServerConnected()) {
          clearInterval(checkConnection);

          // ゲーム画面へ遷移してから JOIN_GAME を送信する（ホストが開始メッセージを逃さないように）
          console.log(" ゲーム画面へ遷移（先）:", `/game/${roomId}`);
          router.push(`/game/${roomId}`);

          // 少し待ってから JOIN_GAME を送信（ページ遷移後にハンドラが登録される想定）
          // 300ms だと稀にハンドラ登録が間に合わないため余裕を持たせる
          setTimeout(() => {
            gameWebSocket.sendToGameServer({
              type: "JOIN_GAME",
              userId: user,
              roomId: roomId,
            });
            console.log("📤 JOIN_GAME 送信（遅延）:", { userId: user, roomId });
          }, 800);
        }

        if (attempts >= maxAttempts) {
          clearInterval(checkConnection);
          if (!gameWebSocket.isGameServerConnected()) {
            console.error(" ゲームサーバへの接続タイムアウト");
            setError("ゲームサーバへの接続に失敗しました");
            setIsLoading(false);
            isTransitioning.current = false;
          }
        }
      }, 100);
    });

    return () => {
      offPlayerJoined();
      offPlayerLeft();
      offGoToGame();
    };
  }, [router, user, addPlayer, removePlayer]);

  const startGame = useCallback(
    (roomId: string) => {
      // 重複実行防止
      if (isLoading || isTransitioning.current) {
        console.log(" 既にゲーム開始処理中です");
        return;
      }

      setIsLoading(true);
      setError("");

      gameWebSocket.send({
        type: "START_GAME",
        userId: user!,
        roomId: roomId,
      });
      // START_GAME はクライアント管理サーバへ送信する
      gameWebSocket.sendToClientManage({
        type: "START_GAME",
        userId: user!,
        roomId: roomId,
      });
      console.log(" START_GAME 送信:", { userId: user, roomId });
    },
    [user, isLoading],
  );

  const leaveRoom = useCallback(() => {
    router.push("/lobby");
  }, [router]);

  return { isLoading, error, startGame, leaveRoom };
};
