package ApplicationServer;

import java.util.ArrayList;
import java.util.List;

public class PlayerList {
    private List<Player> playerlist;

    public PlayerList(){
        this.playerlist=new ArrayList<>();
    }

    //プレイヤー追加
    public boolean SavePlayerInfo(Player player) {
        this.playerlist.add(player);
        return true;
    }

    //プレイヤー削除
    public boolean DeletePlayer(String userID) {
        return this.playerlist.removeIf(p->p.userid.equals(userID));
    }

    //ライフ減算
    //ダメージは基本1であるが、ランダムルール追加に向けて拡張性を持たせるために実装
    public void SubLife(Player player,int damage){
        player.life -= damage;
    }

    //生存確認
    public boolean isAlive(String userID){
        //引数で指定されたIDをプレイヤーリスト内で検索
        for(Player p:this.playerlist){
            if(p.userid.equals(userID)) {
                //発見したらライフが0以下でfalse、そうでなければtrueを返す
                return p.life>0;
            }
        }
        //指定されたuseridのプレイヤーが見つからなかった場合falseを返す
        return false;
    }

    // プレイヤーリスト取得
    public List<Player> getPlayerList() {
        return this.playerlist;
    }
}
