package ClientManageServer;

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
                PreparedStatement ps = conn.prepareStatement(sql)
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
        String sql = "UPDATE users SET login_status = FALSE WHERE user_id = ?";

        try (
                Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASS);
                PreparedStatement ps = conn.prepareStatement(sql)
        ) {

            ps.setString(1, userId);

            int rows = ps.executeUpdate();

            return rows == 1;  // 1件更新できたら成功

        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    boolean registrateNewAccount(String userId , String password) {
    // すでに存在するかチェック
        String checkSql = "SELECT user_id FROM users WHERE user_id = ?";
        String insertSql = "INSERT INTO users(user_id, password) VALUES(?, ?)";

        try (
                Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASS);
                PreparedStatement checkPs = conn.prepareStatement(checkSql);
                PreparedStatement insertPs = conn.prepareStatement(insertSql)
        ) {

            // 既存確認
            checkPs.setString(1, userId);
            ResultSet rs = checkPs.executeQuery();

            if (rs.next()) {
                return false; // 既に存在する
            }

            // 登録
            insertPs.setString(1, userId);
            insertPs.setString(2, password);

            int rows = insertPs.executeUpdate();

            return rows == 1;

        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
}
