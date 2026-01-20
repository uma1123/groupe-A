import type { ClientMessage, ServerResponse } from "@/types/websocket";

export class GameWebSocket {
  private clientManageSocket: WebSocket | null = null;
  private gameSocket: WebSocket | null = null;
  private activeSocket: WebSocket | null = null;
  private handlers: Map<string, Set<(data: ServerResponse) => void>> =
    new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private url: string = "";
  private currentMode: "CLIENT_MANAGE" | "GAME" | null = null;

  /**
   * WebSocket接続を確立
   */
  connect(url: string = "ws://localhost:8080/app/client-manage"): void {
    this.url = url;

    try {
      this.activeSocket = new WebSocket(url);

      this.activeSocket.onopen = (): void => {
        console.log(" WebSocket接続成功:", url);
        this.reconnectAttempts = 0;
      };

      this.activeSocket.onmessage = (event: MessageEvent<string>): void => {
        this.handleMessage(event.data);
      };

      this.activeSocket.onerror = (): void => {
        console.error(" WebSocketエラー");
      };

      this.activeSocket.onclose = (event: CloseEvent): void => {
        console.log(" WebSocket切断:", event.code, event.reason);
        this.attemptReconnect();
      };
    } catch (error) {
      console.error(" WebSocket接続失敗:", error);
      this.attemptReconnect();
    }
  }

  /**
   * メッセージを処理
   */
  private handleMessage(messageStr: string): void {
    try {
      const message = JSON.parse(messageStr) as ServerResponse;
      console.log(" 受信:", message.type, message);

      const set = this.handlers.get(message.type);
      if (set && set.size > 0) {
        set.forEach((h) => {
          try {
            h(message);
          } catch (e) {
            console.error("ハンドラ実行エラー:", e);
          }
        });
      } else {
        console.warn(" 未処理メッセージ:", message.type);
      }
    } catch (error) {
      console.error(" メッセージ解析エラー:", error, messageStr);
    }
  }

  /**
   * 再接続を試行
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        ` 再接続試行 (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${this.reconnectDelay}ms`,
      );
      setTimeout(() => this.connect(this.url), this.reconnectDelay);
    } else {
      console.error(" 再接続回数上限に達しました");
    }
  }

  /**
   * メッセージを送信
   */
  send(message: ClientMessage): void {
    if (this.activeSocket?.readyState === WebSocket.OPEN) {
      this.activeSocket.send(JSON.stringify(message));
      console.log(
        ` 送信 (${this.currentMode || "UNKNOWN"})`,
        message.type,
        message,
      );
    } else {
      console.error(" WebSocket未接続:", this.getReadyStateString(), message);
    }
  }

  /**
   * イベントハンドラを登録
   */
  on<T extends ServerResponse["type"]>(
    type: T,
    handler: (data: Extract<ServerResponse, { type: T }>) => void,
  ): () => void {
    const h = handler as (data: ServerResponse) => void;
    let set = this.handlers.get(type);
    if (!set) {
      set = new Set();
      this.handlers.set(type, set);
    }
    set.add(h);
    console.log(" ハンドラ登録:", type);
    // 解除関数を返す
    return () => {
      const s = this.handlers.get(type);
      if (s) {
        s.delete(h);
        if (s.size === 0) this.handlers.delete(type);
      }
      console.log(" ハンドラ解除(個別):", type);
    };
  }

  /**
   * イベントハンドラを削除
   */
  off(type: ServerResponse["type"]): void {
    this.handlers.delete(type);
    console.log(" ハンドラ削除:", type);
  }

  /**
   * 全ハンドラをクリア
   */
  clearHandlers(): void {
    this.handlers.clear();
    console.log(" 全ハンドラクリア");
  }

  /**
   * 接続を切断
   */
  disconnect(): void {
    if (this.activeSocket) {
      this.activeSocket.close();
      this.activeSocket = null;
    }
    this.clearHandlers();
    this.reconnectAttempts = this.maxReconnectAttempts;
    console.log(" WebSocket切断完了");
  }

  /**
   * 接続状態を取得
   */
  getReadyState(): number {
    return this.activeSocket?.readyState ?? WebSocket.CLOSED;
  }

