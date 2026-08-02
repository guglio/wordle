import { GuessRow } from './Components/GuessRow/GuessRow';
import { useWordleGame } from './hooks/useGameStatus';
import './App.css';
import { Modal } from './Components/Modal/Modal';
import { useEffect, useState } from 'react';

function App() {
  const {
    solution,
    guesses,
    currentRow,
    gameOver,
    getInputProps,
    getCurrentGuess,
    isWinner,
    resetGame,
  } = useWordleGame('CRANE');

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (gameOver) {
      setShowModal(true);
    }
  }, [gameOver]);

  return (
    <div className='app'>
      <header>
        <h1>Wordle</h1>
        {showModal && (
          <Modal
            isWinner={isWinner}
            solution={solution}
            onClose={() => setShowModal(false)}
            onReset={resetGame}
          />
        )}
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
