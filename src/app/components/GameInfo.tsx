'use client';

import React from 'react';

interface GameInfoProps {
  timer: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  mistakes: number;
  isGameComplete: boolean;
  isGameStarted: boolean;
  isTimerRunning: boolean;
  onPause: () => void;
  onResume: () => void;
}

const GameInfo: React.FC<GameInfoProps> = ({
  timer,
  difficulty,
  mistakes,
  isGameComplete,
  isGameStarted,
  isTimerRunning,
  onPause,
  onResume,
}) => {
  // Format timer as MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Get difficulty display name and color
  const getDifficultyInfo = (difficulty: 'easy' | 'medium' | 'hard' | 'expert') => {
    switch (difficulty) {
      case 'easy':
        return { name: 'Easy', color: 'text-green-600 dark:text-green-400' };
      case 'medium':
        return { name: 'Medium', color: 'text-yellow-600 dark:text-yellow-400' };
      case 'hard':
        return { name: 'Hard', color: 'text-orange-600 dark:text-orange-400' };
      case 'expert':
        return { name: 'Expert', color: 'text-red-600 dark:text-red-400' };
      default:
        return { name: 'Unknown', color: 'text-gray-600 dark:text-gray-400' };
    }
  };

  const difficultyInfo = getDifficultyInfo(difficulty);

  return (
    <div className="w-full max-w-[500px] bg-white dark:bg-gray-800 p-4 rounded-md shadow-md mb-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold mb-1">Sudoku</h2>
          {isGameStarted && (
            <p className={`text-sm font-medium ${difficultyInfo.color}`}>
              {difficultyInfo.name}
            </p>
          )}
        </div>
        
        <div className="flex flex-col items-end">
          {isGameStarted && (
            <>
              <div className="flex items-center">
                <span className="text-xl font-mono mr-2">{formatTime(timer)}</span>
                {!isGameComplete && (
                  <button
                    onClick={isTimerRunning ? onPause : onResume}
                    className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {isTimerRunning ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                )}
              </div>
              <div className="text-sm">
                <span className={`${mistakes > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
                  Mistakes: {mistakes}/3
                </span>
              </div>
            </>
          )}
        </div>
      </div>
      
      {isGameComplete && (
        <div className="mt-2 p-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-md text-center">
          {mistakes >= 3 ? 'Game Over - Too many mistakes!' : 'Puzzle Completed!'}
        </div>
      )}
    </div>
  );
};

export default GameInfo; 