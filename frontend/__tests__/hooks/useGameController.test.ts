import { renderHook, act } from "@testing-library/react";
import { useGameController } from "@/hooks/useGameController";
import type { Player } from "@/types/game";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";

jest.useFakeTimers();

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));
jest.mock("@/context/AuthContext", () => ({
  useAuth: () => ({ user: "you" }),
}));
jest.mock("@/context/RoomContext", () => ({
  useRoomContext: () => ({ maxPlayers: 2, initialLife: 3 }),
}));
jest.mock("@/lib/gameMockData", () => ({
  makeMockPlayers: (youName: string): Player[] => [
    {
      id: "p1",
      name: youName,
      lives: 0,
      status: "alive",
      isYou: true,
      isHost: true,
      isReady: true,
      choice: null,
    },
    {
      id: "p2",
      name: "Bot1",
      lives: 0,
      status: "alive",
      isYou: false,
      isHost: false,
      isReady: true,
      choice: null,
    },
    {
      id: "p3",
      name: "Bot2",
      lives: 0,
      status: "alive",
      isYou: false,
      isHost: false,
      isReady: true,
      choice: null,
    },
  ],
}));
jest.mock("@/types/randomRule", () => ({
  RULE_PRESETS: [
    { id: "r1", name: "Rule1", description: "", lifeDamage: 1, color: "red" },
    { id: "r2", name: "Rule2", description: "", lifeDamage: 2, color: "blue" },
  ],
}));

describe("useGameController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(global.Math, "random").mockReturnValue(0.6);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("初期化時にmaxPlayers/initialLifeに合わせてplayersが設定される", async () => {
    const { result } = renderHook(() => useGameController("ROOM1"));
    await act(async () => {});

    const alive = result.current.players.filter((p) => p.status === "alive");
    const empty = result.current.players.filter((p) => p.status === "empty");
    expect(alive.length).toBe(2);
    expect(empty.length).toBe(1);
    alive.forEach((p) => expect(p.lives).toBe(3));
  });

  it("submitNumber後に結果表示が出る（タイマー経過）", async () => {
    const { result } = renderHook(() => useGameController("ROOM1"));
    await act(async () => {});

    await act(async () => {
      result.current.submitNumber(42);
    });

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(result.current.showRoundResult).toBe(true);
    expect(result.current.gameResult).toBe("WIN");
  });

  it("shuffleRuleで別IDのルールに切り替わる", () => {
    // モック: Math.randomで常に最初のルール（r1）を選択するようにする
    jest.spyOn(global.Math, "random").mockReturnValueOnce(0.1); // 初期化: r1

    const { result } = renderHook(() => useGameController("ROOM1"));

    expect(result.current.currentRule?.id).toBe("r1");

    // 次のshuffleRuleでは2番目のルール（r2）を選択
    jest.spyOn(global.Math, "random").mockReturnValueOnce(0.9); // shuffle: r2

    act(() => {
      result.current.shuffleRule();
    });

    expect(result.current.currentRule?.id).toBe("r2");
  });

  it("showResultで最終結果画面を表示する", () => {
    const { result } = renderHook(() => useGameController("ROOM1"));
    act(() => {
      result.current.showResult("LOSE");
    });
    expect(result.current.gameResult).toBe("LOSE");
    expect(result.current.showFinalResult).toBe(true);
  });

  it("startTimerで演出後タイマー開始", () => {
    const { result } = renderHook(() => useGameController("ROOM1"));
    act(() => {
      result.current.startTimer();
    });
    act(() => {
      jest.advanceTimersByTime(1500);
    });
    expect(result.current.showRoundStart).toBe(false);
    expect(result.current.isTimerRunning).toBe(true);
  });

  it("exitGameでロビーへ遷移", () => {
    const { result } = renderHook(() => useGameController("ROOM1"));
    act(() => result.current.exitGame());
    expect(mockPush).toHaveBeenCalledWith("/lobby");
  });
});
