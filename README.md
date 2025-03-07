# Sudoku Game

A modern Sudoku game with a clean UI, developer-friendly code, and fun gameplay features.

![Sudoku Game Screenshot](./public/screenshot.png)

## Features

- **Clean, Modern UI**: Responsive design with light and dark mode support
- **Multiple Difficulty Levels**: Easy, Medium, Hard, and Expert
- **Game Mechanics**:
  - Cell highlighting and selection
  - Notes mode for pencil marks
  - Mistake tracking (limited to 3)
  - Timer with pause/resume functionality
  - Hint system
  - Auto-solve option
- **Developer-Friendly Code**:
  - TypeScript for type safety
  - React hooks for state management
  - Modular component architecture
  - Well-documented utility functions

## Technologies Used

- **Next.js**: React framework for server-rendered applications
- **TypeScript**: For type safety and better developer experience
- **Tailwind CSS**: For styling and responsive design
- **React Hooks**: For state management and side effects

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/sudoku-game.git
   cd sudoku-game
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the game.

## How to Play

1. Click "New Game" and select a difficulty level
2. Click on a cell to select it
3. Enter a number (1-9) using the number pad
4. Toggle "Notes Mode" to add pencil marks
5. Use "Hint" if you get stuck
6. Complete the puzzle by filling all cells correctly

## Game Rules

- Fill the 9×9 grid with digits 1-9
- Each column, row, and 3×3 box must contain all digits 1-9 without repetition
- The game starts with some cells pre-filled (given)
- You cannot change the given cells
- You have a maximum of 3 mistakes allowed

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by classic Sudoku puzzles
- Built with modern web technologies for a smooth user experience
