/* 削除予定（1/15）
package ClientManageServer;

import java.util.ArrayList;
import java.util.List;

public class BaseMessage {
    protected String type;

    public BaseMessage(String type) {
        this.type = type;
    }

    public String getType() {
        return type;
    }
}

// --- ログイン関連 ---

class LoginMessage extends BaseMessage {
    private String userId;
    private String password;

    public LoginMessage(String userId, String password) {
        super("LOGIN");
        this.userId = userId;
        this.password = password;
    }

    public String getUserId() { return userId; }
    public String getPassword() { return password; }
}

class LogoutMessage extends BaseMessage {
    private String userId;

    public LogoutMessage(String userId) {
        super("LOGOUT");
        this.userId = userId;
    }

    public String getUserId() { return userId; }
}

class SignUpMessage extends BaseMessage {
    private String userId;
    private String password;

    public SignUpMessage(String userId, String password) {
        super("SIGNUP");
        this.userId = userId;
        this.password = password;
    }

    public String getUserId() { return userId; }
    public String getPassword() { return password; }
}

// --- ルーム関連 ---

class CreateMessage extends BaseMessage {
    private String userId;
    private int numOfPlayer;
    private int numOfLife;

    public CreateMessage(String userId, int numOfPlayer, int numOfLife) {
        super("CREATE_ROOM");
        this.userId = userId;
        this.numOfPlayer = numOfPlayer;
        this.numOfLife = numOfLife;
    }

    public String getUserId() { return userId; }
    public int getNumOfPlayer() { return numOfPlayer; }
    public int getNumOfLife() { return numOfLife; }
}

class JoinMessage extends BaseMessage {
    private int roomId;
    private String userId;

    public JoinMessage(int roomId, String userId) {
        super("JOIN_ROOM");
        this.roomId = roomId;
        this.userId = userId;
    }

    public int getRoomId() { return roomId; }
    public String getUserId() { return userId; }
}

class TransitionMessage extends BaseMessage {
    private int roomId;
    private int userCount;
    private int life;
    private List<String> users;


    public TransitionMessage(int roomId, int userCount, int life, List<User> roomplayerlist) {
        super("GAME_RULE");
        this.roomId = roomId;
        this.userCount = userCount;
        this.life = life;
        this.users = new ArrayList<>();
        for (User user : roomplayerlist) {
            this.users.add(user.getUserId());
        }
    }
}

    class RemoveMessage extends BaseMessage {
        private int roomId;
        private String userId;

        public RemoveMessage(int roomId, String userId) {
            super("REMOVE_ROOM");
            this.roomId = roomId;
            this.userId = userId;
        }

        public int getRoomId() {
            return roomId;
        }

        public String getUserId() {
            return userId;
        }
    }
*/
