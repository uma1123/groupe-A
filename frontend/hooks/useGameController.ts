import { useRouter } from "next/navigation";
import { useCallback, useState, useRef, useEffect } from "react";
import { Player, DEFAULT_TARGET_VALUE } from "@/types/game";
import { makeMockPlayers } from "@/lib/gameMockData";
import { useAuth } from "@/context/AuthContext";

const TOTAL_ROUNDS = 3;

export const useGameController = (roomId: string) => {
  const router = useRouter();
  const { user } = useAuth(); // ユーザー名取得のためにここでもAuthを使う

  // --- State ---
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [waitingForOthers, setWaitingForOthers] = useState(false);
  
  // 結果表示フラグ
  const [showRoundResult, setShowRoundResult] = useState(false);
  const [showFinalResult, setShowFinalResult] = useState(false);
  const [gameResult, setGameResult] = useState<"WIN" | "LOSE" | null>(null); // ラウンドごとの勝敗
  
  // ゲームデータ
  const [currentRound, setCurrentRound] = useState(1);
  const [roundResults, setRoundResults] = useState<("WIN" | "LOSE")[]>([]);
  const [targetValue, setTargetValue] = useState(DEFAULT_TARGET_VALUE);
  
  // ★重要: プレイヤー状態をここで管理する
  const [players, setPlayers] = useState<Player[]>(() =>
    makeMockPlayers(user || "Player 1")
  );

  // タイマー管理用（アンマウント時のクリーンアップ）
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // --- Actions ---

  // 数値送信 (Mock Logic)
  const submitNumber = useCallback(async (number: number) => {
    setIsLoading(true);
    try {
      setIsSubmitted(true);
      setWaitingForOthers(true);

      // 擬似通信ラグ (2秒)
      timerRef.current = setTimeout(() => {
        setWaitingForOthers(false);
        setShowRoundResult(true);

        // 1. ランダムに勝敗を決定
        const isUserWin = Math.random() > 0.5;
        const result = isUserWin ? "WIN" : "LOSE";
        setGameResult(result);
        setRoundResults((prev) => [...prev, result]);

        // 2. ★重要: ライフ減少ロジック (Mock)
        setPlayers((prevPlayers) => {
          return prevPlayers.map((p) => {
            // 自分(You)の処理
            if (p.isYou) {
              const newLives = isUserWin ? p.lives : p.lives - 1;
              return {
                ...p,
                lives: newLives,
                status: newLives <= 0 ? "dead" : "alive",
                choice: number, // 自分の選択値を記録
              };
            }
            // 他のBotプレイヤーの処理（ランダムに減らす）
            if (p.status === "alive") {
              const botWin = Math.random() > 0.5;
              const newLives = botWin ? p.lives : p.lives - 1;
              return {
                ...p,
                lives: newLives,
                status: newLives <= 0 ? "dead" : "alive",
                choice: Math.floor(Math.random() * 100), // 適当な数値を選択させる
              };
            }
            return p;
          });
        });

        // 3. ターゲット数値をランダム更新（演出用）
        setTargetValue(Number((Math.random() * 100).toFixed(3)));

        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Error submitting number:", error);
      setError("送信中にエラーが発生しました");
      setIsLoading(false);
    }
  }, []);

  // 次のラウンドへ
  const nextRound = useCallback(() => {
    setShowRoundResult(false);
    setGameResult(null);

    // 自分のライフが0なら、即ゲームオーバー画面へ
    const myPlayer = players.find(p => p.isYou);
    if (myPlayer && myPlayer.lives <= 0) {
        setShowFinalResult(true);
        return; 
    }

    if (currentRound >= TOTAL_ROUNDS) {
      // 最終ラウンド終了
      setShowFinalResult(true);
      // 最終結果判定（生き残っていれば勝ちとする）
      setGameResult("WIN"); 
    } else {
      // 継続
      setCurrentRound((prev) => prev + 1);
      setIsSubmitted(false);
    }
  }, [currentRound, players]);

  const exitGame = useCallback(() => {
    router.push("/lobby");
  }, [router]);

  // デバッグ用リセット
  const resetGame = useCallback(() => {
    setCurrentRound(1);
    setRoundResults([]);
    setIsSubmitted(false);
    setWaitingForOthers(false);
    setShowRoundResult(false);
    setShowFinalResult(false);
    setGameResult(null);
    setPlayers(makeMockPlayers(user || "Player 1")); // プレイヤーもリセット
    setTargetValue(DEFAULT_TARGET_VALUE);
  }, [user]);

  return {
    // データ
    players,      // ★追加
    targetValue,  // ★追加
    currentRound,
    totalRounds: TOTAL_ROUNDS,
    roundResults,
    
    // 状態フラグ
    isLoading,
    error,
    isSubmitted,
    waitingForOthers,
    showRoundResult,
    showFinalResult,
    gameResult,
    
    // アクション
    submitNumber,
    nextRound,
    exitGame,
    resetGame,
    setGameResult, // デバッグ用
  };
};