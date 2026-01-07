import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Ensure you have this or use standard <input>
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import socketService from '@/services/socketService';
import { 
  Play, 
  SkipForward, 
  Trophy, 
  StopCircle, 
  Users, 
  Target,
  Zap,
  RotateCcw,
  Eye,
  BarChart3,
  Wifi,
  WifiOff,
  Lock,
  LogIn
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { 
    gameState, 
    currentRound, 
    totalRounds, 
    playerCount, 
    players, 
    currentQuestion,
    minorityResult,
    startRound, 
    nextQuestion, 
    revealResults, 
    showLeaderboard, 
    endRound,
    resetGame 
  } = useGame();

  const [isConnected, setIsConnected] = useState(socketService.isConnected());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");

  // 1. Connection Check & Login Listeners
  useEffect(() => {
    // Check connection pulse
    const interval = setInterval(() => {
      setIsConnected(socketService.isConnected());
    }, 1000);

    // Listen for Login Success/Fail from Server
    socketService.on("admin_login_success", () => {
      console.log("🔓 Login Successful");
      setIsAuthenticated(true);
      setLoginError("");
    });

    socketService.on("admin_login_fail", () => {
      console.log("🔒 Login Failed");
      setLoginError("Incorrect Password");
      setIsAuthenticated(false);
    });

    return () => {
      clearInterval(interval);
      socketService.off("admin_login_success");
      socketService.off("admin_login_fail");
    };
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      setLoginError("Server disconnected. Cannot login.");
      return;
    }
    // Send password to server
    socketService.emit("admin_login", passwordInput);
  };

  const handleAction = (name: string, action: () => void) => {
    console.log(`🖱️ ADMIN ACTION: ${name}`);
    if (!isConnected) alert("⚠️ Socket Disconnected!");
    action();
  };

  // --- VIEW 1: LOGIN SCREEN (If not authenticated) ---
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

  // --- VIEW 2: CONTROL DASHBOARD (If authenticated) ---
  return (
    <div className="min-h-screen bg-background bg-grid p-6">
      {/* Header */}
      <motion.div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Zap className="w-10 h-10 text-neon-cyan" />
          <div>
            <h1 className="text-3xl font-display font-bold neon-text-cyan">Psycho Pool</h1>
            <div className="flex items-center gap-2">
              <p className="text-muted-foreground">Admin Control Panel</p>
              <span className="flex items-center text-xs text-neon-green bg-neon-green/10 px-2 py-0.5 rounded-full border border-neon-green/20">
                <Wifi className="w-3 h-3 mr-1" /> Online & Authenticated
              </span>
            </div>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => handleAction("Reset", resetGame)}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Force Reset
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          
          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="card-glow border-neon-cyan/30">
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 text-neon-cyan mx-auto mb-2" />
                <p className="text-3xl font-display font-bold text-neon-cyan">{playerCount}</p>
                <p className="text-xs text-muted-foreground uppercase">Live Players</p>
              </CardContent>
            </Card>
            
            <Card className="card-glow border-neon-green/30">
              <CardContent className="p-4 text-center">
                <div className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center bg-neon-green/10">
                   <Zap className="w-5 h-5 text-neon-green" />
                </div>
                <p className="text-xs font-display font-bold text-neon-green truncate mt-1">
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
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                
                <Button
                  className="h-20 flex-col gap-2 bg-cyan-600 hover:bg-cyan-500 text-white"
                  onClick={() => handleAction("Start Round", startRound)}
                >
                  <Play className="w-6 h-6" />
                  <span>Start Round</span>
                </Button>

                <Button
                  className="h-20 flex-col gap-2 bg-fuchsia-600 hover:bg-fuchsia-500 text-white"
                  onClick={() => handleAction("Next Question", nextQuestion)}
                >
                  <SkipForward className="w-6 h-6" />
                  <span>Next Q</span>
                </Button>

                <Button
                  className="h-20 flex-col gap-2 bg-purple-600 hover:bg-purple-500 text-white"
                  onClick={() => handleAction("Reveal Results", revealResults)}
                >
                  <Eye className="w-6 h-6" />
                  <span>Reveal</span>
                </Button>

                <Button
                  className="h-20 flex-col gap-2 bg-yellow-500 hover:bg-yellow-400 text-black"
                  onClick={() => handleAction("Leaderboard", showLeaderboard)}
                >
                  <Trophy className="w-6 h-6" />
                  <span>Leaderboard</span>
                </Button>

                <Button
                  variant="destructive"
                  className="h-20 flex-col gap-2"
                  onClick={() => handleAction("End Round", endRound)}
                >
                  <StopCircle className="w-6 h-6" />
                  <span>End Round</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* RESULTS PANEL */}
          {minorityResult && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="card-glow border-neon-cyan/20">
                <CardHeader><CardTitle>Vote Distribution</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(minorityResult.voteCounts).map(([option, count]) => {
                      const isWinner = minorityResult.winningOptions.includes(option);
                      const maxVote = Math.max(...Object.values(minorityResult.voteCounts)) || 1;
                      return (
                        <div key={option} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className={isWinner ? "text-neon-green font-bold" : "text-muted-foreground"}>
                              {option} {isWinner && "(WINNER)"}
                            </span>
                            <span>{count} votes</span>
                          </div>
                          <div className="h-4 bg-muted/30 rounded-full">
                            <div 
                              className={`h-full rounded-full ${isWinner ? "bg-neon-green" : "bg-neon-cyan/50"}`}
                              style={{ width: `${(count / maxVote) * 100}%` }}
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
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;