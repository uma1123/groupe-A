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
  // Provide players so initialization matches current hook behavior
  useRoomContext: () => ({
    maxPlayers: 3,
    initialLife: 3,
    players: ["you", "Bot1"],
  }),
}));
jest.mock("@/types/randomRule", () => ({
  RULE_PRESETS: [
    { id: "r1", name: "Rule1", description: "", lifeDamage: 1, color: "red" },
    { id: "r2", name: "Rule2", description: "", lifeDamage: 2, color: "blue" },
  ],
}));

// Mock gameWebSocket to simulate round results and game flow
jest.mock("@/lib/websocket", () => {
  const handlers: Record<string, Set<Function>> = {};
  return {
    gameWebSocket: {
      on: (type: string, handler: Function) => {
        handlers[type] = handlers[type] || new Set();
        handlers[type].add(handler);
        return () => handlers[type]?.delete(handler);
      },
      send: (message: any) => {
        if (message.type === "SUBMIT_NUMBER") {
          const resp = {
            type: "ROUND_RESULT",
            roomId: message.roomId,
            userId: message.userId,
            roundResult: "WIN",
            targetValue: 50,
            yourNumber: message.num,
            newLife: 2,
            isDead: false,
            appliedRule: {
              id: "r1",
              name: "Rule1",
              description: "",
              lifeDamage: 1,
            },
          };
          handlers["ROUND_RESULT"]?.forEach((h) => h(resp));
        }
      },
      connectToGameServer: () => {},
      isGameServerConnected: () => true,
      sendToGameServer: () => {},
      clearHandlers: () =>
        Object.keys(handlers).forEach((k) => delete handlers[k]),
    },
  };
});

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
    expect(empty.length).toBe(0);
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

  it("setGameResultでゲーム結果が設定される", () => {
    const { result } = renderHook(() => useGameController("ROOM1"));
    act(() => {
      result.current.setGameResult("LOSE");
    });
    expect(result.current.gameResult).toBe("LOSE");
  });

  it("nextRoundで待機状態になる", () => {
    const { result } = renderHook(() => useGameController("ROOM1"));
    act(() => {
      result.current.nextRound();
    });
    expect(result.current.waitingForOthers).toBe(true);
  });

  it("exitGameでロビーへ遷移", () => {
    const { result } = renderHook(() => useGameController("ROOM1"));
    act(() => result.current.exitGame());
    expect(mockPush).toHaveBeenCalledWith("/lobby");
  });
});
