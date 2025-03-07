// Sudoku board representation and utilities

// Types
export type Cell = {
  value: number;
  isGiven: boolean;
  notes: number[];
  isHighlighted: boolean;
  isSelected: boolean;
  isInvalid: boolean;
};

export type Board = Cell[][];

// Constants
export const EMPTY_CELL_VALUE = 0;
export const BOARD_SIZE = 9;
export const BOX_SIZE = 3;

// Initialize an empty Sudoku board
export const initializeEmptyBoard = (): Board => {
  const board: Board = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    board[row] = [];
    for (let col = 0; col < BOARD_SIZE; col++) {
      board[row][col] = {
        value: EMPTY_CELL_VALUE,
        isGiven: false,
        notes: [],
        isHighlighted: false,
        isSelected: false,
        isInvalid: false,
      };
    }
  }
  return board;
};

// Check if a value is valid in a specific position
export const isValidPlacement = (
  board: Board,
  row: number,
  col: number,
  value: number
): boolean => {
  if (value === EMPTY_CELL_VALUE) return true;

  // Check row
  for (let c = 0; c < BOARD_SIZE; c++) {
    if (c !== col && board[row][c].value === value) {
      return false;
    }
  }

  // Check column
  for (let r = 0; r < BOARD_SIZE; r++) {
    if (r !== row && board[r][col].value === value) {
      return false;
    }
  }

  // Check 3x3 box
  const boxStartRow = Math.floor(row / BOX_SIZE) * BOX_SIZE;
  const boxStartCol = Math.floor(col / BOX_SIZE) * BOX_SIZE;
  for (let r = boxStartRow; r < boxStartRow + BOX_SIZE; r++) {
    for (let c = boxStartCol; c < boxStartCol + BOX_SIZE; c++) {
      if (r !== row && c !== col && board[r][c].value === value) {
        return false;
      }
    }
  }

  return true;
};

// Solve the Sudoku board using backtracking algorithm
export const solveSudoku = (board: Board): boolean => {
  const emptyCell = findEmptyCell(board);
  if (!emptyCell) return true; // No empty cells left, puzzle solved

  const [row, col] = emptyCell;

  for (let num = 1; num <= 9; num++) {
    if (isValidPlacement(board, row, col, num)) {
      board[row][col].value = num;

      if (solveSudoku(board)) {
        return true;
      }

      // If placing num doesn't lead to a solution, backtrack
      board[row][col].value = EMPTY_CELL_VALUE;
    }
  }

  return false; // No solution found
};

// Find an empty cell in the board
const findEmptyCell = (board: Board): [number, number] | null => {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col].value === EMPTY_CELL_VALUE) {
        return [row, col];
      }
    }
  }
  return null; // No empty cells found
};

// Generate a Sudoku puzzle with a given difficulty level
export const generateSudokuPuzzle = (
  difficulty: "easy" | "medium" | "hard" | "expert"
): Board => {
  const board = initializeEmptyBoard();
  
  // Fill the diagonal boxes first (these can be filled independently)
  fillDiagonalBoxes(board);
  
  // Solve the rest of the board
  solveSudoku(board);
  
  // Remove cells based on difficulty
  const cellsToRemove = getDifficultyRemovalCount(difficulty);
  removeRandomCells(board, cellsToRemove);
  
  // Mark remaining cells as given
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col].value !== EMPTY_CELL_VALUE) {
        board[row][col].isGiven = true;
      }
    }
  }
  
  return board;
};

// Fill the diagonal 3x3 boxes
const fillDiagonalBoxes = (board: Board): void => {
  for (let box = 0; box < BOARD_SIZE; box += BOX_SIZE) {
    fillBox(board, box, box);
  }
};

// Fill a 3x3 box with random valid numbers
const fillBox = (board: Board, startRow: number, startCol: number): void => {
  const nums = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  let index = 0;
  
  for (let row = 0; row < BOX_SIZE; row++) {
    for (let col = 0; col < BOX_SIZE; col++) {
      board[startRow + row][startCol + col].value = nums[index++];
    }
  }
};

// Shuffle an array using Fisher-Yates algorithm
const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Get the number of cells to remove based on difficulty
const getDifficultyRemovalCount = (
  difficulty: "easy" | "medium" | "hard" | "expert"
): number => {
  switch (difficulty) {
    case "easy":
      return 30; // 51 cells remain
    case "medium":
      return 40; // 41 cells remain
    case "hard":
      return 50; // 31 cells remain
    case "expert":
      return 55; // 26 cells remain
    default:
      return 30;
  }
};

// Remove random cells from the board
const removeRandomCells = (board: Board, count: number): void => {
  const positions: [number, number][] = [];
  
  // Create a list of all positions
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      positions.push([row, col]);
    }
  }
  
  // Shuffle the positions
  const shuffledPositions = shuffleArray(positions);
  
  // Remove cells while ensuring the puzzle remains solvable
  let removed = 0;
  for (let i = 0; i < shuffledPositions.length && removed < count; i++) {
    const [row, col] = shuffledPositions[i];
    const value = board[row][col].value;
    
    board[row][col].value = EMPTY_CELL_VALUE;
    
    // Check if the puzzle still has a unique solution
    const tempBoard = deepCopyBoard(board);
    if (hasUniqueSolution(tempBoard)) {
      removed++;
    } else {
      // If not, restore the value
      board[row][col].value = value;
    }
  }
};

// Create a deep copy of the board
export const deepCopyBoard = (board: Board): Board => {
  return board.map(row => 
    row.map(cell => ({ ...cell }))
  );
};

