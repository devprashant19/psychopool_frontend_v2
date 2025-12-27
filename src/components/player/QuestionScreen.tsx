import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { Check, X, Loader2 } from 'lucide-react';
import socketService from '@/services/socketService';

const optionColors = [
  { bg: 'bg-neon-red/20', border: 'border-neon-red', text: 'text-neon-red', shadow: 'shadow-[0_0_20px_hsl(var(--neon-red)/0.5)]' },
  { bg: 'bg-neon-cyan/20', border: 'border-neon-cyan', text: 'text-neon-cyan', shadow: 'shadow-[0_0_20px_hsl(var(--neon-cyan)/0.5)]' },
  { bg: 'bg-neon-yellow/20', border: 'border-neon-yellow', text: 'text-neon-yellow', shadow: 'shadow-[0_0_20px_hsl(var(--neon-yellow)/0.5)]' },
  { bg: 'bg-neon-green/20', border: 'border-neon-green', text: 'text-neon-green', shadow: 'shadow-[0_0_20px_hsl(var(--neon-green)/0.5)]' },
];

const QuestionScreen: React.FC = () => {
  // 1. Get submitAnswer from Context (it holds your real Player ID)
  const { currentQuestion, submitAnswer } = useGame();
  
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [serverResult, setServerResult] = useState<{ correct: boolean; correctAnswer: number } | null>(null);
  const [timeLeft, setTimeLeft] = useState(currentQuestion?.timeLimit || 15);

  useEffect(() => {
    if (!currentQuestion) return;
    
    // Reset state for new question
    setSelectedIdx(null);
    setIsLocked(false);
    setServerResult(null);
    setTimeLeft(currentQuestion.timeLimit);

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // Listen for the result from server
    const handleResult = (data: any) => {
       setServerResult({ correct: data.isCorrect, correctAnswer: data.correctAnswer });
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

    // 2. USE THE CONTEXT FUNCTION (This uses your Real ID)
    submitAnswer(optionText);
  };

  if (!currentQuestion) return <div>Loading Question...</div>;

  const progressPercent = (timeLeft / currentQuestion.timeLimit) * 100;

  return (
    <div className="min-h-screen flex flex-col p-4 pt-6 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-50" />

      <div className="relative z-10 flex flex-col h-full">
        {/* Timer bar */}
        <div className="mb-6">
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full transition-colors duration-300 ${
                progressPercent > 50 ? 'bg-neon-green' : progressPercent > 25 ? 'bg-neon-yellow' : 'bg-neon-red'
              }`}
              style={{ width: `${progressPercent}%` }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between mt-2 text-sm text-muted-foreground font-display">
            <span>{timeLeft}s</span>
            <span>Question {currentQuestion.id}</span>
          </div>
        </div>

        {/* Question text */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-shrink-0 mb-6"
        >
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border">
            <h1 className="text-xl md:text-2xl font-bold text-center text-foreground leading-relaxed">
              {currentQuestion.text}
            </h1>
          </div>
        </motion.div>

        {/* Answer options */}
        <div className="flex-1 grid grid-cols-1 gap-3">
          {currentQuestion.options.map((option, index) => {
            const color = optionColors[index % 4];
            
            const isSelected = selectedIdx === index;
            // Only reveal answer if we have the server result
            const isCorrect = serverResult?.correctAnswer === index; 
            const showResult = serverResult !== null; 

            let buttonStyle = `border-border bg-card/50 hover:${color.border} hover:${color.bg}`;
            
            if (isSelected) {
               // Selected but waiting
               buttonStyle = `${color.border} ${color.bg} ${color.shadow}`;
            }
            
            if (showResult) {
               if (isCorrect) buttonStyle = 'border-neon-green bg-neon-green/20 shadow-[0_0_25px_hsl(var(--neon-green)/0.6)]';
               else if (isSelected && !serverResult.correct) buttonStyle = 'border-neon-red bg-neon-red/20 shadow-[0_0_25px_hsl(var(--neon-red)/0.6)]';
               else buttonStyle = 'opacity-50 border-border';
            }

            return (
              <motion.button
                key={index}
                onClick={() => handleOptionClick(index, option)}
                disabled={isLocked}
                className={`
                  relative w-full p-4 rounded-xl border-2 font-semibold text-lg
                  transition-all duration-300 text-left
                  ${buttonStyle}
                  disabled:cursor-default
                `}
                whileHover={!isLocked ? { scale: 1.02 } : {}}
                whileTap={!isLocked ? { scale: 0.98 } : {}}
              >
                <div className="flex items-center gap-4">
                  <span className={`
                    w-10 h-10 rounded-lg flex items-center justify-center font-display font-bold text-lg
                    ${isSelected || (showResult && isCorrect) ? 'text-background' : color.text}
                    ${showResult && isCorrect ? 'bg-neon-green' : isSelected ? color.bg.replace('/20', '') : color.bg}
                  `}>
                    {showResult && isCorrect ? <Check className="w-5 h-5" /> : 
                     showResult && isSelected && !serverResult.correct ? <X className="w-5 h-5" /> : 
                     String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1 text-foreground">{option}</span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Status Footer */}
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