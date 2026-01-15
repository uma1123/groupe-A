package ApplicationServer;

import java.util.ArrayList;
import java.util.Random;

public class RuleLottery {
    Rule currentRule;
    public RuleLottery(){
        this.currentRule=new Rule();
    }
    public String drawRandRule(int playerCount){//プレイヤーが2人のときは専用のルール
        /*ランダムルールリストを持ってくる*/
        ArrayList<RandRule> randRules = currentRule.ruleList.getRandRuleList();
        RandRule selectedRule=null;
        if(playerCount==2){
            for(RandRule rr:randRules){
                if(rr.getRandRuleId().equals("ONE_ON_ONE")){
                    selectedRule=rr;
                    currentRule.setCurrentRuleId(selectedRule.getRandRuleId());
                }
            }
            return "ONE_ON_ONE";
        }
        /*ONE_ON_ONE以外を引くまで繰り返し*/
        do {
            /*ランダムルールの数のうちから乱数で数字を出力*/
            int index = new Random().nextInt(currentRule.ruleList.getRuleCount());
            /*ランダムルールリストからランダムに選ばれた数字番目のルールを代入*/
            selectedRule = randRules.get(index);
        }while(selectedRule.getRandRuleId().equals("ONE_ON_ONE"));
        /*抽選されたランダムルールのIdを保存*/
        currentRule.setCurrentRuleId(selectedRule.getRandRuleId());
        /*抽選されたランダムルールのIdを返す*/
        return currentRule.getRandRuleId();
    }
}
