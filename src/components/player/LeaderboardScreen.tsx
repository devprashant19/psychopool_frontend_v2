import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { Trophy, Medal, Crown } from 'lucide-react';

const LeaderboardScreen: React.FC = () => {
  // 1. Get real data from context
  const { players, myPlayerId, gameState } = useGame();

  // 2. Sort players by score (Safety check, though backend sends sorted)
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  
  // 3. Slice for Top 3 vs List
  const top3 = sortedPlayers.slice(0, 3);
  const restPlayers = sortedPlayers.slice(3);
  
  // 4. Get Current Player Data (to read their Rank)
  const currentPlayer = sortedPlayers.find((p) => p.userId === myPlayerId);
  const myRank = currentPlayer?.rank || 0;

  // Helper to get icon based on Actual Rank (not just position)
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-8 h-8" />;
    if (rank === 2) return <Medal className="w-7 h-7" />;
    return <Medal className="w-6 h-6" />;
  };

  const rankColors = [
    'text-neon-yellow neon-text-yellow',
    'text-gray-300',
    'text-amber-600',
  ];

  return (
    <div className="min-h-screen flex flex-col p-4 bg-background relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      <motion.div
        animate={{ opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-neon-yellow/10 rounded-full blur-3xl"
      />

      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-3 mb-2">
            <Trophy className="w-8 h-8 text-neon-yellow" style={{ filter: 'drop-shadow(0 0 10px hsl(var(--neon-yellow)))' }} />
            <h1 className="text-3xl font-display font-bold neon-text-yellow">
              {gameState === 'GAME_OVER' ? 'Final Results' : 'Leaderboard'}
            </h1>
          </div>
        </motion.div>

        {/* Top 3 Podium */}
        <div className="flex justify-center items-end gap-4 mb-8 h-48">
          {/* We map strictly to positions: Left(1), Center(0), Right(2) */}
          {[1, 0, 2].map((podiumIndex) => {
            const player = top3[podiumIndex];
            
            // If no player for this slot, render spacer
            if (!player) return <div key={podiumIndex} className="w-24" />;

            const heights = ['h-32', 'h-40', 'h-24'];
            const delays = [0.2, 0, 0.4];
            const isCurrentUser = player.userId === myPlayerId;
            
            // Visual Styling based on Podium Position (Gold/Silver/Bronze look)
            // Note: Even if tied for 1st, the center podium still looks "Gold"
            const visualColorClass = rankColors[podiumIndex];

            return (
              <motion.div
                key={player.userId || podiumIndex}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: delays[podiumIndex], duration: 0.5 }}
                className="flex flex-col items-center"
              >
                {/* Player info */}
                <motion.div
                  animate={podiumIndex === 0 ? { y: [0, -5, 0] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mb-2 text-center"
                >
                  <span className={`block ${visualColorClass}`}>
                    {/* Icon based on actual RANK, not position */}
                    {getRankIcon(player.rank || podiumIndex + 1)}
                  </span>
                  
                  <p className={`font-display font-bold text-sm mt-1 ${isCurrentUser ? 'text-neon-cyan' : 'text-foreground'}`}>
                    {player.name}
                  </p>
                  <p className="text-muted-foreground text-xs font-display">
                    {player.score} pts
                  </p>
                </motion.div>

                {/* Podium bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  transition={{ delay: delays[podiumIndex] + 0.3, duration: 0.4 }}
                  className={`w-20 ${heights[podiumIndex]} rounded-t-lg ${
                    podiumIndex === 0
                      ? 'bg-gradient-to-t from-neon-yellow/30 to-neon-yellow/10 border-t-2 border-x-2 border-neon-yellow'
                      : 'bg-gradient-to-t from-muted to-muted/50 border-t border-x border-border'
                  }`}
                  style={podiumIndex === 0 ? { boxShadow: '0 -10px 30px hsl(var(--neon-yellow) / 0.3)' } : {}}
                >
                  <div className="flex items-center justify-center h-full">
                    <span className={`text-2xl font-display font-black ${podiumIndex === 0 ? 'text-neon-yellow' : 'text-muted-foreground'}`}>
                      {/* 👇 SHOW BACKEND RANK (Handles Ties) */}
                      {player.rank}
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Current player rank highlight (Floating Sticky Bar) */}
        {/* Only show if they are NOT in the top 3 (index > 2) */}
        {sortedPlayers.findIndex(p => p.userId === myPlayerId) > 2 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-6 mx-4 p-4 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 neon-border-cyan"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-neon-cyan/20 flex items-center justify-center font-display font-bold text-neon-cyan">
                  {myRank}
                </span>
                <span className="font-semibold text-neon-cyan">
                  {currentPlayer?.name} (You)
                </span>
              </div>
              <span className="font-display font-bold text-neon-cyan">
                {currentPlayer?.score} pts
              </span>
            </div>
          </motion.div>
        )}

        {/* Rest of players */}
        <div className="flex-1 overflow-auto">
          <div className="space-y-2">
            {restPlayers.map((player, index) => {
              const isCurrentUser = player.userId === myPlayerId;
              
              return (
                <motion.div
                  key={player.userId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    isCurrentUser
                      ? 'bg-neon-cyan/10 border border-neon-cyan/30'
                      : 'bg-card/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-sm font-display font-semibold text-muted-foreground">
                      {/* 👇 USE BACKEND RANK (Handles Ties) */}
                      {player.rank}
                    </span>
                    <span className={`font-medium ${isCurrentUser ? 'text-neon-cyan' : 'text-foreground'}`}>
                      {player.name}
                      {isCurrentUser && ' (You)'}
                    </span>
                  </div>
                  <span className="font-display font-semibold text-muted-foreground">
                    {player.score} pts
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardScreen;