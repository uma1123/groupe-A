package ApplicationServer;

// ラウンド結果メッセージ
public class RoundResultMessage {
    public String type = "ROUND_RESULT";
    public String roomId;
    public String userId;
    public String roundResult; // "WIN" | "LOSE" | "DRAW"
    public double targetValue; // 平均×0.8
    public int yourNumber;
    public int newLife;
    public boolean isDead;
    public RuleMessage appliedRule;

    public RoundResultMessage(String roomId, String userId, String roundResult, 
                            double targetValue, int yourNumber, int newLife, 
                            boolean isDead, RuleMessage appliedRule) {
        this.roomId = roomId;
        this.userId = userId;
        this.roundResult = roundResult;
        this.targetValue = targetValue;
        this.yourNumber = yourNumber;
        this.newLife = newLife;
        this.isDead = isDead;
        this.appliedRule = appliedRule;
    }
}

