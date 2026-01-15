package ApplicationServer;

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

@ServerEndpoint("/game")
public class GameEndpoint {

    private static Set<Session> sessions =
            Collections.synchronizedSet(new HashSet<>());

    // ユーザーID -> セッション
    private static Map<String, Session> userSessions = new ConcurrentHashMap<>();

    // ルームID -> ゲーム状態
    private static Map<String, GameState> games = new ConcurrentHashMap<>();

    private static Gson gson = new Gson();

    // ゲーム状態クラス
    private static class GameState {
        String roomId;
        int currentRound = 1;
        int totalRounds = 3;
        int timerDuration = 60;
        Map<String, Integer> playerNumbers = new HashMap<>();
        Map<String, Integer> playerLives = new HashMap<>();
        List<String> players = new ArrayList<>();
        RuleData currentRule;
    }

    @OnOpen
    public void onOpen(Session session, EndpointConfig ec) {
        sessions.add(session);
        System.out.println("[GameServer] 接続: " + session.getId());
    }

    @OnMessage
    public void onMessage(String message, Session session) throws IOException {
        System.out.println("[GameServer] 受信: " + message);

        try {
            JsonObject json = JsonParser.parseString(message).getAsJsonObject();
            String type = json.get("type").getAsString();

            switch (type) {
                case "JOIN_GAME":
                    handleJoinGame(json, session);
                    break;
                case "SUBMIT_NUMBER":
                    handleSubmitNumber(gson.fromJson(message, SubmitNumberMessage.class), session);
                    break;
                case "NEXT_ROUND":
                    handleNextRound(gson.fromJson(message, NextRoundMessage.class), session);
                    break;
                default:
                    sendError(session, "UNKNOWN_TYPE", "不明なメッセージタイプ: " + type);
            }
        } catch (Exception e) {
            e.printStackTrace();
            sendError(session, "PARSE_ERROR", "メッセージの解析に失敗しました");
        }
    }

    private void handleJoinGame(JsonObject json, Session session) {
        String userId = json.get("userId").getAsString();
        String roomId = json.get("roomId").getAsString();

        System.out.println("[GameServer] ゲーム参加: " + userId + " -> Room " + roomId);

        userSessions.put(userId, session);

        // ゲーム状態を取得または作成
        GameState game = games.computeIfAbsent(roomId, k -> {
            GameState newGame = new GameState();
            newGame.roomId = roomId;
            newGame.currentRule = createDefaultRule();
            return newGame;
        });

        if (!game.players.contains(userId)) {
            game.players.add(userId);
            game.playerLives.put(userId, 3); // 初期ライフ
        }

        // 全員揃ったらゲーム開始を通知
        // TODO: 実際のプレイヤー数チェック
        if (game.players.size() >= 2) { // 仮: 2人以上で開始
            sendGameStart(game);
        }
    }

    private void handleSubmitNumber(SubmitNumberMessage msg, Session session) {
        System.out.println("[GameServer] 数字提出: " + msg.userId + " -> " + msg.num);

        GameState game = games.get(msg.roomId);
        if (game == null) {
            sendError(session, "GAME_NOT_FOUND", "ゲームが見つかりません");
            return;
        }

        game.playerNumbers.put(msg.userId, msg.num);

        // 全員提出したら結果を計算
        if (game.playerNumbers.size() >= game.players.size()) {
            calculateRoundResult(game);
        }
    }

    private void handleNextRound(NextRoundMessage msg, Session session) {
        System.out.println("[GameServer] 次のラウンド: Room " + msg.roomId);

        GameState game = games.get(msg.roomId);
        if (game == null) {
            sendError(session, "GAME_NOT_FOUND", "ゲームが見つかりません");
            return;
        }

        game.currentRound++;
        game.playerNumbers.clear();

        if (game.currentRound > game.totalRounds) {
            // ゲーム終了
            sendFinalResult(game);
        } else {
            // 次のラウンド開始
            sendRoundStart(game);
        }
    }

    private void sendGameStart(GameState game) {
        List<RuleData> rules = createAvailableRules();

        GameStartResponse response = new GameStartResponse();
        response.roomId = game.roomId;
        response.totalRounds = game.totalRounds;
        response.availableRules = rules;
        response.firstRule = game.currentRule;

        broadcastToRoom(game, response);
    }

