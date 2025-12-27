import { NextResponse } from "next/server";
/*
  新規登録処理を模倣するモックAPIエンドポイント
  POSTリクエストを受け取り、ユーザ名とパスワードを検証します。
  成功した場合、モックのJWTトークンとユーザ情報を返します。
  失敗した場合、エラーメッセージを返します。
*/

export async function POST(req: Request) {
  const body = await req.json();
  const { username, password } = body;

  // 簡易的なバリデーション
  // ユーザー名とパスワードが入力されているか確認
  if (!username || !password) {
    return NextResponse.json(
      { success: false, message: "ユーザー名とパスワードは必須です。" },
      { status: 400 }
    );
  }

  // モックの成功レスポンス
  return NextResponse.json(
    {
      success: true,
      message: "新規登録に成功しました。",
      token: "mock-jwt-token-new-user", // 仮のトークン
      user: {
        id: "u002", // 仮のランダムなIDを生成
        username: username,
      },
    },
    { status: 200 }
  );
}
