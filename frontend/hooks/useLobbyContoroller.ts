import { useAuth } from "@/context/AuthContext";
import { useRoomContext } from "@/context/RoomContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import type {
  CreateRoomMessage,
  JoinRoomMessage,
  ErrorResponse,
  CreateRoomSuccessResponse,
  JoinRoomSuccessResponse,
} from "@/types/websocket";
import { gameWebSocket } from "@/lib/websocket";

export const useLobbyController = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { setRoomSettings, setPlayers, addPlayer } = useRoomContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // ルーム作成成功
    gameWebSocket.on(
      "CREATE_ROOM_SUCCESS",
      (data: CreateRoomSuccessResponse) => {
        console.log("✅ ルーム作成成功:", data);
        setIsLoading(false);

        // サーバーからの設定情報を保存
        const maxPlayers = data.maxPlayers;
        const lives = data.lives;

        if (maxPlayers && lives) {
          setRoomSettings(maxPlayers, lives);
        }

        // 自分をプレイヤーリストに追加
        if (user) {
          setPlayers([user]);
        }

        router.push(`/room/${data.roomId}`);
      }
    );

    // ルーム参加成功
    gameWebSocket.on("JOIN_ROOM_SUCCESS", (data: JoinRoomSuccessResponse) => {
      console.log("✅ ルーム参加成功:", data);
      setIsLoading(false);

      // ★ サーバーからの設定情報を保存
      if (data.maxPlayers && data.lives) {
        setRoomSettings(data.maxPlayers, data.lives);
        console.log("📋 ルーム設定を適用:", {
          maxPlayers: data.maxPlayers,
          lives: data.lives,
        });
      }

      // プレイヤーリストを設定
      if (data.currentPlayers) {
        setPlayers(data.currentPlayers);
      } else if (user) {
        addPlayer(user);
      }

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
  }, [router, user, setRoomSettings, setPlayers, addPlayer]);

  // ルーム作成処理
  const createRoom = async (maxPlayers: number, initialLife: number) => {
    setIsLoading(true);
    setError("");

    // 事前にルーム設定を保存（レスポンスに含まれない場合の保険）
    setRoomSettings(maxPlayers, initialLife);

    const message: CreateRoomMessage = {
      type: "CREATE_ROOM",
      userId: user!,
      numOfPlayer: maxPlayers,
      numOfLife: initialLife,
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
      roomId: Number(roomId),
    };

    gameWebSocket.send(message);
  };

  return { isLoading, error, createRoom, joinRoom };
};
