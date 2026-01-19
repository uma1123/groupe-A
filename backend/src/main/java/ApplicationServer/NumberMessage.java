package ApplicationServer;

// プレイヤーの選んだ数字を表すメッセージ
public class NumberMessage {
    String userid;
    int roomid;
    int num;

    public NumberMessage(int roomid, String userid, int num) {
        this.userid = userid;
        this.roomid = roomid;
        this.num = num;
    }
    @Override
    public String toString() {
        return "NumberMessage{" +
                "userid='" + userid + '\'' +
                ", roomid=" + roomid +
                ", num=" + num +
                '}';
    }
}
