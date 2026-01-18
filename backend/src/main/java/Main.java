////TIP コードを<b>実行</b>するには、<shortcut actionId="Run"/> を押すか
//// ガターの <icon src="AllIcons.Actions.Execute"/> アイコンをクリックします。
//public class Main {
//    public static void main(String[] args) {
//        //TIP ハイライトされたテキストにキャレットがある状態で <shortcut actionId="ShowIntentionActions"/> を押すと
//        // IntelliJ IDEA によるその修正案を確認できます。
//        System.out.printf("Hello and welcome!");
//
//        for (int i = 1; i <= 5; i++) {
//            //TIP <shortcut actionId="Debug"/> を押してコードのデバッグを開始します。<icon src="AllIcons.Debugger.Db_set_breakpoint"/> ブレークポイントを 1 つ設定しましたが、
//            // <shortcut actionId="ToggleLineBreakpoint"/> を押すといつでも他のブレークポイントを追加できます。
//            System.out.println("i = " + i);
//        }
//    }
//}
import org.glassfish.tyrus.server.Server;
import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpExchange;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonArray;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

import ClientManageServer.ClientManageEndpoint;
import ApplicationServer.GameEndpoint;

public class Main {

    public static void main(String[] args) {
        // クライアント管理サーバ（WebSocket: 8080）
        Server clientManageServer = new Server(
            "localhost", 8080, "/app", null,
            ClientManageEndpoint.class
        );

        // アプリケーションサーバ（WebSocket: 8081）
        Server gameServer = new Server(
            "localhost", 8081, "/app", null,
            GameEndpoint.class
        );

        try {
            // WebSocketサーバ起動
            clientManageServer.start();
            System.out.println("✅ クライアント管理サーバ起動: ws://localhost:8080/app/client-manage");

            gameServer.start();
            System.out.println("✅ ゲームサーバ起動: ws://localhost:8081/app/game");

            // HTTPサーバ起動（ゲーム初期化API用）
            startHttpServer();

            System.out.println("サーバー稼働中... Enterキーで終了");
            System.in.read();

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            clientManageServer.stop();
            gameServer.stop();
        }
    }

    /**
     * HTTPサーバを起動（ゲーム初期化API）
     */
    private static void startHttpServer() throws IOException {
        HttpServer httpServer = HttpServer.create(new InetSocketAddress(8082), 0);
        
        httpServer.createContext("/api/init-game", exchange -> {
            // CORSヘッダー
            exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "POST, OPTIONS");
            exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");

            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(200, -1);
                return;
            }

            if ("POST".equals(exchange.getRequestMethod())) {
                handleInitGame(exchange);
            } else {
                exchange.sendResponseHeaders(405, -1);
            }
        });

        httpServer.setExecutor(null);
        httpServer.start();
        System.out.println("✅ HTTP API起動: http://localhost:8082/api/init-game");
    }

    /**
     * ゲーム初期化リクエスト処理
     */
    private static void handleInitGame(HttpExchange exchange) throws IOException {
        try {
            // リクエストボディを読み取り
            InputStream is = exchange.getRequestBody();
            String body = new String(is.readAllBytes(), StandardCharsets.UTF_8);
            System.out.println("📥 INIT_GAME 受信: " + body);

            Gson gson = new Gson();
            JsonObject json = JsonParser.parseString(body).getAsJsonObject();

            // ゲーム初期化情報を GameEndpoint に保存
            GameEndpoint.GameInitInfo info = new GameEndpoint.GameInitInfo();
            info.roomId = String.valueOf(json.get("roomId").getAsInt());
            info.maxPlayers = json.get("maxPlayers").getAsInt();
            info.initialLife = json.get("initialLife").getAsInt();
            
            info.players = new ArrayList<>();
            JsonArray playersArray = json.getAsJsonArray("players");
            for (int i = 0; i < playersArray.size(); i++) {
                info.players.add(playersArray.get(i).getAsString());
            }

            // ★ GameEndpoint の static Map に直接保存
            GameEndpoint.pendingGames.put(info.roomId, info);
            System.out.println("✅ ゲーム初期化情報保存: roomId=" + info.roomId + ", players=" + info.players);

            // 成功レスポンス
            String response = "{\"status\":\"ok\",\"roomId\":\"" + info.roomId + "\"}";
            exchange.getResponseHeaders().add("Content-Type", "application/json");
            exchange.sendResponseHeaders(200, response.getBytes().length);
            OutputStream os = exchange.getResponseBody();
            os.write(response.getBytes());
            os.close();

        } catch (Exception e) {
            e.printStackTrace();
            String error = "{\"status\":\"error\",\"message\":\"" + e.getMessage() + "\"}";
            exchange.sendResponseHeaders(500, error.getBytes().length);
            OutputStream os = exchange.getResponseBody();
            os.write(error.getBytes());
            os.close();
        }
    }
}