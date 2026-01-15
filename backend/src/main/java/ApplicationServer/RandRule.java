package ApplicationServer;

public class RandRule {
    private final String randRuleId;
    private final String detailRule;
    private final int life;
    public RandRule(String randRuleId,String detailRule,int life){
        this.randRuleId=randRuleId;
        this.detailRule=detailRule;
        this.life=life;
    }
    public String getRandRuleId(){
        return this.randRuleId;
    }
    public String getDetailRule() {
        return this.detailRule;
    }
    public int getLife() {return life;}
}
