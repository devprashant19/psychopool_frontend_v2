import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import socketService, { 
  GameState, 
  Player, 
  Question, 
  QuestionData 
} from '@/services/socketService';

// 👇 DEFINE YOUR BACKEND URL HERE
// For local dev: "http://localhost:4000"
// For production: "https://your-app-name.onrender.com"
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

export interface MinorityResultData {
  voteCounts: Record<string, number>;
  winningOptions: string[];
  mode?: 'MINORITY' | 'MAJORITY'; // Added mode to interface
}

interface GameContextType {
  gameState: GameState;
  currentRound: number;
  totalRounds: number;
  players: Player[];
  currentQuestion: Question | null;
  playerCount: number;
  myPlayerId: string | null;
  minorityResult: MinorityResultData | null;

  joinGame: (nickname: string) => void;
  submitAnswer: (answer: string) => void; 
  startRound: () => void;
  nextQuestion: () => void;
  showLeaderboard: () => void;
  endRound: () => void;
  resetGame: () => void;
  revealResults: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within a GameProvider');
  return context;
};

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>("DISCONNECTED");
  const [currentRound, setCurrentRound] = useState(0);
  const [totalRounds] = useState(5);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [playerCount, setPlayerCount] = useState(0);
  const [myPlayerId, setMyPlayerId] = useState<string | null>(null);
  const [minorityResult, setMinorityResult] = useState<MinorityResultData | null>(null);

  // --- 1. INITIALIZE CONNECTION (NEW) ---
  useEffect(() => {
    console.log("🔌 Connecting to backend:", BACKEND_URL);
    socketService.connect(BACKEND_URL);

    return () => {
      socketService.disconnect();
    };
  }, []);

  // --- 2. SETUP LISTENERS ---
  useEffect(() => {
    const savedPlayerId = localStorage.getItem("my_player_id");

    socketService.on("connect", () => {
      console.log("✅ Socket Connected Successfully");
      // If we have a saved ID, try to auto-reconnect
      if (savedPlayerId) {
        console.log(`♻️ Found saved ID: ${savedPlayerId}, attempting reconnect...`);
        socketService.emit("player_reconnect", savedPlayerId);
      }
    });

    socketService.on("disconnect", () => {
        console.log("❌ Socket Disconnected");
        setGameState("DISCONNECTED");
    });

    socketService.on("join_success", (data) => {
      setMyPlayerId(data.playerId);
      setGameState("LOBBY"); 
      // SAVE ID WHEN JOINING
      localStorage.setItem("my_player_id", data.playerId);
    });

    socketService.on("player_count_update", (count) => setPlayerCount(count));

    socketService.on("round_start", (data) => {
      setCurrentRound(data.round);
      setGameState("ROUND_LOADING");
    });

    socketService.on("new_question", (data: QuestionData) => {
      setCurrentQuestion(data); 
      setMinorityResult(null); 
      setGameState("QUESTION_ACTIVE");
    });

    socketService.on("show_leaderboard", (data: Player[]) => {
      setPlayers(data); 
      setGameState("LEADERBOARD");
    });

    socketService.on("round_over", () => setGameState("LOBBY"));

    socketService.on("game_reset", () => {
      setGameState("DISCONNECTED");
      setPlayers([]);
      setPlayerCount(0);
      setCurrentRound(0);
      setMyPlayerId(null);
      setCurrentQuestion(null);
      setMinorityResult(null);
      // CLEAR ID ON RESET
      localStorage.removeItem("my_player_id");
      window.location.reload();
    });

    socketService.on("minority_result", (data) => {
      console.log("📊 Received Minority Results:", data);
      setMinorityResult(data);
      setGameState("WAITING_RESULT"); 
    });

    socketService.on("admin_state_sync", (data) => {
      console.log("🔄 Restoring Admin State:", data);
      setGameState(data.phase);
      setCurrentRound(data.round);
      if (data.question) setCurrentQuestion(data.question);
      else setCurrentQuestion(null);
      if (data.result) setMinorityResult(data.result);
      else setMinorityResult(null);
    });

    // --- HANDLE PLAYER RECONNECT SUCCESS ---
    socketService.on("player_reconnect_success", (data) => {
      console.log("✅ Reconnect Successful!", data);
      
      // Restore Identity
      setMyPlayerId(data.playerId);
      
      // Restore Game State
      setGameState(data.phase);
      setCurrentRound(data.round);
      
      if (data.question) setCurrentQuestion(data.question);
      else setCurrentQuestion(null);

      if (data.result) setMinorityResult(data.result);
      else setMinorityResult(null);
    });

    // --- HANDLE PLAYER RECONNECT FAILURE ---
    socketService.on("player_reconnect_fail", () => {
      console.log("❌ Reconnect Failed (Invalid ID or Server Restarted)");
      localStorage.removeItem("my_player_id"); // Clear bad ID
      setGameState("DISCONNECTED"); // Send to Login
    });

    return () => {
      socketService.off("connect");
      socketService.off("disconnect");
      socketService.off("join_success");
      socketService.off("player_count_update");
      socketService.off("round_start");
      socketService.off("new_question");
      socketService.off("show_leaderboard");
      socketService.off("round_over");
      socketService.off("game_reset");
      socketService.off("minority_result");
      socketService.off("admin_state_sync");
      socketService.off("player_reconnect_success");
      socketService.off("player_reconnect_fail");
    };
  }, []);

  // --- ACTIONS ---

  const joinGame = (nickname: string) => {
    socketService.emit("join_game", { name: nickname });
    setGameState("LOBBY"); 
  };

  const submitAnswer = (answer: string) => {
    if (!currentQuestion || !myPlayerId) return;
    socketService.emit("submit_answer", {
      playerId: myPlayerId,
      questionId: currentQuestion.id,
      answer: answer,
    });
  };

  const startRound = () => {
    socketService.emit("admin_start_round", { roundNumber: currentRound + 1 });
  };

  const nextQuestion = () => socketService.emit("admin_next_question");
  const showLeaderboard = () => socketService.emit("admin_show_leaderboard");
  const endRound = () => socketService.emit("admin_end_round");
  const resetGame = () => socketService.emit("admin_reset_game");

  const revealResults = () => {
    socketService.emit("admin_reveal_results");
  };
  console.log("Attempting to connect to:", BACKEND_URL);
  return (
    <GameContext.Provider value={{
      gameState,
      currentRound,
      totalRounds,
      players,
      currentQuestion,
      playerCount,
      myPlayerId,
      minorityResult, 
      joinGame,
      submitAnswer,
      startRound,
      nextQuestion,
      showLeaderboard,
      endRound,
      resetGame,
      revealResults,
    }}>
      {children}
    </GameContext.Provider>
  );
};