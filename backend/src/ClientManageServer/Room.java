package ClientManageServer;

import java.util.ArrayList;
import java.util.List;

public class Room {
    int roomId;
    int numOfPlayer; // 最大参加人数
    int numOfLife;   // ゲーム内のライフ設定
    String roomOwner;
    List<String> roomPlayerList; // 本来はUserクラスですが、簡略化のためStringリストとしています

    public Room(int roomId, int numOfPlayer, int numOfLife) {
        this.roomId = roomId;
        this.numOfPlayer = numOfPlayer;
        this.numOfLife = numOfLife;
        this.roomPlayerList = new ArrayList<>();
    }
}