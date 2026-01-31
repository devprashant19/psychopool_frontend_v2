import { io, Socket } from "socket.io-client";

// --- 1. GAME STATE ---
export type GameState = 
  | 'DISCONNECTED' 
  | 'LOBBY' 
  | 'ROUND_LOADING' 
  | 'QUESTION_ACTIVE' 
  | 'WAITING_RESULT' 
  | 'LEADERBOARD' 
  | 'GAME_OVER';

export type WinningMode = 'MINORITY' | 'MAJORITY';

// --- 2. DATA TYPES ---
export interface QuestionData {
  id: string;
  text: string;
  options: string[];
  timeLimit: number;
  correctAnswer?: number; 
}
export type Question = QuestionData;

export interface LeaderboardEntry {
  userId: string;
  name: string;
  score: number;
  rank?: number;
  lastAnswerCorrect?: boolean;
}
export type Player = LeaderboardEntry;

// --- 3. SOCKET EVENT INTERFACES ---
interface ServerToClientEvents {
  connect: () => void;
  disconnect: () => void;
  join_success: (data: { playerId: string }) => void;
  player_count_update: (count: number) => void;
  round_start: (data: { round: number }) => void;
  new_question: (data: Question) => void;
  
  answer_result: (data: { isCorrect: boolean; correctAnswer: number; scoreDelta: number }) => void;
  
  minority_result: (data: { 
    voteCounts: Record<string, number>; 
    winningOptions: string[];
    mode?: WinningMode;
  }) => void;

  show_leaderboard: (data: Player[]) => void;
  round_over: () => void;
  game_reset: () => void; 

  admin_login_success: () => void;
  admin_login_fail: () => void;
  admin_mode_update: (mode: WinningMode) => void;

  admin_state_sync: (data: { 
    phase: GameState; 
    round: number; 
    question: Question | null; 
    result: { voteCounts: Record<string, number>; winningOptions: string[] } | null; 
    winningMode?: WinningMode;
  }) => void;

  player_reconnect_success: (data: { 
    playerId: string;
    name: string;
    score: number;
    phase: GameState; 
    round: number; 
    question: Question | null; 
    result: { voteCounts: Record<string, number>; winningOptions: string[] } | null; 
  }) => void;

  player_reconnect_fail: () => void;
}

interface ClientToServerEvents {
  join_game: (data: { name: string }) => void;
  submit_answer: (data: { playerId: string; questionId: string; answer: string; timeTaken?: number }) => void;
  
  admin_start_round: (data: { roundNumber: number }) => void;
  admin_next_question: () => void;
  admin_reveal_results: () => void;
  admin_show_leaderboard: () => void;
  admin_end_round: () => void;
  admin_reset_game: () => void;
  admin_login: (password: string) => void;
  admin_toggle_mode: () => void;

  player_reconnect: (playerId: string) => void;
}

// --- 4. THE SERVICE CLASS ---
class SocketService {
  public socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;
  private pendingListeners: Array<{ event: string, callback: any }> = [];

  connect(url: string): void {
    if (this.socket) return;
    
    // 👇 FIXED: Added Polling + Reconnection Logic
    this.socket = io(url, {
      transports: ["polling", "websocket"], // Vital for Cloud Run
      withCredentials: true,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    this.pendingListeners.forEach(({ event, callback }) => {
      // @ts-ignore
      this.socket?.on(event, callback);
    });
    this.pendingListeners = [];

    this.socket.on("connect", () => {
      console.log("✅ Socket Connected:", this.socket?.id);
    });

    // Debug connection errors
    this.socket.on("connect_error", (err) => {
      console.error("❌ Connection Error:", err.message);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  emit<T extends keyof ClientToServerEvents>(
    event: T, 
    ...args: Parameters<ClientToServerEvents[T]>
  ): void {
    this.socket?.emit(event, ...args);
  }

  on<T extends keyof ServerToClientEvents>(
    event: T, 
    callback: ServerToClientEvents[T]
  ): void {
    if (this.socket) {
      // @ts-ignore
      this.socket.on(event, callback);
    } else {
      console.log(`⏳ Queueing listener for: ${event}`);
      this.pendingListeners.push({ event, callback });
    }
  }

  off<T extends keyof ServerToClientEvents>(event: T): void {
    this.socket?.off(event);
  }
}

const socketService = new SocketService();
export default socketService;