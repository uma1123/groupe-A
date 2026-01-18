"use client";
import { useAuth } from "@/context/AuthContext";
import { useRoomContext } from "@/context/RoomContext"; // 追加
import { ArrowRight, Info, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import RuleModal from "../components/RuleModal";
import { useLobbyController } from "@/hooks/useLobbyContoroller";
import SettingRuleModal from "../components/SettingRuleModal";

export default function LobbyPage() {
  const { user, logout } = useAuth();
  const { setRoomSettings } = useRoomContext(); // コンテキストから追加
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"create" | "join">("create");
  const [isRuleOpen, setIsRuleOpen] = useState(false);
  const [roomIdInput, setRoomIdInput] = useState("");
  const [showGameSettings, setShowGameSettings] = useState(false);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);

  const { createRoom, joinRoom } = useLobbyController();

  const [mounted, setMounted] = useState(false);
  // mounted フラグでクライアントのみレンダリングする値を制御
  useEffect(() => setMounted(true), []);

  // ログアウト機能
  const handleLogout = () => {
    // 後で処理を書く（cookie削除など）
    logout();
    router.push("/login");
  };

  const handleCreateRoom = async () => {
    setShowGameSettings(true);
  };

  // 設定確定時にコンテキストに保存
  const handleConfirmSettings = async (
    maxPlayers: number,
    initialLife: number,
  ) => {
    console.log("設定値:", { maxPlayers, initialLife });
    setShowGameSettings(false);
    setIsCreatingRoom(true); // ローディング開始

    // コンテキストに設定値を保存
    setRoomSettings(maxPlayers, initialLife);

    const result = await createRoom(maxPlayers, initialLife);

    const roomId =
      typeof result === "object" && result !== null && "roomId" in result
        ? (result as { roomId: string | number }).roomId
        : result;

    if (typeof roomId === "string" || typeof roomId === "number") {
      const url = `/room/${roomId}`;
      console.log("遷移URL:", url);
      router.push(url);
    } else {
      console.error("ルームIDの取得に失敗しました", result);
      setIsCreatingRoom(false); // エラー時はローディング解除
    }
  };

  return (
    <div className="min-h-screen items-center justify-center bg-black text-slate-100 font-sans selection:bg-red-900 selection:text-white">
      {/* ヘッダー部分 */}
      <header className="border-b border-red-900/30 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-red-600 tracking-widest drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]">
                天秤ゲーム
              </h1>
            </div>
            <span className="text-[10px] text-red-900/80 tracking-[0.3em] ml-9 mt-1">
              TEBIN GAME
            </span>
          </div>

          <div className="flex items-center gap-4 ml-5">
            <button
              onClick={() => setIsRuleOpen(true)}
              className="p-2 text-slate-500 border border-slate-800 rounded hover:text-red-900 transition-colors"
              title="ルール確認"
            >
              <Info size={20} />
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-500 border border-red-900/50 rounded hover:bg-red-950/30 transition-all tracking-wider"
            >
              LOGOUT
            </button>
          </div>
        </div>
      </header>

      {/*プレイヤー名表示*/}
      <div className="max-w-5xl mx-auto px-6 py-2">
        <p className="text-sm text-slate-400 font-mono">
          &gt; プレイヤ―:{" "}
          <span className="text-red-400">{mounted && user}</span>
        </p>
      </div>

      {/* メインコンテンツ部分 */}
      <main className="flex flex-col items-center justify-center mt-12 px-4">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-red-600 tracking-wider mb-2 drop-shadow-[0_0_15px_rgba(220, 38, 38, 0.6)]">
            ゲーム選択
          </h2>
          <p className="text-slate-500 te">
            &gt; 新しいゲームを始めるか、既存ゲームへ参加してください
          </p>
        </div>

        <div className="w-full max-w-2xl flex border-b border-slate-800 mb-0">
          <button
            onClick={() => setActiveTab("create")}
            className={`flex-1 py-4 text-center font-bold tracking-wider transition-all relative ${
              activeTab === "create"
                ? "text-red-500"
                : "text-slate-600 hover:text-slate-400"
            }`}
          >
            新規作成
            {activeTab === "create" && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600 shadow-[0_0_10px_red]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("join")}
            className={`flex-1 py-4 text-center font-bold tracking-wider transition-all relative ${
              activeTab === "join"
                ? "text-red-500"
                : "text-slate-600 hover:text-slate-400"
            }`}
          >
            ゲーム参加
            {activeTab === "join" && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600 shadow-[0_0_10px_red]" />
            )}
          </button>
        </div>

        {/* カードエリア（背景グラデーション等はユーザーコード準拠） */}
        <div className="w-full max-w-2xl bg-gradient-to-b from-slate-900/80 to-black/60 border border-red-900/40 border-t-0 rounded-b-lg p-10 min-h-[300px] shadow-xl flex flex-col items-center justify-center">
          {activeTab === "create" ? (
            /* 新規作成コンテンツ */
            <div className="w-full max-w-md space-y-8 animate-in fade-in duration-300">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-red-500">
                  新しいゲームを開始
                </h3>
                <p className="text-slate-400 text-sm">
                  &gt; あなたがゲームマスターになります
                </p>
                <p className="text-slate-500 text-sm mt-4 leading-relaxed">
                  ゲームを始めると、他のプレイヤーが参加できるルームが作成されます。
                  参加者が集まるまでロビーで待機します。
                </p>
              </div>

              <button
                onClick={handleCreateRoom}
                className="w-full group py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all flex items-center justify-center gap-3 text-lg"
              >
                ゲーム作成
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ) : (
            /* ゲーム参加コンテンツ（UIイメージ用） */
            <div className="w-full max-w-md space-y-8 animate-in fade-in duration-300">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-red-500">
                  既存ゲームに参加
                </h3>
                <p className="text-slate-400 text-sm">
                  &gt; ルームIDを入力してください
                </p>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Room ID (例: 1234)"
                  className="w-full px-4 py-3 bg-black/60 border border-red-900/60 rounded focus:outline-none focus:ring-2 focus:ring-red-500/50 text-slate-100 placeholder-slate-600"
                  value={roomIdInput}
                  onChange={(e) => setRoomIdInput(e.target.value)}
                />
                {/* <button
                  className="w-full py-4 bg-slate-800 hover:bg-slate-600 text-slate-200 border border-slate-700 font-bold rounded transition-all"
                  onClick={() => joinRoom(Number(roomIdInput))}
                >
                  検索して参加
                </button> */}
                <button
                  onClick={() => joinRoom(Number(roomIdInput))}
                  className="w-full group py-4 bg-slate-600 hover:bg-slate-500 text-white font-bold rounded shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all flex items-center justify-center gap-3 text-lg"
                >
                  ゲームに参加
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      {showGameSettings && (
        <SettingRuleModal
          onConfirmAction={handleConfirmSettings}
          onCloseAction={() => setShowGameSettings(false)}
        />
      )}

      {/* ルーム作成中ローディング */}
      {isCreatingRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md">
          <div className="text-center space-y-6 animate-in fade-in duration-300">
            <div className="relative">
              <div className="w-20 h-20 mx-auto">
                <Loader2 className="w-full h-full text-red-500 animate-spin" />
              </div>
              <div className="absolute inset-0 w-20 h-20 mx-auto rounded-full bg-red-500/20 blur-xl animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-red-400 tracking-wider animate-pulse">
                ルーム作成中
              </h3>
              <p className="text-sm text-slate-500 font-mono">
                &gt; しばらくお待ちください...
              </p>
            </div>
            <div className="flex items-center justify-center gap-1">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      )}

      <RuleModal isOpen={isRuleOpen} onClose={() => setIsRuleOpen(false)} />
    </div>
  );
}
