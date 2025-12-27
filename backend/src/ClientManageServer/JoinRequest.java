package ClientManageServer;

// 他サーバーから送られてくるJSONの形を定義
//通信クラスから操作してもらう
public class JoinRequest {
    private int roomId;
    private String userId;
    private int numOfPlayer;
    private int numOfLife;

    // GetterとSetterが必要（SpringがJSONを流し込むため）
    public int getRoomId() { return roomId; }
    public void setRoomId(int roomId) { this.roomId = roomId; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public int getNumOfPlayer() { return numOfPlayer; }
    public void setNumOfPlayer(int numOfPlayer) { this.numOfPlayer = numOfPlayer; }
    public int getNumOfLife() { return numOfLife; }
    public void setNumOfLife(int numOfLife) { this.numOfLife = numOfLife; }
}