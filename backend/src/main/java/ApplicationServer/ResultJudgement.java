package ApplicationServer;

import java.util.*;
import java.util.stream.Collectors;

public class ResultJudgement {
    private static final double MULTIPLIER = 0.8;

    /**
     * 全プレイヤーの数値から平均×0.8を計算し、勝者を判定
     */
    public static Map<String, Object> judgeRound(List<NumberMessage> submissions) {
        if (submissions == null || submissions.isEmpty()) {
            throw new IllegalArgumentException("No submissions to judge");
        }

        // 平均値を計算
        double average = submissions.stream()
                .mapToInt(s -> s.num)
                .average()
                .orElse(0.0);

        // 目標値（平均×0.8）を計算
        double targetValue = average * MULTIPLIER;

        // 各プレイヤーの目標値との差を計算
        List<PlayerResult> results = submissions.stream()
                .map(s -> new PlayerResult(
                        s.userid,
                        s.num,
                        Math.abs(s.num - targetValue)
                ))
                .collect(Collectors.toList());

        // 最も近い差を見つける
        double minDifference = results.stream()
                .mapToDouble(r -> r.difference)
                .min()
                .orElse(Double.MAX_VALUE);

        // 勝者を決定（複数いる可能性あり）
        List<String> winners = results.stream()
                .filter(r -> Math.abs(r.difference - minDifference) < 0.001) // 浮動小数点の誤差対策
                .map(r -> r.userId)
                .collect(Collectors.toList());

        // 結果をマップに格納
        Map<String, Object> result = new HashMap<>();
        result.put("average", average);
        result.put("targetValue", targetValue);
        result.put("winners", winners);
        result.put("allResults", results);

        return result;
    }

    /**
     * 個別プレイヤーの結果を保持するクラス
     */
    public static class PlayerResult {
        public final String userId;
        public final int number;
        public final double difference;

        public PlayerResult(String userId, int number, double difference) {
            this.userId = userId;
            this.number = number;
            this.difference = difference;
        }
    }
}
