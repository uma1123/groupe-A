import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import type {
  CreateRoomMessage,
  JoinRoomMessage,
  CreateRoomSuccessResponse,
  JoinRoomSuccessResponse,
  ErrorResponse,
} from "@/types/websocket";
import { gameWebSocket } from "@/lib/websocket";

export const useLobbyController = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // ルーム作成成功
    gameWebSocket.on(
      "CREATE_ROOM_SUCCESS",
      (data: CreateRoomSuccessResponse) => {
        console.log("✅ ルーム作成成功:", data);
        setIsLoading(false);
        router.push(`/room/${data.roomId}`);
      }
    );

    // ルーム参加成功
    gameWebSocket.on("JOIN_ROOM_SUCCESS", (data: JoinRoomSuccessResponse) => {
      console.log("✅ ルーム参加成功:", data);
      setIsLoading(false);
      router.push(`/room/${data.roomId}`);
    });

    // エラーハンドラ
    gameWebSocket.on("ERROR", (data: ErrorResponse) => {
      console.error("❌ エラー:", data);
      setError(data.message);
      setIsLoading(false);
    });

    return () => {
      gameWebSocket.off("CREATE_ROOM_SUCCESS");
      gameWebSocket.off("JOIN_ROOM_SUCCESS");
      gameWebSocket.off("ERROR");
    };
  }, [router]);

  // ルーム作成処理
  const createRoom = async (maxPlayers: number, initialLife: number) => {
    setIsLoading(true);
    setError("");

    const message: CreateRoomMessage = {
      type: "CREATE_ROOM",
      userId: user!,
      numOfPlayer: maxPlayers, // ★ 変更
      numOfLife: initialLife, // ★ 変更
    };

    gameWebSocket.send(message);
  };

  // ルーム参加処理
  const joinRoom = async (roomId: string | number) => {
    if (!roomId || (typeof roomId === "number" && isNaN(roomId))) {
      setError("有効なルームIDを入力してください。");
      return;
    }

    setIsLoading(true);
    setError("");

    const message: JoinRoomMessage = {
      type: "JOIN_ROOM",
      userId: user!,
      roomId: Number(roomId), // ★ 数値に変換
    };

    gameWebSocket.send(message);
  };

  return { isLoading, error, createRoom, joinRoom };
};
