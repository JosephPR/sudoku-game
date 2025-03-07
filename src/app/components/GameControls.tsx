'use client';

import React from 'react';

interface GameControlsProps {
  onNewGame: (difficulty: 'easy' | 'medium' | 'hard' | 'expert') => void;
  onHint: () => void;
  onSolve: () => void;
  onReset: () => void;
  isGameStarted: boolean;
  isGameComplete: boolean;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  hintsUsed: number;
}

const GameControls: React.FC<GameControlsProps> = ({
  onNewGame,
  onHint,
  onSolve,
  onReset,
  isGameStarted,
  isGameComplete,
  difficulty,
  hintsUsed,
}) => {
  const [showDifficultySelector, setShowDifficultySelector] = React.useState(false);

  const handleNewGameClick = () => {
    setShowDifficultySelector(true);
  };

  const handleDifficultySelect = (selectedDifficulty: 'easy' | 'medium' | 'hard' | 'expert') => {
    onNewGame(selectedDifficulty);
    setShowDifficultySelector(false);
  };

  return (
    <div className="w-full max-w-[500px] mt-6">
      {showDifficultySelector ? (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-md">
          <h3 className="text-lg font-semibold mb-3 text-center">Select Difficulty</h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              className="bg-green-100 dark:bg-green-900 hover:bg-green-200 dark:hover:bg-green-800 text-green-800 dark:text-green-200 font-medium py-2 px-4 rounded-md"
              onClick={() => handleDifficultySelect('easy')}
            >
              Easy
            </button>
            <button
              className="bg-yellow-100 dark:bg-yellow-900 hover:bg-yellow-200 dark:hover:bg-yellow-800 text-yellow-800 dark:text-yellow-200 font-medium py-2 px-4 rounded-md"
              onClick={() => handleDifficultySelect('medium')}
            >
              Medium
            </button>
            <button
              className="bg-orange-100 dark:bg-orange-900 hover:bg-orange-200 dark:hover:bg-orange-800 text-orange-800 dark:text-orange-200 font-medium py-2 px-4 rounded-md"
              onClick={() => handleDifficultySelect('hard')}
            >
              Hard
            </button>
            <button
              className="bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 text-red-800 dark:text-red-200 font-medium py-2 px-4 rounded-md"
              onClick={() => handleDifficultySelect('expert')}
            >
              Expert
            </button>
          </div>
          <button
            className="w-full mt-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-md"
            onClick={() => setShowDifficultySelector(false)}
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md dark:bg-blue-700 dark:hover:bg-blue-600"
            onClick={handleNewGameClick}
          >
            New Game
          </button>
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
            onClick={onReset}
            disabled={!isGameStarted}
          >
            Reset
          </button>
          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-md dark:bg-yellow-700 dark:hover:bg-yellow-600"
            onClick={onHint}
            disabled={!isGameStarted || isGameComplete}
          >
            Hint ({hintsUsed})
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md dark:bg-red-700 dark:hover:bg-red-600"
            onClick={onSolve}
            disabled={!isGameStarted || isGameComplete}
          >
            Solve
          </button>
        </div>
      )}
    </div>
  );
};

export default GameControls; 