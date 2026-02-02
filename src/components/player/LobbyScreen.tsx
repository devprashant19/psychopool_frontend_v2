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
            className="absolute inset-0 rounded-md border-t-4 border-neon-cyan opacity-50"
          />
          {/* Inner Ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 rounded-md border-b-4 border-neon-magenta opacity-50"
          />
          {/* Icon */}
          <Loader2 className="w-10 h-10 text-white animate-spin-slow" />
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-bold font-display tracking-wider text-white">
            YOU'RE IN!
          </h2>
          <p className="text-neon-cyan animate-glitch font-bold uppercase tracking-widest">
            WAITING FOR CHALLENGERS...
          </p>
        </div>
      </motion.div>

      {/* 2. Player Count Badge */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 flex items-center gap-2 px-6 py-3 bg-black/50 border-2 border-neon-yellow shadow-[0_0_15px_rgba(255,255,0,0.3)] backdrop-blur-md skew-x-[-10deg]"
      >
        <Users className="w-4 h-4 text-neon-yellow" />
        <span className="font-bold text-neon-yellow">{playerCount}</span>
        <span className="text-sm text-gray-400">Players Waiting</span>
      </motion.div>

      {/* 3. Player List (The part causing your 'key' warning previously) */}
      <div className="w-full max-w-5xl mt-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 overflow-y-auto max-h-[60vh] pr-2 scrollbar-hide">
        {players.map((player, index) => (
          <motion.div
            // FIX: This 'key' prop MUST be unique. We use userId.
            key={player.userId || index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-black/40 border-b-2 border-r-2 border-neon-green/50 backdrop-blur-sm rounded-none">
              <CardContent className="p-3 flex items-center justify-center text-center">
                <span className="font-bold text-sm truncate text-neon-green font-display uppercase tracking-wider">
                  {player.name}
                </span>
                {/* Ready Indicator */}
                <div className="w-2 h-2 ml-2 bg-neon-green rounded-full animate-ping" />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

    </div>
  );
};

export default LobbyScreen;