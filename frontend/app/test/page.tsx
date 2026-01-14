"use client";

import { useEffect, useState, useRef } from "react";

// サーバ側と合わせた型定義
interface SampleMessage {
  id: number;
  password: string;
  message: string;
}

export default function ConnectionTestPage() {
  const [status, setStatus] = useState("未接続");
  const [logs, setLogs] = useState<string[]>([]);
  const socketRef = useRef<WebSocket | null>(null);

  const addLog = (msg: string) => {
    setLogs((prev) => [new Date().toLocaleTimeString() + " " + msg, ...prev]);
  };

  // 1. 接続処理
  useEffect(() => {
    // Java側のサンプルコードに合わせたURL
    // contextRoot = "/app", @ServerEndpoint("/sample") => /app/sample
    const wsUrl = "ws://localhost:8080/app/sample";

    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      setStatus("接続成功！ (OPEN)");
      addLog("Connected to " + wsUrl);
    };

    socket.onmessage = (event) => {
      // 受信データの確認
      addLog("受信: " + event.data);
      try {
        const data: SampleMessage = JSON.parse(event.data);
        addLog(`パース成功: ID=${data.id}, MSG=${data.message}`);
      } catch (e) {
        addLog("JSONパースエラー");
      }
    };

    socket.onclose = () => {
      setStatus("切断 (CLOSED)");
      addLog("Disconnected");
    };

    socket.onerror = (error) => {
      setStatus("エラー発生");
      console.error("WebSocket Error:", error);
      addLog("Error occurred (see console)");
    };

    // クリーンアップ
    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, []);

  // 2. 送信処理
  const handleSend = () => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      // Java側の SampleMessage クラスに合わせたJSON
      const payload: SampleMessage = {
        id: 123,
        password: "test-password",
        message: "Hello from Next.js!",
      };
      const json = JSON.stringify(payload);

      socketRef.current.send(json);
      addLog("送信: " + json);
    } else {
      alert("接続されていません");
    }
  };

  return (
    <div className="p-8 bg-black text-slate-200 min-h-screen font-mono">
      <h1 className="text-2xl font-bold text-red-500 mb-4">
        WebSocket Connection Test
      </h1>

      <div className="mb-4 p-4 border border-slate-700 rounded bg-slate-900">
        <p>
          Status:{" "}
          <span
            className={
              status.includes("成功") ? "text-green-400" : "text-red-400"
            }
          >
            {status}
          </span>
        </p>
      </div>

      <button
        onClick={handleSend}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white font-bold mb-6"
      >
        テストメッセージ送信
      </button>

      <div className="space-y-2">
        <h2 className="text-sm text-slate-500 border-b border-slate-700 pb-1">
          Logs
        </h2>
        {logs.map((log, i) => (
          <div key={i} className="text-xs">
            {log}
          </div>
        ))}
      </div>
    </div>
  );
}
