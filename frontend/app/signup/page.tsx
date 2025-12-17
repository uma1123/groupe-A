"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const auth = useAuth();

  // フォームの状態管理
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ログイン処理
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/mock/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        console.log("Signup API success, username:", username, "data:", data);
        if (typeof window !== "undefined") sessionStorage.setItem("username", username);
        auth.setUser(username);
        router.push("/lobby");
      } else {
        setError(data.message || "新規登録に失敗しました。");
      }
    } catch (error) {
      setError("新規登録中にエラーが発生しました。");
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-slate-100">
      <div className="w-full max-w-md p-8 rounded-lg shadow-xl bg-gradient-to-b from-slate-900/80 to-black/60 border border-red-900/40">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-red-400 drop-shadow-[0_0_12px_rgba(255,0,0,0.45)]">
            天秤ゲーム
          </h1>
          <p className="text-md text-red-200/60 mt-1">新規登録してください</p>
        </header>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-200 bg-red-900/60 border border-red-700 rounded">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="username"
              className="block mb-2 text-sm text-slate-300"
            >
              ユーザ名
            </label>
            <input
              id="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 bg-black/60 border border-red-800 rounded focus:outline-none focus:ring-2 focus:ring-red-500/50"
              placeholder="ユーザ名を入力"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm text-slate-300"
            >
              パスワード
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-black/60 border border-red-800 rounded focus:outline-none focus:ring-2 focus:ring-red-500/50"
              placeholder="パスワード"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 rounded font-semibold text-white transition ${
              isLoading
                ? "bg-red-700/60 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-500"
            }`}
          >
            {isLoading ? "処理中..." : "新規登録"}
          </button>
        </form>

        <footer className="mt-6 text-center text-sm text-slate-400">
          アカウントがある場合
          <Link href="/login" className="text-red-400 hover:underline ml-2">
            ログイン
          </Link>
        </footer>
      </div>
    </div>
  );
}
