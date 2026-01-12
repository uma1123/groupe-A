package ClientManageServer;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class roomService {

    // スレッドセーフなリストに変更
    private List<Room> roomList = Collections.synchronizedList(new ArrayList<>());
    private List<Integer> idPool = Collections.synchronizedList(new ArrayList<>());

    //ルームIDを作成する
    public synchronized void createRoomId() {
        if (!idPool.isEmpty()) return; // すでにあったら作らない
        int min = 1000;
        int max = 9999;
        for (int i = min; i <= max; i++) {
            idPool.add(i);
        }
        Collections.shuffle(idPool);
    }


//ルームを追加する
    public synchronized Room addRoom(int numOfPlayer, int numOfLife, String roomOwner) {
        if (idPool.isEmpty()) {
            createRoomId();
        }

        int roomId = idPool.remove(0);
        Room newRoom = new Room(roomId, numOfPlayer, numOfLife, roomOwner);
        roomList.add(newRoom);
        return newRoom;
    }

    // ルームを完全に削除するメソッド（重要！）
    public synchronized void deleteRoom(int roomId) {
        Room room = findRoom(roomId);
        if (room != null) {
            roomList.remove(room);
            idPool.add(roomId); // IDをプールに戻す
        }
    }
//ルーム検索
    public Room findRoom(int roomId) {
        // synchronizedListの検索はコピーまたはsynchronizedブロック内で行うのが安全
        synchronized (roomList) {
            for (Room r : roomList) {
                if (r.getRoomId() == roomId) return r;
            }
        }
        return null;
    }

    //満員チェック
    public boolean isRoomFull(int roomId) {
        Room room = findRoom(roomId);
        if (room == null) return false;
        return room.getCorrentPlayer() >= room.getNumOfPlayer();
    }

    //ルームに参加する
    public String joinProcess(int roomId,String userId) {

        Room room = findRoom(roomId);

    // 1. 存在チェック
        if (room == null) return "ルームが見つかりません";
    // 2. 人数チェック
        if (isRoomFull(roomId)) return "満員です";
    // 3. 登録処理
        room.getPlayerList().add(userId);
        return "参加成功";
    }

    public String removePlayer(int getRoomId,String userId) {
        Room room = findRoom(getRoomId);
        if (room == null) return "ルームが見つかりません";

        room.getPlayerList().remove(userId);

        // もしプレイヤーが誰もいなくなったらルームを削除する
        if (room.getCorrentPlayer() == 0) {
            deleteRoom(room.getRoomId());
            return "退出しました（ルームを解散しました）";
        }

        return "退出しました";
    }
}