package messages;

import java.util.List;

/**
 * サーバ → クライアント へのメッセージ型定義
 */
public class ServerMessages {
    
    // エラー
    public static class ErrorResponse {
        public String type = "ERROR";
        public String errorId;
        public String message;
        
        public ErrorResponse(String errorId, String message) {
            this.errorId = errorId;
            this.message = message;
        }
    }
    
    // 認証成功（引数2つに修正）
    public static class AuthSuccessResponse {
        public String type = "AUTH_SUCCESS";
        public String userId;
        public String token;
        
        public AuthSuccessResponse(String userId, String token) {
            this.userId = userId;
            this.token = token;
        }
    }
    
    // ログアウト成功（引数1つに修正）
    public static class LogoutSuccessResponse {
        public String type = "LOGOUT_SUCCESS";
        public String userId;
        
        public LogoutSuccessResponse(String userId) {
            this.userId = userId;
        }
    }
    
    // ルーム作成成功（roomIdをString型に変更）
    public static class CreateRoomSuccessResponse {
        public String type = "CREATE_ROOM_SUCCESS";
        public String roomId;
        public int maxPlayers;
        public int lives;
        
        public CreateRoomSuccessResponse(String roomId, int maxPlayers, int lives) {
            this.roomId = roomId;
            this.maxPlayers = maxPlayers;
            this.lives = lives;
        }
    }
    
    // ルーム参加成功
    public static class JoinRoomSuccessResponse {
        public String type = "JOIN_ROOM_SUCCESS";
        public String roomId;
        public List<String> currentPlayers;
        public int maxPlayers;    // ★ 追加
        public int lives;         // ★ 追加
        
        public JoinRoomSuccessResponse(String roomId, List<String> currentPlayers, int maxPlayers, int lives) {
            this.roomId = roomId;
            this.currentPlayers = currentPlayers;
            this.maxPlayers = maxPlayers;
            this.lives = lives;
        }
    }
    
    // プレイヤー参加通知
    public static class PlayerJoinedResponse {
        public String type = "PLAYER_JOINED";
        public String newUser;
        public int totalPlayers;
        
        public PlayerJoinedResponse(String newUser, int totalPlayers) {
            this.newUser = newUser;
            this.totalPlayers = totalPlayers;
        }
    }
    
    // ゲームサーバへ移動
    public static class GoToGameServerResponse {
        public String type = "GO_TO_GAME_SERVER";
        public String roomId;
        public String nextEndpoint;
        
        public GoToGameServerResponse(String roomId, String nextEndpoint) {
            this.roomId = roomId;
            this.nextEndpoint = nextEndpoint;
        }
    }
    
    // ルールデータ
    public static class RuleData {
        public String id;
        public String name;
        public String description;
        public int lifeDamage = 1;
    }
    
    // ゲーム開始レスポンス
    public static class GameStartResponse {
        public String type = "GAME_START";
        public String roomId;
        public int totalRounds;
        public List<String> players;           // ★ 追加: プレイヤー名リスト
        public int initialLife;                // ★ 追加: 初期ライフ
        public RuleData firstRule;
        public List<RuleData> availableRules;
        
        public GameStartResponse() {}
        
        public GameStartResponse(
            String roomId,
            int totalRounds,
            List<String> players,
            int initialLife,
            RuleData firstRule,
            List<RuleData> availableRules
        ) {
            this.roomId = roomId;
            this.totalRounds = totalRounds;
            this.players = players;
            this.initialLife = initialLife;
            this.firstRule = firstRule;
            this.availableRules = availableRules;
        }
    }
    
    // ラウンド開始レスポンス
    public static class RoundStartResponse {
        public String type = "ROUND_START";
        public String roomId;
        public int currentRound;
        public int totalRounds;
        public RuleData rule;
        public int timerDuration;
    }
    
    // ラウンド結果レスポンス
    public static class RoundResultResponse {
        public String type = "ROUND_RESULT";
        public String roomId;
        public String userId;  // ★ userId に変更
        public String roundResult;
        public int targetValue;
        public int yourNumber;
        public int newLife;
        public boolean isDead;
        public RuleData appliedRule;
    }

    // 最終結果レスポンス
    public static class FinalResultResponse {
        public String type = "FINAL_RESULT";
        public String roomId;
        public boolean isWinner;
        public int finalRank;
        public List<RankingEntry> rankings;
        
        public static class RankingEntry {
            public int rank;
            public String userId;  // ← oderId から userId に変更
            public int lives;
        }
    }
}
