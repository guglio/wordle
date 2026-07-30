import './guess.css';
import type { GuessLetter } from '../types.d.ts';

const Guess: React.FC<{ letters: GuessLetter[] }> = ({ letters }) => {
  return (
    <div className="guess">
      {letters.map((l, i) => (
        <span key={i} className={`letter ${l.status.toLowerCase()}`}>
          {l.letter.toUpperCase()}
        </span>
      ))}
    </div>
  );
};

export default Guess;