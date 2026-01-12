package ApplicationServer;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class ResultJudgement {
    double result;
    double average;
    double ratio;
    void manageLife(String ruleId,PlayerList pl){
        /*プレイヤーが2人のとき専用ルールに変更*/
        if(pl.getPlayerList().size()==2){
            ruleId="ONE_ON_ONE";
        }
        switch (ruleId){
            case "RULE_ODD","RULE_EVEN","RULE_MULTIPLE_OF_3","RULE_PRIME"->{//通常通りライフの減算をするルールの場合
                List<Player> winners=new ArrayList<Player>();//勝者を保存するインスタンス
                double dif_min=100;//最小の差を保存する
                /*勝者を判定する*/
                for(Player player:pl.getPlayerList()){
                    if(player.selectednum!=-1){//ルール内の数字を選んだプレイヤー
                        if(Math.abs(result-player.selectednum)==dif_min){//計算結果との差が等しい場合
                            winners.add(player);
                        }else if(Math.abs(result-player.selectednum)<dif_min){//計算結果との差が小さい場合
                            winners.clear();
                            winners.add(player);
                            dif_min=Math.abs(result-player.selectednum);
                        }
                    }
                }
                /*ライフ減算*/
                for(Player player:pl.getPlayerList()){
                    if(!winners.contains(player)){//playerが勝者でない場合
                        pl.SubLife(player,1);//ライフを1減らす
                    }
                }
            }
            case "RULE_CLOSEST_AND_FARTHEST"->{//一番近い人と遠い人のみライフ削減
                List<Player> closest_losers=new ArrayList<Player>();//近い人を保存するインスタンス
                List<Player> farthest_losers=new ArrayList<Player>();//遠い人を保存するインスタンス
                double dif_min=100;//最小の差を保存する
                double dif_max=0;//最大の差を保存する
                /*敗者を判定する*/
                for(Player player:pl.getPlayerList()){
                    if(player.selectednum!=-1){//ルール内の数字を選んだプレイヤー
                        /*差が最小の人を配列に保存*/
                        if(Math.abs(result-player.selectednum)==dif_min){//計算結果との差が等しい場合
                            closest_losers.add(player);
                        }else if(Math.abs(result-player.selectednum)<dif_min){//計算結果との差が小さい場合
                            closest_losers.clear();
                            closest_losers.add(player);
                            dif_min=Math.abs(result-player.selectednum);
                        }
                        /*差が最大の人を配列に保存*/
                        if(Math.abs(result-player.selectednum)==dif_max){//計算結果との差が等しい場合
                            farthest_losers.add(player);
                        }else if(Math.abs(result-player.selectednum)>dif_max) {//計算結果との差が大さい場合
                            farthest_losers.clear();
                            farthest_losers.add(player);
                            dif_max = Math.abs(result - player.selectednum);
                        }
                    }
                }
                /*ライフ減算*/
                for(Player player:pl.getPlayerList()){
                    if(closest_losers.contains(player) || farthest_losers.contains(player)) {
                        pl.SubLife(player, 1);
                    }
                }
            }
            case "RULE_LIFE_PLUS1_ON_JUST_RESULT"->{//ぴったりのときライフ+1
                List<Player> winners=new ArrayList<Player>();//勝者を保存するインスタンス
                double dif_min=100;//最小の差を保存する
                /*勝者を判定する*/
                for(Player player:pl.getPlayerList()){
                    if(player.selectednum!=-1){//ルール内の数字を選んだプレイヤー
                        if(Math.abs(result-player.selectednum)==dif_min){//計算結果との差が等しい場合
                            winners.add(player);
                        }else if(Math.abs(result-player.selectednum)<dif_min){//計算結果との差が小さい場合
                            winners.clear();
                            winners.add(player);
                            dif_min=Math.abs(result-player.selectednum);
                        }
                    }
                }
                /*ライフ減算*/
                for(Player player:pl.getPlayerList()){
                    if(!winners.contains(player)){//playerが勝者でない場合
                        pl.SubLife(player,1);//ライフを1減らす
                    }
                }
                /*ライフ加算*/
                /*計算結果を四捨五入*/
                int rounded_value=Math.round((float)this.result);
                for(Player player:pl.getPlayerList()){
                    /*選択した値と四捨五入した計算結果が等しい場合*/
                    if(player.selectednum==rounded_value){
                        pl.SubLife(player,-1);
                    }
                }
            }
            case "ONE_ON_ONE"->{//残っているプレイヤーが2人のとき
                Player winner;//勝者を保存する
                int flag_ratio;
                /*残っているプレイヤーを取り出す*/
                Player p1=pl.getPlayerList().get(0);
                Player p2=pl.getPlayerList().get(1);
                double dif_min=100;//計算結果との最小の差を保存
                for(Player player:pl.getPlayerList()){
                    if(player.selectednum!=-1){//ルール内の数字を選んだプレイヤー
                        if(Math.abs(result-player.selectednum)<dif_min) {//計算結果との差が小さい場合
                            winner = player;
                            dif_min = Math.abs(result - player.selectednum);
                        }
                    }
                }
                if(this.ratio<1){//倍率が1未満の場合
                    flag_ratio=0;
                }else if(this.ratio==1){//倍率が1のとき
                    flag_ratio=1;
                }else{//倍率が1より大きい場合
                    flag_ratio=2;
                }
                /*タイマン特別ルールの適応*/
                switch(flag_ratio){
                    case 0->{//倍率が1未満のとき
                        /*0を選択したものがいた場合のみ100を選択したものが勝利*/
                        if(p1.selectednum==100 && p2.selectednum==0){
                            winner=p1;
                        }else if(p1.selectednum==0 && p2.selectednum==100){
                            winner=p2;
                        }
                    }
                    case 1->{//倍率が1のとき
                        /*数字が大きい方が勝利（ただし100を選択したものがいた場合のみ0を選択したものが勝者）*/
                        int max=0;
                        for(Player player:pl.getPlayerList()){
                            if(max<player.selectednum){
                                max=player.selectednum;
                                winner=player;
                            }
                        }
                        /*100を選択したものがいた場合のみ0を選択したものが勝者*/
                        if(p1.selectednum==100 && p2.selectednum==0){
                            winner=p2;
                        }else if(p1.selectednum==0 && p2.selectednum==100){
                            winner=p1;
                        }
                    }
                    case 2->{//倍率が1より大きいとき
                        /*100を選択したものがいた場合のみ0を選択したものが勝利*/
                        if(p1.selectednum==100 && p2.selectednum==0){
                            winner=p2;
                        }else if(p1.selectednum==0 && p2.selectednum==100){
                            winner=p1;
                        }
                    }
                    default ->
                        System.out.println("error of ratio");
                }

                for(Player player:pl.getPlayerList()){
                    if(player.selectednum==-1){//ルール外の数字を選択した場合
                        /*ライフ減算*/
                        pl.SubLife(player,1);
                    }else if(!player.equals(winner)){/*勝者でない場合*/
                        /*ライフを0にする*/
                        pl.SubLife(player,player.life);
                    }
                }

            }
            default->{
                List<Player> winners=new ArrayList<Player>();//勝者を保存するインスタンス
                double dif_min=100;//最小の差を保存する
                /*勝者を判定する*/
                for(Player player:pl.getPlayerList()){
                    if(player.selectednum!=-1){//ルール内の数字を選んだプレイヤー
                        if(Math.abs(result-player.selectednum)==dif_min){//計算結果との差が等しい場合
                            winners.add(player);
                        }else if(Math.abs(result-player.selectednum)<dif_min){//計算結果との差が小さい場合
                            winners.clear();
                            winners.add(player);
                            dif_min=Math.abs(result-player.selectednum);
                        }
                    }
                }
                /*ライフ減算*/
                for(Player player:pl.getPlayerList()){
                    if(!winners.contains(player)){//playerが勝者でない場合
                        pl.SubLife(player,1);//ライフを1減らす
                    }
                }
            }
        }
    }
    boolean receiveVotingResult(String NumData){
        return true;
    }
    double calculateByRules(String ruleId,PlayerList pl){
        /*averageを初期化*/
        this.average=0;
        /*ラウンドに参加中のプレイヤー数を取得*/
        int playerCount=pl.getPlayerList().size();
        /*プレイヤーが2人のとき専用ルールに変更*/
        if(playerCount==2){
            ruleId="ONE_ON_ONE";
        }
        /*ルールごとに分岐して平均を計算*/
        switch (ruleId){
            case "RULE_ODD"://奇数のみ
                for(Player player:pl.getPlayerList()){
                    if(player.selectednum%2 && player.selectednum<0 && player.selecteednum<=100){//奇数かつ範囲内の場合
                        average+=player.selectednum;
                    }else{//数字が範囲外の場合
                        /*ルールに適しない数字は計算から削除*/
                        player.selectednum=-1;
                        playerCount--;
                    }
                }
                break;
            case "RULE_EVEN"://偶数のみ
                for(Player player:pl.getPlayerList()){
                    if(!player.selectednum%2 && player.selectednum<0 && player.selecteednum<=100){//偶数かつ範囲内の場合
                        average+=player.selectednum;
                    }else{//数字が範囲外の場合
                        /*ルールに適しない数字は計算から削除*/
                        player.selectednum=-1;
                        playerCount--;
                    }
                }
                break;
            case "RULE_MULTIPLE_OF_3"://３の倍数のみ
                for(Player player:pl.getPlayerList()){
                    if(!player.selectednum%3 && player.selectednum<0 && player.selecteednum<=100){//3かつ範囲内の場合
                        average+=player.selectednum;
                    }else{//数字が範囲外の場合
                        /*ルールに適しない数字は計算から削除*/
                        player.selectednum=-1;
                        playerCount--;
                    }
                }
                break;
            case "RULE_PRIME"://素数のみ
                for(Player player:pl.getPlayerList()){
                    /*素数かどうかの情報を持つフラグ*/
                    boolean isPrime=true;
                    /*2未満なら素数でない*/
                    if(player.selectednum<2 || player.selecteednum>100){
                        isPrime=false;
                    }
                    /*素数判定*/
                    for(int i=2;i<player.selectednum;i++){
                        if(player.selectednum%i==0){
                            isPrime=false;
                            break;
                        }
                    }
                    if(isPrime){//素数かつ範囲内の場合
                        average+=player.selectednum;
                    }else{//数字が範囲外の場合
                        /*ルールに適しない数字は計算から削除*/
                        player.selectednum=-1;
                        playerCount--;
                    }
                }
                break;
            case "RULE_CLOSEST_AND_FARTHEST"://一番近い人と遠い人のみライフ削減
                for(Player player:pl.getPlayerList()){
                    if(player.selectednum>=0 && player.selecteednum<=100){//数字が範囲内の場合
                        average+=player.selectednum;
                    }else{//数字が範囲外の場合
                        /*ルールに適しない数字は計算から削除*/
                        player.selectednum=-1;
                        playerCount--;
                    }
                }
                break;
            case "RULE_LIFE_PLUS1_ON_JUST_RESULT"://ぴったりのときライフ+1
                for(Player player:pl.getPlayerList()){
                    if(player.selectednum>=0 && player.selecteednum<=100){//数字が範囲内の場合
                        average+=player.selectednum;
                    }else{//数字が範囲外の場合
                        /*ルールに適しない数字は計算から削除*/
                        player.selectednum=-1;
                        playerCount--;
                    }
                }
                break;
            case "ONE_ON_ONE"://プレイヤーが2人になった場合
                for(Player player:pl.getPlayerList()){
                    if(player.selectednum>=0 && player.selecteednum<=100){//数字が範囲内の場合
                        average+=player.selectednum;
                    }else{//数字が範囲外の場合
                        /*ルールに適しない数字は計算から削除*/
                        player.selectednum=-1;
                        playerCount--;
                    }
                }
                break;
            default:
                for(Player player:pl.getPlayerList()){
                    if(player.selectednum>=0 && player.selecteednum<=100){//数字が範囲内の場合
                        average+=player.selectednum;
                    }else{//数字が範囲外の場合
                        /*ルールに適しない数字は計算から削除*/
                        player.selectednum=-1;
                        playerCount--;
                    }
                }
                break;
        }
        /*倍率をランダムで生成(0.8~1.2)*/
        Random random=new Random();
        /*0~4までの乱数を生成*/
        int randomValue= random.nextInt(5);
        /*倍率を算出*/
        this.ratio=(double)(randomValue+8)/10;
        /*平均計算*/
        if(playerCount!=0){
            average=average/playerCount;
        }
        /*計算結果を返す*/
        this.result=this.average*this.ratio;
        return this.result;
    }
    boolean reqSendRank(){
        return true;
    }
}
