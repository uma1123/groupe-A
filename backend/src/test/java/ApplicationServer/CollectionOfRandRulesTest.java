package ApplicationServer;

import static org.junit.jupiter.api.Assertions.*;

import messages.ServerMessages;
import org.glassfish.tyrus.core.wsadl.model.Application;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

public class CollectionOfRandRulesTest {
        @BeforeEach
        void resetSingleton() throws Exception {
            // ★ シングルトン instance をリセット（リフレクション使用）
            var field = CollectionOfRandRules.class.getDeclaredField("instance");
            field.setAccessible(true);
            field.set(null, null);
        }

        @Test
        void testSingletonInstance() {
            CollectionOfRandRules a = CollectionOfRandRules.getInstance();
            CollectionOfRandRules b = CollectionOfRandRules.getInstance();

            assertSame(a, b);
        }

        @Test
        void testMakerulesCreatesFourRules() {
            CollectionOfRandRules rules = CollectionOfRandRules.getInstance();

            assertEquals(4, rules.getRuleCount());
            assertEquals(4, rules.getRandRuleList().size());
        }

        @Test
        void testRuleContents() {
            CollectionOfRandRules rules = CollectionOfRandRules.getInstance();
            var list = rules.getRandRuleList();

            assertEquals("RULE_ODD", list.get(0).getName());
            assertEquals("RULE_EVEN", list.get(1).getName());
            assertEquals("RULE_PRIME", list.get(2).getName());
            assertEquals("ONE_ON_ONE", list.get(3).getName());

            // lifeDamage はすべて 1
            list.forEach(rule -> assertEquals(1, rule.getLifeDamage()));
        }

        @Test
        void testGetAllRules() {
            List<ServerMessages.RuleData> all = CollectionOfRandRules.getAllRules();
            assertEquals(4, all.size());

            ServerMessages.RuleData r1 = all.get(0);
            assertEquals("RULE_ODD", r1.id);
            assertEquals("RULE_ODD", r1.name);
            assertEquals(1, r1.lifeDamage);
            assertNotNull(r1.description);
        }

        @Test
        void testConvertToRuleDataFields() {
            RandRule rule = new RandRule("TEST_RULE", "説明文", 3);

            // private メソッド convertToRuleData を通すため getAllRules を利用
            CollectionOfRandRules.getInstance().getRandRuleList().add(rule);

            List<ServerMessages.RuleData> all = CollectionOfRandRules.getAllRules();
            ServerMessages.RuleData last = all.get(all.size() - 1);

            assertEquals("TEST_RULE", last.id);
            assertEquals("TEST_RULE", last.name);
            assertEquals("説明文", last.description);
            assertEquals(3, last.lifeDamage);
           // assertNull(last.multiplierLabel); // convert では設定されない
        }

        @Test
        void testGetRandomRule() {
            ServerMessages.RuleData randomRule = CollectionOfRandRules.getRandomRule();

            assertNotNull(randomRule);
            assertNotNull(randomRule.id);
            assertNotNull(randomRule.name);
            assertNotNull(randomRule.description);

            // lifeDamage は必ず 1
            assertEquals(1, randomRule.lifeDamage);
        }
}

