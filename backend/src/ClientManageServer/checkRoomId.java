package ClientManageServer;


import java.util.List;

public String checkRoomId(int inputRoomId) {
    List<Room> roomList = addRoom.getRoomList();

    for (Room room : roomList) {
        // RoomオブジェクトからIDだけを取り出して比較
        int currentId = room.getRoomId();

        if (currentId == inputRoomId) {

            return "ルームが見つかりました"; // 見つかったら即座に終了
        }
    }

    // ループが終わっても見つからなかった場合
    return "ルームが見つかりません";
}
