package ApplicationServer;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class PlayerListTest {

    private PlayerList playerList;

    @BeforeEach
    void setUp() {
        // 初期プレイヤー数 0、初期ライフ 3 とする
        playerList = new PlayerList(0, 3);
    }

    @Test
    void SavePlayerInfo() {
        // 実行
        boolean result = playerList.SavePlayerInfo("user001");

        // ① 戻り値の確認
        assertTrue(result, "SavePlayerInfoはtrueを返すべき");

        // ② プレイヤー数の確認
        assertEquals(1, playerList.getPlayerList().size(),
                "プレイヤーが1人追加されているべき");

        // ③ プレイヤー情報の確認
        Player player = playerList.getPlayerList().get(0);
        assertEquals("user001", player.userid, "useridが正しく設定されているべき");
        assertEquals(3, player.life, "初期ライフが正しく設定されているべき");
    }

    @Test
    void receiveVotingResult() {
        // 準備：プレイヤーを2人追加
        playerList.SavePlayerInfo("user001");
        playerList.SavePlayerInfo("user002");

        // 実行：user001 に投票結果を設定
        playerList.receiveVotingResult("user001", 5);

        // 検証
        Player player1 = playerList.getPlayerList().get(0);
        Player player2 = playerList.getPlayerList().get(1);

        // user001 の number が更新されていること
        assertEquals(5, player1.selectednum, "user001の投票結果が正しく設定されているべき");

        // user002 の number は変更されていないこと（初期値が0想定）
        assertEquals(-1, player2.selectednum, "user002の投票結果は変更されていないべき");
    }

    @Test
    void DeletePlayer() {
        // 準備：プレイヤー追加
        playerList.SavePlayerInfo("user001");
        playerList.SavePlayerInfo("user002");

        // 実行
        boolean result = playerList.DeletePlayer("user001");

        // ① 戻り値の確認
        assertTrue(result, "存在するプレイヤー削除時はtrueを返すべき");

        // ② プレイヤー数の確認
        assertEquals(1, playerList.getPlayerList().size(),
                "プレイヤーが1人削除されているべき");

        // ③ 削除されたプレイヤーが存在しないこと
        assertFalse(
                playerList.getPlayerList()
                        .stream()
                        .anyMatch(p -> p.userid.equals("user001")),
                "user001 はリストから削除されているべき"
        );
    }

    @Test
    void DeletePlayer2() {
        // 準備
        playerList.SavePlayerInfo("user001");

        // 実行
        boolean result = playerList.DeletePlayer("user999");

        // 検証
        assertFalse(result, "存在しないプレイヤー削除時はfalseを返すべき");
        assertEquals(1, playerList.getPlayerList().size(),
                "プレイヤー数は変化しないべき");
    }

    @Test
    void SubLife() {
        // 準備：プレイヤー追加
        playerList.SavePlayerInfo("user001");
        Player player = playerList.getPlayerList().get(0);

        // 初期ライフ確認
        assertEquals(3, player.life, "初期ライフは3のはず");

        // 実行：1ダメージ
        playerList.SubLife(player, 1);

        // 検証：ライフが2になっている
        assertEquals(2, player.life, "ライフが1減って2になるべき");
    }

    @Test
    void isAlive() {
        // 準備
        playerList.SavePlayerInfo("user001");

        // 実行 & 検証
        assertTrue(playerList.isAlive("user001"),
                "ライフが1以上のプレイヤーは生存扱いになるべき");
    }

    @Test
    void isAlive2() {
        // 準備
        playerList.SavePlayerInfo("user001");
        Player player = playerList.getPlayerList().get(0);

        // ライフを0にする
        playerList.SubLife(player, 3);

        // 実行 & 検証
        assertFalse(playerList.isAlive("user001"),
                "ライフが0のプレイヤーは死亡扱いになるべき");
    }

    @Test
    void isAlive3() {
        // 準備
        playerList.SavePlayerInfo("user001");

        // 実行 & 検証
        assertFalse(playerList.isAlive("user999"),
                "存在しないプレイヤーはfalseを返すべき");
    }

}
