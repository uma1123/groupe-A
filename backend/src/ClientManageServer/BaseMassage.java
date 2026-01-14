package ClientManageServer;

public class BaseMassage {
    protected String type;

    public BaseMassage(String type) {
        this.type = type;
    }

    public String getType() {
        return type;
    }
}

// --- ログイン関連 ---

class LoginMessage extends BaseMassage {
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

class LogoutMessage extends BaseMassage {
    private String userId;

    public LogoutMessage(String userId) {
        super("LOGOUT");
        this.userId = userId;
    }

    public String getUserId() { return userId; }
}

class SignUpMessage extends BaseMassage {
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

class CreateMessage extends BaseMassage {
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

class JoinMessage extends BaseMassage {
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

class RemoveMessage extends BaseMassage {
    private int roomId;
    private String userId;

    public RemoveMessage(int roomId, String userId) {
        super("REMOVE_ROOM");
        this.roomId = roomId;
        this.userId = userId;
    }

    public int getRoomId() { return roomId; }
    public String getUserId() { return userId; }
}