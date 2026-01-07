import { X } from "lucide-react";

type RuleModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function RuleModal({ isOpen, onClose }: RuleModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* ノイズ/グリッチ */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,0,0,0.08),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.05),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(255,0,0,0.06),transparent_40%)] mix-blend-screen opacity-70 animate-pulse-slow" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_95%,rgba(255,0,0,0.1))] bg-[length:100%_4px] opacity-40" />

      <div className="relative bg-gradient-to-b from-[#1a0004] via-black to-[#0c0c0c] border border-red-900/60 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-[0_0_40px_rgba(255,0,0,0.25)]">
        {/* ヘッダー */}
        <div className="sticky top-0 bg-gradient-to-r from-red-950/70 to-black border-b border-red-900/40 px-8 py-6 flex items-center justify-between">
          <h2 className="text-2xl font-black tracking-[0.2em] text-red-400 drop-shadow-[0_0_12px_rgba(255,0,0,0.6)]">
            ゲームルール
          </h2>
          <button
            className="rounded border border-red-900/50 p-2 text-red-400 transition hover:bg-red-500/10 hover:text-red-200"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* コンテンツ */}
        <div className="px-8 py-6 space-y-6 text-sm">
          <div>
            <h3 className="text-red-500 font-bold font-mono mb-2 uppercase tracking-wider">
              システム概要
            </h3>
            <p className="text-red-100/80 leading-relaxed">
              本ゲームは「天秤」と呼ばれる心理戦ゲームです。各プレイヤーが0から100の間で任意の数値を選択し、全員の選んだ数値の平均値に倍率（初期値0.8）を掛けた結果に最も近い数値を選んだプレイヤーが勝者となります。
            </p>
          </div>

          <div className="h-px bg-gradient-to-r from-red-900/0 via-red-900/40 to-red-900/0" />

          <div>
            <h3 className="text-red-500 font-bold font-mono mb-2 uppercase tracking-wider">
              ゲーム進行
            </h3>
            <ul className="space-y-2 text-red-100/80">
              <li className="flex gap-2">
                <span className="text-red-500 font-mono">•</span>
                <span>最大9人のプレイヤーでゲームが構成されます</span>
              </li>
              <li className="flex gap-2">
                <span className="text-red-500 font-mono">•</span>
                <span>
                  各プレイヤーにはあらかじめ設定されたライフが与えられます
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-red-500 font-mono">•</span>
                <span>各ターンで勝者以外のプレイヤーはライフを1失います</span>
              </li>
              <li className="flex gap-2">
                <span className="text-red-500 font-mono">•</span>
                <span>ライフが0になったプレイヤーは脱落となります</span>
              </li>
            </ul>
          </div>

          <div className="h-px bg-gradient-to-r from-red-900/0 via-red-900/40 to-red-900/0" />

          <div>
            <h3 className="text-red-500 font-bold font-mono mb-2 uppercase tracking-wider">
              終了条件
            </h3>
            <ul className="space-y-2 text-red-100/80">
              <li className="flex gap-2">
                <span className="text-red-500 font-mono">•</span>
                <span>最後の1人が生き残った時点</span>
              </li>
              <li className="flex gap-2">
                <span className="text-red-500 font-mono">•</span>
                <span>全員が死亡した時点</span>
              </li>
            </ul>
          </div>

          <div className="h-px bg-gradient-to-r from-red-900/0 via-red-900/40 to-red-900/0" />

          <div className="rounded-lg border border-red-900/60 bg-red-950/30 px-4 py-4 shadow-inner shadow-red-900/30">
            <h3 className="text-[11px] font-bold tracking-[0.3em] text-red-400 mb-2">
              重要な注意
            </h3>
            <p className="text-xs text-red-200/90 font-mono leading-relaxed">
              ゲーム開始後、途中退出はできません。通信が切断されたプレイヤーについても死亡扱いとなります。このゲームは最後までコミットする必要があります。
            </p>
          </div>
        </div>

        {/* ボーダーグロー */}
        <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-red-900/50 shadow-[0_0_45px_rgba(255,0,0,0.25)_inset]" />
      </div>
    </div>
  );
}
