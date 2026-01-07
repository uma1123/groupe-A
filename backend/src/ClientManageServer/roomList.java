package ClientManageServer;

import java.util.ArrayList;
import java.util.List;


/**
 * RoomList class - ルームリストを管理するクラス
 */
class roomList {
    private List<Room> roomList;
    private int nextRoomId;

    /**
     * コンストラクタ
     */
    public roomList() {
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


}