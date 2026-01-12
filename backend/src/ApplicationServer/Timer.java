package ApplicationServer;

import java.time.Duration;
import java.time.LocalTime;

public class Timer {
    public int limittime;//制限時間（秒）
    public LocalTime starttime;//開始時間
    public boolean moveflag;//タイマー動作有無

    //コンストラクタ
    Timer(int limitTime){
        limittime = limitTime;
        moveflag = false;
    }

    // スタートする
    public boolean start() {
        //タイマー非作動中の場合
        if (!moveflag) {
            starttime = LocalTime.now();
            moveflag = true;
            return true;
        }
        return false;
    }

    // ストップする
    public boolean stop() {
        //タイマー作動中の場合
        if (moveflag) {
            moveflag = false;
            return true;
        }
        return false;
    }

    // リセットする
    public boolean reset() {
        moveflag = false;
        starttime = null;
        return true;
    }

    // 残り時間を返す（秒）
    public long getRemainingTime() {
        //タイマーが非作動or開始時間がnullの場合初期の制限時間を返す
        if (!moveflag || starttime == null) {
            return limittime;
        }

        //開始時間から現在時刻までの経過時間をDuration型で取得
        Duration elapsed = Duration.between(starttime, LocalTime.now());

        //残り時間を計算
        long remaining = limittime - elapsed.getSeconds();

        //残り時間が負の値になるのを防ぐ処理(制限時間超過時は0を返す)
        return Math.max(remaining, 0);
    }

    // 制限時間を超えたか返す
    public boolean checkTimeLimit() {
        return this.getRemainingTime() <= 0;//超えたらtrue,超えてなければfalse
    }

}
