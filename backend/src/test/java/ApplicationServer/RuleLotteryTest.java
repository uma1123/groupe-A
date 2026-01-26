package ApplicationServer;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class RuleLotteryTest {
        private RuleLottery lottery;

        @BeforeEach
        void setup() {
            lottery = new RuleLottery();
        }

        @Test
        void testDrawRandRule_PlayerCount2() {
            String result = lottery.drawRandRule(2);

            // 2人のときは必ず ONE_ON_ONE
            assertEquals("ONE_ON_ONE", result);

            // currentRuleId も ONE_ON_ONE に設定されている
            assertEquals("ONE_ON_ONE", lottery.currentRule.getRandRuleId());
        }

        @Test
        void testDrawRandRule_Not2Players() {
            // 何度か試行して ONE_ON_ONE が返らないことを確認
            for (int i = 0; i < 20; i++) {
                String result = lottery.drawRandRule(3);
                assertNotEquals("ONE_ON_ONE", result);
            }
        }

        @Test
        void testCurrentRuleIdIsSet() {
            String result = lottery.drawRandRule(3);

            // currentRuleId が null ではない
            assertNotNull(lottery.currentRule.getRandRuleId());

            // 戻り値と currentRuleId が一致している
            assertEquals(result, lottery.currentRule.getRandRuleId());
        }
}

