import { GuessRow } from "./Components/GuessRow/GuessRow";
import { useWordleGame } from "./hooks/useGameStatus";
import "./App.css";

function App() {
  const {
    draft,
    solution,
    guesses,
    gameOver,
    getInputProps,
    getRowLetters,
  } = useWordleGame("CRANE");

  return (
    <div className="app">
      <header>
        <h1>Wordle</h1>
        {gameOver && (
          <p className="message">
            {draft === solution ? "🎉 You win!" : ` Word was ${solution}`}
          </p>
        )}
      </header>
      <main>
        <div className="board">
          {guesses.map((_, idx) => (
            <GuessRow key={idx} letters={getRowLetters(idx)} />
          ))}
        </div>
      </main>
      <input {...getInputProps()} autoComplete="off" />
    </div>
  );
}

export default App;
