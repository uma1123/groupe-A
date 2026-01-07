package ClientManageServer;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class RoomServiceTest {

    private roomService service;

    @BeforeEach
    void setUp() {
        service = new roomService();
    }

    @Test
    @DisplayName("joinProcess: 正常なリクエストでユーザーがルームに参加できること")
    void testJoinProcess_Success() {
        // 1. 準備: ルームを作成して登録
        Room room = new Room(100, 4, 3);
        addRoomToService(room);

        // 2. 準備: JoinRequestの作成 (Setterを使用)
        JoinRequest request = new JoinRequest();
        request.setRoomId(100);
        request.setUserId("TestUser_01");

        // 3. 実行
        String result = service.joinProcess(request);

        // 4. 検証
        assertEquals("参加成功", result);
        assertTrue(room.getPlayerList().contains("TestUser_01"), "ユーザー名がリストに含まれている必要があります");
        assertEquals(1, room.getCorrentPlayer(), "現在のプレイヤー数が1である必要があります");
    }

    @Test
    @DisplayName("joinProcess: 満員の場合に'満員です'と返り、参加できないこと")
    void testJoinProcess_Full() {
        // 1. 準備: 定員1名のルームを作成
        Room room = new Room(200, 1, 3);
        room.getPlayerList().add("ExistingUser");
        addRoomToService(room);

        JoinRequest request = new JoinRequest();
        request.setRoomId(200);
        request.setUserId("NewUser");

        // 2. 実行
        String result = service.joinProcess(request);

        // 3. 検証
        assertEquals("満員です", result);
        assertEquals(1, room.getCorrentPlayer(), "プレイヤー数は増えていないこと");
        assertFalse(room.getPlayerList().contains("NewUser"));
    }

    @Test
    @DisplayName("setRule: ルール設定が既存のルームに正しく反映されること")
    void testSetRule_Success() {
        // 1. 準備: 初期状態 (定員2, ライフ3) のルーム
        Room room = new Room(300, 2, 3);
        addRoomToService(room);

        JoinRequest request = new JoinRequest();
        request.setRoomId(300);
        request.setNum(5);  // 新しい定員
        request.setLife(10); // 新しいライフ

        // 2. 実行
        String result = service.setRule(request);

        // 3. 検証
        assertEquals("ルール設定完了", result);
        assertEquals(5, room.getNumOfPlayer(), "最大人数が更新されていません");
        assertEquals(10, room.numOfLife, "ライフ数が更新されていません");
    }

    @Test
    @DisplayName("ルームが見つからない場合に、適切にエラーメッセージが返ること")
    void testRoomNotFound() {
        // 準備: 何も登録しない
        JoinRequest request = new JoinRequest();
        request.setRoomId(999);

        // 実行
        String joinResult = service.joinProcess(request);

        // 検証
        assertEquals("ルームが見つかりません", joinResult);
    }

    /**
     * 【ヘルパーメソッド】
     * roomService内のprivateなroomListにテスト用ルームを強制的に追加します。
     */
    private void addRoomToService(Room room) {
        try {
            java.lang.reflect.Field field = roomService.class.getDeclaredField("roomList");
            field.setAccessible(true);
            @SuppressWarnings("unchecked")
            List<Room> list = (List<Room>) field.get(service);
            list.add(room);
        } catch (Exception e) {
            throw new RuntimeException("テスト用データの注入に失敗しました", e);
        }
    }
}
