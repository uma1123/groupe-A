package ApplicationServer;

import com.google.gson.Gson;

public class AppController {
    RuleLottery rl = new RuleLottery();
    PlayerList playerList;
    ResultJudgement resultJudgement;
    Timer timer = new Timer(62);

    String roomId;

        // ランダムルールの要求
        public boolean reqRandRules(int playerCount) {
            // ルールデータを抽選->送信
            String ruleId;
            ruleId = rl.drawRandRule(playerCount);

            //恐らく誤りがある...
            Gson gson = new Gson();
            RuleIdMessage sendMessage = new RuleIdMessage(ruleId);
            String sendMessageJson = gson.toJson(sendMessage);
            sendMessage(sendMessageJson);
            return true;
        }

        // タイマー開始要求
        public boolean reqTimeStart() {
            //タイマー開始処理
            //クライアントから「次へ」を押した信号（"NEXT-ROUND"という文字列）を受け取る
            //「次へ」を押したユーザが参加者の人数に達した時にタイマーを開始する
            //タイマー作動→制限時間達したら通知送る？


            //timer.start();



            return true;
        }

        // 制限時間の受け渡し→上と統合？
        public boolean passLimitTime(String limitTimeData) {
            // 制限時間を処理
            //System.out.println("Passing limit time data: " + limitTimeData);
            return true;
        }

        // ゲーム終了処理
        public boolean finGame(int roomId) {
            // ゲーム終了処理＝ルーム削除要求

            //恐らく誤りがある...
            Gson gson = new Gson();
            RoomIdMessage sendMessage = new RoomIdMessage(roomId);
            String sendMessageJson = gson.toJson(sendMessage);
            sendMessage(sendMessageJson);
            return true;
        }

        // 数字情報の受け渡し
        public boolean passNumInfo(String numData) {
            // 数字情報を処理→各playerに数字情報を登録する処理が必要？

            return true;
        }

        // ルール情報の受け渡し
        public boolean passRuleInfo(String ruleId) {
            // ルール情報をクライアントに送信することを想定...
            //恐らく誤りがある...
            Gson gson = new Gson();
            RuleIdMessage sendMessage = new RuleIdMessage(ruleId);
            String sendMessageJson = gson.toJson(sendMessage);
            sendMessage(sendMessageJson);
            return true;
        }

        // ルーム初期値情報受け取り
        public void passDefaultInfo(int roomId, int playerCount, int life){
            //プレイヤーリストへ保存する

        }

        // プレイヤー情報の受け渡し（引数はルームid,ユーザid？）
        public boolean passPlayerInfo(String playerData) {
            // プレイヤー情報を処理→Roomクラスでするべき？
            //解釈としてはクライアントからアプリケーションサーバにユーザidと所属したいルームidが送られてきて,
            //ルームにその情報を登録する作業

            return true;
        }

        // 結果保存要求（引数はユーザid,勝敗結果？）
        public boolean reqResultSave(String resultData) {
            // 結果データを保存→一応データベースに残すが...

            return true;
        }
}
