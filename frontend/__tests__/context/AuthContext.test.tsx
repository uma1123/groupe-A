import { render, screen, fireEvent } from "@testing-library/react";
import { act } from "react";
import { jest } from "@jest/globals";

// WebSocket を使うようになったのでモックをテスト内で生成
jest.mock("@/lib/websocket", () => {
  const send = jest.fn();
  const on = jest.fn().mockImplementation(() => () => {});
  const isConnected = jest.fn().mockReturnValue(true);
  const connectToClientManage = jest.fn();
  const disconnectAll = jest.fn();

  return {
    gameWebSocket: {
      on,
      isConnected,
      send,
      connectToClientManage,
      disconnectAll,
    },
  };
});

import { AuthProvider, useAuth } from "@/context/AuthContext";
import { gameWebSocket } from "@/lib/websocket";
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "@jest/globals";

const createSessionStorageMock = () => {
  let store = {};
  return {
    getItem: (key) => (key in store ? store[key] : null),
    setItem: (key, value) => {
      store[key] = String(value);
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
};

function Consumer() {
  const { user, setUser, logout } = useAuth();
  return (
    <div>
      <span data-testid="user">{user ?? ""}</span>
      <button onClick={() => setUser("bob")}>set</button>
      <button onClick={() => setUser(null)}>clear</button>
      <button onClick={() => logout()}>logout</button>
    </div>
  );
}

function Outside() {
  useAuth();
  return null;
}

describe("AuthContext", () => {
  let sessionMock;

  beforeAll(() => {
    sessionMock = createSessionStorageMock();
    Object.defineProperty(window, "sessionStorage", {
      value: sessionMock,
      configurable: true,
    });
  });

  beforeEach(() => {
    sessionMock.clear();
    jest.clearAllMocks();
    // fetch を毎回モック
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
    jest.spyOn(console, "log").mockImplementation(() => {}); // ログの抑制
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("初期値はsessionStorageが空ならuser=null", () => {
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );
    expect(screen.getByTestId("user").textContent).toBe("");
  });

  it("sessionStorageにusernameがあると初期値に反映", () => {
    window.sessionStorage.setItem("username", "alice");
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );
    expect(screen.getByTestId("user").textContent).toBe("alice");
  });

  it("setUserで状態とsessionStorageが更新される", () => {
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );
    fireEvent.click(screen.getByText("set"));
    expect(screen.getByTestId("user").textContent).toBe("bob");
    expect(window.sessionStorage.getItem("username")).toBe("bob");

    fireEvent.click(screen.getByText("clear"));
    expect(screen.getByTestId("user").textContent).toBe("");
    expect(window.sessionStorage.getItem("username")).toBeNull();
  });

  it("logoutでAPI呼び出しし、userをクリア", async () => {
    window.sessionStorage.setItem("username", "carol");
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );
    expect(screen.getByTestId("user").textContent).toBe("carol");

    fireEvent.click(screen.getByText("logout"));
    // WebSocket 経由で送信されることを期待（fetch は呼ばれない）
    expect(gameWebSocket.send).toHaveBeenCalledWith({
      type: "LOGOUT",
      userId: "carol",
    });
    // モックされた on ハンドラを呼び出して成功をシミュレート
    const onMock = gameWebSocket.on as unknown as jest.Mock;
    const successCall = onMock.mock.calls.find(
      (c: any[]) => c[0] === "LOGOUT_SUCCESS",
    );
    if (successCall) {
      const handler = successCall[1];
      await act(async () => {
        await handler({ type: "LOGOUT_SUCCESS" });
      });
    }
    expect(global.fetch).not.toHaveBeenCalled();
    expect(screen.getByTestId("user").textContent).toBe("");
    expect(window.sessionStorage.getItem("username")).toBeNull();
  });

  it("userが居ない場合はlogoutでAPIを呼ばない", () => {
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );
    fireEvent.click(screen.getByText("logout"));
    expect(global.fetch).not.toHaveBeenCalled();
    expect(gameWebSocket.send).not.toHaveBeenCalled();
    expect(screen.getByTestId("user").textContent).toBe("");
  });

  it("Provider外でuseAuthを呼ぶとエラー", () => {
    expect(() => render(<Outside />)).toThrow(
      "useAuth must be used within AuthProvider",
    );
  });
});
