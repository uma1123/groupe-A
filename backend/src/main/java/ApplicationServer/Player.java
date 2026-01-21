package ApplicationServer;

// プレイヤー情報を表すクラス
public class Player {
    public String userid;
    public int life;
    public int selectednum;

    public Player(String userid,int life){
        this.userid=userid;
        this.life=life;
        /*例外値=-1*/
        this.selectednum=-1;
    }
    public void setNumber(int selectednum){
        this.selectednum=selectednum;
    }
}
