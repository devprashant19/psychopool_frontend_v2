import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import socketService from '@/services/socketService';
import {
  Play,
  SkipForward,
  Trophy,
  StopCircle,
  Users,
  Zap,
  RotateCcw,
  Eye,
  Wifi,
  WifiOff,
  Lock,
  Flame, // Imported for Chaos Mode
  Gem    // Imported for Normal Mode (if using lucide-react latest, otherwise use emoji)
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const {
    gameState,
    players,
    playerCount,
    minorityResult,
    startRound,
    nextQuestion,
    revealResults,
    showLeaderboard,
    endRound,
    resetGame,
    totalQuestionsInRound,
    gotoQuestion,
    currentRound
  } = useGame();

  const [isConnected, setIsConnected] = useState(socketService.isConnected());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");

  // 👇 NEW: State for the Winning Mode
  const [winningMode, setWinningMode] = useState<'MINORITY' | 'MAJORITY'>('MINORITY');

  // 1. Connection Check & Login Listeners
  useEffect(() => {
    const interval = setInterval(() => {
      setIsConnected(socketService.isConnected());
    }, 1000);

    // Listen for Login Success
    socketService.on("admin_login_success", () => {
      console.log("🔓 Login Successful");
      setIsAuthenticated(true);
      setLoginError("");
    });

    socketService.on("admin_login_fail", () => {
      setLoginError("Incorrect Password");
      setIsAuthenticated(false);
    });

    // 👇 NEW: Listen for State Sync (Initial Load)
    socketService.on("admin_state_sync", (data: any) => {
      if (data.winningMode) {
        setWinningMode(data.winningMode);
      }
    });

    // 👇 NEW: Listen for Mode Toggles (Real-time update)
    socketService.on("admin_mode_update", (newMode: 'MINORITY' | 'MAJORITY') => {
      setWinningMode(newMode);
    });

    return () => {
      clearInterval(interval);
      socketService.off("admin_login_success");
      socketService.off("admin_login_fail");
      socketService.off("admin_state_sync");
      socketService.off("admin_mode_update");
    };
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      setLoginError("Server disconnected. Cannot login.");
      return;
    }
    socketService.emit("admin_login", passwordInput);
  };

  const handleAction = (name: string, action: () => void) => {
    console.log(`🖱️ ADMIN ACTION: ${name}`);
    if (!isConnected) alert("⚠️ Socket Disconnected!");
    action();
  };

  // 👇 NEW: Toggle Handler
  const toggleMode = () => {
    socketService.emit("admin_toggle_mode");
  };

  // --- VIEW 1: LOGIN SCREEN ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center space-y-6"
        >
          <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-red-500" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Admin Access</h1>
            <p className="text-gray-400 text-sm">Enter the server password to control the game.</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="bg-gray-950 border-gray-700 text-white text-center h-12 text-lg"
              />
              {loginError && (
                <p className="text-red-400 text-xs font-medium animate-pulse">{loginError}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-red-600 hover:bg-red-500 text-white font-bold"
              disabled={!isConnected}
            >
              {isConnected ? "Unlock Controls" : "Connecting..."}
            </Button>
          </form>

          {!isConnected && (
            <div className="flex items-center justify-center gap-2 text-yellow-500 text-xs">
              <WifiOff className="w-3 h-3" />
              <span>Connecting to Server...</span>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background bg-grid p-4 sm:p-6 overflow-x-hidden">
      {/* Header */}
      <motion.div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Zap className="w-10 h-10 text-theme-red shrink-0" />
          <div>
            <h1 className="text-3xl font-display font-bold neon-text-cyan leading-none">Psycho Pool</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="flex items-center text-xs text-theme-success bg-theme-success/10 px-2 py-1 rounded-full border border-theme-success/20">
                <Wifi className="w-3 h-3 mr-1" /> Online & Auth
              </span>
              <span className="flex items-center text-xs text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded-full border border-cyan-400/20 font-bold">
                <Users className="w-3 h-3 mr-1.5" /> {playerCount} Players
              </span>
            </div>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => handleAction("Reset", resetGame)} className="w-full md:w-auto">
          <RotateCcw className="w-4 h-4 mr-2" />
          Force Reset
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="card-glow border-theme-red/30">
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 text-theme-red mx-auto mb-2" />
                <p className="text-3xl font-display font-bold text-theme-red">{playerCount}</p>
                <p className="text-xs text-muted-foreground uppercase">Live Players</p>
              </CardContent>
            </Card>

            <Card className="card-glow border-theme-success/30">
              <CardContent className="p-4 text-center">
                <div className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center bg-theme-success/10">
                  <Zap className="w-5 h-5 text-theme-success" />
                </div>
                <p className="text-xs font-display font-bold text-theme-success truncate mt-1">
                  {gameState}
                </p>
                <p className="text-xs text-muted-foreground uppercase">Status</p>
              </CardContent>
            </Card>
          </div>

          {/* CONTROL DECK */}
          <Card className="card-glow">
            <CardHeader>
              <CardTitle>Control Deck</CardTitle>
            </CardHeader>
            <CardContent>
              {/* 👇 NEW: The Chaos Mode Toggle Button */}
              <motion.div
                whileTap={{ scale: 0.98 }}
                className="mb-6"
              >
                <Button
                  onClick={toggleMode}
                  className={`w-full min-h-[4rem] h-auto py-3 text-sm sm:text-base md:text-lg font-bold uppercase tracking-wider border-2 transition-all duration-300 whitespace-normal text-center ${winningMode === 'MAJORITY'
                    ? 'bg-green-600 hover:bg-green-700 border-green-400 text-white shadow-[0_0_20px_rgba(22,163,74,0.5)]'
                    : 'bg-red-600 hover:bg-red-700 border-red-400 text-white shadow-[0_0_20px_rgba(220,38,38,0.5)]'
                    }`}
                >
                  {winningMode === 'MAJORITY' ? (
                    <div className="flex items-center gap-2">
                      <Flame className="w-6 h-6 animate-pulse" />
                      🔥 Chaos Mode: MAJORITY Wins
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Gem className="w-6 h-6" />
                      💎 Normal Mode: MINORITY Wins
                    </div>
                  )}
                </Button>
              </motion.div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
                <Button
                  className="h-20 flex-col gap-1 sm:gap-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs sm:text-sm whitespace-normal text-center px-1"
                  onClick={() => handleAction("Start Round", startRound)}
                >
                  <Play className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                  <span>Start Round</span>
                </Button>

                <Button
                  className="h-20 flex-col gap-1 sm:gap-2 bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-xs sm:text-sm whitespace-normal text-center px-1"
                  onClick={() => handleAction("Next Question", nextQuestion)}
                >
                  <SkipForward className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                  <span>Next Q</span>
                </Button>

                <Button
                  className="h-20 flex-col gap-1 sm:gap-2 bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm whitespace-normal text-center px-1"
                  onClick={() => handleAction("Reveal Results", revealResults)}
                >
                  <Eye className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                  <span>Reveal</span>
                </Button>

                <Button
                  className="h-20 flex-col gap-1 sm:gap-2 bg-yellow-500 hover:bg-yellow-400 text-black text-xs sm:text-sm whitespace-normal text-center px-1"
                  onClick={() => handleAction("Leaderboard", showLeaderboard)}
                >
                  <Trophy className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                  <span>Leaderboard</span>
                </Button>

                <Button
                  variant="destructive"
                  className="h-20 flex-col gap-1 sm:gap-2 text-xs sm:text-sm whitespace-normal text-center px-1"
                  onClick={() => handleAction("End Round", endRound)}
                >
                  <StopCircle className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                  <span>End Round</span>
                </Button>
              </div>

              {currentRound > 0 && totalQuestionsInRound > 0 && (
                <div className="mt-6 border-t border-gray-800 pt-6">
                  <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Jump to Question</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2">
                    {Array.from({ length: totalQuestionsInRound }).map((_, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        className="h-12 border-gray-700 hover:bg-gray-800 hover:text-white text-lg font-bold bg-gray-900/50"
                        onClick={() => handleAction(`Go to Q${i + 1}`, () => gotoQuestion(i))}
                      >
                        Q {i + 1}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* RESULTS PANEL */}
          {minorityResult && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="card-glow border-theme-red/20">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <CardTitle>Vote Distribution</CardTitle>
                    {/* 👇 Display Active Mode in Results */}
                    <span className={`text-xs font-bold px-2 py-1 rounded ${winningMode === 'MAJORITY' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                      }`}>
                      {winningMode === 'MAJORITY' ? 'Winning: MOST Votes' : 'Winning: LEAST Votes'}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(minorityResult.voteCounts).map(([option, count]) => {
                      const isWinner = minorityResult.winningOptions.includes(option);
                      const maxVote = Math.max(...Object.values(minorityResult.voteCounts) as number[]) || 1;

                      return (
                        <div key={option} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className={isWinner ? "text-theme-success font-bold" : "text-muted-foreground"}>
                              {option} {isWinner && "(WINNER)"}
                            </span>
                            <span>{count as number} votes</span>
                          </div>
                          <div className="h-4 bg-muted/30 rounded-full">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${isWinner ? "bg-theme-success shadow-[0_0_10px_rgba(34,197,94,0.5)]" : "bg-theme-red/50"}`}
                              style={{ width: `${((count as number) / maxVote) * 100}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* LEADERBOARD PANEL */}
          {gameState === 'LEADERBOARD' && players.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
              <Card className="card-glow border-yellow-500/20">
                <CardHeader>
                  <CardTitle className="text-yellow-500 flex items-center gap-2">
                    <Trophy className="w-6 h-6" /> Live Leaderboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2">
                    {players.map((p, index) => (
                      <div key={p.userId} className="flex justify-between items-center p-3 rounded-lg bg-black/40 border border-white/10 hover:border-yellow-500/50 transition-colors">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <span className="text-lg font-bold text-yellow-500 w-8 shrink-0">#{p.rank || index + 1}</span>
                          <span className="font-semibold text-white truncate max-w-[150px]">{p.name}</span>
                        </div>
                        <span className="font-mono text-cyan-400 font-bold">{p.score} pts</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;