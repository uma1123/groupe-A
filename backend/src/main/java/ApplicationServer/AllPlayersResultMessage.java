package ApplicationServer;

import java.util.List;

public class AllPlayersResultMessage {
    public String type = "ALL_PLAYERS_RESULT";
    public String roomId;
    public int currentRound;
    public List<PlayerResultInfo> results;
    public double targetValue;
    public double average;

    public AllPlayersResultMessage(String roomId, int currentRound,
                                   List<PlayerResultInfo> results,
                                   double targetValue, double average) {
        this.roomId = roomId;
        this.currentRound = currentRound;
        this.results = results;
        this.targetValue = targetValue;
        this.average = average;
    }

    public static class PlayerResultInfo {
        public String userId;
        public int number;
        public String result; // "WIN" | "LOSE" | "DRAW"
        public int lives;
        public boolean isDead;

        public PlayerResultInfo(String userId, int number, String result,
                                int lives, boolean isDead) {
            this.userId = userId;
            this.number = number;
            this.result = result;
            this.lives = lives;
            this.isDead = isDead;
        }
    }
}