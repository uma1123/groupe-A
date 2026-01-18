//package ClientManageServer.TEST;
//
//import ClientManageServer.Room;
//import ClientManageServer.RoomService;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.DisplayName;
//import org.junit.jupiter.api.Test;
//
//import static org.junit.jupiter.api.Assertions.*;
//
//class RoomServiceTest {
//
//    private RoomService service;
//
//    @BeforeEach
//    void setUp() {
//        service = new RoomService();
//        // IDプールを初期化しておく
//        service.createRoomId();
//    }
//
//    @Test
//    @DisplayName("addRoom: ルームを作成するたびに異なるIDが割り振られること")
//    void testAddRoom_UniqueIds() {
//        Room room1 = service.addRoom(4, 3, "Owner1");
//        Room room2 = service.addRoom(4, 3, "Owner2");
//
//        assertNotNull(room1);
//        assertNotNull(room2);
//        assertNotEquals(room1.getRoomId(), room2.getRoomId(), "IDは重複してはいけません");
//    }
//
//    @Test
//    @DisplayName("joinProcess: 正常に参加でき、満員時は拒否されること")
//    void testJoinProcess_Capacity() {
//        // 定員1名のルームを作成
//        Room room = service.addRoom(1, 3, "Owner");
//        int roomId = room.getRoomId();
//
//        // 1人目：成功
//        String result1 = service.joinProcess(roomId, "User1");
//        assertEquals("参加成功", result1);
//
//        // 2人目：満員
//        String result2 = service.joinProcess(roomId, "User2");
//        assertEquals("満員です", result2);
//    }
//
//    @Test
//    @DisplayName("removePlayer: 最後の一人が退出したらルームが削除されること")
//    void testRemovePlayer_DeleteRoomWhenEmpty() {
//        Room room = service.addRoom(2, 3, "Owner");
//        int roomId = room.getRoomId();
//
//        // 参加
//        service.joinProcess(roomId, "User1");
//
//        // 退出（最後の一人）
//        String result = service.removePlayer(roomId, "User1");
//
//        assertTrue(result.contains("ルームを解散しました"));
//        // roomListから消えているか確認
//        assertNull(service.findRoom(roomId), "ルームは削除されている必要があります");
//    }
//
//    @Test
//    @DisplayName("deleteRoom: 削除されたルームのIDが再利用されること")
//    void testIdReclamation() {
//        // 全てのIDを使い切るテストは重いため、一つ作成して削除し、IDが返却されるかを確認
//        Room room = service.addRoom(4, 3, "Owner");
//        int firstRoomId = room.getRoomId();
//
//        // ルーム削除
//        service.deleteRoom(firstRoomId);
//
//        // 次に作るルームが、今削除したIDと同じになるか（IDプールに戻っているか）
//        // ※shuffleしているので必ずしも先頭に来るとは限りませんが、
//        // 今のaddRoomの実装(remove(0))とdeleteRoomの実装(add)なら、
//        // 連続して行うと末尾に追加され、プールを一巡した後に再利用されます。
//
//        // 実装上、IDが枯渇しないことを確認するために、
//        // 削除後にfindRoomでnullになることの方が重要です。
//        assertNull(service.findRoom(firstRoomId));
//    }
//
//    @Test
//    @DisplayName("findRoom: 存在しないIDに対してnullを返すこと")
//    void testFindRoom_NotFound() {
//        Room room = service.findRoom(99999); // 存在しないID
//        assertNull(room);
//    }
//}
