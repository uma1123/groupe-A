package ApplicationServer;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import jakarta.websocket.*;
import jakarta.websocket.server.ServerEndpoint;
import messages.ServerMessages.*;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

// ゲーム用WebSocketエンドポイント
@ServerEndpoint("/game")
public class GameEndpoint {

    //  ゲーム初期化情報を保持
    public static Map<String, GameInitInfo> pendingGames = new ConcurrentHashMap<>();
    
    //  GameInitInfo を GameEndpoint 内に定義
    public static class GameInitInfo {
        public String roomId;
        public int maxPlayers;
        public int initialLife;
        public List<String> players;
    }

    private static Set<Session> sessions = Collections.synchronizedSet(new HashSet<>());
    private static Map<String, Session> userSessions = new ConcurrentHashMap<>();
    private static Map<String, GameState> games = new ConcurrentHashMap<>();
    private static Gson gson = new Gson();

    // ゲーム状態
    private static class GameState {
        String roomId;
        int currentRound = 1;
        int totalRounds = 10;
        int timerDuration = 60;
        int initialLife;
        Map<String, Integer> playerNumbers = new HashMap<>();
        Map<String, Integer> playerLives = new HashMap<>();
        List<String> players = new ArrayList<>();
        List<String> connectedPlayers = new ArrayList<>();
        messages.ServerMessages.RuleData currentRule; 
        boolean gameStarted = false;
        String state = "WAITING_FOR_PLAYERS";
        long startTime;
        // 全プレイヤーの NEXT_ROUND 合図を集めるための集合
        Set<String> nextRoundReady = new HashSet<>();
    }

    @OnOpen
    public void onOpen(Session session) {
        sessions.add(session);
        System.out.println(" ゲームサーバ接続: " + session.getId());

        // クエリパラメータからroomIdを取得
        String query = session.getQueryString();
        String roomId = null;
        String oderId = null;

        if (query != null) {
            for (String param : query.split("&")) {
                String[] kv = param.split("=");
                if (kv.length == 2) {
                    if ("roomId".equals(kv[0])) {
                        roomId = kv[1];
                    } else if ("userId".equals(kv[0])) {
                        oderId = kv[1];
                    }
                }
            }
        }

        if (roomId != null) {
            session.getUserProperties().put("roomId", roomId);
            System.out.println("  roomId: " + roomId);
        }
        if (oderId != null) {
            session.getUserProperties().put("oderId", oderId);
            userSessions.put(oderId, session);
            System.out.println("  userId: " + oderId);
        }
    }

    @OnMessage
    public void onMessage(String message, Session session) {
        try {
            JsonObject jsonMessage = JsonParser.parseString(message).getAsJsonObject();
            String type = jsonMessage.get("type").getAsString();

            switch (type) {
                case "JOIN_GAME":
                    handleJoinGame(jsonMessage, session);
                    break;
                case "SUBMIT_NUMBER":
                    handleSubmitNumber(jsonMessage, session);
                    break;
                case "NEXT_ROUND":
                    handleNextRound(jsonMessage, session);
                    break;
                default:
                    System.out.println("不明なタイプ: " + type);
            }
        } catch (Exception e) {
            sendError(session, "MESSAGE_PARSE_ERROR", e.getMessage());
        }
    }

