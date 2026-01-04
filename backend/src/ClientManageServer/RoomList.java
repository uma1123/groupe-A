package ClientManageServer;

import java.util.ArrayList;
import java.util.List;

/**
 * RoomList class - ルームリストを管理するクラス
 */
class RoomList {
    private List<Room> roomList;
    private int nextRoomId;

    /**
     * コンストラクタ
     */
    public RoomList() {
        this.roomList = new ArrayList<>();
        this.nextRoomId = 1;
    }

    /**
     * 新しいルームを追加
     */
    public Room addRoom(int numOfPlayer, int numOfLife, String roomOwner) {
        int roomId = setRoomId();
        Room newRoom = new Room(roomId, numOfPlayer, numOfLife, roomOwner);
        roomList.add(newRoom);
        return newRoom;
    }

    /**
     * ルームを削除
     */
    public boolean deleteRoom(int roomId) {
        return roomList.removeIf(room -> room.getRoomId() == roomId);
    }

    /**
     * ルームIDを割り当てる
     */
    public int setRoomId() {
        return nextRoomId++;
    }

    /**
     * ルームIDでルームを検索
     */
    public Room findRoomById(int roomId) {
        for (Room room : roomList) {
            if (room.getRoomId() == roomId) {
                return room;
            }
        }
        return null;
    }

    /**
     * すべてのルームを取得
     */
    public List<Room> getAllRooms() {
        return new ArrayList<>(roomList);
    }

    /**
     * 参加可能なルームを取得
     */
    public List<Room> getAvailableRooms() {
        List<Room> availableRooms = new ArrayList<>();
        for (Room room : roomList) {
            if (!room.isFull()) {
                availableRooms.add(room);
            }
        }
        return availableRooms;
    }
}

/**
 * User class - ユーザー情報を管理するクラス（参考用）
 */
class User {
    private String userId;
    private String userName;
    private int life;

    public User(String userId, String userName) {
        this.userId = userId;
        this.userName = userName;
    }

    public String getUserId() {
        return userId;
    }

    public String getUserName() {
        return userName;
    }

    public int getLife() {
        return life;
    }

    public void setLife(int life) {
        this.life = life;
    }

    public void decreaseLife() {
        if (life > 0) {
            life--;
        }
    }

    public boolean isAlive() {
        return life > 0;
    }
}
