package ClientManageServer;

import jakarta.websocket.Session;

public class GameManager {
    private roomService service = new roomService();

    public String handleAction(Message msg) {
        String action = msg.getAction();

        switch (action) {
            case "CREATE":
                //ユーザIDはオーナーのID
                Room newRoom = service.addRoom(msg.getNumOfPlayer(), msg.getNumOfLife(), msg.getUserId());
                return "" + newRoom.getRoomId();

            case "JOIN":
                return service.joinProcess(msg.getRoomId(), msg.getUserId());

            case "REMOVE":
                return service.removePlayer(msg.getRoomId(), msg.getUserId());

            default:
                return "Unknown action: " + action;
        }
    }
}