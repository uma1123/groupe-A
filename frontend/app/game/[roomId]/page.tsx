"use client";

import { useState } from "react";
import { Users, Timer, Target, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import type { Player } from "@/types/game";
import { makeMockPlayers } from "@/lib/gameMockData";
import { PlayerCard } from "@/app/components/PlayerCard";
import { ResultOverlay } from "@/app/components/ResultOverlay";

// --- 2. メインページコンポーネント ---
export default function GamePage() {
  const router = useRouter();
  const [selectedNumber, setSelectedNumber] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [showResult, setShowResult] = useState(false);
  const [gameResult, setGameResult] = useState<"WIN" | "LOSE" | null>(null);

  // Contextからユーザー情報を取得
  const { user } = useAuth();
  const [players, setPlayers] = useState<Player[]>(
    makeMockPlayers(user || "Player 1")
  );

  const alivePlayers = players.filter((p) => p.status === "alive").length;
  const targetValue = 31.375;

  const handleSubmit = () => {
    if (selectedNumber.trim()) {
      setSubmitted(true);
      setTimeout(() => {
        setShowResult(true);
        // ゲーム終了判定をここに追加（例：ライフが0になったら）
        // デモ用に勝利条件を設定
        const userPlayer = players.find((p) => p.isYou);
        if (userPlayer && userPlayer.lives <= 1) {
          setTimeout(() => setGameResult("LOSE"), 1000);
        }
      }, 2000);
    }
  };

  const handleNextRound = () => {
    setCurrentRound(currentRound + 1);
    setSelectedNumber("");
    setSubmitted(false);
    setShowResult(false);

    // デモ用：3ラウンド目で勝利
    if (currentRound >= 3) {
      setTimeout(() => setGameResult("WIN"), 500);
    }
  };

  const handleExit = () => {
    router.push("/lobby");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#1a0000] to-black text-slate-200 overflow-hidden font-sans">
      {gameResult && <ResultOverlay result={gameResult} onExit={handleExit} />}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-10">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, #ff0000 2px, #ff0000 4px)",
          }}
        ></div>
      </div>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-red-900/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-red-900/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Header */}
      <div className="relative border-b border-red-900/30 bg-black/40 backdrop-blur-sm z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <h1 className="text-2xl font-bold text-red-500 font-mono tracking-wider">
                  てんびん
                </h1>
                <p className="text-[10px] text-slate-500 mt-1 tracking-widest">
                  DEATH GAME IN PROGRESS
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Timer className="w-4 h-4 text-red-500" />
                <span className="text-slate-500">ラウンド</span>
                <span className="text-red-500 font-bold font-mono text-lg">
                  {currentRound}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-red-500" />
                <span className="text-slate-500">生存者</span>
                <span className="text-red-500 font-bold font-mono text-lg">
                  {alivePlayers}/
                  {players.filter((p) => p.status !== "empty").length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="relative max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8 flex justify-center">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-red-500/10 blur-xl animate-pulse"></div>
            <div className="relative border border-red-500/30 bg-black/60 backdrop-blur-sm rounded-lg px-8 py-6 shadow-[0_0_15px_rgba(220,38,38,0.2)]">
              <div className="flex items-center gap-4">
                <Target className="w-6 h-6 text-red-500 animate-pulse" />
                <div className="text-center">
                  <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">
                    狙うべき数値
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm text-slate-400">平均値 ×</span>
                    <span className="text-2xl font-bold text-red-400 font-mono">
                      0.8
                    </span>
                    <span className="text-sm text-slate-400">=</span>
                    <span className="text-4xl font-bold text-red-500 font-mono drop-shadow-[0_0_5px_rgba(220,38,38,0.8)]">
                      {showResult ? targetValue : "?"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左側：プレイヤーグリッド */}
          <div className="lg:col-span-2">
            <div className="bg-black/40 border border-red-900/30 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-lg font-bold text-red-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Users className="w-8 h-8" />
                参加者
              </h2>
              <div className="space-y-3">
                <div className="grid grid-cols-5 gap-3">
                  {players.slice(0, 5).map((player) => (
                    <PlayerCard key={player.id} player={player} />
                  ))}
                </div>
                <div className="grid grid-cols-5 gap-3">
                  <div></div>
                  {players.slice(5, 9).map((player) => (
                    <PlayerCard key={player.id} player={player} />
                  ))}
                </div>
              </div>

              {/* 結果表示 */}
              {showResult && (
                <div className="mt-4 bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <User
                        color="black"
                        size={60}
                        className="rounded-full bg-gradient-to-b from-slate-700 to-slate-900"
                      />
                      <div>
                        <p className="text-sm text-emerald-400 font-bold tracking-wider">
                          {user || "Player 1"}
                        </p>
                        <p className="text-xs text-slate-400">
                          選択: {selectedNumber}
                        </p>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-emerald-400 uppercase tracking-widest drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]">
                      WIN
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 右側：入力パネル */}
          <div className="lg:col-span-1">
            <div className="bg-black/60 border border-red-500/30 rounded-lg p-6 sticky top-6 shadow-xl">
              {!submitted ? (
                <>
                  <h2 className="text-lg font-bold text-red-500 uppercase tracking-wider mb-4 border-b border-red-900/30 pb-2">
                    数値選択
                  </h2>
                  <p className="text-slate-400 text-xs mb-6 leading-relaxed">
                    0から100の間で数値を選択してください。全員の平均値に0.8を掛けた値に最も近い数値を選んだプレイヤーが勝利します。
                  </p>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                        あなたの選択
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={selectedNumber}
                        onChange={(e) => setSelectedNumber(e.target.value)}
                        placeholder="0-100"
                        className="w-full bg-[#050505] border border-red-900/40 text-3xl font-bold text-center text-red-500 placeholder-slate-800 h-20 rounded-md focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-900 transition-all font-mono"
                      />
                    </div>
                    <button
                      onClick={handleSubmit}
                      disabled={
                        !selectedNumber ||
                        Number.parseInt(selectedNumber) < 0 ||
                        Number.parseInt(selectedNumber) > 100
                      }
                      className="w-full bg-red-600 hover:bg-red-500 text-white font-bold uppercase tracking-wider py-4 rounded-md transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:shadow-[0_0_25px_rgba(220,38,38,0.6)]"
                    >
                      決定する
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center mb-8 pt-4">
                    <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">
                      あなたの選択
                    </p>
                    <div className="text-7xl font-bold text-red-500 mb-6 animate-pulse font-mono drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]">
                      {selectedNumber}
                    </div>
                    <div className="inline-block bg-emerald-900/20 border border-emerald-500/30 text-emerald-400 px-6 py-2 rounded text-xs font-bold uppercase tracking-wider">
                      ✓ 送信完了
                    </div>
                  </div>
                  {!showResult ? (
                    <div className="bg-white/5 rounded-lg p-6 text-center border border-white/5">
                      <p className="text-xs text-slate-400 mb-4 tracking-wider">
                        他のプレイヤーを待機中...
                      </p>
                      <div className="flex gap-3 justify-center">
                        <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-bounce"></div>
                        <div
                          className="w-2.5 h-2.5 bg-red-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="w-2.5 h-2.5 bg-red-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6 animate-in fade-in zoom-in duration-300">
                      <div className="bg-black/40 border border-red-900/30 rounded-lg p-5">
                        <h3 className="text-xs font-bold text-red-500 mb-4 uppercase tracking-widest border-b border-red-900/30 pb-2">
                          ラウンド結果
                        </h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-500 text-xs uppercase">
                              平均値
                            </span>
                            <span className="text-slate-200 font-mono font-bold">
                              39.219
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500 text-xs uppercase">
                              倍率
                            </span>
                            <span className="text-slate-200 font-mono font-bold">
                              × 0.8
                            </span>
                          </div>
                          <div className="border-t border-red-900/30 pt-3 flex justify-between items-center">
                            <span className="text-slate-400 text-xs uppercase font-bold">
                              目標値
                            </span>
                            <span className="text-red-500 font-mono font-bold text-xl">
                              {targetValue}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={handleNextRound}
                        className="w-full bg-red-600 hover:bg-red-500 text-white font-bold uppercase tracking-wider py-4 rounded-md transition-all shadow-[0_0_15px_rgba(220,38,38,0.4)]"
                      >
                        次のラウンドへ
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* デバッグボタン（開発用） */}
      <div className="fixed bottom-4 right-4 z-40 flex gap-2">
        <button
          onClick={() => setGameResult("WIN")}
          className="bg-yellow-600 hover:bg-yellow-500 px-4 py-2 rounded text-xs font-bold"
        >
          WIN
        </button>
        <button
          onClick={() => setGameResult("LOSE")}
          className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded text-xs font-bold"
        >
          LOSE
        </button>
      </div>
    </div>
  );
}
