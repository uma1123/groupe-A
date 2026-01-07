import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, userId, roomId } = body;

    // リクエスト形式の検証
    if (
      type !== "START_GAME" ||
      typeof userId !== "string" ||
      typeof roomId !== "string"
    ) {
      return NextResponse.json(
        { success: false, message: "不正なリクエスト形式です。" },
        { status: 400 }
      );
    }

    // 本来のゲーム開始ロジックはここに実装
    // 例：ホスト権限の確認、ルーム内のプレイヤー数チェック等
    // 擬似的に成功を返す。遅延を1秒入れる（実際の通信を想定して）
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      roomId,
      message: "ゲームを開始しました。",
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
