package ApplicationServer;

import java.util.ArrayList;
import java.util.Random;

public class RuleLottery {
    Rule currentRule;
    public RuleLottery(){
        this.currentRule=new Rule();
    }
    String drawRandRule(int playerCount){//プレイヤーが2人のときは専用のルール
        if(playerCount==2){
            return "ONE_ON_ONE";
        }
        /*ランダムルールの数のうちから乱数で数字を出力*/
        int index=new Random().nextInt(currentRule.ruleList.getRuleCount());
        /*ランダムルールリストを持ってくる*/
        ArrayList<RandRule>randRules=currentRule.ruleList.getRandRuleList();
        /*ランダムルールリストからランダムに選ばれた数字番目のルールを代入*/
        RandRule selectedRule=randRules.get(index);
        /*抽選されたランダムルールのIdを保存*/
        currentRule.setCurrentRuleId(selectedRule.getRandRuleId());
        /*抽選されたランダムルールのIdを返す*/
        return currentRule.getRandRuleId();
    }
}
