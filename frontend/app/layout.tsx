import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { RoomProvider } from "@/context/RoomContext";
import { WebSocketProvider } from "@/context/WebSocketContext";
//import { WebSocketStatus } from "@/app/components/WebSocketStatus"; // ★ 追加

export const metadata: Metadata = {
  title: "Groupe A Game",
  description: "Multiplayer number guessing game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <WebSocketProvider>
          <AuthProvider>
            <RoomProvider>
              {/* <WebSocketStatus /> */}
              {children}
            </RoomProvider>
          </AuthProvider>
        </WebSocketProvider>
      </body>
    </html>
  );
}
