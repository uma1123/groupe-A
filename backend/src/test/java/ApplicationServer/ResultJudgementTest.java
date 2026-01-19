package ApplicationServer;

import static org.junit.jupiter.api.Assertions.*;

import java.util.*;

import org.junit.jupiter.api.Test;

import messages.ServerMessages;

class ResultJudgementTest {

    @Test
    //一般処理（ランダムルールなし）
    void judgeRound1() {
        // 準備：提出データ
        List<NumberMessage> submissions = List.of(
                new NumberMessage(0000,"user001",10 ),
                new NumberMessage(0000, "user002",20)
        );

        // 実行（ルールなし）
        Map<String, Object> result =
                ResultJudgement.judgeRound(submissions, null);

        // 平均値の確認
        assertEquals(15.0, (double) result.get("average"), 0.001);

        // 目標値の確認
        assertEquals(12.0, (double) result.get("targetValue"), 0.001);

        // 勝者の確認
        @SuppressWarnings("unchecked")
        List<String> winners = (List<String>) result.get("winners");

        assertEquals(1, winners.size(), "勝者は1人であるべき");
        assertEquals("user001", winners.get(0),
                "平均との差が最小の user001 が勝者になるべき");

        // ペナルティがないこと
        @SuppressWarnings("unchecked")
        Map<String, Integer> penalties =
                (Map<String, Integer>) result.get("penalties");

        assertTrue(penalties.isEmpty(), "ルールなしの場合ペナルティは発生しないべき");
    }

    @Test
    //同点処理（ランダムルールなし）
    void judgeRound2() {
        // 準備
        List<NumberMessage> submissions = List.of(
                new NumberMessage(0000,"user001",6),
                new NumberMessage(0000,"user002",10),
                new NumberMessage(0000,"user003",14)
        );

        // 実行
        Map<String, Object> result =
                ResultJudgement.judgeRound(submissions, null);

        // 勝者取得
        @SuppressWarnings("unchecked")
        List<String> winners =
                (List<String>) result.get("winners");

        // 検証
        assertEquals(2, winners.size(),
                "差が同じ場合は勝者が複数になるべき");

        assertTrue(winners.contains("user001"),
                "user001 は勝者に含まれるべき");
        assertTrue(winners.contains("user002"),
                "user002 は勝者に含まれるべき");
    }

    @Test
    //1v1時の特殊ルールテスト
    void judgeRound_ONE_ON_ONE() {
        // 準備
        List<NumberMessage> submissions = List.of(
                new NumberMessage(0000,"user001", 10),
                new NumberMessage(0000,"user002", 20)
        );

        // ONE_ON_ONE ルール作成
        ServerMessages.RuleData rule = new ServerMessages.RuleData();
        rule.id = "ONE_ON_ONE";

        // 実行
        Map<String, Object> result =
                ResultJudgement.judgeRound(submissions, rule);

        // 勝者取得
        @SuppressWarnings("unchecked")
        List<String> winners =
                (List<String>) result.get("winners");

        // 検証
        assertEquals(1, winners.size(),
                "ONE_ON_ONE では勝者は1人であるべき");
        assertEquals("user002", winners.get(0),
                "差が最大の user002 が勝者になるべき");
    }

    @Test
    //特殊ルール「奇数のみ」時のテスト
    void judgeRound_RULE_ODD() {
        // 準備
        List<NumberMessage> submissions = List.of(
                new NumberMessage(0000,"user001", 3), // 奇数（準拠）
                new NumberMessage(0000,"user002", 6), // 偶数（違反）
                new NumberMessage(0000,"user003", 9)  // 奇数（準拠）
        );

        // RULE_ODD ルール作成
        ServerMessages.RuleData rule = new ServerMessages.RuleData();
        rule.id = "RULE_ODD";
        rule.lifeDamage = 2;

        // 実行
        Map<String, Object> result =
                ResultJudgement.judgeRound(submissions, rule);

        // 勝者取得
        @SuppressWarnings("unchecked")
        List<String> winners =
                (List<String>) result.get("winners");

        assertEquals(1, winners.size(),
                "準拠者の中から勝者が1人選ばれるべき");
        assertEquals("user001", winners.get(0),
                "奇数かつ差が最小の user001 が勝者になるべき");

        // ペナルティ確認
        @SuppressWarnings("unchecked")
        Map<String, Integer> penalties =
                (Map<String, Integer>) result.get("penalties");

        assertEquals(1, penalties.size(),
                "ルール違反者は1人であるべき");
        assertTrue(penalties.containsKey("user002"),
                "偶数を出した user002 はペナルティ対象になるべき");
        assertEquals(2, penalties.get("user002"),
                "ペナルティ値は rule.lifeDamage が設定されるべき");
    }

