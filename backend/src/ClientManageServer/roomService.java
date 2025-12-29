package ClientManageServer;

import org.springframework.stereotype.Service; // ★必要！
import java.util.ArrayList;
import java.util.List;

@Service
public class roomService {

    private List<Room> roomList = new ArrayList<>();

    //ルーム検索(見つけたroomを返す)
    public Room findRoom(int roomId) {
        for (Room r : roomList) {
            if (r.getRoomId() == roomId) return r;
        }
        return null;
    }

    public boolean isRoomFull(int roomId) {
        Room room = findRoom(roomId);
        if (room == null) return false;
        return room.getCorrentPlayer() >= room.getNumOfPlayer();
    }

    public String joinProcess(JoinRequest request) {
        Room room = findRoom(request.getRoomId());

        // 1. 存在チェック
        if (room == null) return "ルームが見つかりません";

        // 2. 人数チェック
        if (isRoomFull(request.getRoomId())) return "満員です";

        // 3. 登録処理
        room.getPlayerList().add(request.getUserId());
        return "参加成功";
    }
}