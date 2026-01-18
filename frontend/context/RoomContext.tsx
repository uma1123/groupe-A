"use client";

import { createContext, useContext, ReactNode, useState } from "react";

type RoomContextType = {
  maxPlayers: number;
  initialLife: number;
  players: string[];
  setRoomSettings: (maxPlayers: number, initialLife: number) => void;
  setPlayers: (players: string[]) => void;
  addPlayer: (player: string) => void;
  removePlayer: (player: string) => void;
};

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export function RoomProvider({ children }: { children: ReactNode }) {
  const [maxPlayers, setMaxPlayers] = useState(9);
  const [initialLife, setInitialLife] = useState(3);
  const [players, setPlayersState] = useState<string[]>([]);

  const setRoomSettings = (mp: number, il: number) => {
    setMaxPlayers(mp);
    setInitialLife(il);
  };

  const setPlayers = (newPlayers: string[]) => {
    setPlayersState(newPlayers);
  };

  const addPlayer = (player: string) => {
    setPlayersState((prev) => {
      if (prev.includes(player)) return prev;
      return [...prev, player];
    });
  };

  const removePlayer = (player: string) => {
    setPlayersState((prev) => prev.filter((p) => p !== player));
  };

  return (
    <RoomContext.Provider
      value={{
        maxPlayers,
        initialLife,
        players,
        setRoomSettings,
        setPlayers,
        addPlayer,
        removePlayer,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
}

export function useRoomContext() {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error("useRoomContext must be used within RoomProvider");
  }
  return context;
}
