package ApplicationServer;
import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class TimerTest {
        private Timer timer;

        @BeforeEach
        void setup() {
            timer = new Timer(5); // 制限時間5秒でテスト
        }

        @Test
        void testInitialState() {
            assertEquals(5, timer.limittime);
            assertFalse(timer.moveflag);
            assertNull(timer.starttime);
            assertEquals(5, timer.getRemainingTime());
        }

        @Test
        void testStart() {
            assertTrue(timer.start());
            assertTrue(timer.moveflag);
            assertNotNull(timer.starttime);

            // すでに動作中なら false
            assertFalse(timer.start());
        }

        @Test
        void testStop() {
            timer.start();
            assertTrue(timer.stop());
            assertFalse(timer.moveflag);

            // 停止中なら false
            assertFalse(timer.stop());
        }

        @Test
        void testReset() {
            timer.start();
            timer.reset();

            assertFalse(timer.moveflag);
            assertNull(timer.starttime);
            assertEquals(5, timer.getRemainingTime());
        }

        @Test
        void testGetRemainingTime_NoStart() {
            assertEquals(5, timer.getRemainingTime());
        }

        @Test
        void testGetRemainingTime_AfterStart() throws InterruptedException {
            timer.start();
            Thread.sleep(2000); // 2秒待つ

            long remaining = timer.getRemainingTime();
            assertTrue(remaining <= 3 && remaining >= 2); // 誤差を許容
        }

        @Test
        void testGetRemainingTime_ZeroAfterLimit() throws InterruptedException {
            timer.start();
            Thread.sleep(6000); // 6秒待つ（制限時間超過）

            assertEquals(0, timer.getRemainingTime());
        }

        @Test
        void testCheckTimeLimit() throws InterruptedException {
            timer.start();
            assertFalse(timer.checkTimeLimit());

            Thread.sleep(6000);
            assertTrue(timer.checkTimeLimit());
        }
}