    /**
     * プレイヤーがゲームに参加
     */
    private void handleJoinGame(JsonObject json, Session session) {
        String oderId = json.get("userId").getAsString();
        String roomId = json.get("roomId").getAsString();

        session.getUserProperties().put("roomId", roomId);
        session.getUserProperties().put("oderId", oderId);
        userSessions.put(oderId, session);

        // ゲーム状態を取得または作成
        GameState game = games.computeIfAbsent(roomId, k -> {
            GameState newGame = new GameState();
            newGame.roomId = roomId;

            //  GameEndpoint.pendingGames からゲーム情報を取得
            GameInitInfo info = pendingGames.get(roomId);
            if (info != null) {
                newGame.players = new ArrayList<>(info.players);
                newGame.initialLife = info.initialLife;
                for (String p : info.players) {
                    newGame.playerLives.put(p, info.initialLife);
                }
                System.out.println("ゲーム情報ロード: " + info.players);
            }
            return newGame;
        });

        // 接続済みプレイヤーに追加
        if (!game.connectedPlayers.contains(oderId)) {
            game.connectedPlayers.add(oderId);
        }

        System.out.println( oderId + " がゲームに参加 (" + 
            game.connectedPlayers.size() + "/" + game.players.size() + ")");

        // 参加成功を通知
        sendToSession(session, new JoinGameSuccessResponse(roomId, game.connectedPlayers));

        // 全員揃ったらゲーム開始
        if (game.connectedPlayers.size() == game.players.size() && !game.gameStarted) {
            game.gameStarted = true;
            startGame(game);
        }
    }

    /**
     * ゲーム開始処理
     */
    private void startGame(GameState game) {
        System.out.println("ゲーム開始: roomId=" + game.roomId);
        
        // ルール抽選
        messages.ServerMessages.RuleData firstRule = CollectionOfRandRules.getRandomRule(); 
        game.currentRule = firstRule;

        // totalRounds を初期化 (maxRounds = Math.max(10, initialLife * 2 + Math.ceil(maxPlayers / 2)))
        GameInitInfo info = pendingGames.get(game.roomId);
        int maxPlayers = info != null ? info.maxPlayers : Math.max(1, game.players.size());
        game.totalRounds = Math.max(10, game.initialLife * 2 + (int) Math.ceil(maxPlayers / 2.0));

        //  GameStartResponse を構築（プレイヤー情報を含める）
        Gson gson = new Gson();
        JsonObject response = new JsonObject();
        response.addProperty("type", "GAME_START");
        response.addProperty("roomId", game.roomId);
        response.addProperty("totalRounds", game.totalRounds);
        response.addProperty("initialLife", game.initialLife);  
        
        //  プレイヤーリストを追加
        JsonArray playersArray = new JsonArray();
        for (String player : game.players) {
            playersArray.add(player);
        }
        response.add("players", playersArray);  
        
        // ルール情報を追加
        response.add("firstRule", gson.toJsonTree(firstRule));
        response.add("availableRules", gson.toJsonTree(CollectionOfRandRules.getAllRules()));

        // 全プレイヤーに送信
        broadcastToRoom(game.roomId, response);

        System.out.println("📤 GAME_START 送信: players=" + game.players + ", initialLife=" + game.initialLife);

        // ラウンド開始は少し遅らせて送信（クライアントがハンドラ登録する時間を確保）
        game.startTime = System.currentTimeMillis();
        game.state = "ROUND_IN_PROGRESS";
        new Thread(() -> {
            try {
                Thread.sleep(700); // 700ms の猶予
            } catch (InterruptedException e) {
                // ignore
            }
            startRound(game);
        }).start();
    }

    /**
     * ラウンド開始
     */
    private void startRound(GameState game) {
        System.out.println("ラウンド " + game.currentRound + " 開始");

        game.playerNumbers.clear();

        // ラウンドごとにルールを再抽選する（ただし開始時の第1ラウンドは既にセット済みのまま）
        if (game.currentRound == 1) {
            // startGame ですでに firstRule をセットしているため、そのまま使用
        } else {
            messages.ServerMessages.RuleData newRule = null;
            // 生存プレイヤー数をカウント（ライフが0より大きいプレイヤーを生存とみなす）
            int aliveCount = 0;
            for (Map.Entry<String, Integer> e : game.playerLives.entrySet()) {
                if (e.getValue() != null && e.getValue() > 0) aliveCount++;
            }
            // 残存が2人なら必ず ONE_ON_ONE を適用
            if (aliveCount == 2) {
                for (messages.ServerMessages.RuleData r : CollectionOfRandRules.getAllRules()) {
                    if ("ONE_ON_ONE".equals(r.id)) {
                        newRule = r;
                        break;
                    }
                }
            }
            // 上記で取得できなければ通常抽選。ただしONE_ON_ONEが出たら再抽選（生存人数が2を超える場合）
            if (newRule == null) {
                do {
                    newRule = CollectionOfRandRules.getRandomRule();
                } while (aliveCount > 2 && "ONE_ON_ONE".equals(newRule.id));
            }
            game.currentRule = newRule;
        }

        RoundStartResponse response = new RoundStartResponse();
        response.roomId = game.roomId;
        response.currentRound = game.currentRound;
        response.totalRounds = game.totalRounds;
        response.rule = game.currentRule;
        response.timerDuration = game.timerDuration;

        broadcastToRoom(game.roomId, response);
    }

