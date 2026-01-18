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
    // グローバルなハンドラは個別解除関数を使って登録／解除する
    const offCreate = gameWebSocket.on(
      "CREATE_ROOM_SUCCESS",
      (data: CreateRoomSuccessResponse) => {
        console.log("✅ ルーム作成成功 (global handler):", data);
        setIsLoading(false);

        const maxPlayers = data.maxPlayers;
        const lives = data.lives;
        if (maxPlayers && lives) {
          setRoomSettings(maxPlayers, lives);
        }

        if (user) setPlayers([user]);
        router.push(`/room/${data.roomId}`);
      },
    );

    const offJoin = gameWebSocket.on(
      "JOIN_ROOM_SUCCESS",
      (data: JoinRoomSuccessResponse) => {
        console.log("✅ ルーム参加成功 (global handler):", data);
        setIsLoading(false);

        if (data.maxPlayers && data.lives) {
          setRoomSettings(data.maxPlayers, data.lives);
          console.log("📋 ルーム設定を適用:", {
            maxPlayers: data.maxPlayers,
            lives: data.lives,
          });
        }

        if (data.currentPlayers) {
          setPlayers(data.currentPlayers);
        } else if (user) {
          addPlayer(user);
        }

        router.push(`/room/${data.roomId}`);
      },
    );

    const offError = gameWebSocket.on("ERROR", (data: ErrorResponse) => {
      console.error("❌ エラー:", data);
      setError(data.message);
      setIsLoading(false);
    });

    return () => {
      offCreate();
      offJoin();
      offError();
    };
  }, [router, user, setRoomSettings, setPlayers, addPlayer]);

  // ルーム作成処理（Promiseで応答を待てる）
  const createRoom = async (
    maxPlayers: number,
    initialLife: number,
  ): Promise<CreateRoomSuccessResponse | ErrorResponse | null> => {
    setIsLoading(true);
    setError("");

    setRoomSettings(maxPlayers, initialLife);

    const message: CreateRoomMessage = {
      type: "CREATE_ROOM",
      userId: user!,
      numOfPlayer: maxPlayers,
      numOfLife: initialLife,
    };

    return new Promise((resolve) => {
      const offSuccess = gameWebSocket.on(
        "CREATE_ROOM_SUCCESS",
        (data: CreateRoomSuccessResponse) => {
          setIsLoading(false);
          if (user) setPlayers([user]);
          offSuccess();
          offErr();
          resolve(data);
        },
      );

      const offErr = gameWebSocket.on("ERROR", (err: ErrorResponse) => {
        setIsLoading(false);
        setError(err.message);
        offSuccess();
        offErr();
        resolve(err);
      });

      gameWebSocket.sendToClientManage(message);
    });
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

    gameWebSocket.sendToClientManage(message);
  };

  return { isLoading, error, createRoom, joinRoom };
};
