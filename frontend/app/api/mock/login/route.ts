import { NextResponse } from "next/server";
/*
  ログイン処理を模倣するモックAPIエンドポイント
  POSTリクエストを受け取り、ユーザ名とパスワードを検証します。
  成功した場合、モックのJWTトークンとユーザ情報を返します。
  失敗した場合、エラーメッセージを返します。
*/

export async function POST(req: Request) {
  // リクエストボディからユーザ名とパスワードを取得
  const body = await req.json();
  const { username, password } = body;

  // 簡易的なロジックで認証を行う
  // admin / password の組み合わせのみ成功とする
  if (username === "admin" && password === "password") {
    // 認証成功時のレスポンス
    return NextResponse.json({
      success: true,
      token: "mock-jwt-token-12345",
      user: {
        id: 1,
        name: username,
      },
    });
  } else {
    return NextResponse.json(
      // 認証失敗時のレスポンス
      {
        success: false,
        message: "ユーザ名またはパスワードが正しくありません。",
      },
      { status: 401 }
    );
  }
}
