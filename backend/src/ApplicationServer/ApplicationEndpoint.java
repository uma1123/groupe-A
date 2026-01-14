package ApplicationServer;

import com.google.gson.Gson;
import jakarta.websocket.*;
import jakarta.websocket.server.ServerEndpoint;

import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

public enum MessageType{
    START_GAME,
    SUBMIT_NUMBER,
    PLAYER_INFO,
    GAME_RESULT,
    ROUND_RESULT,
    GAME_RULE
}

@ServerEndpoint("/sample")

public class ApplicationEndpoint {
    private static Set<Session> establishedSessions
            = Collections.synchronizedSet(new HashSet<Session>());

    private int privateIncrementTest = 0;
    private static int staticIncrementTest = 0;

    static Gson gson = new Gson();

    @OnOpen
    public void onOpen(Session session, EndpointConfig ec) {
        establishedSessions.add(session);
        System.out.println("[WebSocketServerSample] onOpen:" + session.getId());
    }


    @OnMessage
    public void onMessage(final String message, final Session session) throws IOException {
        System.out.println("[WebSocketServerSample] onMessage from (session: " + session.getId() + ") msg: " + message);
        this.privateIncrementTest++;
        EndpointSample.staticIncrementTest++;

        //Typeを読み取るために仮置きクラスに送られてきたメッセージを保存
        //Jsonで送られてきたString文をBaseMessageクラスに変換
        BaseMessage receivedMessage = gson.fromJson(message,BaseMessage.class);
        //switchで処理方法を区別
        switch (receivedMessage.type){
            case START_GAME:
                GameStartMessage gameStartMessage = gson.fromJson(message,GameStartMessage.class);
                //ゲームスタート時の処理をここに追加

                break;

            case SUBMIT_NUMBER:
                NumberMessage numberMessage = gson.fromJson(message,NumberMessage.class);
                //数字受信時の処理をここに追加

                break;

            case PLAYER_INFO:
                PlayerInfoMessage playerInfoMessage = gson.fromJson(message,PlayerInfoMessage.class);
                //プレイヤー情報受信時の処理をここに追加

                break;

            case GAME_RESULT:
                ResultMessage resultMessage = gson.fromJson(message,ResultMessage.class);
                //ゲーム結果送信時の処理をここに追加

                break;

            case ROUND_RESULT:
                RoundResultMessage roundResultMessage = gson.fromJson(message,RoundResultMessage.class);
                //ラウンド結果送信時の処理をここに追加

                break;

            case GAME_RULE:
                RuleMessage ruleMessage = gson.fromJson(message,RuleMessage.class);
                //ルール受信時の処理をここに追加

                break;
        }

    }


    @OnClose
    public void onClose(Session session) {
        System.out.println("[WebSocketServerSample] onClose:" + session.getId());
        establishedSessions.remove(session);
    }

    @OnError
    public void onError(Session session, Throwable error) {
        System.out.println("[WebSocketServerSample] onError:" + session.getId());
    }

    /*public void sendMessage(Session session, String message) {
        System.out.println("[WebSocketServerSample] sendMessage(): " + message);
        try {
            // 同期送信（sync）
            session.getBasicRemote().sendText(message);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void sendBroadcastMessage(String message) {
        System.out.println("[WebSocketServerSample] sendBroadcastMessage(): " + message);
        establishedSessions.forEach(session -> {
            // 非同期送信（async）
            session.getAsyncRemote().sendText(message);
        });
    }

     */

    //json型メッセージ仮置きクラス
    public class BaseMessage{
        public MessageType type;
    }





}
