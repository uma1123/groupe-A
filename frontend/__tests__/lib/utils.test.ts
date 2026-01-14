import { cn } from "@/lib/utils";
import { describe, it, expect } from "@jest/globals";

describe("utils.ts - cn関数", () => {
  describe("通常のパラメータ値での検証", () => {
    it("単一のクラス名を正しく返すこと", () => {
      expect(cn("text-red-500")).toBe("text-red-500");
    });

    it("複数のクラス名を結合すること", () => {
      expect(cn("text-red-500", "bg-blue-500")).toBe(
        "text-red-500 bg-blue-500"
      );
    });

    it("条件付きクラスが正しく適用されること", () => {
      const isActive = true;
      expect(cn("base-class", isActive && "active-class")).toBe(
        "base-class active-class"
      );
    });
  });

  describe("パラメータの限界値での検証", () => {
    it("空の引数で空文字列を返すこと", () => {
      expect(cn()).toBe("");
    });

    it("falseやnullを無視すること", () => {
      expect(cn("text-red-500", false, null, undefined)).toBe("text-red-500");
    });
  });

  describe("全てのデータ構造の処理の検証", () => {
    it("配列形式のクラスを処理できること", () => {
      expect(cn(["text-red-500", "bg-blue-500"])).toBe(
        "text-red-500 bg-blue-500"
      );
    });

    it("オブジェクト形式のクラスを処理できること", () => {
      expect(cn({ "text-red-500": true, "bg-blue-500": false })).toBe(
        "text-red-500"
      );
    });

    it("Tailwind CSSの競合クラスを正しくマージすること", () => {
      expect(cn("px-2", "px-4")).toBe("px-4");
      expect(cn("text-sm", "text-lg")).toBe("text-lg");
    });
  });

  describe("複雑な組み合わせの検証", () => {
    it("複数の形式を混在させて処理できること", () => {
      const result = cn(
        "base-class",
        ["array-class-1", "array-class-2"],
        { "object-class": true, "ignored-class": false },
        null,
        undefined,
        "final-class"
      );
      expect(result).toBe(
        "base-class array-class-1 array-class-2 object-class final-class"
      );
    });
  });
});
