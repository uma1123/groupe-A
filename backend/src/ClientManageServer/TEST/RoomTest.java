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
    void testConstructor_initialState() {
        assertEquals(1234, room.getRoomId());
        assertEquals(4, room.getNumOfPlayer());
        assertEquals("Owner1", room.getRoomOwner());
        assertEquals(0, room.getCorrentPlayer(), "初期状態ではプレイヤー数は0のはず");
        assertNotNull(room.getPlayerList());
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
        room.setNumOfLife(5);
        // numOfLifeにgetterがないので、例外が出ないことを確認
        assertDoesNotThrow(() -> room.setNumOfLife(5));
    }

    // プレイヤーリストのテスト
    @Test
    void testGetCorrentPlayer() {
        assertEquals(0, room.getCorrentPlayer());

        room.getPlayerList().add("Player1");
        assertEquals(1, room.getCorrentPlayer());

        room.getPlayerList().add("Player2");
        assertEquals(2, room.getCorrentPlayer());
    }

    @Test
    void testPlayerList_AddAndRemove() {
        room.getPlayerList().add("Player1");
        room.getPlayerList().add("Player2");

        assertEquals(2, room.getCorrentPlayer());
        assertTrue(room.getPlayerList().contains("Player1"));

        room.getPlayerList().remove("Player1");

        assertEquals(1, room.getCorrentPlayer());
        assertFalse(room.getPlayerList().contains("Player1"));
    }
}