    private void sendRoundStart(GameState game) {
        RoundStartResponse response = new RoundStartResponse();
        response.roomId = game.roomId;
        response.currentRound = game.currentRound;
        response.totalRounds = game.totalRounds;
        response.rule = game.currentRule;
        response.timerDuration = game.timerDuration;

        broadcastToRoom(game, response);
    }

    private void calculateRoundResult(GameState game) {
        // ターゲット値を計算（全員の数字の平均 × 0.8）
        int sum = game.playerNumbers.values().stream().mapToInt(Integer::intValue).sum();
        int targetValue = (int) (sum / game.players.size() * 0.8);

        // 各プレイヤーの結果を計算
        for (String playerId : game.players) {
            int playerNumber = game.playerNumbers.getOrDefault(playerId, 0);
            int diff = Math.abs(playerNumber - targetValue);

            // 勝敗判定（仮: ターゲットに最も近い人が勝ち）
            String result = "LOSE";
            int closestDiff = Integer.MAX_VALUE;
            for (int num : game.playerNumbers.values()) {
                int d = Math.abs(num - targetValue);
                if (d < closestDiff) closestDiff = d;
            }
            if (diff == closestDiff) result = "WIN";

            // ライフ更新
            int currentLife = game.playerLives.get(playerId);
            if (result.equals("LOSE")) {
                currentLife -= game.currentRule.lifeDamage;
                game.playerLives.put(playerId, currentLife);
            }

            // 結果送信
            RoundResultResponse response = new RoundResultResponse();
            response.roomId = game.roomId;
            response.userId = playerId;
            response.roundResult = result;
            response.targetValue = targetValue;
            response.yourNumber = playerNumber;
            response.newLife = currentLife;
            response.isDead = currentLife <= 0;
            response.appliedRule = game.currentRule;

            Session playerSession = userSessions.get(playerId);
            if (playerSession != null && playerSession.isOpen()) {
                sendMessage(playerSession, response);
            }
        }
    }

    private void sendFinalResult(GameState game) {
        // ランキング作成
        List<Map.Entry<String, Integer>> sorted = new ArrayList<>(game.playerLives.entrySet());
        sorted.sort((a, b) -> b.getValue() - a.getValue());

        int rank = 1;
        for (Map.Entry<String, Integer> entry : sorted) {
            String playerId = entry.getKey();

            FinalResultResponse response = new FinalResultResponse();
            response.roomId = game.roomId;
            response.isWinner = rank == 1;
            response.finalRank = rank;
            response.rankings = new ArrayList<>();

            int r = 1;
            for (Map.Entry<String, Integer> e : sorted) {
                FinalResultResponse.RankingEntry re = new FinalResultResponse.RankingEntry();
                re.rank = r++;
                re.oderId = e.getKey();
                re.lives = e.getValue();
                response.rankings.add(re);
            }

            Session playerSession = userSessions.get(playerId);
            if (playerSession != null && playerSession.isOpen()) {
                sendMessage(playerSession, response);
            }
            rank++;
        }
    }

    private void broadcastToRoom(GameState game, Object message) {
        for (String playerId : game.players) {
            Session playerSession = userSessions.get(playerId);
            if (playerSession != null && playerSession.isOpen()) {
                sendMessage(playerSession, message);
            }
        }
    }

    private RuleData createDefaultRule() {
        RuleData rule = new RuleData();
        rule.id = "basic";
        rule.name = "基本ルール";
        rule.description = "平均値×0.8に最も近い数字を選んだ人が勝ち";
        rule.lifeDamage = 1;
        return rule;
    }

    private List<RuleData> createAvailableRules() {
        List<RuleData> rules = new ArrayList<>();
        rules.add(createDefaultRule());
        return rules;
    }

    private void sendMessage(Session session, Object message) {
        try {
            String json = gson.toJson(message);
            System.out.println("[GameServer] 送信: " + json);
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
        System.out.println("[GameServer] 切断: " + session.getId());
        sessions.remove(session);
        userSessions.entrySet().removeIf(entry -> entry.getValue().equals(session));
    }

    @OnError
    public void onError(Session session, Throwable error) {
        System.out.println("[GameServer] エラー: " + session.getId());
        error.printStackTrace();
    }
}