  /**
   * 接続状態を文字列で取得
   */
  getReadyStateString(): string {
    const state = this.getReadyState();
    switch (state) {
      case WebSocket.CONNECTING:
        return "CONNECTING";
      case WebSocket.OPEN:
        return "OPEN";
      case WebSocket.CLOSING:
        return "CLOSING";
      case WebSocket.CLOSED:
        return "CLOSED";
      default:
        return "UNKNOWN";
    }
  }

  /**
   * 接続中かどうか
   */
  isConnected(): boolean {
    return this.activeSocket?.readyState === WebSocket.OPEN;
  }

  /**
   * WebSocketのイベントハンドラを設定
   */
  private setupSocketHandlers(socket: WebSocket): void {
    socket.onopen = (): void => {
      console.log(` WebSocket接続成功 (${this.currentMode})`);
      this.reconnectAttempts = 0;
    };

    socket.onmessage = (event: MessageEvent<string>): void => {
      this.handleMessage(event.data);
    };

    socket.onerror = (): void => {
      console.error(` WebSocketエラー (${this.currentMode})`);
    };

    socket.onclose = (event: CloseEvent): void => {
      console.log(
        ` WebSocket切断 (${this.currentMode}):`,
        event.code,
        event.reason,
      );
    };
  }

  /**
   * クライアント管理サーバに接続
   */
  connectToClientManage(
    url: string = "ws://localhost:8080/app/client-manage",
  ): void {
    console.log(" クライアント管理サーバに接続:", url);
    this.currentMode = "CLIENT_MANAGE";
    this.url = url;

    this.clientManageSocket = new WebSocket(url);
    this.activeSocket = this.clientManageSocket;

    this.setupSocketHandlers(this.clientManageSocket);
  }

  /**
   * ゲームサーバに接続
   */
  connectToGameServer(url: string): void {
    console.log(" アプリケーションサーバに接続:", url);

    // 既存の接続があれば閉じる
    if (this.gameSocket) {
      this.gameSocket.close();
    }

    this.gameSocket = new WebSocket(url);

    this.gameSocket.onopen = () => {
      console.log(" WebSocket接続成功 (GAME)");
      this.activeSocket = this.gameSocket;
    };

    this.gameSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as ServerResponse;
        console.log(" 受信 (GAME):", data.type, data);

        // ハンドラを呼び出し
        const set = this.handlers.get(data.type);
        if (set && set.size > 0) {
          set.forEach((h) => {
            try {
              h(data);
            } catch (e) {
              console.error("ハンドラ実行エラー:", e);
            }
          });
        }
      } catch (e) {
        console.error("メッセージ解析エラー:", e);
      }
    };

    this.gameSocket.onerror = (error) => {
      console.error(" WebSocketエラー (GAME):", error);
    };

    this.gameSocket.onclose = (event) => {
      console.log(" WebSocket切断 (GAME)", event.code);
    };
  }

  /**
   * ゲームサーバが接続済みか確認
   */
  isGameServerConnected(): boolean {
    return this.gameSocket?.readyState === WebSocket.OPEN;
  }

  /**
   * ゲームサーバにメッセージ送信
   */
  sendToGameServer(message: object): void {
    if (this.gameSocket?.readyState === WebSocket.OPEN) {
      const json = JSON.stringify(message);
      console.log(" 送信 (GAME):", message);
      this.gameSocket.send(json);
    } else {
      console.error(" ゲームサーバ未接続");
    }
  }

  /**
   * クライアント管理サーバにメッセージ送信
   */
  sendToClientManage(message: ClientMessage): void {
    if (this.clientManageSocket?.readyState === WebSocket.OPEN) {
      const json = JSON.stringify(message);
      console.log(" 送信 (CLIENT_MANAGE):", message);
      this.clientManageSocket.send(json);
    } else {
      console.error(" クライアント管理サーバ未接続", message);
    }
  }

  /**
   * クライアント管理サーバを切断
   */
  disconnectClientManage(): void {
    if (this.clientManageSocket) {
      this.clientManageSocket.close();
      this.clientManageSocket = null;
      console.log(" クライアント管理サーバ切断");
    }
  }

  /**
   * 全接続を切断
   */
  disconnectAll(): void {
    this.disconnectClientManage();
    if (this.gameSocket) {
      this.gameSocket.close();
      this.gameSocket = null;
      console.log(" ゲームサーバ切断");
    }
    this.activeSocket = null;
    this.currentMode = null;
    this.handlers.clear();
  }
}

// シングルトンインスタンス
export const gameWebSocket = new GameWebSocket();
