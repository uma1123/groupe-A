package ClientManageServer;

import java.sql.*;

public class AccountManager {

    private static final String DB_URL  = "jdbc:mysql://localhost:3306/sample";
    private static final String DB_USER = "root";
    private static final String DB_PASS = "password";

    // ログイン処理
    public boolean login(String userId, String password) {

        String selectSql = "SELECT password FROM users WHERE user_id = ?";
        String updateSql = "UPDATE users SET login_status = TRUE WHERE user_id = ?";

        try (
                Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASS);
                PreparedStatement selectPs = conn.prepareStatement(selectSql);
                PreparedStatement updatePs = conn.prepareStatement(updateSql)
        ) {

            selectPs.setString(1, userId);
            ResultSet rs = selectPs.executeQuery();

            if (!rs.next()) {
                return false;   // ユーザが存在しない
            }

            String dbPassword = rs.getString("password");

            if (!password.equals(dbPassword)) {
                return false;   // パスワード不一致
            }

            // ログイン状態を true に更新
            updatePs.setString(1, userId);
            updatePs.executeUpdate();

            return true;

        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    // ログアウト処理（login_status を false に）
    public boolean logout(String userId) {

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

    // アカウント登録
    public boolean registrateNewAccount(String userId, String password) {

        String checkSql = "SELECT user_id FROM users WHERE user_id = ?";
        String insertSql =
                "INSERT INTO users(user_id, password, login_status) VALUES(?, ?, FALSE)";

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
