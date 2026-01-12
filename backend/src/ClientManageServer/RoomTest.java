package ClientManageServer;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import java.util.List;

class RoomTest {

    private Room room;
    private final int INITIAL_ROOM_ID = 101;
    private final int MAX_PLAYERS = 4;
    private final int INITIAL_LIVES = 3;
    private final String OWNER_NAME = "Alice";

    @BeforeEach
    void setUp() {
        // 各テストの前にRoomインスタンスを新しく生成する
        room = new Room(INITIAL_ROOM_ID, MAX_PLAYERS, INITIAL_LIVES, OWNER_NAME);
    }

    @Test
    @DisplayName("コンストラクタで正しく値がセットされているか")
    void testConstructor() {
        assertAll("Roomの初期値検証",
                () -> assertEquals(INITIAL_ROOM_ID, room.getRoomId(), "RoomIDが一致しません"),
                () -> assertEquals(MAX_PLAYERS, room.getNumOfPlayer(), "最大人数が一致しません"),
                () -> assertEquals(OWNER_NAME, room.getRoomOwner(), "オーナー名が一致しません"),
                () -> assertEquals(0, room.getCorrentPlayer(), "初期状態のプレイヤー数は0であるべきです"),
                () -> assertNotNull(room.getPlayerList(), "リストがnullになっています")
        );
    }

    @Test
    @DisplayName("RoomIDの変更ができるか")
    void testSetRoomId() {
        int newId = 202;
        room.setRoomId(newId);
        assertEquals(newId, room.getRoomId(), "セットしたRoomIDが反映されていません");
    }

    @Test
    @DisplayName("プレイヤーリストの初期状態が空か")
    void testPlayerListInitiallyEmpty() {
        List<?> list = room.getPlayerList();
        assertTrue(list.isEmpty(), "初期状態のリストは空である必要があります");
    }
}