import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await new Promise((resolve) => setTimeout(resolve, 600));

  try {
    const body = await request.json();
    const { type, userId, roomId } = body;

    // バリデーション
    if (
      type !== "JOIN_ROOM" ||
      typeof userId !== "string" ||
      typeof roomId !== "string"
    ) {
      return NextResponse.json(
        { success: false, message: "不正なリクエスト形式です。" },
        { status: 400 }
      );
    }

    // Mockロジック: 特定のID（例: 9999）は入れない、等のテストをしたければここに書く
    // 基本は成功させる
    return NextResponse.json({
      success: true,
      roomId: roomId,
      message: "Joined room successfully",
    });
  } catch (error) {
    console.error("Error in joining room:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
