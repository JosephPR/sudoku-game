'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  Board,
  Cell,
  EMPTY_CELL_VALUE,
  BOARD_SIZE,
  initializeEmptyBoard,
  generateSudokuPuzzle,
  isValidPlacement,
  getHighlightedCells,
  isBoardComplete,
  getInvalidCells,
  getHint,
  solveSudoku,
  deepCopyBoard,
} from '../utils/sudokuUtils';

type GameState = {
  board: Board;
  selectedCell: [number, number] | null;
  isGameComplete: boolean;
  isGameStarted: boolean;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  timer: number;
  mistakes: number;
  hintsUsed: number;
  isTimerRunning: boolean;
};

type GameActions = {
  initializeGame: (difficulty: 'easy' | 'medium' | 'hard' | 'expert') => void;
  selectCell: (row: number, col: number) => void;
  inputValue: (value: number) => void;
  toggleNote: (value: number) => void;
  clearCell: () => void;
  getHintAction: () => void;
  solveGame: () => void;
  resetGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
};

const MAX_MISTAKES = 3;

export const useSudoku = (): [GameState, GameActions] => {
  const [gameState, setGameState] = useState<GameState>({
    board: initializeEmptyBoard(),
    selectedCell: null,
    isGameComplete: false,
    isGameStarted: false,
    difficulty: 'easy',
    timer: 0,
    mistakes: 0,
    hintsUsed: 0,
    isTimerRunning: false,
  });

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (gameState.isGameStarted && gameState.isTimerRunning && !gameState.isGameComplete) {
      interval = setInterval(() => {
        setGameState((prevState) => ({
          ...prevState,
          timer: prevState.timer + 1,
        }));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState.isGameStarted, gameState.isTimerRunning, gameState.isGameComplete]);

  // Initialize a new game
  const initializeGame = useCallback((difficulty: 'easy' | 'medium' | 'hard' | 'expert') => {
    const newBoard = generateSudokuPuzzle(difficulty);
    
    setGameState({
      board: newBoard,
      selectedCell: null,
      isGameComplete: false,
      isGameStarted: true,
      difficulty,
      timer: 0,
      mistakes: 0,
      hintsUsed: 0,
      isTimerRunning: true,
    });
  }, []);

  // Select a cell on the board
  const selectCell = useCallback((row: number, col: number) => {
    setGameState((prevState) => {
      // If the cell is already selected, deselect it
      if (
        prevState.selectedCell &&
        prevState.selectedCell[0] === row &&
        prevState.selectedCell[1] === col
      ) {
        return {
          ...prevState,
          selectedCell: null,
          board: prevState.board.map((r, rowIndex) =>
            r.map((cell, colIndex) => ({
              ...cell,
              isSelected: false,
              isHighlighted: false,
            }))
          ),
        };
      }

      // Update the board to highlight cells
      const highlightedCells = getHighlightedCells(prevState.board, row, col);
      const newBoard = prevState.board.map((r, rowIndex) =>
        r.map((cell, colIndex) => ({
          ...cell,
          isSelected: rowIndex === row && colIndex === col,
          isHighlighted: highlightedCells.some(
            ([r, c]) => r === rowIndex && c === colIndex
          ),
        }))
      );

      return {
        ...prevState,
        selectedCell: [row, col],
        board: newBoard,
      };
    });
  }, []);

  // Input a value into the selected cell
  const inputValue = useCallback((value: number) => {
    setGameState((prevState) => {
      if (!prevState.selectedCell || !prevState.isGameStarted) return prevState;

      const [row, col] = prevState.selectedCell;
      const cell = prevState.board[row][col];

      // Cannot modify given cells
      if (cell.isGiven) return prevState;

      // Check if the placement is valid
      const isValid = isValidPlacement(prevState.board, row, col, value);
      let newMistakes = prevState.mistakes;

      if (!isValid) {
        newMistakes += 1;
      }

      // Create a new board with the updated cell
      const newBoard = prevState.board.map((r, rowIndex) =>
        r.map((c, colIndex) => {
          if (rowIndex === row && colIndex === col) {
            return {
              ...c,
              value,
              isInvalid: !isValid,
              notes: [],
            };
          }
          return c;
        })
      );

      // Check if the game is complete
      const gameComplete = isBoardComplete(newBoard);

      return {
        ...prevState,
        board: newBoard,
        mistakes: newMistakes,
        isGameComplete: gameComplete || newMistakes >= MAX_MISTAKES,
        isTimerRunning: !(gameComplete || newMistakes >= MAX_MISTAKES),
      };
    });
  }, []);

  // Toggle a note in the selected cell
  const toggleNote = useCallback((value: number) => {
    setGameState((prevState) => {
      if (!prevState.selectedCell || !prevState.isGameStarted) return prevState;

      const [row, col] = prevState.selectedCell;
      const cell = prevState.board[row][col];

      // Cannot modify given cells or cells with values
      if (cell.isGiven || cell.value !== EMPTY_CELL_VALUE) return prevState;

      // Toggle the note
      const notes = [...cell.notes];
      const noteIndex = notes.indexOf(value);
      
      if (noteIndex === -1) {
        notes.push(value);
      } else {
        notes.splice(noteIndex, 1);
      }

      // Create a new board with the updated cell
      const newBoard = prevState.board.map((r, rowIndex) =>
        r.map((c, colIndex) => {
          if (rowIndex === row && colIndex === col) {
            return {
              ...c,
              notes,
            };
          }
          return c;
        })
      );

      return {
        ...prevState,
        board: newBoard,
      };
    });
  }, []);

  // Clear the selected cell
  const clearCell = useCallback(() => {
    setGameState((prevState) => {
      if (!prevState.selectedCell || !prevState.isGameStarted) return prevState;

      const [row, col] = prevState.selectedCell;
      const cell = prevState.board[row][col];

      // Cannot clear given cells
      if (cell.isGiven) return prevState;

      // Create a new board with the cleared cell
      const newBoard = prevState.board.map((r, rowIndex) =>
        r.map((c, colIndex) => {
          if (rowIndex === row && colIndex === col) {
            return {
              ...c,
              value: EMPTY_CELL_VALUE,
              isInvalid: false,
              notes: [],
            };
          }
          return c;
        })
      );

      return {
        ...prevState,
        board: newBoard,
      };
    });
  }, []);

  // Get a hint for the current board state
  const getHintAction = useCallback(() => {
    setGameState((prevState) => {
      if (!prevState.isGameStarted) return prevState;

      const hint = getHint(prevState.board);
      if (!hint) return prevState;

      const [row, col, value] = hint;

      // Create a new board with the hint applied
      const newBoard = prevState.board.map((r, rowIndex) =>
        r.map((c, colIndex) => {
          if (rowIndex === row && colIndex === col) {
            return {
              ...c,
              value,
              isInvalid: false,
              notes: [],
            };
          }
          return c;
        })
      );

      // Check if the game is complete
      const gameComplete = isBoardComplete(newBoard);

      return {
        ...prevState,
        board: newBoard,
        hintsUsed: prevState.hintsUsed + 1,
        selectedCell: [row, col],
        isGameComplete: gameComplete,
        isTimerRunning: !gameComplete,
      };
    });
  }, []);

  // Solve the entire game
  const solveGame = useCallback(() => {
    setGameState((prevState) => {
      if (!prevState.isGameStarted) return prevState;

      const solvedBoard = deepCopyBoard(prevState.board);
      solveSudoku(solvedBoard);

      return {
        ...prevState,
        board: solvedBoard,
        isGameComplete: true,
        isTimerRunning: false,
      };
    });
  }, []);

  // Reset the game to its initial state
  const resetGame = useCallback(() => {
    setGameState((prevState) => {
      const newBoard = generateSudokuPuzzle(prevState.difficulty);
      
      return {
        ...prevState,
        board: newBoard,
        selectedCell: null,
        isGameComplete: false,
        timer: 0,
        mistakes: 0,
        hintsUsed: 0,
        isTimerRunning: true,
      };
    });
  }, []);

  // Pause the game
  const pauseGame = useCallback(() => {
    setGameState((prevState) => ({
      ...prevState,
      isTimerRunning: false,
    }));
  }, []);

  // Resume the game
  const resumeGame = useCallback(() => {
    setGameState((prevState) => ({
      ...prevState,
      isTimerRunning: !prevState.isGameComplete,
    }));
  }, []);

  const gameActions: GameActions = {
    initializeGame,
    selectCell,
    inputValue,
    toggleNote,
    clearCell,
    getHintAction,
    solveGame,
    resetGame,
    pauseGame,
    resumeGame,
  };

  return [gameState, gameActions];
};

export default useSudoku; 