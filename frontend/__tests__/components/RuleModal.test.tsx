import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import RuleModal from "@/app/components/RuleModal";
import { beforeEach, describe, it, jest } from "@jest/globals";
import "@testing-library/jest-dom";

describe("RuleModal Component", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("通常のパラメータ値での検証", () => {
    it("isOpen=trueのときモーダルが表示されること", () => {
      render(<RuleModal isOpen={true} onClose={mockOnClose} />);
      expect(screen.getByText("ゲームルール")).toBeInTheDocument();
    });

    it("isOpen=falseのときモーダルが表示されないこと", () => {
      const { container } = render(
        <RuleModal isOpen={false} onClose={mockOnClose} />
      );
      expect(container.firstChild).toBeNull();
    });
  });

  describe("全ての命令を実行することの検証", () => {
    it("閉じるボタンをクリックするとonCloseが呼ばれること", () => {
      render(<RuleModal isOpen={true} onClose={mockOnClose} />);
      const closeButton = screen.getByRole("button");
      fireEvent.click(closeButton);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("コンテンツ表示の検証", () => {
    it("システム概要セクションが表示されること", () => {
      render(<RuleModal isOpen={true} onClose={mockOnClose} />);
      expect(screen.getByText("システム概要")).toBeInTheDocument();
      expect(
        screen.getByText(/本ゲームは「天秤」と呼ばれる心理戦ゲーム/)
      ).toBeInTheDocument();
    });

    it("ゲーム進行セクションが表示されること", () => {
      render(<RuleModal isOpen={true} onClose={mockOnClose} />);
      expect(screen.getByText("ゲーム進行")).toBeInTheDocument();
      expect(screen.getByText(/最大9人のプレイヤー/)).toBeInTheDocument();
    });

    it("終了条件セクションが表示されること", () => {
      render(<RuleModal isOpen={true} onClose={mockOnClose} />);
      expect(screen.getByText("終了条件")).toBeInTheDocument();
      expect(screen.getByText(/最後の1人が生き残った時点/)).toBeInTheDocument();
    });

    it("注意セクションが表示されること", () => {
      render(<RuleModal isOpen={true} onClose={mockOnClose} />);
      expect(screen.getByText("重要な注意")).toBeInTheDocument();
      expect(
        screen.getByText(/ゲーム開始後、途中退出はできません/)
      ).toBeInTheDocument();
    });
  });

  describe("スタイルの検証", () => {
    it("モーダルのオーバーレイが正しいスタイルを持つこと", () => {
      const { container } = render(
        <RuleModal isOpen={true} onClose={mockOnClose} />
      );
      const overlay = container.querySelector(".fixed.inset-0");
      expect(overlay).toBeInTheDocument();
      expect(overlay).toHaveClass("bg-black/90", "backdrop-blur-sm");
    });
  });
});
