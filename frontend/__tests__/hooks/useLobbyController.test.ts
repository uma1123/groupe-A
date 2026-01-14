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

describe("useLobbyController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("createRoom成功時にroomIdを返す", async () => {
    global.fetch = jest.fn(
      async () =>
        ({
          ok: true,
          json: jest.fn(async () => ({ success: true, roomId: "123" })),
        } as any)
    );

    const { result } = renderHook(() => useLobbyController());

    await act(async () => {
      const roomId = await result.current.createRoom(4, 3);
      expect(roomId).toBe("123");
    });

    expect(result.current.error).toBe("");
  });

  it("createRoom失敗時にfalseとerror", async () => {
    global.fetch = jest.fn(
      async () =>
        ({
          ok: false,
          json: jest.fn(async () => ({ success: false, message: "作成失敗" })),
        } as any)
    );

    const { result } = renderHook(() => useLobbyController());

    await act(async () => {
      const ok = await result.current.createRoom(4, 3);
      expect(ok).toBe(false);
    });

    expect(result.current.error).toContain("失敗");
  });

  it("joinRoom無効IDでfalseとerror", async () => {
    const { result } = renderHook(() => useLobbyController());

    await act(async () => {
      const ok = await result.current.joinRoom(NaN);
      expect(ok).toBe(false);
    });

    expect(result.current.error).toContain("有効なルームID");
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("joinRoom成功でrouter.pushが呼ばれる", async () => {
    global.fetch = jest.fn(
      async () =>
        ({
          ok: true,
          json: jest.fn(async () => ({ success: true })),
        } as any)
    );

    const { result } = renderHook(() => useLobbyController());

    await act(async () => {
      const ok = await result.current.joinRoom("456");
      expect(ok).toBe(true);
    });

    expect(mockPush).toHaveBeenCalledWith("/room/456");
  });
});
