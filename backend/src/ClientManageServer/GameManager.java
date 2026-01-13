package ClientManageServer;

import jakarta.websocket.Session;

public class GameManager {
    private roomService service = new roomService();

    private AccountManager account = new AccountManager();

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
            case "REGI":
                return account.login(msg.getUserId(), msg.getPassword());

            default:
                return "Unknown action: " + action;
        }
    }
}