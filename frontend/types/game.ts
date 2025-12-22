export type PlayerStatus = "alive" | "dead" | "empty";

export interface Player {
  id: number;
  name: string;
  lives: number;
  status: PlayerStatus;
  isYou: boolean;
  choice: number | null;
}

export const MULTIPLIER = 0.8;

// UI用のモック値（実装が入るまでは固定値で表示）
export const DEFAULT_TARGET_VALUE = 31.375;
