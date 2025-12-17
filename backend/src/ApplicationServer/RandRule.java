package ApplicationServer;

public class RandRule {
    private final String randRuleId;
    private final String detailRule;
    public RandRule(String randRuleId,String detailRule){
        this.randRuleId=randRuleId;
        this.detailRule=detailRule;
    }
    String getRandRuleId(){
        return this.randRuleId;
    }
    String getDetailRule(){
        return this.detailRule;
    }
}
