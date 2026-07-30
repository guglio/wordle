import "./guessRow.css";
import type { GuessLetter } from "../../types.d.ts";

const LetterTile = ({ letter, status }: GuessLetter) => {
  return <span className={`letter ${status.toLowerCase()}`}>{letter}</span>;
};

export const GuessRow = ({ letters }: { letters: GuessLetter[] }) => {
  return (
    <div className="guess">
      {letters.map(({ letter, status }, i) => (
        <LetterTile
          key={`${i}-${letter}`} // ensure unique key
          letter={letter}
          status={status}
        />
      ))}
    </div>
  );
};
