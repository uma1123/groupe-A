package ClientManageServer;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import jakarta.websocket.*;
import jakarta.websocket.server.ServerEndpoint;
import messages.ServerMessages.*;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@ServerEndpoint("/client-manage")
public class ClientManageEndpoint {

    // 接続中のセッション管理
    private static Set<Session> sessions =
            Collections.synchronizedSet(new HashSet<>());

    // ユーザーID -> セッション
    private static Map<String, Session> userSessions = new ConcurrentHashMap<>();

    // ルーム管理
    private static RoomService roomService = new RoomService();

    // アカウント管理（DB接続）
    private static AccountManager accountManager = new AccountManager();

    private static Gson gson = new Gson();

    @OnOpen
    public void onOpen(Session session, EndpointConfig ec) {
        sessions.add(session);
        System.out.println("[ClientManage] 接続: " + session.getId());
    }

    @OnMessage
    public void onMessage(String message, Session session) {
        System.out.println("受信: " + message);

        try {
            JsonObject json = JsonParser.parseString(message).getAsJsonObject();
            String type = json.get("type").getAsString();

            switch (type) {
                case "SIGNUP":
                    handleSignup(json, session);
                    break;
                case "LOGIN":
                    handleLogin(json, session);
                    break;
                case "LOGOUT":
                    handleLogout(json, session);
                    break;
                case "CREATE_ROOM":
                    handleCreateRoom(json, session);
                    break;
                case "JOIN_ROOM":
                    handleJoinRoom(json, session);
                    break;
                case "START_GAME":
                    handleStartGame(json, session);
                    break;
                case "LEAVE_ROOM":
                    handleLeaveRoom(json, session);
                    break;
                default:
                    sendError(session, "UNKNOWN_TYPE", "不明なメッセージタイプ: " + type);
            }
        } catch (Exception e) {
            e.printStackTrace();
            sendError(session, "PARSE_ERROR", "メッセージの解析に失敗しました");
        }
    }

    // ========== ハンドラメソッド ==========

    /**
     * サインアップ処理（DB登録）
     */
    private void handleSignup(JsonObject json, Session session) {
        String userId = json.get("userId").getAsString();
        String password = json.get("password").getAsString();
        
        System.out.println("[ClientManage] サインアップ: " + userId);

        // DB にアカウント登録
        boolean success = accountManager.registrateNewAccount(userId, password);

        if (success) {
            userSessions.put(userId, session);
            sendMessage(session, new AuthSuccessResponse(userId, userId));
            System.out.println("[ClientManage] サインアップ成功: " + userId);
        } else {
            sendError(session, "SIGNUP_FAILED", "ユーザーIDは既に使用されています");
            System.out.println("[ClientManage] サインアップ失敗: " + userId);
        }
    }

    /**
     * ログイン処理（DB認証）
     */
    private void handleLogin(JsonObject json, Session session) {
        String userId = json.get("userId").getAsString();
        String password = json.get("password").getAsString();
        
        System.out.println("[ClientManage] ログイン: " + userId);

        // DB で認証
        boolean success = accountManager.login(userId, password);

        if (success) {
            userSessions.put(userId, session);
            sendMessage(session, new AuthSuccessResponse(userId, userId));
            System.out.println("[ClientManage] ログイン成功: " + userId);
        } else {
            sendError(session, "LOGIN_FAILED", "ユーザーIDまたはパスワードが間違っています");
            System.out.println("[ClientManage] ログイン失敗: " + userId);
        }
    }

    /**
     * ログアウト処理（DBステータス更新）
     */
    private void handleLogout(JsonObject json, Session session) {
        String userId = json.get("userId").getAsString();
        
        System.out.println("[ClientManage] ログアウト: " + userId);

        // DB でログアウト
        boolean success = accountManager.logout(userId);

        if (success) {
            userSessions.remove(userId);
            sendMessage(session, new LogoutSuccessResponse(userId));
            System.out.println("[ClientManage] ログアウト成功: " + userId);
        } else {
            sendError(session, "LOGOUT_FAILED", "ログアウトに失敗しました");
            System.out.println("[ClientManage] ログアウト失敗: " + userId);
        }
    }

    /**
     * ルーム作成処理（メモリ管理）
     */
    private void handleCreateRoom(JsonObject json, Session session) {
        String userId = json.get("userId").getAsString();
        int numOfPlayer = json.get("numOfPlayer").getAsInt();
        int numOfLife = json.get("numOfLife").getAsInt();
        
        System.out.println("[ClientManage] ルーム作成: " + userId);

        // ルーム作成
        Room room = roomService.createRoom(userId, numOfPlayer, numOfLife);

        // レスポンス作成（roomIdをString型で送信）
        CreateRoomSuccessResponse response = new CreateRoomSuccessResponse(
                String.valueOf(room.getRoomId()),
                room.getMaxPlayers(),
                room.getInitialLife()
        );

        sendMessage(session, response);
    }

