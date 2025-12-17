import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // 本来は、ユーザーIDなどをヘッダやbodyから受け取る
  // const body = await req.json();

  const roomId = Math.floor(1000 + Math.random() * 9000);

  return NextResponse.json({
    success: true,
    roomId: roomId,
    message: "ルームが作成されました",
    // DBに保存するデータ構造
    room: {
      id: roomId,
      userId: 1,
      status: "waiting", // waiting, in_game, finished
      maxPlayers: 9,
      currentPlayers: 1,
      createdAt: new Date().toISOString(),
    },
  });
}
