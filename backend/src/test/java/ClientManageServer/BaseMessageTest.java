/*
package ClientManageServer;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class BaseMessageTest {

    private GameManager gameManager;

    @BeforeEach
    void setUp() {
        // テストごとにGameManagerを初期化（状態をリセット）
        gameManager = new GameManager();
    }

    @Test
    void testLoginFlow() {
        // ログインのテスト
        LoginMessage loginMsg = new LoginMessage("user1", "pass1");
        String result = gameManager.handleAction(loginMsg);

        // 成功か失敗のいずれかの文字列が返ってくることを確認
        assertNotNull(result);
        System.out.println("ログイン結果: " + result);
    }

    @Test
    void testCreateAndJoinRoomFlow() {
        // 1. ルーム作成
        CreateMessage createMsg = new CreateMessage("user1", 2, 3);
        String roomIdStr = gameManager.handleAction(createMsg);

        // RoomID（数字）が返ってきていることを確認
        int roomId = Integer.parseInt(roomIdStr);
        assertTrue(roomId >= 1000 && roomId <= 9999);

        // 2. 作成したルームに参加
        JoinMessage joinMsg = new JoinMessage(roomId, "user2");
        String joinRes = gameManager.handleAction(joinMsg);
        assertEquals("参加成功", joinRes);

        // 3. 満員の状態でさらに入ろうとする
        JoinMessage fullMsg = new JoinMessage(roomId, "user3");
        String fullRes = gameManager.handleAction(fullMsg);
        assertEquals("満員です", fullRes);
    }

    @Test
    void testRemoveAndDissolveRoom() {
        // ルーム作成
        CreateMessage createMsg = new CreateMessage("user1", 2, 3);
        int roomId = Integer.parseInt(gameManager.handleAction(createMsg));

        // 退出のテスト
        RemoveMessage removeMsg = new RemoveMessage(roomId, "user1");
        String result = gameManager.handleAction(removeMsg);

        // 最後の1人が抜けたら解散される仕様の確認
        assertEquals("退出しました（ルームを解散しました）", result);
    }

    @Test
    void testSignUp() {
        // アカウント登録のテスト
        SignUpMessage signUpMsg = new SignUpMessage("newUser", "newPass");
        String result = gameManager.handleAction(signUpMsg);

        assertNotNull(result);
        System.out.println("サインアップ結果: " + result);
    }

    @Test
    void testUnknownAction() {
        // 定義されていないメッセージの場合
        BaseMessage unknown = new BaseMessage("CHAT");
        String result = gameManager.handleAction(unknown);
        assertEquals("Unknown action: CHAT", result);
    }
}
*/
