import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import LoginScreen from './LoginScreen';
import LobbyScreen from './LobbyScreen';
import RoundLoadingScreen from './RoundLoadingScreen';
import QuestionScreen from './QuestionScreen';
import LeaderboardScreen from './LeaderboardScreen';
// 1. IMPORT THE NEW SCREEN
import ResultScreen from './ResultScreen'; 

const PlayerView: React.FC = () => {
  const { gameState } = useGame();

  const renderScreen = () => {
    switch (gameState) {
      case 'DISCONNECTED':
        return <LoginScreen />;
      case 'LOBBY':
        return <LobbyScreen />;
      case 'ROUND_LOADING':
        return <RoundLoadingScreen />;
      case 'QUESTION_ACTIVE':
        return <QuestionScreen />;
      
      // 2. ADD THIS CASE
      case 'WAITING_RESULT':
        return <ResultScreen />;
        
      case 'LEADERBOARD':
      case 'GAME_OVER':
        return <LeaderboardScreen />;
      default:
        return <LoginScreen />;
    }
  };

  return (
    <div className="min-h-screen max-w-md mx-auto bg-background">
      <AnimatePresence mode="wait">
        <motion.div
          key={gameState}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen"
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PlayerView;