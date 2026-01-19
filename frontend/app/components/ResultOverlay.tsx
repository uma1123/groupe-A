"use client";

import { Crown, Skull, LogOut } from "lucide-react";

//最終結果オーバレイコンポーネント
export const ResultOverlay = ({
  result,
  onExit,
}: {
  result: "WIN" | "LOSE";
  onExit: () => void;
}) => {
  const isWin = result === "WIN";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-500">
      <div
        className={`relative w-full max-w-lg p-1 rounded-xl bg-gradient-to-b ${
          isWin ? "from-yellow-500 to-yellow-900" : "from-red-600 to-red-900"
        }`}
      >
        <div className="bg-black/90 rounded-lg p-10 text-center border border-white/10 shadow-2xl">
          <div className="mb-6 flex justify-center">
            {isWin ? (
              <Crown
                size={80}
                className="text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)] animate-bounce"
              />
            ) : (
              <Skull
                size={80}
                className="text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)] animate-pulse"
              />
            )}
          </div>
          <h2
            className={`text-5xl font-black italic tracking-widest mb-2 ${
              isWin ? "text-yellow-500" : "text-red-600"
            }`}
          >
            {isWin ? "GAME クリア" : "死亡"}
          </h2>
          <p className="text-slate-400 text-sm tracking-[0.5em] mb-10 uppercase">
            {isWin ? "こんぐらちゅれーしょん" : "あなたは死亡しました"}
          </p>
          <div
            className={`h-1 w-20 mx-auto mb-10 ${
              isWin ? "bg-yellow-500" : "bg-red-600"
            }`}
          ></div>
          <button
            onClick={onExit}
            className={`group relative px-8 py-4 w-full font-bold tracking-widest text-white transition-all overflow-hidden rounded-md ${
              isWin
                ? "bg-yellow-600 hover:bg-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.3)]"
                : "bg-red-700 hover:bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.3)]"
            }`}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <LogOut size={18} />
              RETURN TO LOBBY
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
