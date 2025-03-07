'use client';

import React from 'react';

interface NumberPadProps {
  onNumberClick: (number: number) => void;
  onClearClick: () => void;
  onNoteClick: (number: number) => void;
  isNoteMode: boolean;
  toggleNoteMode: () => void;
}

const NumberPad: React.FC<NumberPadProps> = ({
  onNumberClick,
  onClearClick,
  onNoteClick,
  isNoteMode,
  toggleNoteMode,
}) => {
  const handleNumberClick = (number: number) => {
    if (isNoteMode) {
      onNoteClick(number);
    } else {
      onNumberClick(number);
    }
  };

  return (
    <div className="mt-6 w-full max-w-[500px]">
      <div className="flex justify-between items-center mb-2">
        <button
          className={`px-4 py-2 rounded-md ${
            isNoteMode
              ? 'bg-blue-500 text-white dark:bg-blue-700'
              : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
          }`}
          onClick={toggleNoteMode}
        >
          {isNoteMode ? 'Notes Mode' : 'Normal Mode'}
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded-md dark:bg-red-700"
          onClick={onClearClick}
        >
          Clear
        </button>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
          <button
            key={number}
            className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold py-4 rounded-md text-xl transition-colors"
            onClick={() => handleNumberClick(number)}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NumberPad; 