"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  Users,
  Settings,
  Copy,
  ArrowLeft,
  Info,
  Crown,
  Lock,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import type { Player } from "@/types/game";
import { useRoomController } from "@/hooks/useRoomController";
import { useRoomContext } from "@/context/RoomContext";

export default function RoomPage() {
  const { user } = useAuth();
  const { maxPlayers, initialLife } = useRoomContext();
  const params = useParams();
  const roomId = (params?.roomId as string) || "";
  const { startGame, leaveRoom } = useRoomController();

  const [isHydrated] = useState(true);

  const isRuleLocked = true;

  // プレイヤーリストのモックデータ（Hydration対策済み）
  const players: Player[] = isHydrated
    ? [
        {
          id: "p1",
          name: user || "Player 1",
          isHost: true,
          isReady: true,
          lives: initialLife,
          avatarColor: "bg-red-900/80",
          isYou: true,
          choice: null,
        },
        {
          id: "p2",
          name: "Player 2",
          isHost: false,
          isReady: true,
          lives: initialLife,
          avatarColor: "bg-slate-800",
          isYou: false,
          choice: null,
        },
        {
          id: "p3",
          name: "Player 3",
          isHost: false,
          isReady: true,
          lives: initialLife,
          avatarColor: "bg-slate-800",
          isYou: false,
          choice: null,
        },
      ]
    : [];

  const handleCopyId = () => {
    navigator.clipboard.writeText(roomId);
    alert("ルームIDをコピーしました");
  };

  // Hydration前はローディング画面を表示
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-black text-slate-100 font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-slate-400">ルーム情報を読み込み中...</p>
        </div>
      </div>
    );
  }

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

          <div className="flex items-center gap-2">
            <button
              onClick={leaveRoom}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-400 border border-slate-800 rounded hover:text-white hover:border-slate-600 transition-colors bg-black"
            >
              <ArrowLeft size={16} />
              ロビーに戻る
            </button>
          </div>
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
            {/* ゲーム設定カード（読取専用） */}
            <div className="bg-[#0a0a0a] border border-red-900/20 rounded-lg p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6 text-red-500">
                <div className="flex items-center gap-2">
                  <Settings size={20} />
                  <h2 className="font-bold tracking-wider">ゲーム設定</h2>
                </div>
                {isRuleLocked && (
                  <span className="flex items-center gap-1 px-3 py-1 text-[11px] font-bold rounded border border-red-800 bg-red-900/20 text-red-300">
                    <Lock size={12} />
                    固定済み
                  </span>
                )}
              </div>

              <div className="space-y-5">
                <div className="rounded-lg border border-red-900/50 bg-red-900/10 p-4">
                  <div className="flex items-center justify-between text-sm font-bold text-slate-200">
                    <span className="flex items-center gap-2">
                      <Users size={14} />
                      最大プレイヤー数
                    </span>
                    <span className="text-red-400 text-xl font-black">
                      {maxPlayers}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-[12px] text-red-300/80">
                    <Lock size={12} />
                    設定済み（変更不可）
                  </div>
                </div>

                <div className="rounded-lg border border-red-900/50 bg-red-900/10 p-4">
                  <div className="flex items-center justify-between text-sm font-bold text-slate-200">
                    <span className="flex items-center gap-2">
                      <Users size={14} />
                      初期ライフ
                    </span>
                    <span className="text-red-400 text-xl font-black">
                      {initialLife}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-[12px] text-red-300/80">
                    <Lock size={12} />
                    設定済み（変更不可）
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
                    {/* 動的プレイヤー数表示 */}
                    {3}
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
                {/* プレイヤー1 */}
                <div className="flex items-center justify-between bg-slate-900/40 border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-slate-300 border border-slate-700 bg-red-900/80">
                      P1
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-200">
                          {user || "Player 1"}
                        </span>
                        <span className="px-2 py-0.5 bg-amber-500/20 text-amber-500 text-[10px] font-bold rounded border border-amber-500/30 flex items-center gap-1">
                          <Crown size={10} /> HOST
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                        ▶ ゲームマスター
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

                {/* プレイヤー2 */}
                <div className="flex items-center justify-between bg-slate-900/40 border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-slate-300 border border-slate-700 bg-slate-800">
                      P2
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-200">
                          Player 2
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                        ▶ 参加者
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

                {/* プレイヤー3 */}
                <div className="flex items-center justify-between bg-slate-900/40 border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-slate-300 border border-slate-700 bg-slate-800">
                      P3
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-200">
                          Player 3
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                        ▶ 参加者
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

                {/* 空きスロット */}
                {Array.from({
                  length: Math.max(0, maxPlayers - 3),
                }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="flex items-center gap-4 bg-slate-900/20 border border-slate-800/50 border-dashed rounded-lg p-4 opacity-50"
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-900/50 border border-slate-800 flex items-center justify-center text-slate-700 font-mono text-sm">
                      P{4 + i}
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
                onClick={() => startGame(roomId)}
                disabled={false}
                className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg shadow-lg transition-colors disabled:opacity-50"
              >
                ゲームを開始 ▶
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
