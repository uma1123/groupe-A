"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  user: string | null;
  setUser: (u: string | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<string | null>(null);

  // マウント後に sessionStorage から読み込む（クライアントで確実に取得）
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("username");
      if (stored) {
        setUserState(stored);
        console.log(
          "AuthProvider: loaded username from sessionStorage:",
          stored
        );
      } else {
        console.log("AuthProvider: no username in sessionStorage");
      }
    }
  }, []);

  const setUser = (u: string | null) => {
    if (typeof window !== "undefined") {
      if (u) sessionStorage.setItem("username", u);
      else sessionStorage.removeItem("username");
    }
    setUserState(u);
    console.log("AuthProvider: setUser ->", u);
  };

  const logout = () => setUser(null);

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
