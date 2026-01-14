import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const useRoomController = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // ゲーム開始要求
  const startGame = async (roomId: string) => {
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/mock/game/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "START_GAME",
          userId: user,
          roomId,
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        router.push(`/game/${roomId}`);
        return true;
      } else {
        setError(data.message || "ゲーム開始に失敗しました");
        return false;
      }
    } catch (error) {
      console.error(error);
      setError("ゲーム開始中にエラーが発生しました");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const leaveRoom = () => {
    // WebSocket切断などの処理をここに書く
    router.push("/lobby");
  };

  return { isLoading, error, startGame, leaveRoom };
};
