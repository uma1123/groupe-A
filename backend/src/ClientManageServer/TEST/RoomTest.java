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

    @Test
    void testConstructor_normalParameters() {
        assertEquals(1234, room.getRoomId());
        assertEquals(4, room.getNumOfPlayer());
        assertEquals("Owner1", room.getRoomOwner());
        assertEquals(0, room.getCorrentPlayer(), "初期状態ではプレイヤー数は0のはず");
        assertNotNull(room.getPlayerList());
    }

    @Test
    void testConstructor_boundaryValues() {
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
    }

    @Test
    void testSetNumOfLife_boundaryValue() {
        assertDoesNotThrow(() -> room.setNumOfLife(0));
    }

    // プレイヤーリスト操作のテスト

    @Test
    void testPlayerList_addAndRemove() {
        room.getPlayerList().add("Player1");
        room.getPlayerList().add("Player2");

        assertEquals(2, room.getCorrentPlayer());
        assertTrue(room.getPlayerList().contains("Player1"));

        room.getPlayerList().remove("Player1");

        assertEquals(1, room.getCorrentPlayer());
        assertFalse(room.getPlayerList().contains("Player1"));
    }

    @Test
    void testPlayerList_fullCapacity() {
        for (int i = 1; i <= 4; i++) {
            room.getPlayerList().add("Player" + i);
        }
        assertEquals(4, room.getCorrentPlayer());
        assertEquals(room.getNumOfPlayer(), room.getCorrentPlayer());
    }

    @Test
    void testPlayerList_overCapacity() {
        for (int i = 1; i <= 6; i++) {
            room.getPlayerList().add("Player" + i);
        }
        assertEquals(6, room.getCorrentPlayer());
        assertTrue(room.getCorrentPlayer() > room.getNumOfPlayer());
    }

    @Test
    void testPlayerList_clear() {
        room.getPlayerList().add("Player1");
        room.getPlayerList().add("Player2");

        room.getPlayerList().clear();

        assertEquals(0, room.getCorrentPlayer());
        assertTrue(room.getPlayerList().isEmpty());
    }
}