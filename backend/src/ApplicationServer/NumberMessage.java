package ApplicationServer;

public class NumberMessage extends ApplicationEndpoint.BaseMessage{
    int roomid;
    String userid;
    int num;

    public NumberMessage(int roomid, String userid, int num) {
        this.roomid = roomid;
        this.userid = userid;
        this.num = num;
    }
}
