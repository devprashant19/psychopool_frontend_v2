import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext'; // Import context
import { Loader2, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const LobbyScreen: React.FC = () => {
  // Get players from context to show who is waiting
  const { players, playerCount } = useGame();

  return (
    <div className="flex flex-col items-center min-h-screen p-6 bg-grid">
      
      {/* 1. Main Waiting Animation */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mt-12 text-center space-y-6"
      >
        <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
          {/* Outer Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-t-4 border-neon-cyan opacity-50"
          />
          {/* Inner Ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 rounded-full border-b-4 border-neon-magenta opacity-50"
          />
          {/* Icon */}
          <Loader2 className="w-10 h-10 text-white animate-spin-slow" />
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-bold font-display tracking-wider text-white">
            YOU'RE IN!
          </h2>
          <p className="text-muted-foreground animate-pulse">
            Waiting for host to start...
          </p>
        </div>
      </motion.div>

      {/* 2. Player Count Badge */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
      >
        <Users className="w-4 h-4 text-neon-yellow" />
        <span className="font-bold text-neon-yellow">{playerCount}</span>
        <span className="text-sm text-gray-400">Players Waiting</span>
      </motion.div>

      {/* 3. Player List (The part causing your 'key' warning previously) */}
      <div className="w-full max-w-md mt-8 grid grid-cols-2 gap-3 overflow-y-auto max-h-[300px] pr-2 scrollbar-hide">
        {players.map((player, index) => (
          <motion.div
            // FIX: This 'key' prop MUST be unique. We use userId.
            key={player.userId || index} 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-card/30 border-white/5 backdrop-blur-sm">
              <CardContent className="p-3 flex items-center justify-center text-center">
                <span className="font-medium text-sm truncate text-gray-300">
                  {player.name}
                </span>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

    </div>
  );
};

export default LobbyScreen;