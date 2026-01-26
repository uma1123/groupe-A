package ApplicationServer;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

public class RuleTest {
        @Test
        void testConstructorInitialState() {
            Rule rule = new Rule();

            // ruleList が null ではなく CollectionOfRandRules のインスタンスである
            assertNotNull(rule.ruleList);

            // currentRuleId は初期状態では null
            assertNull(rule.getRandRuleId());
        }

        @Test
        void testSetAndGetCurrentRuleId() {
            Rule rule = new Rule();

            rule.setCurrentRuleId("RULE_ODD");
            assertEquals("RULE_ODD", rule.getRandRuleId());

            rule.setCurrentRuleId("RULE_PRIME");
            assertEquals("RULE_PRIME", rule.getRandRuleId());
        }

        @Test
        void testSetNullRuleId() {
            Rule rule = new Rule();

            rule.setCurrentRuleId(null);
            assertNull(rule.getRandRuleId());
        }
}
