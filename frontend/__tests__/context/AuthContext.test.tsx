import { render, screen, fireEvent } from "@testing-library/react";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";

const createSessionStorageMock = () => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => (key in store ? store[key] : null),
    setItem: (key: string, value: string) => {
      store[key] = String(value);
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  } as Storage;
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
  let sessionMock: Storage;

  beforeAll(() => {
    sessionMock = createSessionStorageMock();
    Object.defineProperty(window, "sessionStorage", {
      value: sessionMock,
      configurable: true,
    });
  });

  beforeEach(() => {
    sessionMock.clear();
    // fetch を毎回モック
    global.fetch = jest
      .fn<typeof global.fetch>()
      .mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      } as Response);
    jest.spyOn(console, "log").mockImplementation(() => {}); // ログの抑制
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("初期値はsessionStorageが空ならuser=null", () => {
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );
    expect(screen.getByTestId("user").textContent).toBe("");
  });

  it("sessionStorageにusernameがあると初期値に反映", () => {
    window.sessionStorage.setItem("username", "alice");
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );
    expect(screen.getByTestId("user").textContent).toBe("alice");
  });

  it("setUserで状態とsessionStorageが更新される", () => {
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
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
      </AuthProvider>
    );
    expect(screen.getByTestId("user").textContent).toBe("carol");

    fireEvent.click(screen.getByText("logout"));
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/mock/logout",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
    );
    expect(screen.getByTestId("user").textContent).toBe("");
    expect(window.sessionStorage.getItem("username")).toBeNull();
  });

  it("userが居ない場合はlogoutでAPIを呼ばない", () => {
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );
    fireEvent.click(screen.getByText("logout"));
    expect(global.fetch).not.toHaveBeenCalled();
    expect(screen.getByTestId("user").textContent).toBe("");
  });

  it("Provider外でuseAuthを呼ぶとエラー", () => {
    expect(() => render(<Outside />)).toThrow(
      "useAuth must be used within AuthProvider"
    );
  });
});