    /**
     * ルーム参加処理（メモリ管理）
     */
    private void handleJoinRoom(JsonObject json, Session session) {
        String userId = json.get("userId").getAsString();
        int roomId = json.get("roomId").getAsInt();
        
        System.out.println("[ClientManage] ルーム参加: " + userId + " -> Room " + roomId);

        Room room = roomService.getRoom(roomId);
        if (room == null) {
            sendError(session, "ROOM_NOT_FOUND", "ルームが見つかりません");
            return;
        }

        if (room.isFull()) {
            sendError(session, "ROOM_FULL", "ルームが満員です");
            return;
        }

        // プレイヤー追加
        room.addPlayer(userId);
        userSessions.put(userId, session);

        // ★ 参加者に通知（設定情報を含める）
        JoinRoomSuccessResponse response = new JoinRoomSuccessResponse(
                String.valueOf(roomId),
                room.getPlayers(),
                room.getMaxPlayers(),      // ★ 追加
                room.getInitialLife()      // ★ 追加
        );
        sendMessage(session, response);

        // 他のプレイヤーに通知
        PlayerJoinedResponse joinedResponse = new PlayerJoinedResponse(
                userId,
                room.getPlayerCount()
        );

        for (String playerId : room.getPlayers()) {
            if (!playerId.equals(userId)) {
                Session playerSession = userSessions.get(playerId);
                if (playerSession != null && playerSession.isOpen()) {
                    sendMessage(playerSession, joinedResponse);
                }
            }
        }
    }

    /**
     * ゲーム開始処理
     */
    private void handleStartGame(JsonObject json, Session session) {
        String userId = json.has("userId") ? json.get("userId").getAsString() : null;
        String roomIdStr = json.has("roomId") ? json.get("roomId").getAsString() : null;

        if (userId == null || roomIdStr == null) {
            sendError(session, "INVALID_REQUEST", "userId または roomId が不足しています");
            return;
        }

        int roomId;
        try {
            roomId = Integer.parseInt(roomIdStr);
        } catch (NumberFormatException e) {
            sendError(session, "INVALID_ROOM_ID", "roomId が数値ではありません");
            return;
        }

        Room room = roomService.getRoom(roomId);
        if (room == null) {
            sendError(session, "ROOM_NOT_FOUND", "ルームが見つかりません");
            return;
        }

        // ホストチェック（最初に参加したプレイヤーがホスト）
        List<String> players = room.getPlayers();
        if (players.isEmpty() || !players.get(0).equals(userId)) {
            sendError(session, "NOT_HOST", "ホストのみがゲームを開始できます");
            return;
        }

        // アプリケーションサーバにルーム情報を送信
        boolean success = sendRoomInfoToGameServer(room);
        if (!success) {
            sendError(session, "GAME_SERVER_ERROR", "ゲームサーバへの接続に失敗しました");
            return;
        }

        // ルーム内の全プレイヤーに GO_TO_GAME_SERVER を送信
        String gameServerEndpoint = "ws://localhost:8081/app/game?roomId=" + roomId;
        GoToGameServerResponse response = new GoToGameServerResponse(
            String.valueOf(roomId),
            gameServerEndpoint
        );
        String responseJson = gson.toJson(response);

        for (String playerId : players) {
            Session playerSession = userSessions.get(playerId);
            if (playerSession != null && playerSession.isOpen()) {
                try {
                    playerSession.getBasicRemote().sendText(responseJson);
                    System.out.println("GO_TO_GAME_SERVER 送信 -> " + playerId);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    /**
     * アプリケーションサーバにルーム情報を送信
     */
    private boolean sendRoomInfoToGameServer(Room room) {
        try {
            // ルーム情報をJSON化
            JsonObject roomInfo = new JsonObject();
            roomInfo.addProperty("type", "INIT_GAME");
            roomInfo.addProperty("roomId", room.getRoomId());
            roomInfo.addProperty("maxPlayers", room.getMaxPlayers());
            roomInfo.addProperty("initialLife", room.getInitialLife());
            
            // プレイヤーリストを追加
            JsonArray playersArray = new JsonArray();
            for (String userId : room.getPlayers()) {
                playersArray.add(userId);
            }
            roomInfo.add("players", playersArray);

            String jsonBody = gson.toJson(roomInfo);
            System.out.println("ゲームサーバへ送信: " + jsonBody);

            // HTTP POST でアプリケーションサーバに送信
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("http://localhost:8082/api/init-game"))  // ★ ポート変更
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            
            System.out.println("ゲームサーバ応答: " + response.statusCode() + " - " + response.body());
            return response.statusCode() == 200;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * ルーム退出処理
     */
    private void handleLeaveRoom(JsonObject json, Session session) {
        String userId = json.has("userId") ? json.get("userId").getAsString() : null;
        if (userId == null) {
            return;
        }

        // ユーザーが所属するルームを探して退出させる
        System.out.println("ユーザー退出: " + userId);
    }

    // ========== ユーティリティメソッド ==========

    private void sendMessage(Session session, Object message) {
        try {
            String json = gson.toJson(message);
            System.out.println("[ClientManage] 送信: " + json);
            session.getBasicRemote().sendText(json);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void sendError(Session session, String errorId, String message) {
        sendMessage(session, new ErrorResponse(errorId, message));
    }

    @OnClose
    public void onClose(Session session) {
        System.out.println("[ClientManage] 切断: " + session.getId());
        sessions.remove(session);

        // ログアウト処理（セッション切断時）
        for (Map.Entry<String, Session> entry : userSessions.entrySet()) {
            if (entry.getValue().equals(session)) {
                String oderId = entry.getKey();
                accountManager.logout(oderId);
                System.out.println("[ClientManage] 自動ログアウト: " + oderId);
                break;
            }
        }

        userSessions.entrySet().removeIf(entry -> entry.getValue().equals(session));
    }

    @OnError
    public void onError(Session session, Throwable error) {
        System.out.println("[ClientManage] エラー: " + session.getId());
        error.printStackTrace();
    }

    // GoToGameServerResponse クラス
    private static class GoToGameServerResponse {
        public String type = "GO_TO_GAME_SERVER";
        public String roomId;
        public String nextEndpoint;

        public GoToGameServerResponse(String roomId, String nextEndpoint) {
            this.roomId = roomId;
            this.nextEndpoint = nextEndpoint;
        }
    }
}