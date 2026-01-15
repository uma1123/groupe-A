package ClientManageServer;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import jakarta.websocket.*;
import jakarta.websocket.server.ServerEndpoint;
import messages.ClientMessages.*;
import messages.ServerMessages.*;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@ServerEndpoint("/client-manage")
public class ClientManageEndpoint {

    // 接続中のセッション管理
    private static Set<Session> sessions =
            Collections.synchronizedSet(new HashSet<>());

    // ユーザーID -> セッション
    private static Map<String, Session> userSessions = new ConcurrentHashMap<>();

    // ルームID -> ルーム情報
    private static Map<String, RoomInfo> rooms = new ConcurrentHashMap<>();

    // ルームIDカウンター
    private static int roomIdCounter = 1;

    private static Gson gson = new Gson();

    // ルーム情報クラス
    private static class RoomInfo {
        String roomId;
        String hostUserId;
        int maxPlayers;
        int lives;
        List<String> players = new ArrayList<>();
    }

    @OnOpen
    public void onOpen(Session session, EndpointConfig ec) {
        sessions.add(session);
        System.out.println("[ClientManage] 接続: " + session.getId());
    }

    @OnMessage
    public void onMessage(String message, Session session) throws IOException {
        System.out.println("[ClientManage] 受信: " + message);

        try {
            JsonObject json = JsonParser.parseString(message).getAsJsonObject();
            String type = json.get("type").getAsString();

            switch (type) {
                case "SIGNUP":
                    handleSignup(gson.fromJson(message, SignupMessage.class), session);
                    break;
                case "LOGIN":
                    handleLogin(gson.fromJson(message, LoginMessage.class), session);
                    break;
                case "CREATE_ROOM":
                    handleCreateRoom(gson.fromJson(message, CreateRoomMessage.class), session);
                    break;
                case "JOIN_ROOM":
                    handleJoinRoom(gson.fromJson(message, JoinRoomMessage.class), session);
                    break;
                case "START_GAME":
                    handleStartGame(gson.fromJson(message, StartGameMessage.class), session);
                    break;
                default:
                    sendError(session, "UNKNOWN_TYPE", "不明なメッセージタイプ: " + type);
            }
        } catch (Exception e) {
            e.printStackTrace();
            sendError(session, "PARSE_ERROR", "メッセージの解析に失敗しました");
        }
    }

    private void handleSignup(SignupMessage msg, Session session) {
        // TODO: DB連携でユーザー登録
        System.out.println("[ClientManage] サインアップ: " + msg.userId);

        // 仮実装: 成功を返す
        userSessions.put(msg.userId, session);
        sendMessage(session, new AuthSuccessResponse(msg.userId, msg.userId));
    }

    private void handleLogin(LoginMessage msg, Session session) {
        // TODO: DB連携で認証
        System.out.println("[ClientManage] ログイン: " + msg.userId);

        // 仮実装: 成功を返す
        userSessions.put(msg.userId, session);
        sendMessage(session, new AuthSuccessResponse(msg.userId, msg.userId));
    }

    private void handleCreateRoom(CreateRoomMessage msg, Session session) {
        System.out.println("[ClientManage] ルーム作成: " + msg.userId);

        // ルーム作成
        RoomInfo room = new RoomInfo();
        room.roomId = String.valueOf(roomIdCounter++);
        room.hostUserId = msg.userId;
        room.maxPlayers = msg.numOfPlayer;
        room.lives = msg.numOfLife;
        room.players.add(msg.userId);

        rooms.put(room.roomId, room);

        // レスポンス作成
        CreateRoomSuccessResponse response = new CreateRoomSuccessResponse();
        response.roomId = room.roomId;
        response.settings = new CreateRoomSuccessResponse.RoomSettings();
        response.settings.maxPlayers = room.maxPlayers;
        response.settings.lives = room.lives;

        sendMessage(session, response);
    }

    private void handleJoinRoom(JoinRoomMessage msg, Session session) {
        String roomId = String.valueOf(msg.roomId);
        System.out.println("[ClientManage] ルーム参加: " + msg.userId + " -> Room " + roomId);

        RoomInfo room = rooms.get(roomId);
        if (room == null) {
            sendError(session, "ROOM_NOT_FOUND", "ルームが見つかりません");
            return;
        }

        if (room.players.size() >= room.maxPlayers) {
            sendError(session, "ROOM_FULL", "ルームが満員です");
            return;
        }

        // プレイヤー追加
        room.players.add(msg.userId);
        userSessions.put(msg.userId, session);

        // 参加者に通知
        JoinRoomSuccessResponse response = new JoinRoomSuccessResponse();
        response.roomId = roomId;
        response.currentPlayers = new ArrayList<>(room.players);
        sendMessage(session, response);

        // 他のプレイヤーに通知
        PlayerJoinedResponse joinedResponse = new PlayerJoinedResponse();
        joinedResponse.newUser = msg.userId;
        joinedResponse.totalPlayers = room.players.size();

        for (String playerId : room.players) {
            if (!playerId.equals(msg.userId)) {
                Session playerSession = userSessions.get(playerId);
                if (playerSession != null && playerSession.isOpen()) {
                    sendMessage(playerSession, joinedResponse);
                }
            }
        }
    }

    private void handleStartGame(StartGameMessage msg, Session session) {
        System.out.println("[ClientManage] ゲーム開始: Room " + msg.roomId);

        RoomInfo room = rooms.get(msg.roomId);
        if (room == null) {
            sendError(session, "ROOM_NOT_FOUND", "ルームが見つかりません");
            return;
        }

        // TODO: ルーム情報をアプリケーションサーバに送信

        // 全プレイヤーにゲームサーバへの移動を通知
        String gameEndpoint = "ws://localhost:8081/game";
        GoToGameServerResponse response = new GoToGameServerResponse(msg.roomId, gameEndpoint);

        for (String playerId : room.players) {
            Session playerSession = userSessions.get(playerId);
            if (playerSession != null && playerSession.isOpen()) {
                sendMessage(playerSession, response);
            }
        }
    }

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
        // ユーザーセッションからも削除
        userSessions.entrySet().removeIf(entry -> entry.getValue().equals(session));
    }

    @OnError
    public void onError(Session session, Throwable error) {
        System.out.println("[ClientManage] エラー: " + session.getId());
        error.printStackTrace();
    }
}