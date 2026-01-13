package ClientManageServer;

public class Message {
    private String action;   // 呼び出すメソッドをここで判断する（ex:ルーム参加だったらJOIN）
     String id;
    String password;
    String message;
    int roomId;
    int numOfPlayer;
    int numOfLife;

    public Message(String id, String password, String message) {
        this.id =id;
        this.password = password;
        this.message = message;
    }
    public String getAction() { return action; }
    public int getRoomId() { return roomId; }
    public String getUserId() { return id; }
    public int getMaxPlayers() { return numOfPlayer; }
    public int getLife() { return numOfLife; }
}
