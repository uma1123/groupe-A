package ApplicationServer;


import java.util.Random;

public class ResultJudgement {
    double result;
    double average;
    double ratio;
    boolean manageLife(String ruleId,PlayerList pl){
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
            case "RULE_CLOSESt_AND_FARTHEST"->{//一番近い人と遠い人のみライフ削減
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
            case "RULE_LIFE_PLUS1_ON_JUST_AVERAGE"->{//ぴったりのときライフ+1
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
        return true;
    }
    boolean receiveVotingResult(String NumData){
        return true;
    }
    double calculateByRules(String ruleId,PlayerList pl){
        /*averageを初期化*/
        this.average=0;
        /*ラウンドに参加中のプレイヤー数を取得*/
        int playerCount=pl.getPlayerList().size();
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
            case "RULE_CLOSESt_AND_FARTHEST"://一番近い人と遠い人のみライフ削減
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
            case "RULE_LIFE_PLUS1_ON_JUST_AVERAGE"://ぴったりのときライフ+1
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
        average=average/playerCount;
        /*計算結果を返す*/
        this.result=this.average*this.ratio;
        return this.result;
    }
    boolean reqSendRank(){
        return true;
    }
}
