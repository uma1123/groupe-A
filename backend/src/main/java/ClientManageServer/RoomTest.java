package ClientManageServer;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class RoomTest {

    private Room room;
    private final int MAX_P = 2;
    private final int LIFE = 100;

    @BeforeEach
    void setUp() {
        // 各テスト前に定員2名のルームをリセット
        room = new Room(1, MAX_P, LIFE);
    }

    @Test
    @DisplayName("プレイヤー追加と満員判定の検証")
    void testAddPlayerAndFullStatus() {
        // 1人目：通常追加
        assertTrue(room.addPlayer("user1"));
        assertFalse(room.isFull());

        // 2人目：限界値（満員）
        assertTrue(room.addPlayer("user2"));
        assertTrue(room.isFull());

        // 3人目：限界値超え
        assertFalse(room.addPlayer("user3"));
    }

    @Test
    @DisplayName("重複プレイヤー追加の検証")
    void testDuplicatePlayer() {
        room.addPlayer("user1");
        int countBefore = room.getPlayerCount();

        // 重複追加を試みる
        boolean result = room.addPlayer("user1");

        assertTrue(result);
        assertEquals(countBefore, room.getPlayerCount());
    }

    @Test
    @DisplayName("プレイヤー削除の検証")
    void testRemovePlayer() {
        room.addPlayer("user1");
        assertEquals(1, room.getPlayerCount());

        room.removePlayer("user1");
        assertEquals(0, room.getPlayerCount());
    }

    @Test
    @DisplayName("初期設定値の取得検証")
    void testGetters() {
        assertEquals(100, room.getInitialLife());
        assertEquals(2, room.getMaxPlayers());
    }
}