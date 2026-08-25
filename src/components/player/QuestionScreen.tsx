import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { Check, X, Loader2 } from 'lucide-react';
import socketService from '@/services/socketService';

// Removed unused optionColors array since all options now start white

const QuestionScreen: React.FC = () => {

  const { currentQuestion, submitAnswer } = useGame();

  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [serverResult, setServerResult] = useState<{ correct: boolean; winningOptions: string[] } | null>(null);
  const [timeLeft, setTimeLeft] = useState(currentQuestion?.timeLimit || 15);

  useEffect(() => {
    if (!currentQuestion) return;


    setSelectedIdx(null);
    setIsLocked(false);
    setServerResult(null);
    setTimeLeft(currentQuestion.timeLimit);

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);


    const handleResult = (data: any) => {
      setServerResult({ correct: data.isCorrect, winningOptions: data.winningOptions || [] });
    };

    socketService.on("answer_result", handleResult);

    return () => {
      clearInterval(timer);
      socketService.off("answer_result"); // Cleanup listener
    };
  }, [currentQuestion]);

  const handleOptionClick = (index: number, optionText: string) => {
    if (isLocked) return;

    setSelectedIdx(index);
    setIsLocked(true);


    submitAnswer(optionText);
  };

  if (!currentQuestion) return <div>Loading Question...</div>;

  const progressPercent = (timeLeft / currentQuestion.timeLimit) * 100;

  const segments = 20;
  const activeSegments = Math.ceil((timeLeft / currentQuestion.timeLimit) * segments);

  return (
    <div className="min-h-screen flex flex-col p-4 pt-6 bg-background relative overflow-hidden">
      <div className="bg-grid-fade" />
      <div className="absolute inset-0 bg-grid opacity-50" />

      <div className="relative z-10 flex flex-col h-full">

        <div className="mb-6">
          <div className="flex justify-between items-end mb-1">
            <span className="text-theme-gray font-display text-sm tracking-widest uppercase">Time Left</span>
            <span className="text-theme-gray font-display text-xl animate-pulse">{timeLeft}s</span>
          </div>
          <div className="h-6 flex gap-1">
            {[...Array(segments)].map((_, i) => (
              <div
                key={i}
                className={`flex-1 transition-colors duration-200 skew-x-[-12deg] border border-black/20 ${i < activeSegments
                    ? (timeLeft <= 5 ? 'bg-theme-red animate-pulse-fast' : 'bg-gradient-to-r from-theme-red to-white')
                    : 'bg-gray-800/30'
                  }`}
                style={{
                  boxShadow: i < activeSegments ? `0 0 8px ${timeLeft <= 5 ? 'red' : 'white'}` : 'none'
                }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground font-display tracking-widest uppercase">
            <span>Mission Status: ACTIVE</span>
          </div>
        </div>


        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-shrink-0 mb-6"
        >
          <div className="bg-black/60 backdrop-blur-md rounded-none p-6 box-theme">
            <h1 className="text-lg md:text-xl font-bold text-center text-white leading-relaxed font-display tracking-wide uppercase text-glow-red">
              {currentQuestion.text}
            </h1>
          </div>
        </motion.div>


        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-fr">
          {currentQuestion.options.map((option, index) => {
            let buttonStyle = `border-white/50 text-white bg-black/40 hover:border-white hover:bg-white/10`;

            if (isSelected) {
              buttonStyle = `border-theme-red bg-white/20 text-white shadow-[0_0_20px_hsl(var(--theme-red)/0.7)]`;
            }

            if (showResult) {
              if (isCorrect) buttonStyle = 'border-theme-success bg-theme-success/20 shadow-[0_0_25px_hsl(var(--theme-success)/0.6)] text-white';
              else if (isSelected && !serverResult.correct) buttonStyle = 'border-theme-red bg-theme-red/20 shadow-[0_0_25px_hsl(var(--theme-red)/0.6)] text-white';
              else buttonStyle = 'opacity-50 border-white/20 bg-black/40 text-white/50';
            }

            return (
              <motion.button
                key={index}
                onClick={() => handleOptionClick(index, option)}
                disabled={isLocked}
                className={`
                  relative w-full p-4 border-l-4 font-bold text-lg
                  transition-all duration-100 text-left
                  uppercase tracking-wider font-display
                  clip-path-polygon btn-3d
                  ${buttonStyle}
                  disabled:cursor-default
                `}
                whileHover={!isLocked ? { x: 10, backgroundColor: 'rgba(255,255,255,0.1)' } : {}}
                whileTap={!isLocked ? { scale: 0.95 } : {}}
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0% 100%)',
                }}
              >
                <div className="flex items-center gap-4">
                  <span className={`
                    w-12 h-12 flex items-center justify-center font-display font-bold text-xl border-2
                    ${isSelected || (showResult && isCorrect) ? 'text-black bg-white border-white' : 'text-white border-white bg-transparent'}
                  `}>
                    {showResult && isCorrect ? <Check className="w-5 h-5" /> :
                      showResult && isSelected && !serverResult.correct ? <X className="w-5 h-5" /> :
                        String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1 text-inherit">{option.replace(/^[A-D]\.\s/, '')}</span>
                </div>
              </motion.button>
            );
          })}
        </div>


        {isLocked && !serverResult && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-center flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            Answer Locked. Waiting for score...
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default QuestionScreen;