import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import type {
  LoginMessage,
  SignupMessage,
  AuthSuccessResponse,
  ErrorResponse,
} from "@/types/websocket";
import { gameWebSocket } from "@/lib/websocket";

export const useAccountController = () => {
  const router = useRouter();
  const { setUser } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // クライアント管理サーバに接続
    gameWebSocket.connectToClientManage(
      process.env.NEXT_PUBLIC_CLIENT_MANAGE_WS_URL ||
        "ws://localhost:8080/client-manage",
    );

    // 認証成功ハンドラ
    const offAuth = gameWebSocket.on(
      "AUTH_SUCCESS",
      (data: AuthSuccessResponse) => {
        console.log("✅ 認証成功:", data);
        setUser(data.userId);
        setIsLoading(false);
        router.push("/lobby");
      },
    );

    // エラーハンドラ
    const offErr = gameWebSocket.on("ERROR", (data: ErrorResponse) => {
      console.error("❌ エラー:", data);
      setError(data.message);
      setIsLoading(false);
    });

    return () => {
      offAuth();
      offErr();
    };
  }, [router, setUser]);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError("");

    const message: LoginMessage = {
      type: "LOGIN",
      userId: username,
      password,
    };

    gameWebSocket.send(message);
  };

  const signup = async (username: string, password: string) => {
    setIsLoading(true);
    setError("");

    const message: SignupMessage = {
      type: "SIGNUP",
      userId: username,
      password,
    };

    gameWebSocket.send(message);
  };

  return { login, signup, isLoading, error };
};
