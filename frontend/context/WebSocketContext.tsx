// 別端末での動作確認の時にurlを変える
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { gameWebSocket } from "@/lib/websocket";

type WebSocketContextType = {
  isConnected: boolean;
  connect: (url?: string) => void;
  disconnect: () => void;
};

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined,
);

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    //  クライアント管理サーバのURLを使用
    const wsUrl =
      process.env.NEXT_PUBLIC_CLIENT_MANAGE_WS_URL ||
      "ws://localhost:8080/app/client-manage";

    //  connectToClientManage を使用
    gameWebSocket.connectToClientManage(wsUrl);

    const checkConnection = setInterval(() => {
      setIsConnected(gameWebSocket.isConnected());
    }, 1000);

    return () => {
      clearInterval(checkConnection);
      gameWebSocket.disconnectAll();
    };
  }, []);

  const connect = (url?: string) => {
    //  デフォルトURLを変更
    const defaultUrl =
      process.env.NEXT_PUBLIC_CLIENT_MANAGE_WS_URL ||
      "ws://localhost:8080/app/client-manage";
    gameWebSocket.connectToClientManage(url || defaultUrl);
  };

  const disconnect = () => {
    gameWebSocket.disconnectAll();
  };

  return (
    <WebSocketContext.Provider value={{ isConnected, connect, disconnect }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within WebSocketProvider");
  }
  return context;
}
