import { renderHook, act } from "@testing-library/react";
import { useLobbyController } from "@/hooks/useLobbyContoroller";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));
jest.mock("@/context/AuthContext", () => ({
  useAuth: () => ({ user: "tester" }),
}));

// Mock gameWebSocket to simulate client-manage responses
jest.mock("@/lib/websocket", () => {
  const handlers: Record<string, Set<Function>> = {};
  return {
    gameWebSocket: {
      on: (type: string, handler: Function) => {
        handlers[type] = handlers[type] || new Set();
        handlers[type].add(handler);
        return () => handlers[type]?.delete(handler);
      },
      sendToClientManage: (message: any) => {
        if (message.type === "CREATE_ROOM") {
          // simulate failure when special invalid value passed
          if (message.numOfPlayer === -1) {
            const err = { type: "ERROR", message: "作成失敗" };
            handlers["ERROR"]?.forEach((h) => h(err));
            return;
          }

          const resp = {
            type: "CREATE_ROOM_SUCCESS",
            roomId: "123",
            maxPlayers: message.numOfPlayer,
            lives: message.numOfLife,
          };
          handlers["CREATE_ROOM_SUCCESS"]?.forEach((h) => h(resp));
        }
        if (message.type === "JOIN_ROOM") {
          const resp = {
            type: "JOIN_ROOM_SUCCESS",
            roomId: message.roomId.toString(),
            currentPlayers: ["tester", message.userId],
            maxPlayers: 4,
            lives: 3,
          };
          handlers["JOIN_ROOM_SUCCESS"]?.forEach((h) => h(resp));
        }
      },
      connectToClientManage: () => {},
      clearHandlers: () => {
        Object.keys(handlers).forEach((k) => delete handlers[k]);
      },
    },
  };
});
// Mock RoomContext used by the hook
jest.mock("@/context/RoomContext", () => ({
  useRoomContext: () => ({
    setRoomSettings: jest.fn(),
    setPlayers: jest.fn(),
    addPlayer: jest.fn(),
  }),
}));

describe("useLobbyController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("createRoom成功時にroomIdが返る", async () => {
    const { result } = renderHook(() => useLobbyController());

    const res = await act(async () => {
      return await result.current.createRoom(4, 3);
    });

    // createRoom resolves with the response object containing roomId
    const created = res as any;
    expect(created.roomId).toBe("123");
    expect(result.current.error).toBe("");
  });

  it("createRoom失敗時にerrorが設定される", async () => {
    const { result } = renderHook(() => useLobbyController());

    // pass sentinel value to make mock emit ERROR
    await act(async () => {
      await result.current.createRoom(-1, 3);
    });

    expect(result.current.error).toContain("作成失敗");
  });

  it("joinRoom無効IDでerrorが設定される", async () => {
    const { result } = renderHook(() => useLobbyController());

    await act(async () => {
      result.current.joinRoom(NaN as any);
    });

    expect(result.current.error).toContain("有効なルームID");
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("joinRoom成功でrouter.pushが呼ばれる", async () => {
    const { result } = renderHook(() => useLobbyController());

    await act(async () => {
      result.current.joinRoom("456");
    });

    expect(mockPush).toHaveBeenCalledWith("/room/456");
  });
});
