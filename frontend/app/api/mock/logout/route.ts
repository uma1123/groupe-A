export async function POST(req: Request) {
  const body = await req.json();
  const { type, userId } = body;

  if (type !== "LOGOUT" || typeof userId !== "string") {
    return new Response(
      JSON.stringify({ success: false, message: "不正なリクエスト形式です。" }),
      { status: 400 }
    );
  }

  // モックなので特に処理はせず、成功レスポンスを返す
  return new Response(
    JSON.stringify({ success: true, message: "ログアウトに成功しました。" }),
    { status: 200 }
  );
}
