import { useRouter } from "next/navigation";
import { useCallback, useState, useRef, useEffect } from "react";
import { Player, DEFAULT_TARGET_VALUE } from "@/types/game";
import { makeMockPlayers } from "@/lib/gameMockData";
import { useAuth } from "@/context/AuthContext";
import { RULE_PRESETS, type GameRule } from "@/types/randomRule";
import { useRoomContext } from "@/context/RoomContext";

const TOTAL_ROUNDS = 3;
const TIMER_DURATION = 60; // 60秒

export const useGameController = (roomId: string) => {
  const router = useRouter();
  const { user } = useAuth();
  const { maxPlayers, initialLife } = useRoomContext();

  // --- State ---
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [waitingForOthers, setWaitingForOthers] = useState(false);

  // 結果表示フラグ
  const [showRoundResult, setShowRoundResult] = useState(false);
  const [showFinalResult, setShowFinalResult] = useState(false);
  const [gameResult, setGameResult] = useState<"WIN" | "LOSE" | null>(null);

  // ゲームデータ
  const [currentRound, setCurrentRound] = useState(1);
  const [roundResults, setRoundResults] = useState<("WIN" | "LOSE")[]>([]);
  const [targetValue, setTargetValue] = useState(DEFAULT_TARGET_VALUE);

  // ★タイマー関連
  const [timeRemaining, setTimeRemaining] = useState(TIMER_DURATION);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showRoundStart, setShowRoundStart] = useState(false);

  // ★プレイヤー状態（SSRでは空、CSRで初期化）
  const [players, setPlayers] = useState<Player[]>([]);

  // ★ランダムルール（SSRでは未決定、CSRで抽選）
  const [currentRule, setCurrentRule] = useState<GameRule | null>(null);
  const [ruleHistory, setRuleHistory] = useState<GameRule[]>([]);

  // タイマー管理用
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const roundStartTimeoutRef = useRef<NodeJS.Timeout | null>(null); // ★追加
  // 初回ラウンドの開始を一度だけ実行するためのフラグ
  const hasStartedInitialRound = useRef(false);

  // タイマーのクリーンアップ
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
      if (roundStartTimeoutRef.current)
        clearTimeout(roundStartTimeoutRef.current); // ★追加
    };
  }, []);

  // タイマーカウントダウン
  useEffect(() => {
    if (isTimerRunning && timeRemaining > 0) {
      countdownRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            // タイムアップ時の処理（自動送信）
            if (!isSubmitted) {
              submitNumber(0); // デフォルト値0を送信
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTimerRunning, isSubmitted]);

  // SSR/CSR差異を避けるため、クライアント側で初期化
  useEffect(() => {
    const base = makeMockPlayers(user || "Player 1");
    // スロット数は mock の長さ（例: 9）に合わせ、maxPlayers を超える分は empty に
    const adjusted = base.map((p, i) => {
      if (i < maxPlayers) {
        return { ...p, lives: initialLife, status: "alive" as const };
      }
      return { ...p, lives: 0, status: "empty" as const };
    });
    setPlayers(adjusted);
  }, [user, maxPlayers, initialLife]);

  // 直前と同一ルールを避けてランダム選択
  const pickRandomRule = useCallback((prevId?: string): GameRule => {
    if (RULE_PRESETS.length === 1) return RULE_PRESETS[0];
    let rule: GameRule;
    do {
      rule = RULE_PRESETS[Math.floor(Math.random() * RULE_PRESETS.length)];
    } while (prevId && rule.id === prevId && RULE_PRESETS.length > 1);
    return rule;
  }, []);

  // ラウンド開始演出＋タイマー開始を共通化
  const beginRoundStart = useCallback(() => {
    setShowRoundStart(true);
    setTimeRemaining(TIMER_DURATION);
    if (roundStartTimeoutRef.current)
      clearTimeout(roundStartTimeoutRef.current);
    roundStartTimeoutRef.current = setTimeout(() => {
      setShowRoundStart(false);
      setIsTimerRunning(true);
    }, 1500);
  }, []);

  // 初期ルールはクライアント側で抽選（SSRとCSRの乱数差異対策）
  useEffect(() => {
    const initial = pickRandomRule();
    setCurrentRule(initial);
    setRuleHistory([initial]);

    if (!hasStartedInitialRound.current) {
      hasStartedInitialRound.current = true;
      beginRoundStart(); // ★共通関数に置き換え
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 数値送信 (Mock Logic)
  const submitNumber = useCallback(
    async (number: number) => {
      setIsLoading(true);
      setIsTimerRunning(false); // タイマー停止
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

  // 次のラウンドへ（全員の準備完了を待機）
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
      // ★ここでサーバーに「NEXT_ROUND」メッセージを送信
      // TODO: WebSocket実装時に実装
      // socket.send(JSON.stringify({ type: "NEXT_ROUND", roomId }));

      // ★Mock: 2秒後にラウンド開始（サーバーからの応答を待つ想定）
      setWaitingForOthers(true);
      timerRef.current = setTimeout(() => {
        setWaitingForOthers(false);
        setShowRoundResult(false);
        setGameResult(null);
        setCurrentRound((prev) => prev + 1);
        setIsSubmitted(false);

        // 次ラウンドのルール抽選
        setCurrentRule((prev: GameRule | null): GameRule => {
          const next = pickRandomRule(prev?.id);
          // 履歴の更新は外側で行う
          return next;
        });

        // ★ラウンド開始演出とタイマー開始
        beginRoundStart(); // ★共通関数で管理
      }, 2000);
    }
  }, [currentRound, players, pickRandomRule, beginRoundStart]);

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

    const base = makeMockPlayers(user || "Player 1");
    const adjusted = base.map((p, i) => {
      if (i < maxPlayers) {
        return { ...p, lives: initialLife, status: "alive" as const };
      }
      return { ...p, lives: 0, status: "empty" as const };
    });
    setPlayers(adjusted);

    setTargetValue(DEFAULT_TARGET_VALUE);
    setTimeRemaining(TIMER_DURATION);
    setIsTimerRunning(false);
    setShowRoundStart(false);

    // ルールも初期化
    const initial = pickRandomRule();
    setCurrentRule(initial);
    setRuleHistory([initial]);
  }, [user, pickRandomRule, maxPlayers, initialLife]);

  // デバッグ: 任意タイミングでルールを引き直す
  const shuffleRule = useCallback(() => {
    setCurrentRule((prev: GameRule | null): GameRule => {
      if (!prev) return RULE_PRESETS[0];
      return pickRandomRule(prev.id);
    });
  }, [pickRandomRule]);

  // ★デバッグ用の結果表示関数
  const showResult = useCallback((result: "WIN" | "LOSE") => {
    setGameResult(result);
    setShowFinalResult(true);
  }, []);

  // ★デバッグ用: タイマー開始
  const startTimer = useCallback(() => {
    beginRoundStart(); // ★共通関数で管理
  }, [beginRoundStart]);

  return {
    // データ
    players,
    targetValue,
    currentRound,
    totalRounds: TOTAL_ROUNDS,
    roundResults,
    currentRule,
    ruleHistory,
    timeRemaining,
    isTimerRunning,
    showRoundStart,

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
    showResult,
    startTimer, // ★デバッグ用
  };
};
