"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

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
          stored
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

    if (currentUser) {
      fetch("/api/mock/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: "LOGOUT", userId: currentUser }),
      }).catch((e) => console.error("Logout error:", e));
      setUser(null);
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
