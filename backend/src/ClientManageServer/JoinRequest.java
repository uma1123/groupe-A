package ClientManageServer;

// 他サーバーから送られてくるJSONの形を定義
//通信クラスから操作してもらう
public class JoinRequest {
    private int roomId;
    private String userId;
    private int num;
    private int life;
    // GetterとSetterが必要（SpringがJSONを流し込むため）
    public int getRoomId() { return roomId; }
    public void setRoomId(int roomId) { this.roomId = roomId; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public int getNum() { return num; }
    public void setNum(int num) { this.num = num; }
    public int getLife() { return life; }
    public void setLife(int life) { this.life = life; }
}
