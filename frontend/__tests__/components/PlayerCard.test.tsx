import React from "react";
import { render, screen } from "@testing-library/react";
import { RoomProvider } from "@/context/RoomContext";
import type { Player } from "@/types/game";
import { PlayerCard } from "@/app/components/PlayerCard";
import "@testing-library/jest-dom";

describe("PlayerCard Component", () => {
  const mockContextProvider = ({ children }: { children: React.ReactNode }) => (
    <RoomProvider>{children}</RoomProvider>
  );

  describe("通常のパラメータ値での検証", () => {
    it("アクティブなプレイヤーカードが正常にレンダリングされること", () => {
      const player: Player = {
        id: "player-1",
        name: "Player1",
        lives: 3,
        status: "alive",
        isYou: false,
        isHost: false,
        isReady: false,
        choice: null,
      };

      render(<PlayerCard player={player} />, { wrapper: mockContextProvider });
      expect(screen.getByText("Player1")).toBeInTheDocument();
    });

    it("自分のプレイヤーが「YOU」として表示されること", () => {
      const player: Player = {
        id: "player-2",
        name: "MyPlayer",
        lives: 2,
        status: "alive",
        isYou: true,
        isHost: false,
        isReady: false,
        choice: null,
      };

      render(<PlayerCard player={player} />, { wrapper: mockContextProvider });
      expect(screen.getByText("YOU")).toBeInTheDocument();
    });
  });

  describe("パラメータの限界値での検証", () => {
    it("生命が0のプレイヤーが表示されること", () => {
      const player: Player = {
        id: "player-3",
        name: "NoLife",
        lives: 0,
        status: "alive",
        isYou: false,
        isHost: false,
        isReady: false,
        choice: null,
      };

      render(<PlayerCard player={player} />, { wrapper: mockContextProvider });
      expect(screen.getByText("NoLife")).toBeInTheDocument();
    });

    it("最大生命値のプレイヤーが表示されること", () => {
      const player: Player = {
        id: "player-4",
        name: "FullLife",
        lives: 3,
        status: "alive",
        isYou: false,
        isHost: false,
        isReady: false,
        choice: null,
      };

      render(<PlayerCard player={player} />, { wrapper: mockContextProvider });
      expect(screen.getByText("FullLife")).toBeInTheDocument();
    });
  });

  describe("パラメータの範囲外での検証", () => {
    it("生命が初期値を超える場合でもレンダリングされること", () => {
      const player: Player = {
        id: "player-5",
        name: "ExtraLife",
        lives: 10,
        status: "alive",
        isYou: false,
        isHost: false,
        isReady: false,
        choice: null,
      };

      render(<PlayerCard player={player} />, { wrapper: mockContextProvider });
      expect(screen.getByText("ExtraLife")).toBeInTheDocument();
    });

    it("負の生命値でもレンダリングされること", () => {
      const player: Player = {
        id: "player-6",
        name: "NegativeLife",
        lives: -1,
        status: "alive",
        isYou: false,
        isHost: false,
        isReady: false,
        choice: null,
      };

      render(<PlayerCard player={player} />, { wrapper: mockContextProvider });
      expect(screen.getByText("NegativeLife")).toBeInTheDocument();
    });
  });

  describe("全てのデータ構造の処理の検証", () => {
    it("statusが「empty」の場合、空のカードが表示されること", () => {
      const player: Player = {
        id: "player-7",
        name: "Empty",
        lives: 0,
        status: "empty",
        isYou: false,
        isHost: false,
        isReady: false,
        choice: null,
      };

      const { container } = render(<PlayerCard player={player} />, {
        wrapper: mockContextProvider,
      });
      expect(
        container.querySelector(".border-red-900\\/10")
      ).toBeInTheDocument();
    });

    it("statusが「dead」の場合、死亡表示が出現すること", () => {
      const player: Player = {
        id: "player-8",
        name: "DeadPlayer",
        lives: 0,
        status: "dead",
        isYou: false,
        isHost: false,
        isReady: false,
        choice: null,
      };

      const { container } = render(<PlayerCard player={player} />, {
        wrapper: mockContextProvider,
      });
      const deadIndicator = container.querySelector(".text-red-600.text-5xl");
      expect(deadIndicator).toBeInTheDocument();
    });
  });

  describe("全てのループの正常終了の検証", () => {
    it("initialLifeの数だけハートアイコンが生成されること", () => {
      const player: Player = {
        id: "player-9",
        name: "HeartTest",
        lives: 2,
        status: "alive",
        isYou: false,
        isHost: false,
        isReady: false,
        choice: null,
      };

      const { container } = render(<PlayerCard player={player} />, {
        wrapper: mockContextProvider,
      });
      const hearts = container.querySelectorAll("svg");
      expect(hearts.length).toBe(4); // 1 user icon + 3 hearts
    });
  });

  describe("スタイル適用の検証", () => {
    it("自分のカードが赤い枠線を持つこと", () => {
      const player: Player = {
        id: "player-10",
        name: "YouPlayer",
        lives: 3,
        status: "alive",
        isYou: true,
        isHost: false,
        isReady: false,
        choice: null,
      };

      const { container } = render(<PlayerCard player={player} />, {
        wrapper: mockContextProvider,
      });
      expect(container.querySelector(".border-red-500")).toBeInTheDocument();
    });

    it("他人のカードがスレート色の枠線を持つこと", () => {
      const player: Player = {
        id: "player-11",
        name: "OtherPlayer",
        lives: 3,
        status: "alive",
        isYou: false,
        isHost: false,
        isReady: false,
        choice: null,
      };

      const { container } = render(<PlayerCard player={player} />, {
        wrapper: mockContextProvider,
      });
      expect(container.querySelector(".border-slate-800")).toBeInTheDocument();
    });
  });
});
