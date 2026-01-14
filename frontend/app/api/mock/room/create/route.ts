import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { type, userId, settings } = body;

  // リクエスト形式の検証
  if (
    type !== "CREATE_ROOM" ||
    typeof userId !== "string" ||
    !settings ||
    typeof settings.maxPlayers !== "number" ||
    typeof settings.lives !== "number"
  ) {
    return NextResponse.json(
      { success: false, message: "不正なリクエスト形式です。" },
      { status: 400 }
    );
  }

  await new Promise((resolve) => setTimeout(resolve, 600));

  // ランダムな4桁の数値をルームIDとして生成
  const randomRoomId = Math.floor(1000 + Math.random() * 9000).toString();

  return NextResponse.json({
    success: true,
    roomId: randomRoomId,
    message: "Room created successfully",
  });
}
