package ApplicationServer;

public class RoundResultMessage {
    int roomid;
    String userid;
    Boolean roundresult;
    int life;

    public RoundResultMessage(int roomid, String userid, boolean roundresult, int life) {
        this.roomid = roomid;
        this.userid = userid;
        this.roundresult = roundresult;
        this.life = life;
    }
}

