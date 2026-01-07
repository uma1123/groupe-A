import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const useLobbyController = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // ルーム作成処理
  const createRoom = async (maxPlayers: number, initialLife: number) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/mock/room/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "CREATE_ROOM",
          userId: user,
          settings: {
            maxPlayers,
            lives: initialLife,
          },
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        return data.roomId;
      } else {
        setError(data.message || "ルームの作成に失敗しました。");
        return false;
      }
    } catch (error) {
      console.error(error);
      setError("ルームの作成中にエラーが発生しました。");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // ルーム参加処理
  const joinRoom = async (roomId: string | number) => {
    if (!roomId || (typeof roomId === "number" && isNaN(roomId))) {
      setError("有効なルームIDを入力してください。");
      return false;
    }

    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/mock/room/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "JOIN_ROOM",
          userId: user,
          roomId: roomId.toString(),
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        router.push(`/room/${roomId}`);
        return true;
      } else {
        setError(data.message || "ルームへの参加に失敗しました。");
        return false;
      }
    } catch (error) {
      console.error(error);
      setError("ルームへの参加中にエラーが発生しました。");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, createRoom, joinRoom };
};
