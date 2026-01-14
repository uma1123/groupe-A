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

    /**
     * メソッド名: Room(コンストラクタ)
     * テスト種別: 通常のパラメータ値での検証
     * テストデータ生成方法: 正常な値を設定(roomId=1234, numOfPlayer=4, numOfLife=3, roomOwner="Owner1")
     * テスト手順: テストプログラム作成(コンストラクタ呼び出し後、各フィールドを確認)
     * 期待されるテスト結果: 全てのフィールドが正しく初期化され、プレイヤーリストが空である
     * テスト結果の確認方法: テストプログラムの実行(JUnit assertEqualsで確認)
     */
    @Test
    void testConstructor_normalParameters() {
        assertEquals(1234, room.getRoomId());
        assertEquals(4, room.getNumOfPlayer());
        assertEquals("Owner1", room.getRoomOwner());
        assertEquals(0, room.getCorrentPlayer(), "初期状態ではプレイヤー数は0のはず");
        assertNotNull(room.getPlayerList());
    }

    /**
     * メソッド名: Room(コンストラクタ)
     * テスト種別: パラメータの限界値での検証
     * テストデータ生成方法: 定員1、ライフ1の最小値を設定
     * テスト手順: テストプログラム作成(最小値でのインスタンス生成)
     * 期待されるテスト結果: 正常にインスタンスが生成される
     * テスト結果の確認方法: テストプログラムの実行
     */
    @Test
    void testConstructor_boundaryValues() {
        Room minRoom = new Room(1000, 1, 1, "Owner");
        assertEquals(1, minRoom.getNumOfPlayer());
        assertEquals(0, minRoom.getCorrentPlayer());
    }

    // ========================================
    // Getterのテスト
    // ========================================

    /**
     * メソッド名: getRoomId
     * テスト種別: 通常のパラメータ値での検証
     * テストデータ生成方法: setUp()で生成したroomインスタンスを使用
     * テスト手順: テストプログラム作成(getRoomId()の戻り値を確認)
     * 期待されるテスト結果: コンストラクタで設定した値1234が返る
     * テスト結果の確認方法: テストプログラムの実行
     */
    @Test
    void testGetRoomId() {
        assertEquals(1234, room.getRoomId());
    }

    /**
     * メソッド名: getNumOfPlayer
     * テスト種別: 通常のパラメータ値での検証
     * テストデータ生成方法: setUp()で生成したroomインスタンスを使用
     * テスト手順: テストプログラム作成(getNumOfPlayer()の戻り値を確認)
     * 期待されるテスト結果: コンストラクタで設定した値4が返る
     * テスト結果の確認方法: テストプログラムの実行
     */
    @Test
    void testGetNumOfPlayer() {
        assertEquals(4, room.getNumOfPlayer());
    }

    /**
     * メソッド名: getRoomOwner
     * テスト種別: 通常のパラメータ値での検証
     * テストデータ生成方法: setUp()で生成したroomインスタンスを使用
     * テスト手順: テストプログラム作成(getRoomOwner()の戻り値を確認)
     * 期待されるテスト結果: コンストラクタで設定した"Owner1"が返る
     * テスト結果の確認方法: テストプログラムの実行
     */
    @Test
    void testGetRoomOwner() {
        assertEquals("Owner1", room.getRoomOwner());
    }

    /**
     * メソッド名: getCorrentPlayer
     * テスト種別: 全てのデータ構造の処理の検証
     * テストデータ生成方法: プレイヤーリストに要素を追加して検証
     * テスト手順: テストプログラム作成(初期状態、1人追加、2人追加の3パターン確認)
     * 期待されるテスト結果: リストのサイズと一致した値が返る
     * テスト結果の確認方法: テストプログラムの実行
     */
    @Test
    void testGetCorrentPlayer() {
        assertEquals(0, room.getCorrentPlayer());

        room.getPlayerList().add("Player1");
        assertEquals(1, room.getCorrentPlayer());

        room.getPlayerList().add("Player2");
        assertEquals(2, room.getCorrentPlayer());
    }

    // ========================================
    // Setterのテスト
    // ========================================

    /**
     * メソッド名: setRoomId
     * テスト種別: 通常のパラメータ値での検証
     * テストデータ生成方法: 新しいroomId=5678を設定
     * テスト手順: テストプログラム作成(setRoomId()実行後、getRoomId()で確認)
     * 期待されるテスト結果: 設定した値5678が返る
     * テスト結果の確認方法: テストプログラムの実行
     */
    @Test
    void testSetRoomId() {
        room.setRoomId(5678);
        assertEquals(5678, room.getRoomId());
    }

    /**
     * メソッド名: setNumOfPlayer
     * テスト種別: 通常のパラメータ値での検証
     * テストデータ生成方法: 新しい定員数=8を設定
     * テスト手順: テストプログラム作成(setNumOfPlayer()実行後、getNumOfPlayer()で確認)
     * 期待されるテスト結果: 設定した値8が返る
     * テスト結果の確認方法: テストプログラムの実行
     */
    @Test
    void testSetNumOfPlayer() {
        room.setNumOfPlayer(8);
        assertEquals(8, room.getNumOfPlayer());
    }

    /**
     * メソッド名: setNumOfLife
     * テスト種別: 通常のパラメータ値での検証
     * テストデータ生成方法: 新しいライフ数=5を設定
     * テスト手順: テストプログラム作成(setNumOfLife()実行時に例外が出ないことを確認)
     * 期待されるテスト結果: 例外が発生しない
     * テスト結果の確認方法: テストプログラムの実行(getterがないため例外確認のみ)
     */
    @Test
    void testSetNumOfLife() {
        assertDoesNotThrow(() -> room.setNumOfLife(5));
    }

    /**
     * メソッド名: setNumOfLife
     * テスト種別: パラメータの限界値での検証
     * テストデータ生成方法: ライフ数=0を設定
     * テスト手順: テストプログラム作成(0を設定して例外が出ないことを確認)
     * 期待されるテスト結果: 例外が発生しない
     * テスト結果の確認方法: テストプログラムの実行
     */
    @Test
    void testSetNumOfLife_boundaryValue() {
        assertDoesNotThrow(() -> room.setNumOfLife(0));
    }

    // ========================================
    // プレイヤーリスト操作のテスト
    // ========================================

    /**
     * メソッド名: getPlayerList (add/remove操作含む)
     * テスト種別: 全てのデータ構造の処理の検証
     * テストデータ生成方法: プレイヤー名"Player1", "Player2"を追加・削除
     * テスト手順: テストプログラム作成(追加→サイズ確認→削除→サイズ確認)
     * 期待されるテスト結果: 追加・削除が正しく反映される
     * テスト結果の確認方法: テストプログラムの実行
     */
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

    /**
     * メソッド名: getPlayerList (定員チェック)
     * テスト種別: パラメータの限界値での検証
     * テストデータ生成方法: 定員分のプレイヤーを追加
     * テスト手順: テストプログラム作成(定員4人まで追加して確認)
     * 期待されるテスト結果: 定員分のプレイヤーが追加される
     * テスト結果の確認方法: テストプログラムの実行
     */
    @Test
    void testPlayerList_fullCapacity() {
        for (int i = 1; i <= 4; i++) {
            room.getPlayerList().add("Player" + i);
        }
        assertEquals(4, room.getCorrentPlayer());
        assertEquals(room.getNumOfPlayer(), room.getCorrentPlayer());
    }

    /**
     * メソッド名: getPlayerList (定員超過)
     * テスト種別: パラメータの範囲外での検証
     * テストデータ生成方法: 定員を超えるプレイヤーを追加
     * テスト手順: テストプログラム作成(定員4人に対して6人追加)
     * 期待されるテスト結果: Roomクラスは定員チェックをしないため、6人追加される
     * テスト結果の確認方法: テストプログラムの実行(定員チェックはroomServiceの責務)
     */
    @Test
    void testPlayerList_overCapacity() {
        for (int i = 1; i <= 6; i++) {
            room.getPlayerList().add("Player" + i);
        }
        assertEquals(6, room.getCorrentPlayer());
        assertTrue(room.getCorrentPlayer() > room.getNumOfPlayer());
    }

    /**
     * メソッド名: getPlayerList (空リスト操作)
     * テスト種別: 全てのデータ構造の処理の検証
     * テストデータ生成方法: プレイヤーを追加後、全削除
     * テスト手順: テストプログラム作成(clear()で全削除後に確認)
     * 期待されるテスト結果: リストが空になる
     * テスト結果の確認方法: テストプログラムの実行
     */
    @Test
    void testPlayerList_clear() {
        room.getPlayerList().add("Player1");
        room.getPlayerList().add("Player2");

        room.getPlayerList().clear();

        assertEquals(0, room.getCorrentPlayer());
        assertTrue(room.getPlayerList().isEmpty());
    }
}