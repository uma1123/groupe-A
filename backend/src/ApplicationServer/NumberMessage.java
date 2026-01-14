package ApplicationServer;

public class NumberMessage extends ApplicationEndpoint.BaseMessage{
    String userid;
    int roomid;
    int num;

    public NumberMessage(int roomid, String userid, int num) {
        this.userid = userid;
        this.roomid = roomid;
        this.num = num;
    }
}
