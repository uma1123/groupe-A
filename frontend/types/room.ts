// プレイヤーの型定義（後で共通型定義ファイルに移動推奨）
export type Player = {
  id: string;
  name: string;
  isHost: boolean;
  isReady: boolean;
  life: number;
  avatarColor: string;
};
