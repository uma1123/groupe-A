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
  undefined
);

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // 環境変数からモードを取得
    const mockMode = process.env.NEXT_PUBLIC_MOCK_MODE === "true";
    const wsUrl =
      process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080/app/sample";

    if (mockMode) {
      gameWebSocket.enableMockMode();
    }

    gameWebSocket.connect(wsUrl);

    const checkConnection = setInterval(() => {
      setIsConnected(gameWebSocket.isConnected());
    }, 1000);

    return () => {
      clearInterval(checkConnection);
      gameWebSocket.disconnect();
    };
  }, []);

  const connect = (url?: string) => {
    gameWebSocket.connect(url);
  };

  const disconnect = () => {
    gameWebSocket.disconnect();
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
