package ClientManageServer;

import java.util.List;

public class checkNumOfPlayer {

    // 実際に処理を行うメソッド
    public void executeCheck() {
        // 1. 他サーバから届いたリクエスト(JoinRequest)を準備
        // 本来は引数で受け取るか、Springが自動生成します
        JoinRequest request = new JoinRequest();
        int targetId = request.getRoomId();

        // 2. サーバーが管理しているルームリストを取得
        List<Room> roomList = addRoom.getRoomList();
        // 3. リストの中から、IDが一致するRoomを探す
        for (Room room : roomList) {
            if (room.getRoomId() == targetId) {
                // 4. 一致したRoomから現在の人数を取得
                //ルームクラスで処理を行いたい
                room.checkNumOfPlayer(targetId);
            }
        }
    }

}
