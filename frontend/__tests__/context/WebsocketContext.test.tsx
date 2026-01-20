import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  WebSocketProvider,
  useWebSocket,
} from "../../context/WebSocketContext";
import { gameWebSocket } from "@/lib/websocket";

jest.mock("@/lib/websocket");

const mockedGameWebSocket = gameWebSocket as jest.Mocked<typeof gameWebSocket>;

const TestChild: React.FC<{ url?: string }> = ({ url }) => {
  const { isConnected, connect, disconnect } = useWebSocket();
  return (
    <div>
      <span data-testid="state">{isConnected ? "on" : "off"}</span>
      <button data-testid="connect" onClick={() => connect(url)}>
        connect
      </button>
      <button data-testid="disconnect" onClick={disconnect}>
        disconnect
      </button>
    </div>
  );
};

describe("WebSocketContext", () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    process.env = { ...ORIGINAL_ENV };
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    process.env = ORIGINAL_ENV;
  });

  it("マウント時に環境変数URLで接続する", () => {
    mockedGameWebSocket.connectToClientManage = jest.fn();
    mockedGameWebSocket.disconnectAll = jest.fn();
    mockedGameWebSocket.isConnected = jest.fn().mockReturnValue(false);

    process.env.NEXT_PUBLIC_CLIENT_MANAGE_WS_URL = "ws://env/app";
    render(
      <WebSocketProvider>
        <TestChild />
      </WebSocketProvider>,
    );
    expect(mockedGameWebSocket.connectToClientManage).toHaveBeenCalledWith(
      "ws://env/app",
    );
  });

  it("環境変数が無い場合はデフォルトURLで接続する", () => {
    mockedGameWebSocket.connectToClientManage = jest.fn();
    mockedGameWebSocket.disconnectAll = jest.fn();
    mockedGameWebSocket.isConnected = jest.fn().mockReturnValue(false);

    delete process.env.NEXT_PUBLIC_CLIENT_MANAGE_WS_URL;
    render(
      <WebSocketProvider>
        <TestChild />
      </WebSocketProvider>,
    );
    expect(mockedGameWebSocket.connectToClientManage).toHaveBeenCalledWith(
      "ws://localhost:8080/app/client-manage",
    );
  });

  it("connect() が引数なしならデフォルトURLを使う", () => {
    mockedGameWebSocket.connectToClientManage = jest.fn();
    mockedGameWebSocket.disconnectAll = jest.fn();
    mockedGameWebSocket.isConnected = jest.fn().mockReturnValue(false);

    process.env.NEXT_PUBLIC_CLIENT_MANAGE_WS_URL = "ws://env/app";
    render(
      <WebSocketProvider>
        <TestChild />
      </WebSocketProvider>,
    );

    fireEvent.click(screen.getByTestId("connect"));
    expect(mockedGameWebSocket.connectToClientManage).toHaveBeenLastCalledWith(
      "ws://env/app",
    );
  });

  it("connect() が引数ありなら指定URLを使う", () => {
    mockedGameWebSocket.connectToClientManage = jest.fn();
    mockedGameWebSocket.disconnectAll = jest.fn();
    mockedGameWebSocket.isConnected = jest.fn().mockReturnValue(false);

    render(
      <WebSocketProvider>
        <TestChild url="ws://custom/app" />
      </WebSocketProvider>,
    );

    fireEvent.click(screen.getByTestId("connect"));
    expect(mockedGameWebSocket.connectToClientManage).toHaveBeenLastCalledWith(
      "ws://custom/app",
    );
  });

  it("disconnect() で disconnectAll を呼ぶ", () => {
    mockedGameWebSocket.connectToClientManage = jest.fn();
    mockedGameWebSocket.disconnectAll = jest.fn();
    mockedGameWebSocket.isConnected = jest.fn().mockReturnValue(false);

    render(
      <WebSocketProvider>
        <TestChild />
      </WebSocketProvider>,
    );

    fireEvent.click(screen.getByTestId("disconnect"));
    expect(mockedGameWebSocket.disconnectAll).toHaveBeenCalled();
  });
});
