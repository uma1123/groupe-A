package ApplicationServer;

public class Rule {
    CollectionOfRandRules ruleList;
    private String currentRuleId;

    public Rule(){
        this.ruleList=new CollectionOfRandRules();
        this.currentRuleId=null;
    }

    public String getRandRuleId() {
        return currentRuleId;
    }
    public void setCurrentRuleId(String ruleId){
        this.currentRuleId=ruleId;
    }
}
