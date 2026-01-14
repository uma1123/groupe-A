import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SettingRuleModal from "@/app/components/SettingRuleModal";
import { beforeEach, describe, it, jest } from "@jest/globals";
import "@testing-library/jest-dom";

describe("SettingRuleModal Component", () => {
  const mockOnConfirm = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("通常のパラメータ値での検証", () => {
    it("モーダルが正しくレンダリングされること", () => {
      render(
        <SettingRuleModal
          onConfirmAction={mockOnConfirm}
          onCloseAction={mockOnClose}
        />
      );
      expect(screen.getByText("ゲーム設定")).toBeInTheDocument();
    });

    it("初期値が正しく表示されること", () => {
      render(
        <SettingRuleModal
          onConfirmAction={mockOnConfirm}
          onCloseAction={mockOnClose}
        />
      );
      // ★ getAllByText を使用して複数の要素から特定のものを選択
      const nineTexts = screen.getAllByText("9");
      expect(nineTexts[0]).toBeInTheDocument(); // maxPlayers表示値

      const threeTexts = screen.getAllByText("3");
      expect(threeTexts[0]).toBeInTheDocument(); // initialLife表示値
    });
  });

  describe("パラメータの限界値での検証", () => {
    it("最大プレイヤー数のスライダーが最小値2から最大値9の範囲を持つこと", () => {
      render(
        <SettingRuleModal
          onConfirmAction={mockOnConfirm}
          onCloseAction={mockOnClose}
        />
      );
      const slider = screen.getAllByRole("slider")[0];
      expect(slider).toHaveAttribute("min", "2");
      expect(slider).toHaveAttribute("max", "9");
    });

    it("初期ライフのスライダーが最小値1から最大値10の範囲を持つこと", () => {
      render(
        <SettingRuleModal
          onConfirmAction={mockOnConfirm}
          onCloseAction={mockOnClose}
        />
      );
      const slider = screen.getAllByRole("slider")[1];
      expect(slider).toHaveAttribute("min", "1");
      expect(slider).toHaveAttribute("max", "10");
    });
  });

  describe("全ての命令を実行することの検証", () => {
    it("閉じるボタンをクリックするとonCloseActionが呼ばれること", () => {
      render(
        <SettingRuleModal
          onConfirmAction={mockOnConfirm}
          onCloseAction={mockOnClose}
        />
      );
      const closeButton = screen.getAllByRole("button")[0];
      fireEvent.click(closeButton);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("確定ボタンをクリックすると正しい引数でonConfirmActionが呼ばれること", () => {
      render(
        <SettingRuleModal
          onConfirmAction={mockOnConfirm}
          onCloseAction={mockOnClose}
        />
      );
      const confirmButton = screen.getByText("確定させてルーム作成");
      fireEvent.click(confirmButton);
      expect(mockOnConfirm).toHaveBeenCalledWith(9, 3);
    });
  });

  describe("スライダー操作の検証", () => {
    it("最大プレイヤー数スライダーを変更すると表示が更新されること", () => {
      render(
        <SettingRuleModal
          onConfirmAction={mockOnConfirm}
          onCloseAction={mockOnClose}
        />
      );
      const slider = screen.getAllByRole("slider")[0];
      fireEvent.change(slider, { target: { value: "5" } });
      // ★ getAllByText で複数の5から最初のものを確認
      const fiveTexts = screen.getAllByText("5");
      expect(fiveTexts[0]).toBeInTheDocument();
    });

    it("初期ライフスライダーを変更すると表示が更新されること", () => {
      render(
        <SettingRuleModal
          onConfirmAction={mockOnConfirm}
          onCloseAction={mockOnClose}
        />
      );
      const slider = screen.getAllByRole("slider")[1];
      fireEvent.change(slider, { target: { value: "7" } });
      // ★ getAllByText で複数の7から最初のものを確認
      const sevenTexts = screen.getAllByText("7");
      expect(sevenTexts[0]).toBeInTheDocument();
    });

    it("変更後に確定すると変更された値が渡されること", () => {
      render(
        <SettingRuleModal
          onConfirmAction={mockOnConfirm}
          onCloseAction={mockOnClose}
        />
      );

      const playerSlider = screen.getAllByRole("slider")[0];
      const lifeSlider = screen.getAllByRole("slider")[1];

      fireEvent.change(playerSlider, { target: { value: "4" } });
      fireEvent.change(lifeSlider, { target: { value: "5" } });

      const confirmButton = screen.getByText("確定させてルーム作成");
      fireEvent.click(confirmButton);

      expect(mockOnConfirm).toHaveBeenCalledWith(4, 5);
    });
  });

  describe("コンテンツ表示の検証", () => {
    it("注意文が表示されること", () => {
      render(
        <SettingRuleModal
          onConfirmAction={mockOnConfirm}
          onCloseAction={mockOnClose}
        />
      );
      expect(
        screen.getByText(/これらの設定は一度確定すると変更できません/)
      ).toBeInTheDocument();
    });
  });
});