    @Test
        //特殊ルール「偶数のみ」時のテスト
    void judgeRound_RULE_EVEN() {
        // 準備
        List<NumberMessage> submissions = List.of(
                new NumberMessage(0000,"user001", 4),  // 偶数（準拠）
                new NumberMessage(0000,"user002", 8),  // 偶数（準拠）
                new NumberMessage(0000,"user003", 9)  // 奇数（違反）
        );

        // RULE_EVEN ルール作成
        ServerMessages.RuleData rule = new ServerMessages.RuleData();
        rule.id = "RULE_EVEN";
        rule.lifeDamage = 1;

        // 実行
        Map<String, Object> result =
                ResultJudgement.judgeRound(submissions, rule);

        // 勝者確認
        @SuppressWarnings("unchecked")
        List<String> winners =
                (List<String>) result.get("winners");

        assertEquals(1, winners.size(),
                "準拠者の中から勝者が1人選ばれるべき");
        assertEquals("user001", winners.get(0),
                "偶数かつ差が最小の user001 が勝者になるべき");

        // ペナルティ確認
        @SuppressWarnings("unchecked")
        Map<String, Integer> penalties =
                (Map<String, Integer>) result.get("penalties");

        assertEquals(1, penalties.size(),
                "違反者は1人であるべき");
        assertTrue(penalties.containsKey("user003"),
                "奇数を出した user003 はペナルティ対象になるべき");
        assertEquals(1, penalties.get("user003"),
                "ペナルティは最低1が付与されるべき");
    }

    @Test
    //特殊ルール「素数のみ」時のテスト
    void judgeRound_RULE_PRIME() {
        // 準備
        List<NumberMessage> submissions = List.of(
                new NumberMessage(0000,"user001", 2), // 素数（準拠）
                new NumberMessage(0000,"user002", 4), // 非素数（違反）
                new NumberMessage(0000,"user003", 5), // 素数（準拠）
                new NumberMessage(0000,"user004", 9)  // 非素数（違反）
        );

        // RULE_PRIME ルール作成
        ServerMessages.RuleData rule = new ServerMessages.RuleData();
        rule.id = "RULE_PRIME";
        rule.lifeDamage = 2;

        // 実行
        Map<String, Object> result =
                ResultJudgement.judgeRound(submissions, rule);

        // 勝者確認
        @SuppressWarnings("unchecked")
        List<String> winners =
                (List<String>) result.get("winners");

        assertEquals(1, winners.size(),
                "準拠者の中から勝者が1人選ばれるべき");
        assertEquals("user003", winners.get(0),
                "素数かつ差が最小の user003 が勝者になるべき");

        // ペナルティ確認
        @SuppressWarnings("unchecked")
        Map<String, Integer> penalties =
                (Map<String, Integer>) result.get("penalties");

        assertEquals(2, penalties.size(),
                "非素数を出したプレイヤーは2人いるべき");
        assertTrue(penalties.containsKey("user002"));
        assertTrue(penalties.containsKey("user004"));
        assertEquals(2, penalties.get("user002"));
        assertEquals(2, penalties.get("user004"));
    }

    @Test
    //特殊ルールに準拠するプレイヤーが１人もいない場合のテスト
    void judgeRound_RULE_NONE() {
        // 準備（全員偶数＝奇数準拠者なし）
        List<NumberMessage> submissions = List.of(
                new NumberMessage(0000,"user001", 2),
                new NumberMessage(0000,"user002", 4),
                new NumberMessage(0000,"user003", 6)
        );

        // RULE_ODD ルール作成
        ServerMessages.RuleData rule = new ServerMessages.RuleData();
        rule.id = "RULE_ODD";
        rule.lifeDamage = 3;

        // 実行
        Map<String, Object> result =
                ResultJudgement.judgeRound(submissions, rule);

        // 勝者確認（全員対象で判定）
        @SuppressWarnings("unchecked")
        List<String> winners =
                (List<String>) result.get("winners");

        assertEquals(1, winners.size(),
                "準拠者がいない場合でも勝者は決定されるべき");
        assertEquals("user002", winners.get(0),
                "全員対象で差が最小の user002 が勝者になるべき");

        // ペナルティ確認（全員違反）
        @SuppressWarnings("unchecked")
        Map<String, Integer> penalties =
                (Map<String, Integer>) result.get("penalties");

        assertEquals(3, penalties.size(),
                "全員がルール違反となるべき");
        assertEquals(3, penalties.get("user001"));
        assertEquals(3, penalties.get("user002"));
        assertEquals(3, penalties.get("user003"));
    }

    @Test
    //submissionsがnullの場合
    void judgeRound_submissions1() {
        // 実行 & 検証
        IllegalArgumentException exception =
                assertThrows(IllegalArgumentException.class, () -> {
                    ResultJudgement.judgeRound(null, null);
                });

        // メッセージ確認（任意だが丁寧）
        assertEquals("No submissions to judge", exception.getMessage());
    }

    @Test
    //submissionsが空の場合
    void judgeRound_submissions2() {
        // 準備
        List<NumberMessage> submissions = new ArrayList<>();

        // 実行 & 検証
        IllegalArgumentException exception =
                assertThrows(IllegalArgumentException.class, () -> {
                    ResultJudgement.judgeRound(submissions, null);
                });

        // メッセージ確認
        assertEquals("No submissions to judge", exception.getMessage());
    }

}
