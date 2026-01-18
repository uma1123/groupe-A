package ApplicationServer;

public class RandRule {
    private String name;
    private String descriprion;
    private int lifeDamage;

    public RandRule(String name, String descriprion, int lifeDamage) {
        this.name = name;
        this.descriprion = descriprion;
        this.lifeDamage = lifeDamage;
    }

    public String getName() { return name; }
    public String getDescriprion() { return descriprion; }
    public int getLifeDamage() { return lifeDamage; }

    // ★ 追加: RuleLottery で使用
    public String getRandRuleId() { return name; }
}
