package ApplicationServer;

// ルールデータを表すクラス
public class RuleData {
    public String id;
    public String name;
    public String description;
    public String multiplierLabel;
    public int lifeDamage;

    public RuleData() {}

    public RuleData(String id, String name, String description, int lifeDamage) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.lifeDamage = lifeDamage;
        this.multiplierLabel = "0.8";
    }
}