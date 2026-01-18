import { useRouter } from "next/navigation";
import { useCallback, useState, useRef, useEffect } from "react";
import { Player, DEFAULT_TARGET_VALUE } from "@/types/game";
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

// ★ makeMockPlayers を削除し、プレイヤーを初期化する関数に変更
const initializePlayersFromServer = (
  playerNames: string[],
  initialLives: number,
  currentUser: string,
): Player[] => {
  return playerNames.map((name) => ({
    id: name,
    name: name, // ★ サーバーから取得した名前
    lives: initialLives,
    status: "alive" as const,
    isYou: name === currentUser, // ★ 自分かどうかを判定
    isHost: false,
    isReady: false,
    choice: null,
  }));
};

// ★ 空の初期状態
const initializeEmptyPlayers = (maxNum: number): Player[] => {
  return Array.from({ length: maxNum }, (_, i) => ({
    id: `empty-${i}`,
    name: "",
    lives: 0,
    status: "empty" as const,
    isYou: false,
    isHost: false,
    isReady: false,
    choice: null,
  }));
};

export const useGameController = (roomId: string) => {
  const router = useRouter();
  const { user } = useAuth();
  const { maxPlayers, initialLife, players: roomPlayers } = useRoomContext();

  // ✅ RoomContext のプレイヤー情報を使って初期化（GAME_START 前でも表示可能）
  const [players, setPlayers] = useState<Player[]>(() => {
    if (roomPlayers && roomPlayers.length > 0 && user) {
      return initializePlayersFromServer(roomPlayers, initialLife || 3, user);
    }
    return initializeEmptyPlayers(maxPlayers || 4);
  });

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

  const [average, setAverage] = useState<number | undefined>(undefined);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const roundStartTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ✅ タイマーのクリーンアップ
  useEffect(() => {
    const timer = timerRef.current;
    const countdown = countdownRef.current;
    const roundStartTimeout = roundStartTimeoutRef.current;
    return () => {
      if (timer) clearTimeout(timer);
      if (countdown) clearInterval(countdown);
      if (roundStartTimeout) clearTimeout(roundStartTimeout);
    };
  }, []);

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
    [user, roomId],
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

  // ✅ タイマーカウントダウン
  useEffect(() => {
    if (isTimerRunning && timeRemaining > 0) {
      countdownRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            if (!isSubmitted) {
              submitNumber(0);
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

  // ★ WebSocket イベントハンドラ登録（サーバーからプレイヤー情報を取得）
  useEffect(() => {
    // ゲーム開始
    const offGameStart = gameWebSocket.on(
      "GAME_START",
      (data: GameStartResponse) => {
        console.log("🎮 ゲーム開始:", data);

        // ★ サーバーからのプレイヤーリストを使用して初期化
        if (data.players && Array.isArray(data.players) && user) {
          console.log("📥 サーバーからのプレイヤーリスト:", data.players);

          const initializedPlayers = initializePlayersFromServer(
            data.players,
            data.initialLife || 3,
            user,
          );
          setPlayers(initializedPlayers);
          console.log("👥 プレイヤー初期化完了:", initializedPlayers);
        } else {
          console.warn("⚠️ プレイヤーリストが受信されていません:", data);
        }

        setTotalRounds(data.totalRounds);
        setAvailableRules(data.availableRules || []);
        setCurrentRule(data.firstRule as GameRule);
        setRuleHistory([data.firstRule as GameRule]);
        beginRoundStart();
      },
    );

    // ラウンド開始
    const offRoundStart = gameWebSocket.on(
      "ROUND_START",
      (data: RoundStartResponse) => {
        console.log("🎬 ラウンド開始:", data);
        // サーバーが送る totalRounds をここでも反映する
        setTotalRounds(data.totalRounds);
        setCurrentRound(data.currentRound);
        setCurrentRule(data.rule as GameRule);
        setRuleHistory((prev) => [...prev, data.rule as GameRule]);
        setTimeRemaining(data.timerDuration);
        // 送信/待機フラグをリセットして新ラウンドへ
        setIsSubmitted(false);
        setIsLoading(false);
        setWaitingForOthers(false);
        setShowRoundResult(false);
        beginRoundStart();
      },
    );

    // ラウンド結果
    const offRoundResult = gameWebSocket.on(
      "ROUND_RESULT",
      (data: RoundResultResponse) => {
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
          }),
        );

        setIsLoading(false);
      },
    );

    // 全員の結果
    const offAllPlayersResult = gameWebSocket.on(
      "ALL_PLAYERS_RESULT",
      (data: AllPlayersResultResponse) => {
        console.log("📊 全員の結果:", data);

        setAverage(data.average); // ★ 平均値を保存
        setTargetValue(data.targetValue);

        setPlayers((prev) =>
          prev.map((p) => {
            const result = data.results.find((r) => r.userId === p.name);
            if (result) {
              return {
                ...p,
                lives: result.lives,
                status: result.isDead ? "dead" : "alive",
                choice: result.number,
                penalty: result.penalty || 0,
              };
            }
            return p;
          }),
        );
      },
    );

    // 最終結果
    const offFinalResult = gameWebSocket.on(
      "FINAL_RESULT",
      (data: FinalResultResponse) => {
        console.log("🏆 最終結果:", data);
        setGameResult(data.isWinner ? "WIN" : "LOSE");
        setShowFinalResult(true);
      },
    );

    return () => {
      offGameStart();
      offRoundStart();
      offRoundResult();
      offAllPlayersResult();
      offFinalResult();
    };
  }, [user, initialLife, beginRoundStart]);

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

    // ★ 空の状態にリセット（次のゲーム開始時に再初期化）
    setPlayers(initializeEmptyPlayers(maxPlayers || 4));

    setTargetValue(DEFAULT_TARGET_VALUE);
    setTimeRemaining(TIMER_DURATION);
    setIsTimerRunning(false);
    setShowRoundStart(false);
  }, [maxPlayers]);

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
    average, // ★ 追加
    submitNumber,
    nextRound,
    exitGame,
    resetGame,
    setGameResult,
  };
};
