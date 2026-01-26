package ApplicationServer;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class RandRuleTest {
        @Test
        void testConstructorAndGetters() {
            RandRule rule = new RandRule("Fire", "Burns the target", 10);

            assertEquals("Fire", rule.getName());
            assertEquals("Burns the target", rule.getDescriprion());
            assertEquals(10, rule.getLifeDamage());
        }

        @Test
        void testGetRandRuleId() {
            RandRule rule = new RandRule("Poison", "Deals damage over time", 5);

            // getRandRuleId は name を返す仕様
            assertEquals("Poison", rule.getRandRuleId());
        }

        @Test
        void testDifferentValues() {
            RandRule rule = new RandRule("Freeze", "Stops movement", 0);

            assertEquals("Freeze", rule.getName());
            assertEquals("Stops movement", rule.getDescriprion());
            assertEquals(0, rule.getLifeDamage());
        }
}

