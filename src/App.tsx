import { useState } from "react";
import { GuessRow } from "./Components/GuessRow/GuessRow";
import "./App.css";
import { useWordleGame } from "./hooks/useGameStatus";

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

function App() {
  const { getInputProps, gameState } = useWordleGame("CRANE");

  return (
    <>
      <h2>Wordle</h2>
      <div className="app">
        <div className="guesses">
          {gameState.guesses.map(({ letters }, i) => (
            <GuessRow letters={letters} key={`${i}`} />
          ))}
        </div>
      </div>
      <input {...getInputProps()} autoComplete="off" />
    </>
  );
}

export default App;
