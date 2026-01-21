package ApplicationServer;

// プレイヤー情報メッセージ
public class PlayerInfoMessage {
    int roomid;
    String userid;

    public PlayerInfoMessage(int roomid, String userid) {
        this.roomid = roomid;
        this.userid = userid;
    }
}

