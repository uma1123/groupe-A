package ClientManageServer;

import java.util.ArrayList;
import java.util.List;

public class Room {
    private int roomId;
    private int numOfPlayer;
    private int numOfLife;
    private String roomOwner;
    private List<User> roomPlayerList;

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

     //ルームが満員かチェック
    public boolean isFull() {
        return roomPlayerList.size() >= numOfPlayer;
    }

     //現在のプレイヤー数を取得
    public int getCurrentPlayerCount() {
        return roomPlayerList.size();
    }
}
