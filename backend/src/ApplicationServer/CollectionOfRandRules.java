package ApplicationServer;

import java.util.ArrayList;

public class CollectionOfRandRules {
    public int ruleCount;
    private ArrayList<RandRule> randRuleList;

    public CollectionOfRandRules() {
        this.randRuleList = Makerules();
        this.ruleCount = randRuleList.size();
    }
    private ArrayList<RandRule>Makerules(){
        ArrayList<RandRule>rulelist=new ArrayList<>();
        RandRule rule1=new RandRule("rr01","a");
        rulelist.add(rule1);
        RandRule rule2=new RandRule("rr02","b");
        rulelist.add(rule2);
        return rulelist;
    }
    public ArrayList<RandRule> getRandRuleList(){
        return this.randRuleList;
    }
    public int getRuleCount(){
        return this.ruleCount;
    }
}
