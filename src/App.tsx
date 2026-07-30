import { GuessRow } from './Components/GuessRow/GuessRow';
import './App.css';
import { useWordleGame } from './hooks/useGameStatus';

function App() {
  // Pass a fixed word for testing, or omit for random.
  const { gameState, getInputProps, getRowLetters } = useWordleGame(); // or useWordleGame('CRANE')

  return (
    <>
      <h2>Wordle</h2>
      <div className="app">
        <div className="guesses">
          {gameState.guesses.map((guess, idx) => (
            <GuessRow key={idx} letters={guess.letters} />
          ))}
          {/* Render the current (in‑progress) row if the game isn't over */}
          {!gameState.gameOver && (
            <GuessRow
              key="current"
              letters={getRowLetters(gameState.currentRow)}
            />
          )}
        </div>
      </div>

      {/* Hidden input that captures keyboard events */}
      <input {...getInputProps()} autoComplete="off" />
    </>
  );
}

export default App;
