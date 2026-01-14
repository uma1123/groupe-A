package ClientManageServer;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Field;

import static org.junit.jupiter.api.Assertions.*;

/**
 * GameManager#handleAction(BaseMessage) の単体テスト（JUnit5）
 *
 * GameManager は service/account を new しているため、
 * リフレクションで private フィールドをスタブに差し替えて単体テストとして実施する。
 */
public class GameManagerTest {

    private GameManager gm;
    private RoomServiceStub serviceStub;
    private AccountManagerStub accountStub;

    @BeforeEach
    void setUp() throws Exception {
        gm = new GameManager();
        serviceStub = new RoomServiceStub();
        accountStub = new AccountManagerStub();

        // GameManager の private フィールド差し替え（フィールド名は君のGameManagerに合わせている）
        inject(gm, "service", serviceStub);
        inject(gm, "account", accountStub);
    }

    // ----------------------------
    // CREATE_ROOM
    // ----------------------------

    @Test
    void createRoom_normal_returnsRoomId() {
        // arrange
        serviceStub.addRoomReturn = new Room("R001");
        CreateMessage msg = new CreateMessage("CREATE_ROOM", 4, 3, "userA");

        // act
        String result = gm.handleAction(msg);

        // assert
        assertEquals("R001", result);
        assertEquals(4, serviceStub.lastNumOfPlayer);
        assertEquals(3, serviceStub.lastNumOfLife);
        assertEquals("userA", serviceStub.lastUserId);
    }

    @Test
    void createRoom_boundary_minValues_returnsRoomId() {
        serviceStub.addRoomReturn = new Room("R_MIN");
        CreateMessage msg = new CreateMessage("CREATE_ROOM", 1, 1, "userA");

        String result = gm.handleAction(msg);

        assertEquals("R_MIN", result);
    }

    @Test
    void createRoom_outOfRange_throwsIllegalArgumentException() {
        serviceStub.throwOnAddRoom = new IllegalArgumentException("invalid numOfPlayer");
        CreateMessage msg = new CreateMessage("CREATE_ROOM", 0, 3, "userA");

        assertThrows(IllegalArgumentException.class, () -> gm.handleAction(msg));
    }

    // ----------------------------
    // JOIN_ROOM
    // ----------------------------

    @Test
    void joinRoom_normal_returnsJoinOk() {
        serviceStub.joinProcessReturn = "JOIN_OK";
        JoinMessage msg = new JoinMessage("JOIN_ROOM", "R001", "userA");

        String result = gm.handleAction(msg);

        assertEquals("JOIN_OK", result);
        assertEquals("R001", serviceStub.lastRoomId);
        assertEquals("userA", serviceStub.lastUserId);
    }

    @Test
    void joinRoom_error_roomNotFound_returnsRoomNotFound() {
        serviceStub.joinProcessReturn = "ROOM_NOT_FOUND";
        JoinMessage msg = new JoinMessage("JOIN_ROOM", "NO_ROOM", "userA");

        String result = gm.handleAction(msg);

        assertEquals("ROOM_NOT_FOUND", result);
    }

    // ----------------------------
    // REMOVE_ROOM
    // ----------------------------

    @Test
    void removeRoom_normal_returnsRemoveOk() {
        serviceStub.removePlayerReturn = "REMOVE_OK";
        RemoveMessage msg = new RemoveMessage("REMOVE_ROOM", "R001", "userA");

        String result = gm.handleAction(msg);

        assertEquals("REMOVE_OK", result);
        assertEquals("R001", serviceStub.lastRoomId);
        assertEquals("userA", serviceStub.lastUserId);
    }

    // ----------------------------
    // LOGIN
    // ----------------------------

    @Test
    void login_success_returnsJapaneseSuccess() {
        accountStub.loginReturn = true;
        LoginMessage msg = new LoginMessage("LOGIN", "userA", "pass");

        String result = gm.handleAction(msg);

        assertEquals("ログイン成功", result);
        assertEquals("userA", accountStub.lastUserId);
        assertEquals("pass", accountStub.lastPassword);
    }

    @Test
    void login_fail_returnsJapaneseFail() {
        accountStub.loginReturn = false;
        LoginMessage msg = new LoginMessage("LOGIN", "userA", "wrong");

        String result = gm.handleAction(msg);

        assertEquals("ログイン失敗", result);
    }

    // ----------------------------
    // LOGOUT
    // ----------------------------

