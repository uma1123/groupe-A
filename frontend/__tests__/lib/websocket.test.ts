import { GameWebSocket } from "../../lib/websocket";

describe("GameWebSocket", () => {
  const OriginalWebSocket = globalThis.WebSocket;
  const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  const errSpy = jest.spyOn(console, "error").mockImplementation(() => {});

  let mockSend: jest.Mock;
  let mockClose: jest.Mock;
  let lastInstance: any;
  let MockWebSocket: jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();

    mockSend = jest.fn();
    mockClose = jest.fn();

    const WS = function (this: any, url: string) {
      lastInstance = this;
      this.url = url;
      this.readyState = WS.OPEN;
      this.send = mockSend;
      this.close = mockClose;
      this.onopen = undefined;
      this.onmessage = undefined;
      this.onerror = undefined;
      this.onclose = undefined;
    } as any;
    WS.CONNECTING = 0;
    WS.OPEN = 1;
    WS.CLOSING = 2;
    WS.CLOSED = 3;

    MockWebSocket = jest.fn(WS as any);
    globalThis.WebSocket = MockWebSocket as any;
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    logSpy.mockClear();
    errSpy.mockClear();
    globalThis.WebSocket = OriginalWebSocket as any;
  });

  it("connectToClientManage で指定URLに接続し activeSocket を設定する", () => {
    const ws = new GameWebSocket();
    ws.connectToClientManage("ws://example.com/app");

    expect(MockWebSocket).toHaveBeenCalledWith("ws://example.com/app");
    expect((ws as any).activeSocket).toBe(lastInstance);
    expect((ws as any).currentMode).toBe("CLIENT_MANAGE");
  });

  it("on で登録したハンドラが受信時に呼ばれる", () => {
    const ws = new GameWebSocket();
    const handler = jest.fn();
    ws.on("TEST" as any, handler);
    ws.connectToClientManage("ws://example.com/app");

    lastInstance.onmessage?.({
      data: JSON.stringify({ type: "TEST", value: 1 }),
    } as any);

    expect(handler).toHaveBeenCalledWith({ type: "TEST", value: 1 });
  });

  it("disconnectAll で両ソケットを close し状態をリセットする", () => {
    const ws = new GameWebSocket();
    ws.connectToClientManage("ws://cm/app");
    ws.connectToGameServer("ws://game/app");

    ws.disconnectAll();

    expect(mockClose).toHaveBeenCalledTimes(2);
    expect((ws as any).activeSocket).toBeNull();
    expect((ws as any).currentMode).toBeNull();
  });
});
