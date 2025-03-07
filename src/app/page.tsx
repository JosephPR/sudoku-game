import SudokuGame from './components/SudokuGame';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <main className="w-full max-w-[600px]">
        <SudokuGame />
      </main>
      <footer className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>© {new Date().getFullYear()} Sudoku Game</p>
        <p className="mt-1">
          A clean, developer-friendly, and fun Sudoku implementation
        </p>
      </footer>
    </div>
  );
}
