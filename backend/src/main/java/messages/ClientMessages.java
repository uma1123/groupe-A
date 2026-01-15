package messages;

public class ClientMessages {
    // 基底クラス
    public static class BaseMessage {
        public String type;
    }

    // サインアップ
    public static class SignupMessage extends BaseMessage {
        public String userId;
        public String password;
    }

    // ログイン
    public static class LoginMessage extends BaseMessage {
        public String userId;
        public String password;
    }

    // ルーム作成
    public static class CreateRoomMessage extends BaseMessage {
        public String userId;
        public int numOfPlayer;
        public int numOfLife;
    }

    // ルーム参加
    public static class JoinRoomMessage extends BaseMessage {
        public String userId;
        public int roomId;
    }

    // ゲーム開始
    public static class StartGameMessage extends BaseMessage {
        public String userId;
        public String roomId;
    }

    // 数字提出
    public static class SubmitNumberMessage extends BaseMessage {
        public String userId;
        public String roomId;
        public int num;
    }

    // 次のラウンド
    public static class NextRoundMessage extends BaseMessage {
        public String userId;
        public String roomId;
    }
}
