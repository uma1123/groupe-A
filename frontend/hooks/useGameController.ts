import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

const TOTAL_ROUNDS = 3; // 仮のラウンド数

export const useGameController = (roomId: string) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [waitingForOthers, setWaitingForOthers] = useState(false);
  const [showRoundResult, setShowRoundResult] = useState(false);
  const [showFinalResult, setShowFinalResult] = useState(false);
  const [gameResult, setGameResult] = useState<"WIN" | "LOSE" | null>(null);
  const [currentRound, setCurrentRound] = useState(1);
  const [roundResults, setRoundResults] = useState<("WIN" | "LOSE")[]>([]);

  // 数値送信
  const submitNumber = useCallback(async (number: number) => {
    setIsLoading(true);
    try {
      // 送信完了状態にする
      setIsSubmitted(true);
      setWaitingForOthers(true);

      // 擬似的に「全員揃ったイベント」を2秒後に発火させる
      setTimeout(() => {
        setWaitingForOthers(false);
        setShowRoundResult(true);

        // ランダムに勝敗を決定
        const didWin = Math.random() > 0.5;
        setGameResult(didWin ? "WIN" : "LOSE");

        // ラウンド結果を保存
        setRoundResults((prev) => [...prev, didWin ? "WIN" : "LOSE"]);

        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Error submitting number:", error);
      setError("送信中にエラーが発生しました");
      setIsLoading(false);
    }
  }, []);

  const nextRound = useCallback(() => {
    // ラウンド結果画面を閉じる
    setShowRoundResult(false);
    setGameResult(null);

    // 最終ラウンドチェック
    if (currentRound >= TOTAL_ROUNDS) {
      // ゲーム終了：最終結果を計算
      setShowFinalResult(true);

      // 最終勝敗を決定（勝ったラウンドが多いか）
      const winCount = roundResults.filter((r) => r === "WIN").length;
      const finalResult = winCount > TOTAL_ROUNDS / 2 ? "WIN" : "LOSE";
      setGameResult(finalResult);
    } else {
      // 次のラウンドへ
      setCurrentRound((prev) => prev + 1);
      setIsSubmitted(false);
    }
  }, [currentRound, roundResults]);

  const exitGame = useCallback(() => {
    router.push("/lobby");
  }, [router]);

  // ゲームをリセット（テスト用）
  const resetGame = useCallback(() => {
    setCurrentRound(1);
    setRoundResults([]);
    setIsSubmitted(false);
    setWaitingForOthers(false);
    setShowRoundResult(false);
    setShowFinalResult(false);
    setGameResult(null);
  }, []);

  return {
    submitNumber,
    isLoading,
    error,
    isSubmitted,
    waitingForOthers,
    showRoundResult,
    showFinalResult,
    gameResult,
    currentRound,
    totalRounds: TOTAL_ROUNDS,
    roundResults,
    nextRound,
    exitGame,
    resetGame,
    setGameResult,
  };
};
