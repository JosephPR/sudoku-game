'use client';

import React, { useState } from 'react';
import SudokuBoard from './SudokuBoard';
import NumberPad from './NumberPad';
import GameControls from './GameControls';
import GameInfo from './GameInfo';
import useSudoku from '../hooks/useSudoku';

const SudokuGame: React.FC = () => {
  const [isNoteMode, setIsNoteMode] = useState(false);
  const [gameState, gameActions] = useSudoku();

  const toggleNoteMode = () => {
    setIsNoteMode(!isNoteMode);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-[600px] mx-auto p-4">
      <GameInfo
        timer={gameState.timer}
        difficulty={gameState.difficulty}
        mistakes={gameState.mistakes}
        isGameComplete={gameState.isGameComplete}
        isGameStarted={gameState.isGameStarted}
        isTimerRunning={gameState.isTimerRunning}
        onPause={gameActions.pauseGame}
        onResume={gameActions.resumeGame}
      />

      <SudokuBoard
        board={gameState.board}
        onCellClick={gameActions.selectCell}
      />

      <NumberPad
        onNumberClick={gameActions.inputValue}
        onClearClick={gameActions.clearCell}
        onNoteClick={gameActions.toggleNote}
        isNoteMode={isNoteMode}
        toggleNoteMode={toggleNoteMode}
      />

      <GameControls
        onNewGame={gameActions.initializeGame}
        onHint={gameActions.getHintAction}
        onSolve={gameActions.solveGame}
        onReset={gameActions.resetGame}
        isGameStarted={gameState.isGameStarted}
        isGameComplete={gameState.isGameComplete}
        difficulty={gameState.difficulty}
        hintsUsed={gameState.hintsUsed}
      />

      {!gameState.isGameStarted && (
        <div className="mt-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Welcome to Sudoku!</h2>
          <p className="mb-2">Click "New Game" to start playing.</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Fill the grid so that every row, column, and 3×3 box contains the digits 1-9.
          </p>
        </div>
      )}
    </div>
  );
};

export default SudokuGame; 