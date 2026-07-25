import React, { useState, useRef, useEffect, useCallback } from "react";

const setInitState = (solution: string) => ({
  guesses: [],
  currentRow: 0,
  currentCol: 0,
  draft: "",
  solution,
  gameOver: false,
});

export const useWordleGame = (solution = "CRANE") => {
  const [gameState, setGameState] = useState<GameState>(setInitState(solution));

  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputBlur = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const handleKey = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      console.log(e.key);
    },
    [
      gameState.currentCol,
      gameState.currentRow,
      gameState.draft,
      gameState.gameOver,
      gameState.solution,
    ],
  );
  useEffect(() => {
    inputRef?.current?.focus();
  }, [gameState.currentRow, gameState.gameOver]);

  const getInputProps = useCallback(
    () => ({
      ref: inputRef,
      onKeyDown: handleKey,
      onBlur: handleInputBlur,
      style: {
        position: "absolute",
        left: "-9999px",
        opacity: 0,
      },
      "aria-label": "Wordle guess input",
    }),
    [handleKey],
  );

  return { gameState, setGameState, getInputProps };
};