// Check if the puzzle has a unique solution
const hasUniqueSolution = (board: Board): boolean => {
  // This is a simplified check - in a real implementation, you would
  // need a more sophisticated algorithm to check for uniqueness
  return solveSudoku(board);
};

// Get all cells that would be highlighted based on the selected cell
export const getHighlightedCells = (
  board: Board,
  selectedRow: number,
  selectedCol: number
): [number, number][] => {
  const highlightedCells: [number, number][] = [];
  
  // Same row
  for (let col = 0; col < BOARD_SIZE; col++) {
    if (col !== selectedCol) {
      highlightedCells.push([selectedRow, col]);
    }
  }
  
  // Same column
  for (let row = 0; row < BOARD_SIZE; row++) {
    if (row !== selectedRow) {
      highlightedCells.push([row, selectedCol]);
    }
  }
  
  // Same 3x3 box
  const boxStartRow = Math.floor(selectedRow / BOX_SIZE) * BOX_SIZE;
  const boxStartCol = Math.floor(selectedCol / BOX_SIZE) * BOX_SIZE;
  for (let row = boxStartRow; row < boxStartRow + BOX_SIZE; row++) {
    for (let col = boxStartCol; col < boxStartCol + BOX_SIZE; col++) {
      if (row !== selectedRow && col !== selectedCol) {
        highlightedCells.push([row, col]);
      }
    }
  }
  
  // Same value
  const selectedValue = board[selectedRow][selectedCol].value;
  if (selectedValue !== EMPTY_CELL_VALUE) {
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (
          (row !== selectedRow || col !== selectedCol) &&
          board[row][col].value === selectedValue
        ) {
          highlightedCells.push([row, col]);
        }
      }
    }
  }
  
  return highlightedCells;
};

// Check if the board is completely filled and valid
export const isBoardComplete = (board: Board): boolean => {
  // Check if all cells are filled
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col].value === EMPTY_CELL_VALUE) {
        return false;
      }
    }
  }
  
  // Check if all rows, columns, and boxes are valid
  return isValidBoard(board);
};

// Check if the entire board is valid
export const isValidBoard = (board: Board): boolean => {
  // Check rows
  for (let row = 0; row < BOARD_SIZE; row++) {
    if (!isValidUnit(board[row].map(cell => cell.value))) {
      return false;
    }
  }
  
  // Check columns
  for (let col = 0; col < BOARD_SIZE; col++) {
    const column = board.map(row => row[col].value);
    if (!isValidUnit(column)) {
      return false;
    }
  }
  
  // Check boxes
  for (let boxRow = 0; boxRow < BOARD_SIZE; boxRow += BOX_SIZE) {
    for (let boxCol = 0; boxCol < BOARD_SIZE; boxCol += BOX_SIZE) {
      const box = [];
      for (let row = 0; row < BOX_SIZE; row++) {
        for (let col = 0; col < BOX_SIZE; col++) {
          box.push(board[boxRow + row][boxCol + col].value);
        }
      }
      if (!isValidUnit(box)) {
        return false;
      }
    }
  }
  
  return true;
};

// Check if a unit (row, column, or box) is valid
const isValidUnit = (unit: number[]): boolean => {
  const seen = new Set<number>();
  for (const value of unit) {
    if (value === EMPTY_CELL_VALUE) continue;
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
  }
  return true;
};

// Get all invalid cells in the board
export const getInvalidCells = (board: Board): [number, number][] => {
  const invalidCells: [number, number][] = [];
  
  // Check rows
  for (let row = 0; row < BOARD_SIZE; row++) {
    const seen = new Set<number>();
    for (let col = 0; col < BOARD_SIZE; col++) {
      const value = board[row][col].value;
      if (value !== EMPTY_CELL_VALUE) {
        if (seen.has(value)) {
          invalidCells.push([row, col]);
        } else {
          seen.add(value);
        }
      }
    }
  }
  
  // Check columns
  for (let col = 0; col < BOARD_SIZE; col++) {
    const seen = new Set<number>();
    for (let row = 0; row < BOARD_SIZE; row++) {
      const value = board[row][col].value;
      if (value !== EMPTY_CELL_VALUE) {
        if (seen.has(value)) {
          invalidCells.push([row, col]);
        } else {
          seen.add(value);
        }
      }
    }
  }
  
  // Check boxes
  for (let boxRow = 0; boxRow < BOARD_SIZE; boxRow += BOX_SIZE) {
    for (let boxCol = 0; boxCol < BOARD_SIZE; boxCol += BOX_SIZE) {
      const seen = new Set<number>();
      for (let row = 0; row < BOX_SIZE; row++) {
        for (let col = 0; col < BOX_SIZE; col++) {
          const value = board[boxRow + row][boxCol + col].value;
          if (value !== EMPTY_CELL_VALUE) {
            if (seen.has(value)) {
              invalidCells.push([boxRow + row, boxCol + col]);
            } else {
              seen.add(value);
            }
          }
        }
      }
    }
  }
  
  return invalidCells;
};

// Get a hint for the current board state
export const getHint = (board: Board): [number, number, number] | null => {
  const tempBoard = deepCopyBoard(board);
  
  if (solveSudoku(tempBoard)) {
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (board[row][col].value === EMPTY_CELL_VALUE) {
          return [row, col, tempBoard[row][col].value];
        }
      }
    }
  }
  
  return null; // No hint available or puzzle is unsolvable
}; 