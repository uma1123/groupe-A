import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const useAccountController = () => {
  const router = useRouter();
  const { setUser } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/mock/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: "LOGIN", userId: username, password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        // 通信が成功したのでユーザー情報をセット
        setUser(username);

        router.push("/lobby");
        return true;
      } else {
        setError("ログインに失敗しました。");
        return false;
      }
    } catch (err) {
      console.error(err);
      setError("ログイン中にエラーが発生しました。");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (username: string, password: string) => {
    // ... (loginとほぼ同じ流れで、最後に setUser(username) する)
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/mock/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "REGISTER", userId: username, password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setUser(username); // 新規登録後も自動ログイン扱いにする
        router.push("/lobby");
        return true;
      } else {
        setError(data.message || "登録に失敗しました。");
        return false;
      }
    } catch (err) {
      console.error(err);
      setError("エラーが発生しました。");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, signup, isLoading, error };
};
