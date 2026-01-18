/* 一旦コメントアウト
package ClientManageServer.TEST;

import ClientManageServer.AccountManager;
import org.junit.jupiter.api.*;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;

import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class AccountManagerTest {

    private static final String DB_URL  =
            "jdbc:mysql://sql.yamazaki.se.shibaura-it.ac.jp:13308/db_group_a";
    private static final String DB_USER = "group_a";
    private static final String DB_PASS = "group_a";

    private static final String TEST_USER = "test_user_junit";
    private static final String TEST_PASS = "test_pass";

    private static AccountManager accountManager;

    @BeforeAll
    static void setup() {
        accountManager = new AccountManager();
        deleteTestUser(); // 念のため初期化
    }

    @AfterAll
    static void cleanup() {
        deleteTestUser();
    }

    // ---------- テスト ----------

    @Test
    @Order(1)
    void testRegisterSuccess() {
        boolean result = accountManager.registrateNewAccount(TEST_USER, TEST_PASS);
        assertTrue(result, "新規登録は成功するはず");
    }

    @Test
    @Order(2)
    void testRegisterDuplicate() {
        boolean result = accountManager.registrateNewAccount(TEST_USER, TEST_PASS);
        assertFalse(result, "同じユーザIDは登録できないはず");
    }

    @Test
    @Order(3)
    void testLoginSuccess() {
        boolean result = accountManager.login(TEST_USER, TEST_PASS);
        assertTrue(result, "正しいID・パスワードでログインできるはず");
    }

    @Test
    @Order(4)
    void testLoginFailWrongPassword() {
        boolean result = accountManager.login(TEST_USER, "wrong_password");
        assertFalse(result, "パスワードが違えばログイン失敗するはず");
    }

    @Test
    @Order(5)
    void testLogoutSuccess() {
        boolean result = accountManager.logout(TEST_USER);
        assertTrue(result, "ログアウトは成功するはず");
    }

    // ---------- 補助メソッド ----------

    private static void deleteTestUser() {
        String sql = "DELETE FROM users WHERE user_id = ?";

        try (
                Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASS);
                PreparedStatement ps = conn.prepareStatement(sql)
        ) {
            ps.setString(1, TEST_USER);
            ps.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
*/
