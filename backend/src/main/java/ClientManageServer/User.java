package ClientManageServer;

// ユーザークラス
public class User {

    private final String userId;
    private final String password;
    private boolean login;

    public User(String userId, String password) {
        this.userId = userId;
        this.password = password;
        this.login = false;
    }

    public String getUserId() {
        return userId;
    }

    public String getPassword() {
        return password;
    }

    public boolean isLogin() {
        return login;
    }

    public void setLogin(boolean login) {
        this.login = login;
    }
}
