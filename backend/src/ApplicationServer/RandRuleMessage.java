package ApplicationServer;

public class RandRuleMessage extends ApplicationEndpoint.BaseMessage{
    int roomid;
    String ruledetail;

    public RandRuleMessage(int roomid, String ruledetail) {
        this.roomid = roomid;
        this.ruledetail = ruledetail;
    }
}
