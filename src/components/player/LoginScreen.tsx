import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGame } from '@/contexts/GameContext';
import { Zap } from 'lucide-react';

const LoginScreen: React.FC = () => {
  const [nickname, setNickname] = useState('');
  const { joinGame } = useGame();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nickname.trim()) {
      joinGame(nickname.trim());
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-grid relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-neon-magenta/10 rounded-full blur-3xl" />

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
          <div className="inline-flex items-center gap-3 mb-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Zap className="w-16 h-16 text-neon-cyan animate-pulse-fast" style={{ filter: 'drop-shadow(0 0 10px hsl(var(--neon-cyan)))' }} />
            </motion.div>
            <h1 className="text-5xl font-display font-bold neon-text-cyan">
              Psycho Pool
            </h1>

          </div>
          <p className="text-glow-pink text-lg font-bold tracking-widest uppercase">
            Enter name to begin
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
          <div className="relative box-arcade p-2">
            <Input
              type="text"
              placeholder="PLAYER 1 NAME"
              value={nickname}
              onChange={(e) => setNickname(e.target.value.toUpperCase())}
              maxLength={12}
              className="text-center text-xl bg-transparent border-none text-white font-display uppercase tracking-widest placeholder:text-gray-600 focus-visible:ring-0"
            />
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              type="submit"
              variant="ghost"
              size="xl"
              className="w-full btn-arcade h-16 text-xl animate-pulse"
              disabled={!nickname.trim()}
            >
              JOIN GAME
            </Button>
          </motion.div>
        </motion.form>

        {/* Footer hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center text-muted-foreground text-sm mt-8"
        >
          Waiting for host to start the game
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoginScreen;
