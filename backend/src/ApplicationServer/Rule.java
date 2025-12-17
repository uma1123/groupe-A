package ApplicationServer;

public class Rule {
    CollectionOfRandRules ruleList;
    private String randRuleId;

    public Rule(){
        this.ruleList=new CollectionOfRandRules();
        this.randRuleId=null;
    }

    public String getRandRuleId() {
        return randRuleId;
    }
}
