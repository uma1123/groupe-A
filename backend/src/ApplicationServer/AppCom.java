package ApplicationServer;

import org.glassfish.tyrus.server.Server;

public class AppCom {
    static String contextRoot = "/app";
    static String protocol = "ws";
    static int port = 8080;


    public static void main(String[] args) throws Exception {
        Server server = new Server(protocol, port, contextRoot, null, AppCom.class/*, EndpointExample.class*/);
        System.out.println("numserver: " + server);


        try {
            server.start();
            System.in.read();
        } finally {
            server.stop();
        }
    }

    AppCom(){

    }
}
