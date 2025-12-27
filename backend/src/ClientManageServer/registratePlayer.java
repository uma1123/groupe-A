package ClientManageServer;

import java.util.List;

public class registratePlayer {

    JoinRequest request;
    int targetId = request.getRoomId();
    String userId = request.getUserId();

    public void registrate() {
        List<Room> allRooms = addRoom.getRoomList();
        for (Room room : allRooms) {
            if (room.getRoomId() == targetId)
                // 参加処理
                room.addMember(userId);
        }
    }

}
