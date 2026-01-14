import { render, screen, fireEvent } from "@testing-library/react";
import { RoomProvider, useRoomContext } from "@/context/RoomContext";
import { describe, expect, it } from "@jest/globals";

function Consumer() {
  const { maxPlayers, initialLife, setRoomSettings } = useRoomContext();
  return (
    <div>
      <span data-testid="mp">{maxPlayers}</span>
      <span data-testid="il">{initialLife}</span>
      <button onClick={() => setRoomSettings(4, 5)}>update</button>
    </div>
  );
}

function Outside() {
  useRoomContext();
  return null;
}

describe("RoomContext", () => {
  it("デフォルト値を提供する", () => {
    render(
      <RoomProvider>
        <Consumer />
      </RoomProvider>
    );
    expect(screen.getByTestId("mp").textContent).toBe("9");
    expect(screen.getByTestId("il").textContent).toBe("3");
  });

  it("setRoomSettingsで値が更新される", () => {
    render(
      <RoomProvider>
        <Consumer />
      </RoomProvider>
    );
    fireEvent.click(screen.getByText("update"));
    expect(screen.getByTestId("mp").textContent).toBe("4");
    expect(screen.getByTestId("il").textContent).toBe("5");
  });

  it("Provider外でuseRoomContextを呼ぶとエラー", () => {
    expect(() => render(<Outside />)).toThrow(
      "useRoomContext must be used within RoomProvider"
    );
  });
});
