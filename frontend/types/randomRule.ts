export type GameRule = {
  id: string;
  name: string;
  description: string;
  // 画面「平均値 × ?」の?に表示するテキスト
  multiplierLabel?: string; // 例: "0.8" / "0.6"
  // このラウンドの1回の敗北あたりのライフ減少量
  lifeDamage: number; // 0, 1, 2 ...
  // タグ用の色クラス
  badgeClass: string;
};

export const RULE_PRESETS: GameRule[] = [
  {
    id: "1",
    name: "奇数",
    description: "奇数を選べ。偶数は呪われるかもしれない。",
    multiplierLabel: "0.8",
    lifeDamage: 1,
    badgeClass: "bg-red-600/20 text-red-400 border-red-500/40",
  },
  {
    id: "2",
    name: "偶数",
    description: "偶数を選べ。奇数は重くのしかかる。",
    multiplierLabel: "0.8",
    lifeDamage: 1,
    badgeClass: "bg-blue-600/20 text-blue-300 border-blue-500/40",
  },
  {
    id: "3",
    name: "3の倍数",
    description: "3の倍数だけが祝福される。",
    multiplierLabel: "0.8",
    lifeDamage: 1,
    badgeClass: "bg-amber-600/20 text-amber-300 border-amber-500/40",
  },
  {
    id: "4",
    name: "素数",
    description: "素数を選んだ者に微笑むラウンド。",
    multiplierLabel: "0.8",
    lifeDamage: 1,
    badgeClass: "bg-emerald-600/20 text-emerald-300 border-emerald-500/40",
  },
  {
    id: "5",
    name: "平均最遠&最近ペナルティ",
    description: "平均に一番近い人と遠い人だけライフ-1。",
    multiplierLabel: "0.8",
    lifeDamage: 1,
    badgeClass: "bg-fuchsia-600/20 text-fuchsia-300 border-fuchsia-500/40",
  },
  {
    id: "6",
    name: "ぴったりボーナス",
    description: "目標値にぴったりならライフ+1（外せば通常ペナルティ）。",
    multiplierLabel: "0.8",
    lifeDamage: 1,
    badgeClass: "bg-sky-600/20 text-sky-300 border-sky-500/40",
  },
];
