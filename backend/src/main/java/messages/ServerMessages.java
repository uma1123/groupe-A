package messages;

import java.util.List;

public class ServerMessages {
    // 後でエラーを実装する(クライアント側が実装できてない)
    public static class ErrorResponse {
        public String type = "ERROR";
        public String errorId;
        public String message;

        public ErrorResponse(String errorId, String message) {
            this.errorId = errorId;
            this.message = message;
        }
    }

    // 認証成功
    public static class AuthSuccessResponse {
        public String type = "AUTH_SUCCESS";
        public String userId;
        public String userName;

        public AuthSuccessResponse(String userId, String userName) {
            this.userId = userId;
            this.userName = userName;
        }
    }

    // ルーム作成成功
    public static class CreateRoomSuccessResponse {
        public String type = "CREATE_ROOM_SUCCESS";
        public String roomId;
        public RoomSettings settings;

        public static class RoomSettings {
            public int maxPlayers;
            public int lives;
        }
    }

    // ルーム参加成功
    public static class JoinRoomSuccessResponse {
        public String type = "JOIN_ROOM_SUCCESS";
        public String roomId;
        public List<String> currentPlayers;
    }

    //　プレイヤー参加通知
    public static class PlayerJoinedResponse {
        public String type = "PLAYER_JOINED";
        public String newUser;
        public int totalPlayers;
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
        public String multiplierLabel;
        public int lifeDamage;
    }

    // ゲーム開始
    public static class GameStartResponse {
        public String type = "GAME_START";
        public String roomId;
        public int totalRounds;
        public List<RuleData> availableRules;
        public RuleData firstRule;
    }

    // ラウンド開始
    public static class RoundStartResponse {
        public String type = "ROUND_START";
        public String roomId;
        public int currentRound;
        public int totalRounds;
        public RuleData rule;
        public int timerDuration;
    }

    // ラウンド結果
    public static class RoundResultResponse {
        public String type = "ROUND_RESULT";
        public String roomId;
        public String userId;
        public String roundResult; // "WIN" | "LOSE" | "DRAW"
        public int targetValue;
        public int yourNumber;
        public int newLife;
        public boolean isDead;
        public RuleData appliedRule;
    }

    // 全員の結果
    public static class AllPlayersResultResponse {
        public String type = "ALL_PLAYERS_RESULT";
        public String roomId;
        public List<PlayerResult> results;

        public static class PlayerResult {
            public String oderId;
            public int number;
            public int lives;
            public boolean isDead;
        }
    }

    // 最終結果
    public static class FinalResultResponse {
        public String type = "FINAL_RESULT";
        public String roomId;
        public boolean isWinner;
        public int finalRank;
        public List<RankingEntry> rankings;

        public static class RankingEntry {
            public int rank;
            public String oderId;
            public int lives;
        }
    }
}
