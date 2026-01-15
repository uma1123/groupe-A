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
import ClientManageServer.ClientManageEndpoint;
import ApplicationServer.GameEndpoint;

public class Main {
    public static void main(String[] args) throws Exception {
        // クライアント管理サーバ（ポート8080）
        Server clientManageServer = new Server(
                "localhost", 8080, "/app", null,
                ClientManageEndpoint.class
        );

        // ゲームサーバ（ポート8081）
        Server gameServer = new Server(
                "localhost", 8081, "/app", null,
                GameEndpoint.class
        );

        try {
            clientManageServer.start();
            System.out.println("✅ クライアント管理サーバ起動: ws://localhost:8080/app/client-manage");

            gameServer.start();
            System.out.println("✅ ゲームサーバ起動: ws://localhost:8081/app/game");

            System.out.println("\n🎮 サーバ稼働中... Enterキーで終了");
            System.in.read();
        } finally {
            clientManageServer.stop();
            gameServer.stop();
        }
    }
}