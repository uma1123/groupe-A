import { useRouter } from "next/navigation";
import { useState } from "react";

export const useRoomController = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // ゲーム開始要求
  // プレイヤー数、ライフ数、ターン数をサーバーに送信してゲームを開始する処理を追加する(1/7)
  const startGame = async (roomId: string) => {
    setIsLoading(true);
    setError("");

    try {
      // WebScoketでの通知などがあればここで行う
      const res = await fetch("/api/mock/game/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomId }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        router.push(`/game/${roomId}`);
        return true;
      }
    } catch (error) {
      console.error(error);
      setError("ゲーム開始に失敗しました");
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
