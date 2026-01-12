package ApplicationServer;

import org.glassfish.tyrus.server.Server;

public class AppCom {
    static String contextRoot = "/app";
    static String protocol = "ws";
    static int port = 8080;


    public static void main(String[] args) throws Exception {
        //数字受け取りエンドポイント
        Server numserver = new Server(protocol, port, contextRoot, num, AppCom.class/*, EndpointExample.class*/);
        System.out.println("numserver: " + numserver);
        //プレイヤー情報受信エンドポイント
        Server playerinfoserver = new Server(protocol, port, contextRoot, playerinfo, AppCom.class/*, EndpointExample.class*/);
        System.out.println("playerinfoserver: " + playerinfoserver);
        //ゲーム開始受信エンドポイント
        Server startserver = new Server(protocol, port, contextRoot, start, AppCom.class/*, EndpointExample.class*/);
        System.out.println("startserver: " + startserver);
        //ルール情報受信エンドポイント
        Server ruleserver = new Server(protocol, port, contextRoot, rule, AppCom.class/*, EndpointExample.class*/);
        System.out.println("ruleserver: " + ruleserver);
        //勝敗送信エンドポイント
        Server resultserver = new Server(protocol, port, contextRoot, result, AppCom.class/*, EndpointExample.class*/);
        System.out.println("resultserver: " + resultserver);
        //結果送信エンドポイント
        Server judgeserver = new Server(protocol, port, contextRoot, rule, AppCom.class/*, EndpointExample.class*/);
        System.out.println("judgeserver: " + judgeserver);

        try {
            numserver.start();
            playerinfoserver.start();
            startserver.start();
            ruleserver.start();
            resultserver.start();
            judgeserver.start();
            System.in.read();
        } finally {
            numserver.stop();
            playerinfoserver.stop();
            startserver.stop();
            ruleserver.stop();
            resultserver.stop();
            judgeserver.stop();
        }
    }

    AppCom(){

    }
}
