package ApplicationServer;

import java.util.*;
import java.util.stream.Collectors;

public class ResultJudgement {
    private static final double MULTIPLIER = 0.8;

    /**
     * 判定を行う。rule が null の場合はデフォルト判定を行う。
     * 返却マップには keys: average, targetValue, winners, allResults, penalties
     */
    public static Map<String, Object> judgeRound(List<NumberMessage> submissions, messages.ServerMessages.RuleData rule) {
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

        // デフォルト: もっとも差が小さいものが勝者
        List<String> winners = new ArrayList<>();
        Map<String, Integer> penalties = new HashMap<>(); // userId -> damage

        if (rule != null && rule.id != null) {
            String rid = rule.id;
            if ("ONE_ON_ONE".equals(rid) && submissions.size() == 2) {
                // タイマン特別ルール: 逆に“最も差が大きい”プレイヤーを勝者とする（特殊ルール）
                double maxDiff = results.stream().mapToDouble(r -> r.difference).max().orElse(Double.MAX_VALUE);
                winners = results.stream()
                        .filter(r -> Math.abs(r.difference - maxDiff) < 0.001)
                        .map(r -> r.userId)
                        .collect(Collectors.toList());
            } else if ("RULE_ODD".equals(rid) || "RULE_EVEN".equals(rid) || "RULE_PRIME".equals(rid)) {
                // 準拠者を抽出
                boolean wantOdd = "RULE_ODD".equals(rid);
                boolean wantEven = "RULE_EVEN".equals(rid);
                boolean wantPrime = "RULE_PRIME".equals(rid);

                List<PlayerResult> compliant = new ArrayList<>();
                for (PlayerResult pr : results) {
                    boolean ok = true;
                    if (wantOdd) ok = (pr.number % 2 != 0);
                    if (wantEven) ok = (pr.number % 2 == 0);
                    if (wantPrime) ok = isPrime(pr.number);
                    if (ok) {
                        compliant.add(pr);
                    } else {
                        // ルール違反: ペナルティを記録
                        penalties.put(pr.userId, Math.max(1, rule.lifeDamage));
                    }
                }

                if (!compliant.isEmpty()) {
                    double minDiff = compliant.stream().mapToDouble(r -> r.difference).min().orElse(Double.MAX_VALUE);
                    winners = compliant.stream()
                            .filter(r -> Math.abs(r.difference - minDiff) < 0.001)
                            .map(r -> r.userId)
                            .collect(Collectors.toList());
                } else {
                    // 準拠者がいない場合は全員対象で判定
                    double minDiff = results.stream().mapToDouble(r -> r.difference).min().orElse(Double.MAX_VALUE);
                    winners = results.stream()
                            .filter(r -> Math.abs(r.difference - minDiff) < 0.001)
                            .map(r -> r.userId)
                            .collect(Collectors.toList());
                }
            } else {
                // 未定義ルールはデフォルト判定
                double minDifference = results.stream().mapToDouble(r -> r.difference).min().orElse(Double.MAX_VALUE);
                winners = results.stream()
                        .filter(r -> Math.abs(r.difference - minDifference) < 0.001)
                        .map(r -> r.userId)
                        .collect(Collectors.toList());
            }
        } else {
            double minDifference = results.stream().mapToDouble(r -> r.difference).min().orElse(Double.MAX_VALUE);
            winners = results.stream()
                    .filter(r -> Math.abs(r.difference - minDifference) < 0.001)
                    .map(r -> r.userId)
                    .collect(Collectors.toList());
        }

        Map<String, Object> result = new HashMap<>();
        result.put("average", average);
        result.put("targetValue", targetValue);
        result.put("winners", winners);
        result.put("allResults", results);
        result.put("penalties", penalties);

        return result;
    }

    private static boolean isPrime(int n) {
        if (n <= 1) return false;
        if (n <= 3) return true;
        if (n % 2 == 0 || n % 3 == 0) return false;
        for (int i = 5; i * i <= n; i += 6) {
            if (n % i == 0 || n % (i + 2) == 0) return false;
        }
        return true;
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
