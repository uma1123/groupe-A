import { useRouter } from "next/navigation";
import { useCallback, useState, useRef, useEffect } from "react";
import { Player, DEFAULT_TARGET_VALUE } from "@/types/game";
import { makeMockPlayers } from "@/lib/gameMockData";
import { useAuth } from "@/context/AuthContext";
import { RULE_PRESETS, type GameRule } from "@/types/randomRule";

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

  // ★プレイヤー状態
  const [players, setPlayers] = useState<Player[]>(() =>
    makeMockPlayers(user || "Player 1")
  );

  // ★ランダムルール
  const [currentRule, setCurrentRule] = useState<GameRule | null>(() => {
    const initial =
      RULE_PRESETS.length === 1
        ? RULE_PRESETS[0]
        : RULE_PRESETS[Math.floor(Math.random() * RULE_PRESETS.length)];
    return initial;
  });
  const [ruleHistory, setRuleHistory] = useState<GameRule[]>(() => {
    const initial =
      RULE_PRESETS.length === 1
        ? RULE_PRESETS[0]
        : RULE_PRESETS[Math.floor(Math.random() * RULE_PRESETS.length)];
    return [initial];
  });

  // タイマー管理用（アンマウント時のクリーンアップ）
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // 直前と同一ルールを避けてランダム選択
  const pickRandomRule = useCallback((prevId?: string): GameRule => {
    if (RULE_PRESETS.length === 1) return RULE_PRESETS[0];
    let rule: GameRule;
    do {
      rule = RULE_PRESETS[Math.floor(Math.random() * RULE_PRESETS.length)];
    } while (rule.id === prevId);
    return rule;
  }, []);

  // --- Actions ---

  // 数値送信 (Mock Logic)
  const submitNumber = useCallback(
    async (number: number) => {
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

          // 2. ライフ減少ロジック（ルール適用: ダメージ量）
          const damage = currentRule?.lifeDamage ?? 1;

          setPlayers((prevPlayers) => {
            return prevPlayers.map((p) => {
              // 自分(You)
              if (p.isYou) {
                const newLives = isUserWin
                  ? p.lives
                  : Math.max(0, p.lives - damage);
                return {
                  ...p,
                  lives: newLives,
                  status: newLives <= 0 ? "dead" : "alive",
                  choice: number,
                };
              }
              // Bot
              if (p.status === "alive") {
                const botWin = Math.random() > 0.5;
                const newLives = botWin
                  ? p.lives
                  : Math.max(0, p.lives - damage);
                return {
                  ...p,
                  lives: newLives,
                  status: newLives <= 0 ? "dead" : "alive",
                  choice: Math.floor(Math.random() * 100),
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
    },
    [currentRule]
  );

  // 次のラウンドへ
  const nextRound = useCallback(() => {
    // 自分のライフが0なら、即ゲームオーバー画面へ
    const myPlayer = players.find((p) => p.isYou);
    if (myPlayer && myPlayer.lives <= 0) {
      setShowRoundResult(false);
      setGameResult("LOSE");
      setShowFinalResult(true);
      return;
    }

    if (currentRound >= TOTAL_ROUNDS) {
      // 最終ラウンド終了
      setShowRoundResult(false);
      setGameResult("WIN");
      setShowFinalResult(true);
    } else {
      // 継続
      setShowRoundResult(false);
      setGameResult(null);
      setCurrentRound((prev) => prev + 1);
      setIsSubmitted(false);
      // 次ラウンドのルール抽選
      setCurrentRule((prev: GameRule | null): GameRule => {
        const next = pickRandomRule(prev?.id);
        setRuleHistory((h: GameRule[]): GameRule[] => [...h, next]);
        return next;
      });
    }
  }, [currentRound, players, pickRandomRule]);

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
    // ルールも初期化
    const initial = pickRandomRule();
    setCurrentRule(initial);
    setRuleHistory([initial]);
  }, [user, pickRandomRule]);

  // デバッグ: 任意タイミングでルールを引き直す
  const shuffleRule = useCallback(() => {
    setCurrentRule((prev: GameRule | null): GameRule => {
      const next = pickRandomRule(prev?.id);
      setRuleHistory((h: GameRule[]): GameRule[] => [...h, next]);
      return next;
    });
  }, [pickRandomRule]);

  // ★追加: デバッグ用の結果表示関数
  const showResult = useCallback((result: "WIN" | "LOSE") => {
    setGameResult(result);
    setShowFinalResult(true);
  }, []);

  return {
    // データ
    players,
    targetValue,
    currentRound,
    totalRounds: TOTAL_ROUNDS,
    roundResults,
    currentRule,
    ruleHistory,

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
    setGameResult,
    shuffleRule,
    showResult, // ★追加
  };
};
