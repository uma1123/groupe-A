package ClientManageServer;

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
            case "LOGIN":
                if(account.login(msg.getUserId(), msg.getPassword()))
                    return "ログイン成功";
            case "LOGOUT":
                if(account.logout(msg.getUserId()))
                    return "ログアウト成功";
            case "REGI":
                if(account.registrateNewAccount(msg.getUserId(), msg.getPassword()))
                    return "アカウントを登録しました";
            default:
                return "Unknown action: " + action;
        }
    }
}