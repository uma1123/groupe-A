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

describe("useAccountController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("login成功時にsetUserとrouter.pushが呼ばれる", async () => {
    // ★ async関数として直接定義
    global.fetch = jest.fn(
      async () =>
        ({
          ok: true,
          json: jest.fn(async () => ({ success: true })),
        } as any)
    );

    const { result } = renderHook(() => useAccountController());

    await act(async () => {
      const ok = await result.current.login("alice", "pass");
      expect(ok).toBe(true);
    });

    expect(mockSetUser).toHaveBeenCalledWith("alice");
    expect(mockPush).toHaveBeenCalledWith("/lobby");
    expect(result.current.error).toBe("");
    expect(result.current.isLoading).toBe(false);
  });

  it("login失敗時にerrorが設定される", async () => {
    global.fetch = jest.fn(
      async () =>
        ({
          ok: false,
          json: jest.fn(async () => ({ success: false, message: "NG" })),
        } as any)
    );

    const { result } = renderHook(() => useAccountController());

    await act(async () => {
      const ok = await result.current.login("a", "b");
      expect(ok).toBe(false);
    });

    expect(result.current.error).toContain("ログイン");
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("signup成功時にsetUserとrouter.pushが呼ばれる", async () => {
    global.fetch = jest.fn(
      async () =>
        ({
          ok: true,
          json: jest.fn(async () => ({ success: true })),
        } as any)
    );

    const { result } = renderHook(() => useAccountController());

    await act(async () => {
      const ok = await result.current.signup("newuser", "pass");
      expect(ok).toBe(true);
    });

    expect(mockSetUser).toHaveBeenCalledWith("newuser");
    expect(mockPush).toHaveBeenCalledWith("/lobby");
  });
});
