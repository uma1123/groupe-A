package ClientManageServer;

import java.util.ArrayList;
import java.util.List;

public class Room {
    int roomId;
    int numOfPlayer; // 最大参加人数
    int numOfLife;   // ゲーム内のライフ設定
    String roomOwner;
    List<String> roomPlayerList; // 本来はUserクラスですが、簡略化のためStringリストとしています

    public Room(int roomId, int numOfPlayer, int numOfLife, String roomOwner) {
        this.roomId = roomId;
        this.numOfPlayer = numOfPlayer;
        this.numOfLife = numOfLife;
        this.roomPlayerList = new ArrayList<>();
        this.roomOwner= roomOwner;
    }

    public int getRoomId()
    {
        return roomId;
    }
    public int getNumOfPlayer()
    {
        return numOfPlayer;
    }

    public int getCorrentPlayer()
    {
        return roomPlayerList.size();
    }
public String getRoomOwner()
{return roomOwner;}
    public List getPlayerList()
    {
        return roomPlayerList;
    }

    public void setRoomId(int roomId)
    {
        this.roomId=roomId;
    }

    public void setNumOfPlayer(int num)
    {
        this.numOfPlayer=num;
    }
    public void setNumOfLife(int life)
    {
        this.numOfLife=life;
    }
}