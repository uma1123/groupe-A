import { NextResponse } from "next/server";

export async function POST() {
  await new Promise((resolve) => setTimeout(resolve, 600));

  // ランダムな4桁の数値をルームIDとして生成
  const randomRoomId = Math.floor(1000 + Math.random() * 9000).toString();

  return NextResponse.json({
    success: true,
    roomId: randomRoomId, // 生成したIDを返す
    message: "Room created successfully",
  });
}
