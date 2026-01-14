package ApplicationServer;

public class PlayerInfoMessage extends ApplicationEndpoint.BaseMessage{
    int roomid;
    String userid;

    public PlayerInfoMessage(int roomid, String userid) {
        this.roomid = roomid;
        this.userid = userid;
    }
}

