package ApplicationServer;

public class GameStartMessage extends ApplicationEndpoint.BaseMessage {
    int roomid;

    public GameStartMessage(int roomid) {
        this.roomid = roomid;
    }
}

