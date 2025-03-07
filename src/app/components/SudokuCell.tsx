'use client';

import React from 'react';
import { EMPTY_CELL_VALUE } from '../utils/sudokuUtils';

interface SudokuCellProps {
  value: number;
  notes: number[];
  isGiven: boolean;
  isSelected: boolean;
  isHighlighted: boolean;
  isInvalid: boolean;
  onClick: () => void;
  borderClasses: string;
}

const SudokuCell: React.FC<SudokuCellProps> = ({
  value,
  notes,
  isGiven,
  isSelected,
  isHighlighted,
  isInvalid,
  onClick,
  borderClasses,
}) => {
  // Determine cell background color based on state
  let cellClasses = 'flex items-center justify-center w-full h-full relative';
  
  if (isSelected) {
    cellClasses += ' bg-blue-200 dark:bg-blue-900';
  } else if (isHighlighted) {
    cellClasses += ' bg-blue-50 dark:bg-blue-950';
  } else {
    cellClasses += ' bg-white dark:bg-gray-800';
  }
  
  if (isInvalid) {
    cellClasses += ' text-red-600 dark:text-red-400';
  }
  
  // Add border classes
  cellClasses += ` ${borderClasses}`;
  
  // Determine text style based on whether the cell is given or user-entered
  const textClasses = isGiven
    ? 'font-bold text-black dark:text-white'
    : 'font-normal text-blue-600 dark:text-blue-400';
  
  return (
    <div
      className={cellClasses}
      onClick={onClick}
    >
      {value !== EMPTY_CELL_VALUE ? (
        <span className={`text-xl ${textClasses}`}>{value}</span>
      ) : notes.length > 0 ? (
        <div className="grid grid-cols-3 grid-rows-3 gap-0 w-full h-full p-[2px]">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <div key={num} className="flex items-center justify-center">
              {notes.includes(num) && (
                <span className="text-[8px] text-gray-600 dark:text-gray-400">
                  {num}
                </span>
              )}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default SudokuCell; 