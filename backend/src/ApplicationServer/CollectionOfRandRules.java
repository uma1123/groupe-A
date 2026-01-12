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
        RandRule rule1=new RandRule("RULE_ODD","奇数のみ");
        rulelist.add(rule1);
        RandRule rule2=new RandRule("RULE_EVEN","偶数のみ");
        rulelist.add(rule2);
        RandRule rule3=new RandRule("RULE_MULTIPLE_OF_3","3の倍数のみ");
        rulelist.add(rule3);
        RandRule rule4=new RandRule("RULE_PRIME","素数のみ");
        rulelist.add(rule4);
        RandRule rule5 =new RandRule("RULE_CLOSEST_AND_FARTHEST","一番近い人と遠い人のみライフ削減");
        rulelist.add(rule5);
        RandRule rule6 =new RandRule("RULE_LIFE_PLUS1_ON_JUST_RESULT","ぴったりのときライフ+1");
        rulelist.add(rule6);


        return rulelist;
    }
    public ArrayList<RandRule> getRandRuleList(){
        return this.randRuleList;
    }
    public int getRuleCount(){
        return this.ruleCount;
    }
}
