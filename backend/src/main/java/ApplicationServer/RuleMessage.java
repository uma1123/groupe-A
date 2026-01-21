package ApplicationServer;

// ルールメッセージ
public class RuleMessage {
    int roomid;
    int playercount;
    int life;

    public RuleMessage(int roomid, int playercount, int life) {
        this.roomid = roomid;
        this.playercount = playercount;
        this.life = life;
    }
}

