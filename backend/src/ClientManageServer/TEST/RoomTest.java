package ClientManageServer.TEST;

import ClientManageServer.Room;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class RoomTest {

    private Room room;

    @BeforeEach
    void setUp() {
        room = new Room(1234, 4, 3, "Owner1");
    }

    // コンストラクタのテスト

    @Test
    void testConstructor() {
        // 正常な値
        assertEquals(1234, room.getRoomId());
        assertEquals(4, room.getNumOfPlayer());
        assertEquals("Owner1", room.getRoomOwner());
        assertEquals(0, room.getCorrentPlayer());
        assertNotNull(room.getPlayerList());

        // 最小値
        Room minRoom = new Room(1000, 1, 1, "Owner");
        assertEquals(1, minRoom.getNumOfPlayer());
        assertEquals(0, minRoom.getCorrentPlayer());
    }

    // Getterのテスト

    @Test
    void testGetRoomId() {
        assertEquals(1234, room.getRoomId());
    }

    @Test
    void testGetNumOfPlayer() {
        assertEquals(4, room.getNumOfPlayer());
    }

    @Test
    void testGetRoomOwner() {
        assertEquals("Owner1", room.getRoomOwner());
    }

    @Test
    void testGetCorrentPlayer() {
        assertEquals(0, room.getCorrentPlayer());

        room.getPlayerList().add("Player1");
        assertEquals(1, room.getCorrentPlayer());

        room.getPlayerList().add("Player2");
        assertEquals(2, room.getCorrentPlayer());
    }

    // Setterのテスト

    @Test
    void testSetRoomId() {
        room.setRoomId(5678);
        assertEquals(5678, room.getRoomId());
    }

    @Test
    void testSetNumOfPlayer() {
        room.setNumOfPlayer(8);
        assertEquals(8, room.getNumOfPlayer());
    }

    @Test
    void testSetNumOfLife() {
        assertDoesNotThrow(() -> room.setNumOfLife(5));
        assertDoesNotThrow(() -> room.setNumOfLife(0));
    }

    // プレイヤーリスト操作のテスト

    @Test
    void testPlayerList() {
        // 追加と削除
        room.getPlayerList().add("Player1");
        room.getPlayerList().add("Player2");
        assertEquals(2, room.getCorrentPlayer());
        assertTrue(room.getPlayerList().contains("Player1"));

        room.getPlayerList().remove("Player1");
        assertEquals(1, room.getCorrentPlayer());
        assertFalse(room.getPlayerList().contains("Player1"));

        // 定員まで追加
        room.getPlayerList().clear();
        for (int i = 1; i <= 4; i++) {
            room.getPlayerList().add("Player" + i);
        }
        assertEquals(4, room.getCorrentPlayer());
        assertEquals(room.getNumOfPlayer(), room.getCorrentPlayer());

        // 定員超過（Roomクラスは定員チェックしない）
        room.getPlayerList().add("Player5");
        room.getPlayerList().add("Player6");
        assertEquals(6, room.getCorrentPlayer());
        assertTrue(room.getCorrentPlayer() > room.getNumOfPlayer());

        // 全削除
        room.getPlayerList().clear();
        assertEquals(0, room.getCorrentPlayer());
        assertTrue(room.getPlayerList().isEmpty());
    }
}