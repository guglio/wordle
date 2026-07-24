import "./guessRow.css";

const LetterTile = ({ letter, status }: GuessLetter) => {
  return <span className={`letter ${status.toLowerCase()}`}>{letter}</span>;
};

export const GuessRow = ({ letters }: GuessType) => {
  return (
    <div className="guess">
      {letters.map(({ letter, status }, i) => (
        <LetterTile letter={letter} key={`${letter}-${i}`} status={status} />
      ))}
    </div>
  );
};