    @Test
    void logout_success_returnsJapaneseSuccess() {
        accountStub.logoutReturn = true;
        LogoutMessage msg = new LogoutMessage("LOGOUT", "userA");

        String result = gm.handleAction(msg);

        assertEquals("ログアウト成功", result);
        assertEquals("userA", accountStub.lastUserId);
    }

    @Test
    void logout_fail_returnsJapaneseFail() {
        accountStub.logoutReturn = false;
        LogoutMessage msg = new LogoutMessage("LOGOUT", "userA");

        String result = gm.handleAction(msg);

        assertEquals("ログアウト失敗", result);
    }

    // ----------------------------
    // SIGNUP
    // ----------------------------

    @Test
    void signup_success_returnsJapaneseSuccess() {
        accountStub.registrateReturn = true;
        SignUpMessage msg = new SignUpMessage("SIGNUP", "newUser", "pass");

        String result = gm.handleAction(msg);

        assertEquals("アカウントを登録しました", result);
        assertEquals("newUser", accountStub.lastUserId);
        assertEquals("pass", accountStub.lastPassword);
    }

    @Test
    void signup_fail_returnsJapaneseFail() {
        accountStub.registrateReturn = false;
        SignUpMessage msg = new SignUpMessage("SIGNUP", "userA", "pass");

        String result = gm.handleAction(msg);

        assertEquals("登録に失敗しました", result);
    }

    // ----------------------------
    // Unknown / abnormal
    // ----------------------------

    @Test
    void unknownType_returnsUnknownAction() {
        BaseMessage msg = new BaseMessage("HOGE");

        String result = gm.handleAction(msg);

        assertEquals("Unknown action: HOGE", result);
    }

    @Test
    void msgIsNull_throwsNullPointerException() {
        assertThrows(NullPointerException.class, () -> gm.handleAction(null));
    }

    @Test
    void typeSaysCreateRoomButActualClassIsJoinMessage_throwsClassCastException() {
        // JoinMessage だが type だけ CREATE_ROOM（キャスト例外確認）
        BaseMessage bad = new JoinMessage("CREATE_ROOM", "R001", "userA");
        assertThrows(ClassCastException.class, () -> gm.handleAction(bad));
    }

    // ============================================================
    // helpers
    // ============================================================

    private static void inject(Object target, String fieldName, Object value) throws Exception {
        Field f = target.getClass().getDeclaredField(fieldName);
        f.setAccessible(true);
        f.set(target, value);
    }

    // ============================================================
    // Stubs（君の実クラスを拡張して戻り値を制御する）
    // ============================================================

    /**
     * roomService のスタブ
     * ※君のプロジェクト内のクラス名が "roomService" の前提
     */
    static class RoomServiceStub extends roomService {
        // return controls
        Room addRoomReturn = new Room("DUMMY");
        String joinProcessReturn = "DUMMY";
        String removePlayerReturn = "DUMMY";

        // throw controls
        RuntimeException throwOnAddRoom;

        // last called params
        int lastNumOfPlayer;
        int lastNumOfLife;
        String lastUserId;
        String lastRoomId;

        @Override
        public Room addRoom(int numOfPlayer, int numOfLife, String userId) {
            if (throwOnAddRoom != null) throw throwOnAddRoom;
            lastNumOfPlayer = numOfPlayer;
            lastNumOfLife = numOfLife;
            lastUserId = userId;
            return addRoomReturn;
        }

        @Override
        public String joinProcess(String roomId, String userId) {
            lastRoomId = roomId;
            lastUserId = userId;
            return joinProcessReturn;
        }

        @Override
        public String removePlayer(String roomId, String userId) {
            lastRoomId = roomId;
            lastUserId = userId;
            return removePlayerReturn;
        }
    }

    /**
     * AccountManager のスタブ
     */
    static class AccountManagerStub extends AccountManager {
        boolean loginReturn;
        boolean logoutReturn;
        boolean registrateReturn;

        String lastUserId;
        String lastPassword;

        @Override
        public boolean login(String userId, String password) {
            lastUserId = userId;
            lastPassword = password;
            return loginReturn;
        }

        @Override
        public boolean logout(String userId) {
            lastUserId = userId;
            return logoutReturn;
        }

        @Override
        public boolean registrateNewAccount(String userId, String password) {
            lastUserId = userId;
            lastPassword = password;
            return registrateReturn;
        }
    }
}

