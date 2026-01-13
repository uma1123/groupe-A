import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ResultOverlay } from "@/app/components/ResultOverlay";
import { beforeEach, describe, it, jest } from "@jest/globals";
import "@testing-library/jest-dom";

describe("ResultOverlay Component", () => {
  const mockOnExit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("通常のパラメータ値での検証", () => {
    it('result="WIN"のとき勝利画面が表示されること', () => {
      render(<ResultOverlay result="WIN" onExit={mockOnExit} />);
      expect(screen.getByText("GAME クリア")).toBeInTheDocument();
      expect(screen.getByText("こんぐらちゅれーしょん")).toBeInTheDocument();
    });

    it('result="LOSE"のとき敗北画面が表示されること', () => {
      render(<ResultOverlay result="LOSE" onExit={mockOnExit} />);
      expect(screen.getByText("死亡")).toBeInTheDocument();
      expect(screen.getByText("あなたは死亡しました")).toBeInTheDocument();
    });
  });

  describe("全ての命令を実行することの検証", () => {
    it("RETURN TO LOBBYボタンをクリックするとonExitが呼ばれること", () => {
      render(<ResultOverlay result="WIN" onExit={mockOnExit} />);
      const exitButton = screen.getByText("RETURN TO LOBBY");
      fireEvent.click(exitButton);
      expect(mockOnExit).toHaveBeenCalledTimes(1);
    });
  });

  describe("全てのデータ構造の処理の検証", () => {
    it("勝利時は王冠アイコンが表示されること", () => {
      const { container } = render(
        <ResultOverlay result="WIN" onExit={mockOnExit} />
      );
      const crownIcon = container.querySelector(".text-yellow-500");
      expect(crownIcon).toBeInTheDocument();
    });

    it("敗北時はスカルアイコンが表示されること", () => {
      const { container } = render(
        <ResultOverlay result="LOSE" onExit={mockOnExit} />
      );
      const skullIcon = container.querySelector(".text-red-600");
      expect(skullIcon).toBeInTheDocument();
    });
  });

  describe("スタイルの検証", () => {
    it("勝利時は黄色系のスタイルが適用されること", () => {
      const { container } = render(
        <ResultOverlay result="WIN" onExit={mockOnExit} />
      );
      const gradientDiv = container.querySelector(".from-yellow-500");
      expect(gradientDiv).toBeInTheDocument();
    });

    it("敗北時は赤色系のスタイルが適用されること", () => {
      const { container } = render(
        <ResultOverlay result="LOSE" onExit={mockOnExit} />
      );
      const gradientDiv = container.querySelector(".from-red-600");
      expect(gradientDiv).toBeInTheDocument();
    });
  });
});
