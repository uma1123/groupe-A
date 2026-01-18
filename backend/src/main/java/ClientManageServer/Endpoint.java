/*削除予定(1/15)
package ClientManageServer;

import com.google.gson.Gson;

import jakarta.websocket.*;

import jakarta.websocket.Session; // これに差し替える
import jakarta.websocket.server.ServerEndpoint;

import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

@ServerEndpoint("/sample")
public class Endpoint {
    private static final GameManager gameManager = new GameManager();
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
        System.out.println("[WebSocketServerSample] 受信: " + message);

        try {
            // --- 手順1: まずは type だけ読み取る ---
            BaseMessage temp = gson.fromJson(message, BaseMessage.class);
            String type = temp.getType();

            // --- 手順2: type に応じて、正しい子クラスとして読み直す ---
            // これをしないと、userId や password などのデータが消えてしまいます
            BaseMessage receivedMessage;
            if ("LOGIN".equals(type)) {
                receivedMessage = gson.fromJson(message, LoginMessage.class);
            } else if ("JOIN_ROOM".equals(type)) {
                receivedMessage = gson.fromJson(message, JoinMessage.class);
            } else if ("CREATE_ROOM".equals(type)) {
                receivedMessage = gson.fromJson(message, CreateMessage.class);
            } else if ("LOGOUT".equals(type)) {
                receivedMessage = gson.fromJson(message, LogoutMessage.class);
            } else if ("SIGNUP".equals(type)) {
                receivedMessage = gson.fromJson(message, SignUpMessage.class);
            } else if ("REMOVE_ROOM".equals(type)) {
                receivedMessage = gson.fromJson(message, RemoveMessage.class);
            } else {
                receivedMessage = temp; // 該当なし
            }

            // --- 手順3: GameManagerで処理 ---
            String result = gameManager.handleAction(receivedMessage);

            // --- 手順4: 結果を送信者に返信 ---
            // result が String ならそのまま、Object なら gson.toJson() を使う
            sendMessage(session, result);

        } catch (Exception e) {
            e.printStackTrace();
            sendMessage(session, "サーバーでエラーが発生しました");
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

    public void sendMessage(Session session, String message) {
        System.out.println("[WebSocketServerSample] sendMessage(): " + message);
        try {
            // 同期送信（sync）
            session.getBasicRemote().sendText(message);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
*/
