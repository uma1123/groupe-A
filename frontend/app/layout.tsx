import type { Metadata } from "next";
import { RoomProvider } from "@/context/RoomContext";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "天秤ゲーム",
  description: "天秤ゲーム",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <AuthProvider>
          <RoomProvider>{children}</RoomProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
