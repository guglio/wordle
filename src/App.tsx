import Guess from './Components/Guess';
import './App.css';
import { useWordleGame } from './hooks/useGameStatus';

function App() {
  const {
    guesses,
    gameOver,
    getInputProps,
    getRowLetters,
  } = useWordleGame(); // optionally pass a solution for testing, e.g., useWordleGame('CRANE')

  // Determine win/lose message when game is over
  let message = '';
  if (gameOver) {
    const lastGuessedRow = [...guesses]
      .reverse()
      .find(r => r.letters.some(l => l.letter !== ''));
    const isWin =
      !!lastGuessedRow && lastGuessedRow.letters.every(l => l.status === 'GREEN');
    message = !lastGuessedRow
      ? ''
      : isWin
      ? '🎉 You win!'
      : `😢 Word was ${lastGuessedRow.letters.map(l => l.letter).join('')}`;
  }

  return (
    <div className="app">
      <header>
        <h1>Wordle</h1>
        {gameOver && <p className="message">{message}</p>}
      </header>

      <main>
        <div className="board">
          {guesses.map((_, idx) => (
            <Guess key={idx} letters={getRowLetters(idx)} />
          ))}
        </div>
      </main>

      {/* Hidden input that captures keyboard events */}
      <input {...getInputProps()} autoComplete="off" />
    </div>
  );
}

export default App;