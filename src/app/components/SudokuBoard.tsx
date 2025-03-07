'use client';

import React from 'react';
import { Board, BOARD_SIZE, BOX_SIZE } from '../utils/sudokuUtils';
import SudokuCell from './SudokuCell';

interface SudokuBoardProps {
  board: Board;
  onCellClick: (row: number, col: number) => void;
}

const SudokuBoard: React.FC<SudokuBoardProps> = ({ board, onCellClick }) => {
  return (
    <div className="grid grid-cols-9 gap-[1px] bg-gray-300 dark:bg-gray-700 p-[1px] rounded-md shadow-lg max-w-[500px] w-full aspect-square">
      {Array.from({ length: BOARD_SIZE }).map((_, rowIndex) => (
        Array.from({ length: BOARD_SIZE }).map((_, colIndex) => {
          const cell = board[rowIndex][colIndex];
          
          // Determine border styles based on box boundaries
          const borderClasses = [];
          
          // Right border for cells at the end of a box (except the last column)
          if ((colIndex + 1) % BOX_SIZE === 0 && colIndex < BOARD_SIZE - 1) {
            borderClasses.push('border-r-2 border-r-gray-500 dark:border-r-gray-500');
          }
          
          // Bottom border for cells at the end of a box (except the last row)
          if ((rowIndex + 1) % BOX_SIZE === 0 && rowIndex < BOARD_SIZE - 1) {
            borderClasses.push('border-b-2 border-b-gray-500 dark:border-b-gray-500');
          }
          
          return (
            <SudokuCell
              key={`${rowIndex}-${colIndex}`}
              value={cell.value}
              notes={cell.notes}
              isGiven={cell.isGiven}
              isSelected={cell.isSelected}
              isHighlighted={cell.isHighlighted}
              isInvalid={cell.isInvalid}
              onClick={() => onCellClick(rowIndex, colIndex)}
              borderClasses={borderClasses.join(' ')}
            />
          );
        })
      )).flat()}
    </div>
  );
};

export default SudokuBoard; 