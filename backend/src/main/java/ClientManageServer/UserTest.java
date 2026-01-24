package ClientManageServer;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

public class UserTest {

    @Test
void testUserInitialization(){
        User user = new User("testUser","pass");

        assertEquals("testUser",user.getUserId());
        assertEquals("pass",user.getPassword());
        assertFalse(user.isLogin());
    }
    @Test
    void testSetLogin(){
        User user = new User("testUser","pass");

        user.setLogin(true);
        assertTrue(user.isLogin());

        user.setLogin(false);
        assertFalse(user.isLogin());
    }
}
