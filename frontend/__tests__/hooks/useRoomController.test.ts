import { renderHook, act } from "@testing-library/react";
import { useRoomController } from "@/hooks/useRoomController";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));
jest.mock("@/context/AuthContext", () => ({
  useAuth: () => ({ user: "tester" }),
}));

describe("useRoomController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("startGame成功時にゲームページへ遷移", async () => {
    global.fetch = jest.fn(
      async () =>
        ({
          ok: true,
          json: jest.fn(async () => ({ success: true })),
        } as any)
    );

    const { result } = renderHook(() => useRoomController());

    await act(async () => {
      const ok = await result.current.startGame("ROOM1");
      expect(ok).toBe(true);
    });

    expect(mockPush).toHaveBeenCalledWith("/game/ROOM1");
    expect(result.current.error).toBe("");
  });

  it("startGame失敗時にerror", async () => {
    global.fetch = jest.fn(
      async () =>
        ({
          ok: false,
          json: jest.fn(async () => ({ success: false, message: "開始失敗" })),
        } as any)
    );

    const { result } = renderHook(() => useRoomController());

    await act(async () => {
      const ok = await result.current.startGame("ROOM1");
      expect(ok).toBe(false);
    });

    expect(result.current.error).toContain("失敗");
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("leaveRoomでロビーへ遷移", () => {
    const { result } = renderHook(() => useRoomController());
    act(() => result.current.leaveRoom());
    expect(mockPush).toHaveBeenCalledWith("/lobby");
  });
});
