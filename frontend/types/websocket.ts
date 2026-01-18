/**
 * WebSocket通信で使用するメッセージ型定義
 */

// ==========================================
// 1. クライアント送信データ (Client -> Server)
// ==========================================

// --- 認証・ロビー ---
export type SignupMessage = {
  type: "SIGNUP";
  userId: string;
  password: string;
};

export type LoginMessage = {
  type: "LOGIN";
  userId: string;
  password: string;
};

// Java側の CreateMessage に対応
export type CreateRoomMessage = {
  type: "CREATE_ROOM";
  userId: string;
  numOfPlayer: number; // ★ settings.maxPlayers から変更
  numOfLife: number; // ★ settings.lives から変更
};

export type JoinRoomMessage = {
  type: "JOIN_ROOM";
  userId: string;
  roomId: number; // ★ string から number に変更
};

// プレイヤーがルームを退出する時
export type LeaveRoomMessage = {
  type: "LEAVE_ROOM";
  userId: string;
  roomId: string;
};

// ホストがゲーム開始ボタンを押した時
export type StartGameMessage = {
  type: "START_GAME";
  userId: string;
  roomId: string;
};

// --- ゲーム本編 ---
// 数値を送信する
export type SubmitNumberMessage = {
  type: "SUBMIT_NUMBER";
  userId: string;
  roomId: string;
  num: number;
};

// 次のラウンドへ進む要求（全員の結果確認後）
export type NextRoundMessage = {
  type: "NEXT_ROUND";
  userId: string;
  roomId: string;
};

// 送信メッセージのユニオン型
export type ClientMessage =
  | SignupMessage
  | LoginMessage
  | CreateRoomMessage
  | JoinRoomMessage
  | StartGameMessage
  | SubmitNumberMessage
  | NextRoundMessage
  | LeaveRoomMessage;

// ==========================================
// 2. サーバー受信データ (Server -> Client)
// ==========================================

// ★ ルール情報の型定義（フロントの GameRule と対応）
export type RuleData = {
  id: string;
  name: string;
  description: string;
  multiplierLabel?: string; // "0.8" など
  lifeDamage: number;
};

// 基本レスポンス型（エラー時など）
export type ErrorResponse = {
  type: "ERROR";
  errorId: string;
  message: string;
};

// --- 認証・ロビー応答 ---
export type AuthSuccessResponse = {
  type: "AUTH_SUCCESS";
  userId: string;
  userName: string;
};

// ★ サーバーの実際のレスポンス形式に合わせて修正
export type CreateRoomSuccessResponse = {
  type: "CREATE_ROOM_SUCCESS";
  roomId: string;
  maxPlayers: number; // ★ settings からフラットに変更
  lives: number; // ★ settings からフラットに変更
};

export type JoinRoomSuccessResponse = {
  type: "JOIN_ROOM_SUCCESS";
  roomId: string;
  currentPlayers: string[];
  maxPlayers: number; // ★ 追加
  lives: number; // ★ 追加
};

// 【重要】他プレイヤーの入室通知（ブロードキャスト）
export type PlayerJoinedResponse = {
  type: "PLAYER_JOINED";
  newUser: string;
  totalPlayers: number;
};

export type PlayerLeftResponse = {
  type: "PLAYER_LEFT";
  userId: string;
};

// 【重要】アプリサーバへの移動命令
export type GoToGameServerResponse = {
  type: "GO_TO_GAME_SERVER";
  roomId: string;
  nextEndpoint: string;
};

// --- ゲーム進行応答 ---

// ★ ゲーム開始時にルール一覧を送信
export type GameStartResponse = {
  type: "GAME_START";
  roomId: string;
  totalRounds: number;
  players: string[]; // ★ 追加: プレイヤー名リスト
  initialLife: number; // ★ 追加: 初期ライフ
  availableRules: RuleData[]; // サーバーが持っている全ルール
  firstRule: RuleData; // 最初のラウンドで使用するルール
};

// ★ ラウンド開始時に適用ルールを送信
export type RoundStartResponse = {
  type: "ROUND_START";
  roomId: string;
  currentRound: number;
  totalRounds: number;
  rule: RuleData; // このラウンドで適用されるルール
  timerDuration: number; // 制限時間（秒）
};

// 数値送信後の結果（勝敗・ライフ減少）
export type RoundResultResponse = {
  type: "ROUND_RESULT";
  roomId: string;
  userId: string;
  roundResult: "WIN" | "LOSE" | "DRAW";
  targetValue: number; // サーバが決めた正解値（平均*0.8など）
  yourNumber: number; // あなたが送信した数値
  newLife: number;
  isDead: boolean;
  appliedRule: RuleData; // 適用されたルール（再確認用）
};

// ★ 全員の結果集計（ブロードキャスト）
export type AllPlayersResultResponse = {
  type: "ALL_PLAYERS_RESULT";
  roomId: string;
  currentRound: number;
  results: {
    userId: string;
    number: number;
    result: "WIN" | "LOSE" | "DRAW";
    lives: number;
    isDead: boolean;
  }[];
  targetValue: number;
  average: number; // 全員の平均値
};

// 次のラウンド開始通知（既存を拡張）
export type NextRoundResponse = {
  type: "NEXT_ROUND_START";
  roomId: string;
  currentRound: number;
  totalRounds: number;
  nextRule: RuleData; // 次のラウンドで使用するルール
};

// 最終結果
export type FinalResultResponse = {
  type: "FINAL_RESULT";
  roomId: string;
  isWinner: boolean;
  ranking: {
    rank: number;
    userId: string;
    finalLives: number;
  }[];
};

// 受信メッセージのユニオン型
export type ServerResponse =
  | ErrorResponse
  | AuthSuccessResponse
  | CreateRoomSuccessResponse
  | JoinRoomSuccessResponse
  | PlayerJoinedResponse
  | PlayerLeftResponse // ★ 追加
  | GoToGameServerResponse
  | GameStartResponse
  | RoundStartResponse
  | RoundResultResponse
  | AllPlayersResultResponse
  | NextRoundResponse
  | FinalResultResponse;
