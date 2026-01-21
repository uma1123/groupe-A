package ClientManageServer;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class RoomServiceTest {

    private RoomService roomService;

    @BeforeEach
    void setUp() {
        // 各テストの前にRoomServiceを初期化
        roomService = new RoomService();
    }

    @Test
    @DisplayName("ルーム作成が正常に行われ、IDがインクリメントされること")
    void testCreateRoom() {
        Room room1 = roomService.createRoom("owner1", 4, 100);
        Room room2 = roomService.createRoom("owner2", 2, 50);

        assertNotNull(room1);
        assertEquals(1, room1.getRoomId()); // 最初のIDは1
        assertEquals(2, room2.getRoomId()); // 次は2

        assertTrue(roomService.exists(1));
        assertTrue(roomService.exists(2));
    }

    @Test
    @DisplayName("int型のIDでルームが正しく取得できること")
    void testGetRoomInt() {
        roomService.createRoom("userA", 4, 100);
        Room fetchedRoom = roomService.getRoom(1);

        assertNotNull(fetchedRoom);
        assertEquals(1, fetchedRoom.getRoomId());
    }

    @Test
    @DisplayName("String型のIDでルームが正しく取得できること")
    void testGetRoomString() {
        roomService.createRoom("userB", 4, 100);

        // 正常系: 数字の文字列
        Room fetchedRoom = roomService.getRoom("1");
        assertNotNull(fetchedRoom);

        // 異常系: 数字ではない文字列
        Room invalidRoom = roomService.getRoom("abc");
        assertNull(invalidRoom);

        // 異常系: 存在しないID
        Room nonExistentRoom = roomService.getRoom("999");
        assertNull(nonExistentRoom);
    }

    @Test
    @DisplayName("ルームの削除が正しく動作すること")
    void testRemoveRoom() {
        roomService.createRoom("userC", 4, 100);
        assertTrue(roomService.exists(1));

        roomService.removeRoom(1);
        assertFalse(roomService.exists(1));
        assertNull(roomService.getRoom(1));
    }

    @Test
    @DisplayName("存在しないルームのexists確認")
    void testExists() {
        assertFalse(roomService.exists(999));
    }
}