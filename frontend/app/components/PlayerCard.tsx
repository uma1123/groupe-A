"use client";

import { User, Heart } from "lucide-react";
import type { Player } from "@/types/game";

export const PlayerCard = ({ player }: { player: Player }) => {
  const baseStyle =
    "relative aspect-square rounded-lg border transition-all overflow-hidden";
  const statusStyles = {
    empty: "border-red-900/10 bg-white/5",
    dead: "border-slate-800 bg-slate-900/50 opacity-60",
    you: "border-red-500 bg-red-500/10 shadow-[0_0_10px_rgba(239,68,68,0.3)]",
    normal: "border-slate-800 bg-black/60",
  };

  let cardStyle = statusStyles.normal;
  if (player.status === "empty") cardStyle = statusStyles.empty;
  else if (player.status === "dead") cardStyle = statusStyles.dead;
  else if (player.isYou) cardStyle = statusStyles.you;

  return (
    <div className={`${baseStyle} ${cardStyle}`}>
      {player.status === "empty" ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border border-dashed border-red-900/30"></div>
        </div>
      ) : (
        <>
          <div
            className={`absolute inset-0 flex items-center justify-center ${
              player.status === "dead" ? "grayscale" : ""
            }`}
          >
            <div className="translate-y-2">
              <User
                size={70}
                color="black"
                className={`rounded-full ${
                  player.status === "dead"
                    ? "bg-slate-700"
                    : "bg-gradient-to-b from-slate-700 to-slate-900"
                }`}
              />
            </div>
            <div className="absolute bottom-2 left-0 right-0 z-10">
              <div className="flex gap-1 justify-center">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Heart
                    key={i}
                    className={`w-5 h-5 ${
                      i < player.lives
                        ? "text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]"
                        : "text-slate-800"
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="absolute top-1 left-0 right-0 flex justify-center">
              <div
                className={`text-white text-[12px] font-bold uppercase px-2 py-0.5 rounded-sm tracking-wider shadow-sm ${
                  player.isYou ? "bg-red-600" : "bg-blue-600"
                }`}
              >
                {player.isYou ? "YOU" : player.name}
              </div>
            </div>
          </div>
          {player.status === "dead" && (
            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
              <div className="text-red-600 text-5xl font-bold opacity-100 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]">
                ×
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
