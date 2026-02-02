import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Loader2, Flame, Gem } from 'lucide-react';

const ResultScreen: React.FC = () => {
  const { minorityResult } = useGame();

  if (!minorityResult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-neon-cyan" />
        <p>Calculating Results...</p>
      </div>
    );
  }

  // 1. Destructure Data & Mode
  const { voteCounts, winningOptions, mode } = minorityResult;
  const maxVotes = Math.max(...Object.values(voteCounts));

  // 2. Determine Display Mode (Default to MINORITY if undefined)
  const currentMode = mode || 'MINORITY';
  const isChaos = currentMode === 'MAJORITY';

  return (
    <div className="min-h-screen p-6 bg-grid flex flex-col items-center justify-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-4xl space-y-6"
      >
        {/* Header - Dynamic based on Mode */}
        <div className="text-center space-y-2">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="flex items-center justify-center gap-2"
          >
            {isChaos ? (
              <Flame className="w-8 h-8 text-red-500 animate-pulse" />
            ) : (
              <Gem className="w-8 h-8 text-neon-green" />
            )}
            <h1 className={`text-3xl font-display font-bold ${isChaos ? 'text-red-500' : 'text-neon-green'}`}>
              {isChaos ? 'MAJORITY WINS!' : 'MINORITY WINS!'}
            </h1>
          </motion.div>

          <p className="text-muted-foreground">
            The option with the <strong className="text-white">{isChaos ? 'MOST' : 'FEWEST'}</strong> votes takes the points.
          </p>
        </div>

        {/* Results Card */}
        <div className={`box-arcade p-6 md:p-10 ${isChaos ? 'border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.4)]' : 'border-neon-green shadow-[0_0_40px_rgba(74,222,128,0.4)]'}`}>
          <div className="mb-4 text-center">
            <h2 className={`flex items-center justify-center gap-2 text-xl font-display font-bold uppercase tracking-widest ${isChaos ? 'text-red-400 text-glow-pink' : 'text-neon-green text-glow-cyan'}`}>
              <BarChart3 className="w-6 h-6" />
              Vote Stats
            </h2>
          </div>
          <div className="space-y-4">
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
                    <span className={isWinner ? (isChaos ? "text-red-500 font-bold" : "text-neon-green font-bold") : "text-gray-400"}>
                      {option} {isWinner && (isChaos ? "🔥" : "👑")}
                    </span>
                    <span className="text-white">{count} votes</span>
                  </div>

                  <div className="h-4 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / maxVotes) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full ${isWinner
                        ? (isChaos
                          ? 'bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]'
                          : 'bg-gradient-to-r from-neon-green to-emerald-600 shadow-[0_0_20px_hsl(var(--neon-green))]')
                        : 'bg-gradient-to-r from-gray-700 to-gray-800'
                        }`}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

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

      </motion.div >
    </div >
  );
};

export default ResultScreen;