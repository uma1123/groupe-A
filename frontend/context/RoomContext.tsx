"use client";

import { createContext, useContext, ReactNode, useState } from "react";

type RoomContextType = {
  maxPlayers: number;
  initialLife: number;
  setRoomSettings: (maxPlayers: number, initialLife: number) => void;
};

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export function RoomProvider({ children }: { children: ReactNode }) {
  const [maxPlayers, setMaxPlayers] = useState(9);
  const [initialLife, setInitialLife] = useState(3);

  const setRoomSettings = (mp: number, il: number) => {
    setMaxPlayers(mp);
    setInitialLife(il);
  };

  return (
    <RoomContext.Provider value={{ maxPlayers, initialLife, setRoomSettings }}>
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
