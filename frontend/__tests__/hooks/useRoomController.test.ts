import { renderHook, act } from "@testing-library/react";
import { useRoomController } from "@/hooks/useRoomController";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";

const mockPush = jest.fn();

jest.useFakeTimers();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));
jest.mock("@/context/AuthContext", () => ({
  useAuth: () => ({ user: "tester" }),
}));

// Mock gameWebSocket to simulate GO_TO_GAME_SERVER and player events
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
        if (message.type === "START_GAME") {
          // simulate error when special roomId requested
          if (message.roomId === "FAIL") {
            const err = { type: "ERROR", message: "開始失敗" };
            handlers["ERROR"]?.forEach((h) => h(err));
            return;
          }
          const resp = {
            type: "GO_TO_GAME_SERVER",
            roomId: message.roomId,
            nextEndpoint: "ws://localhost:8081/app/game",
          };
          handlers["GO_TO_GAME_SERVER"]?.forEach((h) => h(resp));
        }
      },
      connectToGameServer: () => {},
      isGameServerConnected: () => true,
      sendToClientManage: () => {},
      clearHandlers: () =>
        Object.keys(handlers).forEach((k) => delete handlers[k]),
    },
  };
});
// Mock RoomContext used by the hook
jest.mock("@/context/RoomContext", () => ({
  useRoomContext: () => ({
    addPlayer: jest.fn(),
    removePlayer: jest.fn(),
  }),
}));

describe("useRoomController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("startGame成功時にゲームページへ遷移", async () => {
    const { result } = renderHook(() => useRoomController());

    await act(async () => {
      result.current.startGame("ROOM1");
    });

    // allow interval (100ms) that checks connection to run
    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(mockPush).toHaveBeenCalledWith("/game/ROOM1");
    expect(result.current.error).toBe("");
  });

  it("leaveRoomでロビーへ遷移", () => {
    const { result } = renderHook(() => useRoomController());
    act(() => result.current.leaveRoom());
    expect(mockPush).toHaveBeenCalledWith("/lobby");
  });
});
