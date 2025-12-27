import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Loader2 } from 'lucide-react';

const ResultScreen: React.FC = () => {
  const { minorityResult } = useGame();

  if (!minorityResult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-neon-cyan" />
        <p>Calculating Minority...</p>
      </div>
    );
  }

  const { voteCounts, winningOptions } = minorityResult;
  const maxVotes = Math.max(...Object.values(voteCounts));

  return (
    <div className="min-h-screen p-6 bg-grid flex flex-col items-center justify-center">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-display font-bold text-white">
            Round Results
          </h1>
          <p className="text-muted-foreground">The minority option wins!</p>
        </div>

        {/* Results Card */}
        <Card className="card-glow border-neon-purple/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-neon-purple">
              <BarChart3 className="w-5 h-5" />
              Vote Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(voteCounts).map(([option, count], index) => {
              const isWinner = winningOptions.includes(option);
              
              return (
                <motion.div 
                  key={option}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-1"
                >
                  <div className="flex justify-between text-sm font-medium">
                    <span className={isWinner ? "text-neon-green" : "text-gray-400"}>
                      {option} {isWinner && "👑"}
                    </span>
                    <span className="text-white">{count} votes</span>
                  </div>
                  
                  <div className="h-4 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / maxVotes) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full ${
                        isWinner 
                          ? 'bg-neon-green shadow-[0_0_10px_hsl(var(--neon-green))]' 
                          : 'bg-gray-600'
                      }`}
                    />
                  </div>
                </motion.div>
              );
            })}
          </CardContent>
        </Card>

        {/* Footer Message */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center p-4 rounded-xl bg-white/5 border border-white/10"
        >
          <p className="text-sm text-gray-300 animate-pulse">
            Waiting for host to start next question...
          </p>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default ResultScreen;