    /**
     * 数値送信処理
     */
    private void handleSubmitNumber(JsonObject jsonMessage, Session session) {
        String userId = jsonMessage.get("userId").getAsString();
        String roomId = jsonMessage.get("roomId").getAsString();
        int num = jsonMessage.get("num").getAsInt();

        // 数値を保存して、全員の提出が揃えば判定を実行
        GameState game = games.get(roomId);
        if (game == null) {
            sendError(session, "ROOM_NOT_FOUND", "Room not found: " + roomId);
            return;
        }

        // 上書きで保存（同一ユーザーの再送対応）
        game.playerNumbers.put(userId, num);
        System.out.println(" 受信: " + userId + " => " + num + " (room=" + roomId + ")");

        // 判定対象は現在『生存している』プレイヤー数（ライフ>0 のプレイヤー）にする
        int expected = 0;
        for (Map.Entry<String, Integer> e : game.playerLives.entrySet()) {
            Integer lv = e.getValue();
            if (lv != null && lv > 0) expected++;
        }
        if (game.playerNumbers.size() >= expected) {
            processRoundResults(roomId);
        }
    }

    private void processRoundResults(String roomId) {
        GameState game = games.get(roomId);
        if (game == null) return;

        // 提出を NumberMessage リストに変換
        List<NumberMessage> submissions = new ArrayList<>();
        for (Map.Entry<String, Integer> e : game.playerNumbers.entrySet()) {
            submissions.add(new NumberMessage(0, e.getKey(), e.getValue()));
        }

        if (submissions.isEmpty()) return;

        // 勝者判定 (ルール情報を渡す)
        Map<String, Object> judgement = ResultJudgement.judgeRound(submissions, game.currentRule);
        double average = (double) judgement.get("average");
        double targetValue = (double) judgement.get("targetValue");
        List<String> winners = (List<String>) judgement.get("winners");
        List<ResultJudgement.PlayerResult> allResults = (List<ResultJudgement.PlayerResult>) judgement.get("allResults");
        Map<String, Integer> penalties = (Map<String, Integer>) judgement.get("penalties");

        // 現在のルール情報（lifeDamage を参照）
        int lifeDamage = 1;
        if (game.currentRule != null) {
            lifeDamage = game.currentRule.lifeDamage;
        }

        // 各プレイヤーに個別結果を送信し、ライフを更新
        for (NumberMessage nm : submissions) {
            String uid = nm.userid;
            boolean isWinner = winners.contains(uid);

            int life = game.playerLives.getOrDefault(uid, game.initialLife);

            // ダメージは「敗北による1」+「ルール違反によるペナルティ」の合計で適用する
            int damage = 0;
            if (!isWinner) damage += 1; // 敗者は1ダメージ
            if (penalties != null && penalties.containsKey(uid)) damage += penalties.get(uid);

            life = life - damage;
            if (life < 0) life = 0;
            game.playerLives.put(uid, life);

            boolean isDead = life <= 0;
            String result = isWinner ? "WIN" : "LOSE";

            // RoundResultMessage の appliedRule は ApplicationServer.RuleMessage を期待するので簡易的に作成
            RuleMessage applied = new RuleMessage(0, game.players.size(), lifeDamage);

            RoundResultMessage rmsg = new RoundResultMessage(
                    roomId,
                    uid,
                    result,
                    targetValue,
                    nm.num,
                    life,
                    isDead,
                    applied
            );

            sendToUser(uid, rmsg);
        }

        // 全員の集計を作成してブロードキャスト
        List<AllPlayersResultMessage.PlayerResultInfo> infos = new ArrayList<>();
        for (ResultJudgement.PlayerResult pr : allResults) {
            int life = game.playerLives.getOrDefault(pr.userId, game.initialLife);
            boolean isDead = life <= 0;
            boolean isWinner = winners.contains(pr.userId);
                int pen = 0;
                if (penalties != null && penalties.containsKey(pr.userId)) {
                pen = penalties.get(pr.userId);
                }
                infos.add(new AllPlayersResultMessage.PlayerResultInfo(
                    pr.userId,
                    pr.number,
                    isWinner ? "WIN" : "LOSE",
                    life,
                    isDead,
                    pen
                ));
        }

        AllPlayersResultMessage allMsg = new AllPlayersResultMessage(
                roomId,
                game.currentRound,
                infos,
                targetValue,
                average
        );

        broadcastToRoom(roomId, allMsg);

        // --- ゲーム終了判定 ---
        // 生存者数をカウント
        int aliveCount = 0;
        String lastAlive = null;
        for (Map.Entry<String, Integer> e : game.playerLives.entrySet()) {
            if (e.getValue() > 0) {
                aliveCount++;
                lastAlive = e.getKey();
            }
        }

        // 全員ライフ0 または 生存者が1名 の場合は早期終了
        boolean earlyEnd = (aliveCount <= 1);

        // 上限ラウンド到達判定（現在のラウンドが totalRounds に達している場合）
        boolean reachedMaxRounds = (game.currentRound >= game.totalRounds);

        if (earlyEnd || reachedMaxRounds) {
            // 最終結果を作成してクライアント毎に送信
            // ランキングを作成（ライフ降順）
            List<Map.Entry<String,Integer>> rankingList = new ArrayList<>(game.playerLives.entrySet());
            rankingList.sort((a,b) -> Integer.compare(b.getValue(), a.getValue()));

            // JSONを直接構築してフロントの期待フォーマットに合わせる
            for (String uid : game.connectedPlayers) {
                boolean isWinner = false;
                if (aliveCount == 1) {
                    isWinner = uid.equals(lastAlive);
                } else if (aliveCount > 1 && reachedMaxRounds) {
                    // maxRounds 到達時: 最高ライフのプレイヤーを勝者とする（同率は勝者扱い）
                    int topLife = rankingList.isEmpty() ? 0 : rankingList.get(0).getValue();
                    int userLife = game.playerLives.getOrDefault(uid, 0);
                    isWinner = userLife == topLife && topLife > 0;
                }

                // ranking 配列を作る
                com.google.gson.JsonObject finalObj = new com.google.gson.JsonObject();
                finalObj.addProperty("type", "FINAL_RESULT");
                finalObj.addProperty("roomId", roomId);
                finalObj.addProperty("isWinner", isWinner);

                com.google.gson.JsonArray rankingArr = new com.google.gson.JsonArray();
                int rank = 1;
                int prevLives = Integer.MIN_VALUE;
                int displayRank = 1;
                for (Map.Entry<String,Integer> re : rankingList) {
                    if (prevLives != Integer.MIN_VALUE && re.getValue() != prevLives) {
                        displayRank = rank;
                    }
                    com.google.gson.JsonObject reObj = new com.google.gson.JsonObject();
                    reObj.addProperty("rank", displayRank);
                    reObj.addProperty("userId", re.getKey());
                    reObj.addProperty("finalLives", re.getValue());
                    rankingArr.add(reObj);
                    prevLives = re.getValue();
                    rank++;
                }
                finalObj.add("ranking", rankingArr);

                // 個別に送信
                sendToUser(uid, finalObj);
            }

            // ゲーム終了後のクリーンアップ
            game.gameStarted = false;
            game.state = "FINISHED";
            games.remove(roomId);
            return; // 処理終了
        }
        // 次ラウンド準備: 送信記録をクリア
        game.playerNumbers.clear();
        // ラウンド番号は外部の NEXT_ROUND で進めるのでここでは増やさない（必要なら処理）
    }

