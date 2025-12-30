import { useRouter } from "next/navigation";
import { useState } from "react";

export const useLobbyController = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // ルーム作成処理
  const createRoom = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/mock/room/create", {
        method: "POST",
      });
      const data = await res.json();

      if (res.ok && data.success) {
        router.push(`/room/${data.roomId}`);
        return true;
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
  const joinRoom = async (roomId: number) => {
    if (!roomId || isNaN(roomId)) {
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
        body: JSON.stringify({ roomId }),
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
