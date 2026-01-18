import type { ClientMessage, ServerResponse } from "@/types/websocket";

export class GameWebSocket {
  private clientManageSocket: WebSocket | null = null;
  private gameSocket: WebSocket | null = null;
  private activeSocket: WebSocket | null = null;
  private handlers: Map<string, (data: ServerResponse) => void> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private url: string = "";
  private mockMode: boolean = false;
  private currentMode: "CLIENT_MANAGE" | "GAME" | null = null;

  /**
   * モックモードを有効化（Java側未実装時のテスト用）
   */
  enableMockMode(): void {
    this.mockMode = true;
    console.log("🧪 モックモード有効化");
  }

  /**
   * WebSocket接続を確立（互換性維持用）
   * ★ デフォルトURLを修正
   */
  connect(url: string = "ws://localhost:8080/app/client-manage"): void {
    this.url = url;

    if (this.mockMode) {
      console.log("🧪 モックモードで動作中（実際の接続は行いません）");
      this.simulateConnection();
      return;
    }

    try {
      this.activeSocket = new WebSocket(url);

      this.activeSocket.onopen = (): void => {
        console.log("✅ WebSocket接続成功:", url);
        this.reconnectAttempts = 0;
      };

      this.activeSocket.onmessage = (event: MessageEvent<string>): void => {
        this.handleMessage(event.data);
      };

      this.activeSocket.onerror = (): void => {
        console.error("❌ WebSocketエラー");
      };

      this.activeSocket.onclose = (event: CloseEvent): void => {
        console.log("🔌 WebSocket切断:", event.code, event.reason);
        this.attemptReconnect();
      };
    } catch (error) {
      console.error("❌ WebSocket接続失敗:", error);
      this.attemptReconnect();
    }
  }

  /**
   * メッセージを処理
   */
  private handleMessage(messageStr: string): void {
    try {
      const message = JSON.parse(messageStr) as ServerResponse;
      console.log("📥 受信:", message.type, message);

      // ★ GO_TO_GAME_SERVER の自動処理を削除（ハンドラに任せる）
      // if (message.type === "GO_TO_GAME_SERVER") {
      //   ...
      // }

      const handler = this.handlers.get(message.type);
      if (handler) {
        handler(message);
      } else {
        console.warn("⚠️ 未処理メッセージ:", message.type);
      }
    } catch (error) {
      console.error("❌ メッセージ解析エラー:", error, messageStr);
    }
  }

  /**
   * モックモード時の疑似接続
   */
  private simulateConnection(): void {
    setTimeout(() => {
      console.log("✅ モック接続成功");
      this.reconnectAttempts = 0;
    }, 100);
  }

  /**
   * 再接続を試行
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `🔄 再接続試行 (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${this.reconnectDelay}ms`
      );
      setTimeout(() => this.connect(this.url), this.reconnectDelay);
    } else {
      console.error("❌ 再接続回数上限に達しました");
    }
  }

  /**
   * モックレスポンスを生成
   */
  private handleMockResponse(message: ClientMessage): void {
    setTimeout(() => {
      let response: ServerResponse | null = null;

      switch (message.type) {
        case "LOGIN": {
          const loginMsg = message as Extract<ClientMessage, { type: "LOGIN" }>;
          response = {
            type: "AUTH_SUCCESS",
            userId: loginMsg.userId,
            userName: loginMsg.userId,
          };
          break;
        }

        case "SIGNUP": {
          const signupMsg = message as Extract<
            ClientMessage,
            { type: "SIGNUP" }
          >;
          response = {
            type: "AUTH_SUCCESS",
            userId: signupMsg.userId,
            userName: signupMsg.userId,
          };
          break;
        }

        case "CREATE_ROOM": {
          const createMsg = message as Extract<
            ClientMessage,
            { type: "CREATE_ROOM" }
          >;
          response = {
            type: "CREATE_ROOM_SUCCESS",
            roomId: Math.floor(1000 + Math.random() * 9000).toString(),
            maxPlayers: createMsg.numOfPlayer,
            lives: createMsg.numOfLife,
          };
          break;
        }

        case "JOIN_ROOM": {
          const joinMsg = message as Extract<
            ClientMessage,
            { type: "JOIN_ROOM" }
          >;
          // ★ モックでは固定値を返す（実際はサーバーから取得）
          response = {
            type: "JOIN_ROOM_SUCCESS",
            roomId: joinMsg.roomId.toString(),
            currentPlayers: ["Player1", joinMsg.userId],
            maxPlayers: 4, // ★ 修正: 固定値（モック用）
            lives: 3, // ★ 修正: 固定値（モック用）
          };
          break;
        }

        case "LEAVE_ROOM": {
          const leaveMsg = message as Extract<
            ClientMessage,
            { type: "LEAVE_ROOM" }
          >;
          response = {
            type: "PLAYER_LEFT",
            userId: leaveMsg.userId,
          };
          break;
        }

        case "START_GAME": {
          const startMsg = message as Extract<
            ClientMessage,
            { type: "START_GAME" }
          >;
          response = {
            type: "GO_TO_GAME_SERVER",
            roomId: startMsg.roomId,
            nextEndpoint: "ws://localhost:8081/app/game",
          };
          break;
        }

        case "SUBMIT_NUMBER": {
          const submitMsg = message as Extract<
            ClientMessage,
            { type: "SUBMIT_NUMBER" }
          >;
          response = {
            type: "ROUND_RESULT",
            roomId: submitMsg.roomId,
            userId: submitMsg.userId,
            roundResult: Math.random() > 0.5 ? "WIN" : "LOSE",
            targetValue: Math.floor(Math.random() * 100),
            yourNumber: submitMsg.num,
            newLife: 2,
            isDead: false,
            appliedRule: {
              id: "RULE_ODD",
              name: "奇数のみ",
              description: "奇数のみ選択可能",
              lifeDamage: 1,
            },
          };
          break;
        }

        case "NEXT_ROUND": {
          const nextMsg = message as Extract<
            ClientMessage,
            { type: "NEXT_ROUND" }
          >;
          response = {
            type: "ROUND_START",
            roomId: nextMsg.roomId,
            currentRound: 2,
            totalRounds: 3,
            rule: {
              id: "RULE_EVEN",
              name: "偶数のみ",
              description: "偶数のみ選択可能",
              lifeDamage: 1,
            },
            timerDuration: 60,
          };
          break;
        }
      }

      if (response) {
        console.log("📥 モック受信:", response.type, response);
        const handler = this.handlers.get(response.type);
        if (handler) {
          handler(response);
        }
      }
    }, 500);
  }

