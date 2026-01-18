package messages;

/**
 * クライアント → サーバ へのメッセージ型定義
 * フロントエンドの types/websocket.ts と対応
 */
public class ClientMessages {

    // サインアップ
    public static class SignupMessage {
        public String type;
        public String userId;
        public String password;
    }

    // ログイン
    public static class LoginMessage {
        public String type;
        public String userId;
        public String password;
    }

    // ルーム作成
    public static class CreateRoomMessage {
        public String type;
        public String userId;
        public int numOfPlayer;
        public int numOfLife;
    }

    // ルーム参加
    public static class JoinRoomMessage {
        public String type;
        public String userId;
        public int roomId;
    }

    // ゲーム開始
    public static class StartGameMessage {
        public String type;
        public String userId;
        public String roomId;
    }

    // 数字提出
    public static class SubmitNumberMessage {
        public String type;
        public String userId;
        public String roomId;
        public int num;
    }

    // 次のラウンド
    public static class NextRoundMessage {
        public String type;
        public String userId;
        public String roomId;
    }

    // ログアウト（追加）
    public static class LogoutMessage {
        public String type;
        public String userId;
    }
}