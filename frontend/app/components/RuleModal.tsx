import { X } from "lucide-react";

type RuleModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function RuleModal({ isOpen, onClose }: RuleModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-red-950/40 to-black/60 border border-red-900/40 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl shadow-red-500/20">
        {/* モーダルヘッダー */}
        <div className="sticky top-0 bg-gradient-to-b from-red-950/60 to-black/40 border-b border-red-900/30 px-8 py-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-red-500 font-mono">
            ゲームルール
          </h2>
          <button
            className="p-2 hover:bg-red-500/10 border border-red-900/30 rounded transition-colors"
            onClick={onClose}
          >
            <X className="w-5 h-5 text-red-500" />
          </button>
        </div>

        {/* モーダルコンテンツ */}
        <div className="px-8 py-6 space-y-6 text-sm">
          <div>
            <h3 className="text-red-500 font-bold font-mono mb-2 uppercase tracking-wider">
              システム概要
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              本ゲームは「天秤」と呼ばれる心理戦ゲームです。各プレイヤーが0から100の間で任意の数値を選択し、全員の選んだ数値の平均値に倍率（初期値0.8）を掛けた結果に最も近い数値を選んだプレイヤーが勝者となります。
            </p>
          </div>

          <div className="h-px bg-gradient-to-r from-red-900/0 via-red-900/30 to-red-900/0"></div>

          <div>
            <h3 className="text-red-500 font-bold font-mono mb-2 uppercase tracking-wider">
              ゲーム進行
            </h3>
            <ul className="space-y-2 text-muted-foreground">
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

          <div className="h-px bg-gradient-to-r from-red-900/0 via-red-900/30 to-red-900/0"></div>

          <div>
            <h3 className="text-red-500 font-bold font-mono mb-2 uppercase tracking-wider">
              終了条件
            </h3>
            <ul className="space-y-2 text-muted-foreground">
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

          <div className="h-px bg-gradient-to-r from-red-900/0 via-red-900/30 to-red-900/0"></div>

          <div>
            <h3 className="text-red-500 font-bold font-mono mb-2 uppercase tracking-wider">
              重要な注意
            </h3>
            <div className="bg-red-950/30 border border-red-900/40 rounded px-4 py-3">
              <p className="text-red-300 font-mono text-xs">
                ゲーム開始後、途中退出はできません。通信が切断されたプレイヤーについても死亡扱いとなります。このゲームは最後までコミットする必要があります。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
