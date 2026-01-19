// 削除する（デバック用）

"use client";

import { useWebSocket } from "@/context/WebSocketContext";

export function WebSocketStatus() {
  const { isConnected } = useWebSocket();

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`px-4 py-2 rounded-full text-sm font-medium ${
          isConnected
            ? "bg-green-500 text-white"
            : "bg-red-500 text-white animate-pulse"
        }`}
      >
        {isConnected ? "🟢 接続中" : "🔴 切断"}
      </div>
    </div>
  );
}
