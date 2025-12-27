import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // モックのゲーム開始API
  try {
    const body = await req.json();
    const { roomId } = body;

    if (!roomId || isNaN(roomId)) {
      return NextResponse.json(
        { success: false, message: "無効なルームIDです。" },
        { status: 400 }
      );
    }

    // 本来のゲーム開始ロジックはここに実装
    // 擬似的に成功を返す。遅延を1秒入れる（実際の通信を想定して）
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      message: "ルームID " + roomId + " のゲームを開始しました。",
      startedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("ゲーム開始エラー:", error);
    return NextResponse.json(
      { success: false, message: "ゲーム開始中にエラーが発生しました。" },
      { status: 500 }
    );
  }
}
