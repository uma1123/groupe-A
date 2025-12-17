import ClientManageServer.User;

import java.sql.*;
import java.util.*;

public class AccountManager {
    static final List<User> userList = new ArrayList<>();
    private static final String DB_URL  = "jdbc:mysql://localhost:3306/sample";
    private static final String DB_USER = "root";
    private static final String DB_PASS = "password";

    boolean login(String userId , String password) {


        String sql = "SELECT password FROM users WHERE user_id = ?";

        try (
                Connection conn = DriverManager.getConnection(
                        DB_URL, DB_USER, DB_PASS
                );
                PreparedStatement ps = conn.prepareStatement(sql);
        ) {

            ps.setString(1, userId);
            ResultSet rs = ps.executeQuery();

            if (!rs.next()) {
                return false; // ユーザが存在しない
            }

            String dbPassword = rs.getString("password");

            return password.equals(dbPassword);

        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    boolean logout(String userId , String password) {

        return true;
    }

    boolean registrateNewAccount(String userId , String password) {

        return true;
    }
}
