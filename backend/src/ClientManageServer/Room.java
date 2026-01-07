package ClientManageServer;

import java.util.ArrayList;
import java.util.List;

public class Room {
    int roomId;
    int numOfPlayer;
    int numOfLife;
    String roomOwner;
    List<User> roomPlayerList;

    //コンストラクタ

    public Room(int roomId, int numOfPlayer, int numOfLife, String roomOwner) {
        this.roomId = roomId;
        this.numOfPlayer = numOfPlayer;
        this.numOfLife = numOfLife;
        this.roomOwner = roomOwner;
        this.roomPlayerList = new ArrayList<>();
    }

    // プレイヤーをルームに追加
    public boolean addPlayer(User user) {
        if (roomPlayerList.size() < numOfPlayer) {
            roomPlayerList.add(user);
            return true;
        }
        return false;
    }



    // プレイヤーをルームから削除
    public boolean removePlayer(User user) {
        return roomPlayerList.remove(user);
    }

    // ルームIDを取得
    public int getRoomId() {
        return roomId;
    }

    // ルームが満員かチェック
    public boolean isFull() {
        return roomPlayerList.size() >= numOfPlayer;
    }

}
