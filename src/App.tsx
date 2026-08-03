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
  const [shareString, setShareString] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (gameOver) {
      setShowModal(true);
      // Generate share string from guesses (only submitted rows)
      const rows = guesses
        .slice(0, currentRow + 1) // only rows that have been submitted
        .map(row => {
          return row.letters
            .map(l => {
              switch (l.status) {
                case 'GREEN': return '🟩';
                case 'YELLOW': return '🟨';
                default: return '⬜';
              }
            })
            .join('');
        });
      const guessCount = rows.length;
      const header = `Wordle ${guessCount}/6`;
      const share = [header, ...rows].join('\n');
      setShareString(share);
    }
  }, [gameOver, guesses, currentRow]);

  const handleCopyShare = async () => {
    if (shareString) {
      try {
        await navigator.clipboard.writeText(shareString);
        alert('Copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy: ', err);
        alert('Failed to copy text');
      }
    }
  };

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
            shareString={shareString}
            onCopyShare={handleCopyShare}
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