  /**
   * メッセージを送信
   */
  send(message: ClientMessage): void {
    if (this.mockMode) {
      console.log("📤 モック送信:", message.type, message);
      this.handleMockResponse(message);
      return;
    }

    if (this.activeSocket?.readyState === WebSocket.OPEN) {
      this.activeSocket.send(JSON.stringify(message));
      console.log(
        `📤 送信 (${this.currentMode || "UNKNOWN"})`,
        message.type,
        message
      );
    } else {
      console.error("❌ WebSocket未接続:", this.getReadyStateString(), message);
    }
  }

  /**
   * イベントハンドラを登録
   */
  on<T extends ServerResponse["type"]>(
    type: T,
    handler: (data: Extract<ServerResponse, { type: T }>) => void
  ): void {
    this.handlers.set(type, handler as (data: ServerResponse) => void);
    console.log("📌 ハンドラ登録:", type);
  }

  /**
   * イベントハンドラを削除
   */
  off(type: ServerResponse["type"]): void {
    this.handlers.delete(type);
    console.log("📌 ハンドラ削除:", type);
  }

  /**
   * 全ハンドラをクリア
   */
  clearHandlers(): void {
    this.handlers.clear();
    console.log("🧹 全ハンドラクリア");
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
    console.log("🔌 WebSocket切断完了");
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
    if (this.mockMode) return true;
    return this.activeSocket?.readyState === WebSocket.OPEN;
  }

  /**
   * WebSocketのイベントハンドラを設定
   */
  private setupSocketHandlers(socket: WebSocket): void {
    socket.onopen = (): void => {
      console.log(`✅ WebSocket接続成功 (${this.currentMode})`);
      this.reconnectAttempts = 0;
    };

    socket.onmessage = (event: MessageEvent<string>): void => {
      this.handleMessage(event.data);
    };

    socket.onerror = (): void => {
      console.error(`❌ WebSocketエラー (${this.currentMode})`);
    };

    socket.onclose = (event: CloseEvent): void => {
      console.log(
        `🔌 WebSocket切断 (${this.currentMode}):`,
        event.code,
        event.reason
      );
    };
  }

  /**
   * クライアント管理サーバに接続
   */
  connectToClientManage(
    url: string = "ws://localhost:8080/app/client-manage"
  ): void {
    console.log("🔌 クライアント管理サーバに接続:", url);
    this.currentMode = "CLIENT_MANAGE";
    this.url = url;

    if (this.mockMode) {
      console.log("🧪 モックモードで動作中");
      return;
    }

    this.clientManageSocket = new WebSocket(url);
    this.activeSocket = this.clientManageSocket;

    this.setupSocketHandlers(this.clientManageSocket);
  }

  /**
   * ゲームサーバに接続
   */
  connectToGameServer(url: string): void {
    console.log("🎮 アプリケーションサーバに接続:", url);

    // 既存の接続があれば閉じる
    if (this.gameSocket) {
      this.gameSocket.close();
    }

    this.gameSocket = new WebSocket(url);

    this.gameSocket.onopen = () => {
      console.log("✅ WebSocket接続成功 (GAME)");
      this.activeSocket = this.gameSocket;
    };

    this.gameSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as ServerResponse;
        console.log("📥 受信 (GAME):", data.type, data);

        // ハンドラを呼び出し
        const handler = this.handlers.get(data.type);
        if (handler) {
          handler(data);
        }
      } catch (e) {
        console.error("メッセージ解析エラー:", e);
      }
    };

    this.gameSocket.onerror = (error) => {
      console.error("❌ WebSocketエラー (GAME):", error);
    };

    this.gameSocket.onclose = (event) => {
      console.log("🔌 WebSocket切断 (GAME)", event.code);
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
      console.log("📤 送信 (GAME):", message);
      this.gameSocket.send(json);
    } else {
      console.error("❌ ゲームサーバ未接続");
    }
  }

  /**
   * クライアント管理サーバを切断
   */
  disconnectClientManage(): void {
    if (this.clientManageSocket) {
      this.clientManageSocket.close();
      this.clientManageSocket = null;
      console.log("🔌 クライアント管理サーバ切断");
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
      console.log("🔌 ゲームサーバ切断");
    }
    this.activeSocket = null;
    this.currentMode = null;
    this.handlers.clear();
  }
}

// シングルトンインスタンス
export const gameWebSocket = new GameWebSocket();
