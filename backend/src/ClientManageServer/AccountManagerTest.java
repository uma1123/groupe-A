package ClientManageServer;

import org.junit.jupiter.api.*;
import java.sql.*;
import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class) // テストの実行順序を制御
class AccountManagerTest {

    private AccountManager manager;
    private static final String TEST_USER = "test_user_999";
    private static final String TEST_PASS = "test_pass_123";

    @BeforeEach
    void setUp() {
        manager = new AccountManager();
        // 各テストの前に、もし前回のゴミが残っていたら消しておく（独立性の確保）
        deleteTestUser(TEST_USER);
    }

    @AfterEach
    void tearDown() {
        // テストが終わったらテストデータを削除する
        deleteTestUser(TEST_USER);
    }

    @Test
    @Order(1)
    @DisplayName("新規登録：正常にユーザーが登録できること")
    void testRegistrateNewAccount_Success() {
        boolean result = manager.registrateNewAccount(TEST_USER, TEST_PASS);
        assertTrue(result, "新規登録は成功するはずです");

        // DBに実際に存在するか確認
        try {
            assertTrue(isUserExists(TEST_USER));
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    @Order(2)
    @DisplayName("新規登録：重複するIDは登録できないこと")
    void testRegistrateNewAccount_Duplicate() {
        manager.registrateNewAccount(TEST_USER, TEST_PASS);

        // 同じIDで再度登録
        boolean result = manager.registrateNewAccount(TEST_USER, "different_pass");
        assertFalse(result, "重複したIDは登録できないはずです");
    }

    @Test
    @Order(3)
    @DisplayName("ログイン：正しいパスワードでログイン成功し、ステータスが更新されること")
    void testLogin_Success() {
        manager.registrateNewAccount(TEST_USER, TEST_PASS);

        boolean loginResult = manager.login(TEST_USER, TEST_PASS);
        assertTrue(loginResult, "正しい情報ならログイン成功するはずです");

        // ログインステータスがTRUEになっているか確認
        assertTrue(getLoginStatus(TEST_USER), "ログイン後はstatusがTRUEになるはずです");
    }

    @Test
    @Order(4)
    @DisplayName("ログイン：間違ったパスワードでログイン失敗すること")
    void testLogin_WrongPassword() {
        manager.registrateNewAccount(TEST_USER, TEST_PASS);

        boolean loginResult = manager.login(TEST_USER, "wrong_password");
        assertFalse(loginResult, "間違ったパスワードは失敗するはずです");
    }

    @Test
    @Order(5)
    @DisplayName("ログアウト：ログイン状態が解除されること")
    void testLogout() {
        manager.registrateNewAccount(TEST_USER, TEST_PASS);
        manager.login(TEST_USER, TEST_PASS); // 一度ログイン

        boolean logoutResult = manager.logout(TEST_USER);
        assertTrue(logoutResult, "ログアウト処理自体が成功するはずです");
        assertFalse(getLoginStatus(TEST_USER), "ログアウト後はstatusがFALSEになるはずです");
    }

    // --- テスト用の補助メソッド (JDBCを直接使って状態確認) ---

    private void deleteTestUser(String userId) {
        String sql = "DELETE FROM users WHERE user_id = ?";
        try (Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/sample", "root", "password");
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, userId);
            ps.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private boolean isUserExists(String userId) throws SQLException {
        String sql = "SELECT COUNT(*) FROM users WHERE user_id = ?";
        try (Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/sample", "root", "password");
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, userId);
            ResultSet rs = ps.executeQuery();
            return rs.next() && rs.getInt(1) > 0;
        }
    }

    private boolean getLoginStatus(String userId) {
        String sql = "SELECT login_status FROM users WHERE user_id = ?";
        try (Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/sample", "root", "password");
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, userId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return rs.getBoolean("login_status");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }
}