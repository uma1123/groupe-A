package ApplicationServer;

public class ResultMessage {
    int roomid;
    String userid;
    Boolean result;

    public ResultMessage(int roomid, String userid, boolean result) {
        this.roomid = roomid;
        this.userid = userid;
        this.result = result;
    }
}

