import { NextResponse } from "next/server";
/*
  ログイン処理を模倣するモックAPIエンドポイント
  POSTリクエストを受け取り、ユーザIDとパスワードを検証します。
  成功した場合、モックのJWTトークンとユーザ情報を返します。
  失敗した場合、エラーメッセージを返します。
*/

export async function POST(req: Request) {
  // リクエストボディからtype / userId / passwordを取得
  const body = await req.json();
  const { type, userId, password } = body;

  // リクエスト形式の検証
  if (
    type !== "LOGIN" ||
    typeof userId !== "string" ||
    typeof password !== "string"
  ) {
    return NextResponse.json(
      { success: false, message: "不正なリクエスト形式です。" },
      { status: 400 }
    );
  }

  // 簡易的なロジックで認証を行う
  // 例：Taku / password123 のみ成功とする（サンプルJSONに合わせる）
  if (userId === "Taku" && password === "password123") {
    // 認証成功時のレスポンス
    return NextResponse.json({
      success: true,
      token: "mock-jwt-token-12345",
      user: {
        id: "u001",
        name: userId,
      },
    });
  } else {
    // 認証失敗時のレスポンス
    return NextResponse.json(
      {
        success: false,
        message: "ユーザIDまたはパスワードが正しくありません。",
      },
      { status: 401 }
    );
  }
}
