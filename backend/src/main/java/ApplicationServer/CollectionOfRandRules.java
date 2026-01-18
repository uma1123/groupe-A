package ApplicationServer;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import messages.ServerMessages.RuleData;  // ★ 追加

public class CollectionOfRandRules {
    public int ruleCount;
    private ArrayList<RandRule> randRuleList;
    private static CollectionOfRandRules instance;
    private Random random;

    public CollectionOfRandRules() {
        this.randRuleList = Makerules();
        this.ruleCount = randRuleList.size();
        this.random = new Random();
    }

    /**
     * シングルトンインスタンスを取得
     */
    public static CollectionOfRandRules getInstance() {
        if (instance == null) {
            instance = new CollectionOfRandRules();
        }
        return instance;
    }

    private ArrayList<RandRule> Makerules() {
        ArrayList<RandRule> rulelist = new ArrayList<>();
        RandRule rule1 = new RandRule("RULE_ODD", "奇数のみ選択可能(それ以外を選んだ場合ライフ-1)", -1);
        rulelist.add(rule1);
        RandRule rule2 = new RandRule("RULE_EVEN", "偶数のみ選択可能(それ以外を選んだ場合ライフ-1)", -1);
        rulelist.add(rule2);
        RandRule rule3 = new RandRule("RULE_MULTIPLE_OF_3", "3の倍数のみ選択可能(それ以外を選んだ場合ライフ-1)", -1);
        rulelist.add(rule3);
        RandRule rule4 = new RandRule("RULE_PRIME", "素数のみ選択可能(それ以外を選んだ場合ライフ-1)", -1);
        rulelist.add(rule4);
        RandRule rule5 = new RandRule("RULE_CLOSEST_AND_FARTHEST", "一番近い人と遠い人のみライフ-1", -1);
        rulelist.add(rule5);
        RandRule rule6 = new RandRule("RULE_LIFE_PLUS1_ON_JUST_RESULT", "ぴったりのときライフ+1", 1);
        rulelist.add(rule6);
        RandRule rule7 = new RandRule("ONE_ON_ONE", "タイマン特別ルール:勝敗は倍率により0と100の優劣が変わり、該当する選択者がいる場合のみ成立する", -1);
        rulelist.add(rule7);

        return rulelist;
    }

    public ArrayList<RandRule> getRandRuleList() {
        return this.randRuleList;
    }

    public int getRuleCount() {
        return this.ruleCount;
    }

    /**
     * ランダムにルールを取得（静的メソッド）
     */
    public static RuleData getRandomRule() {
        CollectionOfRandRules rules = getInstance();
        int randomIndex = rules.random.nextInt(rules.randRuleList.size());
        RandRule randRule = rules.randRuleList.get(randomIndex);
        return convertToRuleData(randRule);
    }

    /**
     * 全てのルールを取得（静的メソッド）
     */
    public static List<RuleData> getAllRules() {
        CollectionOfRandRules rules = getInstance();
        List<RuleData> ruleDataList = new ArrayList<>();
        for (RandRule randRule : rules.randRuleList) {
            ruleDataList.add(convertToRuleData(randRule));
        }
        return ruleDataList;
    }

    /**
     * RandRule を RuleData に変換
     */
    private static RuleData convertToRuleData(RandRule randRule) {
        RuleData ruleData = new RuleData();
        ruleData.id = randRule.getName();
        ruleData.name = randRule.getName();
        ruleData.description = randRule.getDescriprion();
        ruleData.lifeDamage = randRule.getLifeDamage();
        // multiplierLabel は messages.ServerMessages.RuleData には無いので設定しない
        return ruleData;
    }
}
