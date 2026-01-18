//package ClientManageServer.TEST;
//
//import static org.junit.jupiter.api.Assertions.*;
//
//import ClientManageServer.User;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//
//class UserTest {
//
//    private User user;
//
//    @BeforeEach
//    void setUp() {
//        user = new User("testUser", "testPass");
//    }
//
//    // ① コンストラクタのテスト
//    @Test
//    void testConstructor_initialState() {
//        assertEquals("testUser", user.getUserId());
//        assertEquals("testPass", user.getPassword());
//        assertFalse(user.isLogin(), "初期状態ではログインしていないはず");
//    }
//
//    // ② getUserId のテスト
//    @Test
//    void testGetUserId() {
//        assertEquals("testUser", user.getUserId());
//    }
//
//    // ③ getPassword のテスト
//    @Test
//    void testGetPassword() {
//        assertEquals("testPass", user.getPassword());
//    }
//
//    // ④ setLogin(true) のテスト
//    @Test
//    void testSetLoginTrue() {
//        user.setLogin(true);
//        assertTrue(user.isLogin(), "login は true になるはず");
//    }
//
//    // ⑤ setLogin(false) のテスト
//    @Test
//    void testSetLoginFalse() {
//        user.setLogin(true);   // 一度 true にしてから
//        user.setLogin(false);  // false に戻す
//        assertFalse(user.isLogin(), "login は false に戻るはず");
//    }
//}