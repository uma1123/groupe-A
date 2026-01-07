package ClientManageServer;

public class ClientManageCom {

    static String contextRoot = "/app";
    static String protocol = "ws";
    static int port = 8080;


    public static void main(String[] args) throws Exception {
        Server server = new Server(protocol, port, contextRoot, null, EndpointSample.class/*, EndpointExample.class*/);
        System.out.println("server: " + server);

        try {
            server.start();
            System.in.read();
        } finally {
            server.stop();
        }
    }

    WebSocketServerSample() { }
}
