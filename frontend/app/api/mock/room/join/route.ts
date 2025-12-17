import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { roomId } = body;

  // テスト用ロジック: "1234" という部屋だけが存在することにする
  if (roomId === "1234") {
    return NextResponse.json({
      success: true,
      message: "ルームへの参加が可能です",
      room: {
        id: "1234",
        status: "WAITING",
        currentPlayers: 3, // 現在3人いる設定
        maxPlayers: 9,
      },
    });
  } else if (roomId === "9999") {
    // 満員のエラーテスト用
    return NextResponse.json(
      { success: false, message: "このルームは満員です" },
      { status: 400 } // Bad Request
    );
  } else {
    // 存在しない部屋
    return NextResponse.json(
      { success: false, message: "ルームが見つかりません" },
      { status: 404 } // Not Found
    );
  }
}
