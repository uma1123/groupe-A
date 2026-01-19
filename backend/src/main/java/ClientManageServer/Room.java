package ClientManageServer;

import java.util.ArrayList;
import java.util.List;

// ルーム情報クラス
public class Room {
    private int roomId;
    private int maxPlayers;
    private int initialLife;
    private List<String> players;

    public Room(int roomId, int maxPlayers, int initialLife) {
        this.roomId = roomId;
        this.maxPlayers = maxPlayers;
        this.initialLife = initialLife;
        this.players = new ArrayList<>();
    }

    public int getRoomId() {
        return roomId;
    }

    public int getMaxPlayers() {
        return maxPlayers;
    }

    public int getInitialLife() {
        return initialLife;
    }

    public List<String> getPlayers() {
        return players;
    }

    public int getPlayerCount() {
        return players.size();
    }

    public boolean addPlayer(String userId) {
        if (players.size() >= maxPlayers) {
            return false;
        }
        if (!players.contains(userId)) {
            players.add(userId);
        }
        return true;
    }

    public void removePlayer(String userId) {
        players.remove(userId);
    }

    public boolean isFull() {
        return players.size() >= maxPlayers;
    }
}