import { GuessRow } from './Components/GuessRow/GuessRow';
import { useWordleGame } from './hooks/useGameStatus';
import './App.css';
import { Modal } from './Components/Modal/Modal';

function App() {
  const {
    solution,
    guesses,
    currentRow,
    gameOver,
    getInputProps,
    getCurrentGuess,
    isWinner,
  } = useWordleGame('CRANE');

  return (
    <div className='app'>
      <header>
        <h1>Wordle</h1>
        {/* {gameOver && (
          <p className='message'>
            {isWinner ? '🎉 You win!' : `😢 Word was ${solution}`}
          </p>
        )} */}
        {gameOver && <Modal isWinner={isWinner} solution={solution} />}
      </header>
      <main>
        <div className='board'>
          {guesses.map((row, idx) => (
            <GuessRow
              key={idx}
              letters={idx === currentRow ? getCurrentGuess() : row.letters}
            />
          ))}
        </div>
      </main>
      <input {...getInputProps()} autoComplete='off' />
    </div>
  );
}

export default App;
