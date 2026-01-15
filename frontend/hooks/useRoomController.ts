import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import type {
  StartGameMessage,
  GoToGameServerResponse,
  ErrorResponse,
} from "@/types/websocket";
import { gameWebSocket } from "@/lib/websocket";

export const useRoomController = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // ゲームサーバへの移動指示を受信
    gameWebSocket.on("GO_TO_GAME_SERVER", (data: GoToGameServerResponse) => {
      console.log("🎮 ゲームサーバへ移動:", data);

      // ★ クライアント管理サーバを切断
      gameWebSocket.disconnectClientManage();

      // ★ ゲームサーバに接続
      const gameUrl =
        data.nextEndpoint ||
        process.env.NEXT_PUBLIC_GAME_WS_URL ||
        "ws://localhost:8081/game";
      gameWebSocket.connectToGameServer(gameUrl);

      // ★ ゲーム画面へ遷移
      router.push(`/game/${data.roomId}`);
    });

    return () => {
      gameWebSocket.off("GO_TO_GAME_SERVER");
    };
  }, [router]);

  const startGame = async (roomId: string) => {
    setIsLoading(true);
    setError("");

    const message: StartGameMessage = {
      type: "START_GAME",
      userId: user!,
      roomId,
    };

    gameWebSocket.send(message);
  };

  const leaveRoom = () => {
    router.push("/lobby");
  };

  return { isLoading, error, startGame, leaveRoom };
};
