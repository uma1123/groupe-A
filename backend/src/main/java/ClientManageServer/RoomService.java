package ClientManageServer;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

// ルーム管理サービスクラス
public class RoomService {
    private Map<Integer, Room> rooms = new ConcurrentHashMap<>();
    private AtomicInteger roomIdCounter = new AtomicInteger(1);

    /**
     * ルーム作成
     */
    public Room createRoom(String ownerId, int maxPlayers, int initialLife) {
        int roomId = roomIdCounter.getAndIncrement();
        Room room = new Room(roomId, maxPlayers, initialLife);
        room.addPlayer(ownerId); // オーナーを最初のプレイヤーとして追加
        rooms.put(roomId, room);
        System.out.println("ルーム作成: ID=" + roomId + ", オーナー=" + ownerId);
        return room;
    }

    /**
     * ルーム取得（int型）
     */
    public Room getRoom(int roomId) {
        return rooms.get(roomId);
    }

    /**
     * ルーム取得（String型）
     */
    public Room getRoom(String roomIdStr) {
        try {
            int roomId = Integer.parseInt(roomIdStr);
            return rooms.get(roomId);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    /**
     * ルーム削除
     */
    public void removeRoom(int roomId) {
        rooms.remove(roomId);
        System.out.println("ルーム削除: ID=" + roomId);
    }

    /**
     * ルーム存在確認
     */
    public boolean exists(int roomId) {
        return rooms.containsKey(roomId);
    }
}
