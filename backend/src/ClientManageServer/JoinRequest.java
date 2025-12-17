package ClientManageServer;

// 他サーバーから送られてくるJSONの形を定義
//通信クラスから操作してもらう
public class JoinRequest {
    private int roomId;
    // GetterとSetterが必要（SpringがJSONを流し込むため）
    public int getRoomId() { return roomId; }
    public void setRoomId(int roomId) { this.roomId = roomId; }

}