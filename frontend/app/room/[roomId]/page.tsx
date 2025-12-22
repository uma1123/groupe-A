"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Users, Settings, Copy, ArrowLeft, Info, Crown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import type { Player } from "@/types/room";

export default function RoomPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const roomId = (params?.roomId as string) || "";

  // ゲーム設定の状態
  const [maxPlayers, setMaxPlayers] = useState(9);
  const [initialLife, setInitialLife] = useState(3);
  const [multiplier, setMultiplier] = useState(0.8);

  // プレイヤーリストのモックデータ
  const players: Player[] = [
    {
      id: "p1",
      name: user || "Player 1",
      isHost: true,
      isReady: true,
      life: 3,
      avatarColor: "bg-red-900/80",
    },
    {
      id: "p2",
      name: "Player 2",
      isHost: false,
      isReady: true,
      life: 3,
      avatarColor: "bg-slate-800",
    },
    {
      id: "p3",
      name: "Player 3",
      isHost: false,
      isReady: true,
      life: 3,
      avatarColor: "bg-slate-800",
    },
  ];

  const handleCopyId = () => {
    navigator.clipboard.writeText(roomId);
    alert("ルームIDをコピーしました");
  };

  const handleLeave = () => {
    // 退出処理（WebSocket切断など）
    router.push("/lobby");
  };

  const handleStartGame = () => {
    // ゲーム開始処理（サーバー通知など）
    alert("ゲームを開始します！");
    router.push(`/game/${roomId}`);
  };

  return (
    <div className="min-h-screen bg-black text-slate-100 font-sans selection:bg-red-900 selection:text-white pb-10">
      {/* 1. ヘッダーエリア */}
      <header className="border-b border-red-900/20 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-900/20 rounded-lg border border-red-900/40">
              <Users className="text-red-500" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-red-500 tracking-wider">
                待機室
              </h1>
              <p className="text-xs text-slate-500">
                &gt; ゲーム設定を調整してください
              </p>
            </div>
          </div>

          <button
            onClick={handleLeave}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-400 border border-slate-800 rounded hover:text-white hover:border-slate-600 transition-colors bg-black"
          >
            <ArrowLeft size={16} />
            ロビーに戻る
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 mt-8 space-y-6">
        {/* 2. ルームIDバー */}
        <div className="w-full bg-[#0a0a0a] border border-red-900/30 rounded-lg p-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-4">
            <span className="text-slate-500 text-sm font-mono tracking-wider">
              ルームID
            </span>
            <span className="text-2xl font-bold text-red-500 font-mono tracking-widest">
              {roomId}
            </span>
          </div>
          <button
            onClick={handleCopyId}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-300 bg-slate-900/50 border border-slate-700 rounded hover:bg-slate-800 transition-all"
          >
            <Copy size={16} />
            IDをコピー
          </button>
        </div>

        {/* 3. メインコンテンツ（2カラムレイアウト） */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 左カラム：設定パネル (4/12) */}
          <div className="lg:col-span-4 space-y-6">
            {/* ゲーム設定カード */}
            <div className="bg-[#0a0a0a] border border-red-900/20 rounded-lg p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-6 text-red-500">
                <Settings size={20} />
                <h2 className="font-bold tracking-wider">ゲーム設定</h2>
              </div>

              <div className="space-y-8">
                {/* 最大プレイヤー数スライダー */}
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-400">最大プレイヤー数</span>
                    <span className="text-red-500 text-lg">{maxPlayers}</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="9"
                    value={maxPlayers}
                    onChange={(e) => setMaxPlayers(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                    <span>2</span>
                    <span>9</span>
                  </div>
                </div>

                {/* 初期ライフスライダー */}
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-400">初期ライフ</span>
                    <span className="text-red-500 text-lg">{initialLife}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={initialLife}
                    onChange={(e) => setInitialLife(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                    <span>1</span>
                    <span>10</span>
                  </div>
                </div>

                {/* 倍率スライダー */}
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-400">倍率</span>
                    <span className="text-red-500 text-lg">
                      {multiplier.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="2.0"
                    step="0.1"
                    value={multiplier}
                    onChange={(e) => setMultiplier(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                    <span>0.1</span>
                    <span>2.0</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ルール要約カード */}
            <div className="bg-[#0a0a0a] border border-red-900/20 rounded-lg p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4 text-red-500/80">
                <Info size={18} />
                <h3 className="text-sm font-bold tracking-wider">
                  ゲームルール
                </h3>
              </div>
              <ul className="space-y-3 text-xs text-slate-400 leading-relaxed list-none">
                <li className="flex gap-2">
                  <span className="text-red-900">▶</span> 0〜100の数値を選択
                </li>
                <li className="flex gap-2">
                  <span className="text-red-900">▶</span>{" "}
                  平均値×倍率に最も近い値が勝利
                </li>
                <li className="flex gap-2">
                  <span className="text-red-900">▶</span> 敗者は毎ターンライフ-1
                </li>
                <li className="flex gap-2">
                  <span className="text-red-900">▶</span> ライフ0で脱落
                </li>
                <li className="flex gap-2">
                  <span className="text-red-900">▶</span> 最後の1人まで生き残れ
                </li>
              </ul>
            </div>
          </div>

          {/* 右カラム：参加者リスト (8/12) */}
          <div className="lg:col-span-8">
            <div className="bg-[#0a0a0a] border border-slate-800 rounded-lg shadow-xl overflow-hidden min-h-[600px] flex flex-col">
              {/* リストヘッダー */}
              <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-[#111]">
                <div className="flex items-center gap-2 text-red-500">
                  <Users size={20} />
                  <h2 className="font-bold tracking-wider">参加者</h2>
                </div>
                <div className="bg-slate-900 px-3 py-1 rounded border border-slate-800">
                  <span className="text-xs text-slate-400 mr-2">人数:</span>
                  <span className="text-red-500 font-bold font-mono text-lg">
                    {players.length}
                  </span>
                  <span className="text-slate-600 font-mono text-lg mx-1">
                    /
                  </span>
                  <span className="text-slate-500 font-mono text-lg">
                    {maxPlayers}
                  </span>
                </div>
              </div>

              {/* プレイヤー一覧 */}
              <div className="p-6 space-y-3 flex-1 overflow-y-auto">
                {/* 既存プレイヤーのレンダリング */}
                {players.map((player, index) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between bg-slate-900/40 border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {/* アバター円 */}
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-slate-300 border border-slate-700 ${player.avatarColor}`}
                      >
                        P{index + 1}
                      </div>

                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-200">
                            {player.name}
                          </span>
                          {player.isHost && (
                            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-500 text-[10px] font-bold rounded border border-amber-500/30 flex items-center gap-1">
                              <Crown size={10} /> HOST
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                          ▶ {player.isHost ? "ゲームマスター" : "参加者"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 mr-6">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 block">
                          ライフ
                        </span>
                        <span className="font-mono text-xl text-red-500 font-bold">
                          {initialLife}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* 空きスロットのレンダリング */}
                {Array.from({
                  length: Math.max(0, maxPlayers - players.length),
                }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="flex items-center gap-4 bg-slate-900/20 border border-slate-800/50 border-dashed rounded-lg p-4 opacity-50"
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-900/50 border border-slate-800 flex items-center justify-center text-slate-700 font-mono text-sm">
                      P{players.length + i + 1}
                    </div>
                    <span className="text-slate-600 text-sm tracking-widest">
                      待機中 ...
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {/* ゲーム開始ボタン */}
            <div>
              <button
                onClick={handleStartGame}
                disabled={players.length < 2}
                className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg shadow-lg transition-colors"
              >
                {players.length < 2
                  ? "参加者が不足しています…"
                  : "ゲームを開始  ▶"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
