"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { gameWebSocket } from "@/lib/websocket";
import type {
  LogoutMessage,
  LogoutSuccessResponse,
  ErrorResponse,
} from "@/types/websocket";

type AuthContextType = {
  user: string | null;
  setUser: (u: string | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("username");
      if (stored) {
        console.log(
          "AuthProvider: loaded username from sessionStorage:",
          stored,
        );
        return stored;
      } else {
        console.log("AuthProvider: no username in sessionStorage");
      }
    }
    return null;
  });

  // マウント後に sessionStorage から読み込む（クライアントで確実に取得）
  useEffect(() => {
    // useEffect is no longer needed for initialization
  }, []);

  const setUser = (u: string | null) => {
    if (typeof window !== "undefined") {
      if (u) sessionStorage.setItem("username", u);
      else sessionStorage.removeItem("username");
    }
    setUserState(u);
    console.log("AuthProvider: setUser ->", u);
  };

  const logout = () => {
    const currentUser =
      user ??
      (typeof window !== "undefined"
        ? sessionStorage.getItem("username")
        : null);

    if (!currentUser) return;

    // クライアント管理サーバへ WebSocket 経由で LOGOUT を送信
    try {
      // ハンドラ登録
      const offSuccess = gameWebSocket.on(
        "LOGOUT_SUCCESS",
        (_data: LogoutSuccessResponse) => {
          setUser(null);
          offSuccess();
          offErr();
          try {
            gameWebSocket.disconnectAll();
          } catch (_) {}
        },
      );

      const offErr = gameWebSocket.on("ERROR", (err: ErrorResponse) => {
        console.error("Logout error (WS):", err);
        offSuccess();
        offErr();
      });

      // 既に接続済みなら送信
      const logoutMsg: LogoutMessage = { type: "LOGOUT", userId: currentUser };
      if (gameWebSocket.isConnected()) {
        gameWebSocket.send(logoutMsg);
        return;
      }

      // 未接続なら一時的に接続して送信（少し遅延を置いて送る）
      const url =
        process.env.NEXT_PUBLIC_CLIENT_MANAGE_WS_URL ??
        "ws://localhost:8080/app/client-manage";
      gameWebSocket.connectToClientManage(url);
      setTimeout(() => {
        try {
          gameWebSocket.send(logoutMsg);
        } catch (e) {
          console.error("Logout send error after connect:", e);
        }
      }, 250);
    } catch (e) {
      console.error("Logout unexpected error:", e);
      // フォールバック: 開発時は既存のモックエンドポイントへフォールバック
      if (process.env.NODE_ENV !== "production") {
        fetch("/api/mock/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "LOGOUT", userId: currentUser }),
        }).catch((err) => console.error("Fallback logout error:", err));
        setUser(null);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
