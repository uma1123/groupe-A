// Playerに関する型定義をここで管理
export type PlayerStatus = "alive" | "dead" | "empty";

export interface Player {
  // 共通必須項目
  id: string; // UUID対応のため string に統一（numberは廃止）
  name: string;
  lives: number; // "life" ではなく "lives" に統一
  status?: PlayerStatus; // "alive" | "dead" | "empty"

  // フラグ系
  isYou: boolean; // 自分かどうか
  isHost: boolean; // ホストかどうか（待機画面で使用）
  isReady: boolean; // 準備完了か（待機画面で使用）

  // ゲーム進行用
  choice: number | null; // 選択した数値

  // UI用（オプション）
  avatarColor?: string; // アバターの色（サーバーから来るデータに含まれない場合はUI側で計算するため任意項目に）
  // このラウンドで受けたペナルティ（表示用、任意）
  penalty?: number;
}

// 定数もここで管理
export const MULTIPLIER = 0.8;
export const DEFAULT_TARGET_VALUE = 31.375;
