"use client";

import { useState } from "react";
import { gameWebSocket } from "@/lib/websocket";

export default function ConnectionTestPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [userId, setUserId] = useState("testuser");
  const [password, setPassword] = useState("password");
  const [roomId, setRoomId] = useState("");

  const addLog = (msg: string) => {
    setLogs((prev) => [`${new Date().toLocaleTimeString()} ${msg}`, ...prev]);
  };

  const testLogin = () => {
    addLog("📤 LOGIN送信");
    gameWebSocket.send({
      type: "LOGIN",
      userId,
      password,
    });
  };

  const testCreateRoom = () => {
    addLog("📤 CREATE_ROOM送信");
    gameWebSocket.send({
      type: "CREATE_ROOM",
      userId,
      numOfPlayer: 4,
      numOfLife: 3,
    });
  };

  const testJoinRoom = () => {
    addLog(`📤 JOIN_ROOM送信 (RoomID: ${roomId})`);
    gameWebSocket.send({
      type: "JOIN_ROOM",
      userId,
      roomId: Number(roomId),
    });
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-4">WebSocket統合テスト</h1>

      <div className="space-y-4 mb-8">
        <div>
          <label className="block text-sm mb-1">ユーザーID</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded w-64"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">パスワード</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded w-64"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={testLogin}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded"
          >
            LOGIN送信
          </button>
          <button
            onClick={testCreateRoom}
            className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded"
          >
            CREATE_ROOM送信
          </button>
        </div>

        <div>
          <label className="block text-sm mb-1">ルームID</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded w-64"
              placeholder="例: 1234"
            />
            <button
              onClick={testJoinRoom}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded"
            >
              JOIN_ROOM送信
            </button>
          </div>
        </div>
      </div>

      <div className="border border-gray-700 rounded p-4 bg-gray-900">
        <h2 className="font-bold mb-2">通信ログ</h2>
        <div className="space-y-1 max-h-96 overflow-y-auto font-mono text-sm">
          {logs.map((log, i) => (
            <div key={i} className="text-green-400">
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
