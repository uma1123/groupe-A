package ClientManageServer;

public class GameManager {
    private roomService service = new roomService();
    private AccountManager account = new AccountManager();

    public String handleAction(BaseMessage msg) {
        // 1. まずメッセージの種類(type)をチェック
        String type = msg.getType();

        // 2. typeに応じて、msgを具体的な子クラスにキャストして処理する
        if (type.equals("CREATE_ROOM")) {
            // CreateMessageに変換（キャスト）
            CreateMessage cMsg = (CreateMessage) msg;
            Room newRoom = service.addRoom(cMsg.getNumOfPlayer(), cMsg.getNumOfLife(), cMsg.getUserId());
            return "" + newRoom.getRoomId();

        } else if (type.equals("JOIN_ROOM")) {
            // JoinMessageに変換（キャスト）
            JoinMessage jMsg = (JoinMessage) msg;
            return service.joinProcess(jMsg.getRoomId(), jMsg.getUserId());

        } else if (type.equals("REMOVE_ROOM")) {
            // RemoveMessageに変換（キャスト）
            RemoveMessage rMsg = (RemoveMessage) msg;
            return service.removePlayer(rMsg.getRoomId(), rMsg.getUserId());

        } else if (type.equals("LOGIN")) {
            LoginMessage loginMsg = (LoginMessage) msg;
            if (account.login(loginMsg.getUserId(), loginMsg.getPassword())) {
                return "ログイン成功";
            } else {
                return "ログイン失敗";
            }

        } else if (type.equals("LOGOUT")) {
            LogoutMessage logoutMsg = (LogoutMessage) msg;
            if (account.logout(logoutMsg.getUserId())) {
                return "ログアウト成功";
            } else {
                return "ログアウト失敗";
            }

        } else if (type.equals("SIGNUP")) {
            SignUpMessage sMsg = (SignUpMessage) msg;
            if (account.registrateNewAccount(sMsg.getUserId(), sMsg.getPassword())) {
                return "アカウントを登録しました";
            } else {
                return "登録に失敗しました";
            }
        }

        return "Unknown action: " + type;
    }
}