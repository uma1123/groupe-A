import { useRouter } from "next/navigation";
import { useCallback, useState, useRef, useEffect } from "react";
import { Player, DEFAULT_TARGET_VALUE } from "@/types/game";
import { makeMockPlayers } from "@/lib/gameMockData";
import { useAuth } from "@/context/AuthContext";
import type { GameRule } from "@/types/randomRule";
import { useRoomContext } from "@/context/RoomContext";
import type {
  SubmitNumberMessage,
  NextRoundMessage,
  RuleData,
  GameStartResponse,
  RoundStartResponse,
  RoundResultResponse,
  AllPlayersResultResponse,
  FinalResultResponse,
} from "@/types/websocket";
import { gameWebSocket } from "@/lib/websocket";

const TIMER_DURATION = 60;

const initializePlayers = (
  username: string,
  maxNum: number,
  initialLives: number
) => {
  const base = makeMockPlayers(username || "Player 1");
  return base.map((p, i) => {
    if (i < maxNum) {
      return { ...p, lives: initialLives, status: "alive" as const };
    }
    return { ...p, lives: 0, status: "empty" as const };
  });
};

export const useGameController = (roomId: string) => {
  const router = useRouter();
  const { user } = useAuth();
  const { maxPlayers, initialLife } = useRoomContext();

  // ✅ 初期値を直接設定（setState 不要）
  const [players, setPlayers] = useState<Player[]>(() =>
    initializePlayers(user || "Player 1", maxPlayers, initialLife)
  );

  // --- State ---
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [waitingForOthers, setWaitingForOthers] = useState(false);

  const [showRoundResult, setShowRoundResult] = useState(false);
  const [showFinalResult, setShowFinalResult] = useState(false);
  const [gameResult, setGameResult] = useState<"WIN" | "LOSE" | null>(null);

  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(3);
  const [roundResults, setRoundResults] = useState<("WIN" | "LOSE")[]>([]);
  const [targetValue, setTargetValue] = useState(DEFAULT_TARGET_VALUE);

  const [timeRemaining, setTimeRemaining] = useState(TIMER_DURATION);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showRoundStart, setShowRoundStart] = useState(false);

  const [currentRule, setCurrentRule] = useState<GameRule | null>(null);
  const [availableRules, setAvailableRules] = useState<RuleData[]>([]);
  const [ruleHistory, setRuleHistory] = useState<GameRule[]>([]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const roundStartTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ✅ タイマーのクリーンアップ
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
      if (roundStartTimeoutRef.current)
        clearTimeout(roundStartTimeoutRef.current);
    };
  }, []);

  // ★ 関数宣言を最初に持ってくる（useEffect より前）
  const submitNumber = useCallback(
    (number: number) => {
      setIsLoading(true);
      setIsTimerRunning(false);
      setIsSubmitted(true);
      setWaitingForOthers(true);

      const message: SubmitNumberMessage = {
        type: "SUBMIT_NUMBER",
        userId: user!,
        roomId,
        num: number,
      };

      gameWebSocket.send(message);
    },
    [user, roomId]
  );

  const beginRoundStart = useCallback(() => {
    console.log("🎬 ラウンド開始演出を開始");
    setShowRoundStart(true);

    if (roundStartTimeoutRef.current) {
      clearTimeout(roundStartTimeoutRef.current);
    }

    roundStartTimeoutRef.current = setTimeout(() => {
      console.log("⏰ タイマー開始");
      setShowRoundStart(false);
      setIsTimerRunning(true);
    }, 1500);
  }, []);

  // ✅ タイマーカウントダウン（submitNumber を使用）
  useEffect(() => {
    if (isTimerRunning && timeRemaining > 0) {
      countdownRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            if (!isSubmitted) {
              submitNumber(0); // ✅ ここで呼び出せる
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [isTimerRunning, timeRemaining, isSubmitted, submitNumber]);

  // ★ WebSocket イベントハンドラ登録（beginRoundStart を使用）
  useEffect(() => {
    // ゲーム開始
    gameWebSocket.on("GAME_START", (data: GameStartResponse) => {
      console.log("🎮 ゲーム開始:", data);
      setTotalRounds(data.totalRounds);
      setAvailableRules(data.availableRules);
      setCurrentRule(data.firstRule as GameRule);
      setRuleHistory([data.firstRule as GameRule]);
      beginRoundStart(); // ✅ ここで呼び出せる
    });

    // ラウンド開始
    gameWebSocket.on("ROUND_START", (data: RoundStartResponse) => {
      console.log("🎬 ラウンド開始:", data);
      setCurrentRound(data.currentRound);
      setCurrentRule(data.rule as GameRule);
      setRuleHistory((prev) => [...prev, data.rule as GameRule]);
      setTimeRemaining(data.timerDuration);
      beginRoundStart(); // ✅ ここで呼び出せる
    });

    // ラウンド結果
    gameWebSocket.on("ROUND_RESULT", (data: RoundResultResponse) => {
      console.log("📊 ラウンド結果:", data);
      setWaitingForOthers(false);
      setShowRoundResult(true);
      setGameResult(data.roundResult === "WIN" ? "WIN" : "LOSE");
      setRoundResults((prev) => [
        ...prev,
        data.roundResult === "WIN" ? "WIN" : "LOSE",
      ]);
      setTargetValue(data.targetValue);

      setPlayers((prev) =>
        prev.map((p) => {
          if (p.isYou) {
            return {
              ...p,
              lives: data.newLife,
              status: data.isDead ? "dead" : "alive",
              choice: data.yourNumber,
            };
          }
          return p;
        })
      );

      setIsLoading(false);
    });

    // 全員の結果
    gameWebSocket.on("ALL_PLAYERS_RESULT", (data: AllPlayersResultResponse) => {
      console.log("📊 全員の結果:", data);
      setPlayers((prev) =>
        prev.map((p) => {
          const result = data.results.find((r) => r.userId === p.name);
          if (result) {
            return {
              ...p,
              lives: result.lives,
              status: result.isDead ? "dead" : "alive",
              choice: result.number,
            };
          }
          return p;
        })
      );
    });

    // 最終結果
    gameWebSocket.on("FINAL_RESULT", (data: FinalResultResponse) => {
      console.log("🏆 最終結果:", data);
      setGameResult(data.isWinner ? "WIN" : "LOSE");
      setShowFinalResult(true);
    });

    return () => {
      gameWebSocket.off("GAME_START");
      gameWebSocket.off("ROUND_START");
      gameWebSocket.off("ROUND_RESULT");
      gameWebSocket.off("ALL_PLAYERS_RESULT");
      gameWebSocket.off("FINAL_RESULT");
    };
  }, [beginRoundStart]); // ✅ beginRoundStart を依存配列に追加

  const nextRound = useCallback(() => {
    const myPlayer = players.find((p) => p.isYou);

    // ケース1: 自分が死亡している
    if (myPlayer && myPlayer.lives <= 0) {
      console.log("💀 ゲーム終了（ライフ0）");
      setShowRoundResult(false);
      setGameResult("LOSE");
      setShowFinalResult(true);
      return;
    }

    // ケース2: 全ラウンド終了
    if (currentRound >= totalRounds) {
      console.log("🏁 全ラウンド終了");
      setShowRoundResult(false);
      setGameResult("WIN");
      setShowFinalResult(true);
      return;
    }

    // ケース3: 次のラウンドへ
    console.log(`📍 ラウンド ${currentRound} → ${currentRound + 1}`);
    const message: NextRoundMessage = {
      type: "NEXT_ROUND",
      userId: user!,
      roomId,
    };

    setWaitingForOthers(true);
    setShowRoundResult(false);
    setGameResult(null);
    setIsSubmitted(false);

    gameWebSocket.send(message);
  }, [currentRound, totalRounds, players, user, roomId]);

  const exitGame = useCallback(() => {
    router.push("/lobby");
  }, [router]);

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
  }, [user, maxPlayers, initialLife]);

  return {
    players,
    targetValue,
    currentRound,
    totalRounds,
    roundResults,
    currentRule,
    availableRules,
    ruleHistory,
    timeRemaining,
    isTimerRunning,
    showRoundStart,
    isLoading,
    error,
    isSubmitted,
    waitingForOthers,
    showRoundResult,
    showFinalResult,
    gameResult,
    submitNumber,
    nextRound,
    exitGame,
    resetGame,
    setGameResult,
  };
};
