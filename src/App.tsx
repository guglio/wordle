import { useState } from "react";
import { GuessRow } from "./Components/GuessRow/GuessRow";
import "./App.css";

const sampleGuesses: Guesses = [
  {
    letters: [
      { letter: "C", status: "GREY" }, // C not in solution
      { letter: "R", status: "YELLOW" }, // R exists but wrong spot
      { letter: "A", status: "GREEN" }, // A in correct spot
      { letter: "N", status: "GREY" }, // N not in solution
      { letter: "E", status: "GREEN" }, // E in correct spot
    ],
  },
  {
    letters: [
      { letter: "S", status: "GREEN" }, // S correct spot
      { letter: "H", status: "GREY" }, // H not in solution
      { letter: "O", status: "YELLOW" }, // O exists but wrong spot
      { letter: "R", status: "GREY" }, // R already used elsewhere → grey
      { letter: "E", status: "EMPTY" }, // E correct spot
    ],
  },
];

const BLANK_GUESS: GuessType = {
  letters: Array(5)
    .fill(0)
    .map(() => ({ letter: "", status: "EMPTY" })),
};

const BLANK_GUESSES: Guesses = Array(6)
  .fill(0)
  .map(() => BLANK_GUESS);

function App() {
  const [guesses, setGuesses] = useState<Guesses>(BLANK_GUESSES);

  return (
    <>
      <h2>Wordle</h2>
      <div className="app">
        <div className="guesses">
          {guesses.map(({ letters }) => (
            <GuessRow letters={letters} />
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
