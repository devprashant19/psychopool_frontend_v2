import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';

const RoundLoadingScreen: React.FC = () => {
  // 1. Remove 'countdown' from context (it doesn't exist there)
  const { currentRound } = useGame();
  
  // 2. Add Local State for the visual countdown
  const [count, setCount] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0; // Stops at 0
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
      {/* Dynamic background */}
      <motion.div
        animate={{
          background: [
            'radial-gradient(circle at 50% 50%, hsl(var(--neon-cyan) / 0.2) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 50%, hsl(var(--neon-magenta) / 0.2) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 50%, hsl(var(--neon-cyan) / 0.2) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0"
      />

      <div className="relative z-10 text-center">
        {/* Round indicator */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-xl text-muted-foreground font-display uppercase tracking-widest mb-2">
            Get Ready
          </h2>
          <h1 className="text-4xl md:text-5xl font-display font-bold neon-text-magenta">
            Round {currentRound}
          </h1>
        </motion.div>

        {/* Countdown display */}
        <div className="relative w-48 h-48 mx-auto">
          {/* Circular progress */}
          <motion.svg
            className="absolute inset-0 w-full h-full -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="4"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ pathLength: 1 }}
              animate={{ pathLength: 0 }}
              transition={{ duration: 3, ease: 'linear' }}
              style={{
                strokeDasharray: '283',
                filter: 'drop-shadow(0 0 10px hsl(var(--neon-cyan)))',
              }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--neon-cyan))" />
                <stop offset="100%" stopColor="hsl(var(--neon-magenta))" />
              </linearGradient>
            </defs>
          </motion.svg>

          {/* Countdown number */}
          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {count > 0 ? (
                <motion.span
                  key={count}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-8xl font-display font-black neon-text-cyan"
                >
                  {count}
                </motion.span>
              ) : (
                <motion.span
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-2xl font-display font-bold text-white animate-pulse"
                >
                  GO!
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Motivational text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="mt-8 text-lg text-muted-foreground font-display"
        >
          {count > 0 ? "Starting Soon..." : "Waiting for Host..."}
        </motion.p>
      </div>

      {/* Decorative elements */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute top-20 left-10 w-20 h-20 border border-neon-cyan/20 rounded-full"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        className="absolute bottom-20 right-10 w-32 h-32 border border-neon-magenta/20 rounded-full"
      />
    </div>
  );
};

export default RoundLoadingScreen;