    /**
     * 次のラウンド処理
     */
    private void handleNextRound(JsonObject json, Session session) {
        String roomId = json.get("roomId").getAsString();
        String userId = json.has("userId") ? json.get("userId").getAsString() : (String) session.getUserProperties().get("oderId");
        GameState game = games.get(roomId);
        if (game == null) return;

        synchronized (game) {
            if (userId != null) game.nextRoundReady.add(userId);

            // 参加プレイヤー全員からの合図を待つ（生存プレイヤー数を基準）
            int expected = 0;
            for (Map.Entry<String, Integer> e : game.playerLives.entrySet()) {
                Integer lv = e.getValue();
                if (lv != null && lv > 0) expected++;
            }
            if (game.nextRoundReady.size() >= expected) {
                // 次ラウンド開始
                game.nextRoundReady.clear();
                game.currentRound = Math.min(game.currentRound + 1, game.totalRounds);
                // 少し遅延を入れてクライアントの準備を促す
                new Thread(() -> {
                    try { Thread.sleep(300); } catch (InterruptedException e) {}
                    startRound(game);
                }).start();
            }
        }
    }

    /**
     * デフォルトルール作成
     */
    private messages.ServerMessages.RuleData createDefaultRule() { // ★ 戻り値を明示
        messages.ServerMessages.RuleData rule = new messages.ServerMessages.RuleData();
        rule.id = "rule_08";
        rule.name = "標準ルール";
        rule.description = "平均値の0.8倍に最も近い数値が勝利";
        rule.lifeDamage = 1;
        return rule;
    }

