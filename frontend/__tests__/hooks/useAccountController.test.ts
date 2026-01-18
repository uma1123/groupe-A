import { renderHook, act } from "@testing-library/react";
import { useAccountController } from "@/hooks/useAccountController";
import { beforeEach, describe, it, jest } from "@jest/globals";

const mockPush = jest.fn();
const mockSetUser = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));
jest.mock("@/context/AuthContext", () => ({
  useAuth: () => ({ setUser: mockSetUser }),
}));

// Mock gameWebSocket to simulate server responses synchronously
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
        // immediate mock responses
        if (message.type === "LOGIN") {
          if (message.userId === "a") {
            const err = { type: "ERROR", message: "ログイン失敗" };
            handlers["ERROR"]?.forEach((h) => h(err));
          } else {
            const resp = {
              type: "AUTH_SUCCESS",
              userId: message.userId,
              userName: message.userId,
            };
            handlers["AUTH_SUCCESS"]?.forEach((h) => h(resp));
          }
        }
        if (message.type === "SIGNUP") {
          const resp = {
            type: "AUTH_SUCCESS",
            userId: message.userId,
            userName: message.userId,
          };
          handlers["AUTH_SUCCESS"]?.forEach((h) => h(resp));
        }
      },
      connectToClientManage: () => {},
      sendToClientManage: () => {},
      clearHandlers: () => {
        Object.keys(handlers).forEach((k) => delete handlers[k]);
      },
    },
  };
});

describe("useAccountController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("login成功時にsetUserとrouter.pushが呼ばれる", async () => {
    const { result } = renderHook(() => useAccountController());

    await act(async () => {
      result.current.login("alice", "pass");
    });

    expect(mockSetUser).toHaveBeenCalledWith("alice");
    expect(mockPush).toHaveBeenCalledWith("/lobby");
    expect(result.current.error).toBe("");
    expect(result.current.isLoading).toBe(false);
  });

  it("login失敗時にerrorが設定される", async () => {
    const { result } = renderHook(() => useAccountController());

    await act(async () => {
      result.current.login("a", "b");
    });

    expect(result.current.error).toContain("ログイン");
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("signup成功時にsetUserとrouter.pushが呼ばれる", async () => {
    const { result } = renderHook(() => useAccountController());

    await act(async () => {
      result.current.signup("newuser", "pass");
    });

    expect(mockSetUser).toHaveBeenCalledWith("newuser");
    expect(mockPush).toHaveBeenCalledWith("/lobby");
  });
});
