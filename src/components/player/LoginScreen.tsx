import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGame } from '@/contexts/GameContext';
import { Zap } from 'lucide-react';

const LoginScreen: React.FC = () => {
  const [nickname, setNickname] = useState('');
  const { joinGame, error } = useGame();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nickname.trim()) {
      joinGame(nickname.trim());
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-grid relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-theme-red/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-theme-white/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-10"
        >
          <div className="inline-flex flex-wrap justify-center items-center gap-2 sm:gap-3 mb-4 relative text-center">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Zap className="w-12 h-12 sm:w-16 sm:h-16 text-theme-red animate-pulse-fast shrink-0" style={{ filter: 'drop-shadow(0 0 10px hsl(var(--theme-red)))' }} />
            </motion.div>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-white drop-shadow-lg leading-tight" style={{ textShadow: '0 0 10px hsl(var(--theme-white))' }}>
              Psycho Pool
            </h1>
          </div>
          <p className="text-glow-white text-lg font-bold tracking-widest uppercase mb-2">
            Enter your nickname to begin
          </p>
          <p className="text-muted-foreground text-sm mb-2">
            Compete live, climb the leaderboard, and outsmart your friends!
          </p>
        </motion.div>

        {/* Login Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {error && (
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-theme-white text-center font-bold animate-pulse"
            >
              ⚠️ {error}
            </motion.p>
          )}
          <div className="relative box-theme p-2 rounded-2xl border-2 border-theme-red/40 bg-black/30 shadow-lg flex gap-2 items-center">
            <Input
              type="text"
              placeholder="PLAYER 1 NAME"
              value={nickname}
              onChange={(e) => setNickname(e.target.value.toUpperCase())}
              maxLength={12}
              className="text-center text-xl bg-transparent border-none text-white font-display uppercase tracking-widest placeholder:text-gray-600 focus-visible:ring-0"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="ml-2 px-2 py-1 text-xs border-theme-white text-theme-white hover:bg-theme-white/10"
              onClick={() => setNickname(["SHARKY","ACE","MAVERICK","QUEEN","POOLSTAR","LUCKY","BLAZE","STRIKE","MAGIC","WIZ","BOSS"][Math.floor(Math.random()*11)])}
            >
              🎲 Random
            </Button>
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              type="submit"
              variant="ghost"
              size="xl"
              className="w-full btn-theme h-16 text-xl animate-pulse shadow-md bg-gradient-to-r from-theme-red/30 to-theme-white/20 hover:from-theme-white/30 hover:to-theme-red/20"
              disabled={!nickname.trim()}
            >
              JOIN GAME
            </Button>
          </motion.div>
        </motion.form>

        {/* Quick Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-8 mb-2 bg-black/30 border-l-4 border-theme-gray/60 p-4 rounded-xl shadow-md"
        >
          <h3 className="text-theme-gray font-bold mb-1 text-base">Quick Tips:</h3>
          <ul className="text-muted-foreground text-xs list-disc list-inside space-y-1">
            <li>Use a fun nickname for the leaderboard!</li>
            <li>Fastest answers get more points.</li>
            <li>Wait for the host to start the game.</li>
          </ul>
        </motion.div>

        {/* Footer hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center text-muted-foreground text-sm mt-4"
        >
          Waiting for host to start the game
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoginScreen;
