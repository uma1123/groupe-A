import type { Player } from "@/types/game";

export function makeMockPlayers(currentUserName: string): Player[] {
  return [
    {
      id: 1,
      name: currentUserName,
      lives: 3,
      status: "alive",
      isYou: true,
      choice: null,
    },
    {
      id: 2,
      name: "Player 2",
      lives: 2,
      status: "alive",
      isYou: false,
      choice: 31,
    },
    {
      id: 3,
      name: "Player 3",
      lives: 3,
      status: "alive",
      isYou: false,
      choice: null,
    },
    {
      id: 4,
      name: "Player 4",
      lives: 1,
      status: "alive",
      isYou: false,
      choice: null,
    },
    {
      id: 5,
      name: "Player 5",
      lives: 0,
      status: "dead",
      isYou: false,
      choice: null,
    },
    {
      id: 6,
      name: "Player 6",
      lives: 2,
      status: "alive",
      isYou: false,
      choice: null,
    },
    {
      id: 7,
      name: "Player 7",
      lives: 3,
      status: "alive",
      isYou: false,
      choice: null,
    },
    {
      id: 8,
      name: "Player 8",
      lives: 1,
      status: "alive",
      isYou: false,
      choice: null,
    },
    { id: 9, name: "", lives: 0, status: "empty", isYou: false, choice: null },
  ];
}