    /**
     * ルーム内の全プレイヤーにブロードキャスト
     */
    private void broadcastToRoom(String roomId, Object message) {
        String json = gson.toJson(message);
        GameState game = games.get(roomId);
        if (game == null) return;

        for (String oderId : game.connectedPlayers) {
            Session session = userSessions.get(oderId);
            if (session != null && session.isOpen()) {
                try {
                    session.getBasicRemote().sendText(json);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    /**
     * セッションにメッセージ送信
     */
    private void sendToSession(Session session, Object message) {
        try {
            session.getBasicRemote().sendText(gson.toJson(message));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * ユーザーIDを指定して送信
     */
    private void sendToUser(String userId, Object message) {
        Session session = userSessions.get(userId);
        if (session == null || !session.isOpen()) return;
        try {
            session.getBasicRemote().sendText(gson.toJson(message));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void sendError(Session session, String errorId, String message) {
        messages.ServerMessages.ErrorResponse err = new messages.ServerMessages.ErrorResponse(errorId, message);
        sendToSession(session, err);
    }

    @OnClose
    public void onClose(Session session) {
        sessions.remove(session);
        String oderId = (String) session.getUserProperties().get("oderId");
        if (oderId != null) {
            userSessions.remove(oderId);
        }
        System.out.println("🔌 ゲームサーバ切断: " + session.getId());
    }

    @OnError
    public void onError(Session session, Throwable throwable) {
        System.err.println("❌ エラー: " + throwable.getMessage());
    }

    // JOIN_GAME成功レスポンス
    private static class JoinGameSuccessResponse {
        public String type = "JOIN_GAME_SUCCESS";
        public String roomId;
        public List<String> connectedPlayers;

        public JoinGameSuccessResponse(String roomId, List<String> connectedPlayers) {
            this.roomId = roomId;
            this.connectedPlayers = connectedPlayers;
        }
    }
}