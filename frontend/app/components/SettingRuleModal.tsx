"use client";
import { ArrowRight, X } from "lucide-react";
import React, { useState } from "react";

type Props = {
  onConfirmAction: (maxPlayers: number, initialLife: number) => void;
  onCloseAction: () => void;
};

// ゲーム設定モーダルコンポーネント(ライフ数と最大プレイヤー数)
export default function SettingRuleModal({
  onConfirmAction,
  onCloseAction,
}: Props) {
  // ゲーム設定の状態
  const [maxPlayers, setMaxPlayers] = useState(9);
  const [initialLife, setInitialLife] = useState(3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      {/* ノイズ/グリッチ風オーバーレイ */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,0,0,0.08),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.05),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(255,0,0,0.06),transparent_40%)] mix-blend-screen opacity-70 animate-pulse-slow" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_95%,rgba(255,0,0,0.1))] bg-[length:100%_4px] opacity-40" />

      <div className="relative w-full max-w-2xl overflow-hidden rounded-xl border border-red-900/60 bg-gradient-to-b from-[#1a0004] via-black to-[#0c0c0c] shadow-[0_0_40px_rgba(255,0,0,0.25)]">
        {/* モーダルヘッダー */}
        <div className="flex items-center justify-between border-b border-red-900/40 bg-gradient-to-r from-red-950/70 to-black px-8 py-6">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 animate-ping rounded-full bg-red-500" />
            <h2 className="text-2xl font-black tracking-[0.2em] text-red-400 drop-shadow-[0_0_12px_rgba(255,0,0,0.6)]">
              ゲーム設定
            </h2>
          </div>
          <button
            className="rounded border border-red-900/50 p-2 text-red-400 transition hover:bg-red-500/10 hover:text-red-200"
            onClick={onCloseAction}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* モーダルコンテンツ */}
        <div className="space-y-8 px-8 py-7 text-sm">
          <div className="space-y-4 rounded-lg border border-red-900/40 bg-black/40 p-5 shadow-inner shadow-red-900/30">
            <h3 className="text-xs font-bold uppercase tracking-[0.35em] text-red-400">
              最大プレイヤー数
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-bold text-slate-400">
                <span>最大プレイヤー数</span>
                <span className="text-lg text-red-300">{maxPlayers}</span>
              </div>
              <input
                type="range"
                min="2"
                max="9"
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(Number(e.target.value))}
                className="w-full accent-red-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-red-800">
                <span>2</span>
                <span>9</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-lg border border-red-900/40 bg-black/40 p-5 shadow-inner shadow-red-900/30">
            <h3 className="text-xs font-bold uppercase tracking-[0.35em] text-red-400">
              初期ライフ数
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-bold text-slate-400">
                <span>初期ライフ数</span>
                <span className="text-lg text-red-300">{initialLife}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={initialLife}
                onChange={(e) => setInitialLife(Number(e.target.value))}
                className="w-full accent-red-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-red-800">
                <span>2</span>
                <span>10</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-red-900/60 bg-gradient-to-r from-red-950/50 to-black p-4">
            <h3 className="mb-2 text-[11px] font-bold tracking-[0.3em] text-red-500">
              ※ 注意
            </h3>
            <p className="text-xs text-red-200/90">
              これらの設定は一度確定すると変更できません。慎重に設定してください。
            </p>
          </div>
        </div>

        {/* モーダルの確定ボタンを修正 */}
        <button
          onClick={() => onConfirmAction(maxPlayers, initialLife)}
          className="group flex w-full items-center justify-center gap-3 bg-gradient-to-r from-red-700 via-red-600 to-red-700 py-4 text-lg font-bold text-white shadow-[0_0_28px_rgba(255,0,0,0.35)] transition hover:from-red-600 hover:to-red-500"
        >
          <span className="tracking-[0.2em]">確定させてルーム作成</span>
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </button>

        {/* ボーダーグロー */}
        <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-red-900/50 shadow-[0_0_45px_rgba(255,0,0,0.25)_inset]" />
      </div>
    </div>
  );
}
