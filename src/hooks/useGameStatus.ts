import React, { useState, useRef, useEffect, useCallback } from 'react';

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

const WORD_LIST = [
  'SLATE',
  'CRANE',
  'TRACE',
  'ROAST',
  // … add more 5‑letter words …
];

const EMPTY_LETTER = { letter: '', status: 'EMPTY' as LetterStatus };

const EMPTY_ROW: GuessType = {
  letters: Array(WORD_LENGTH).fill(EMPTY_LETTER),
};

const setInitState = (solution: string) => {
  return {
    guesses: Array(MAX_GUESSES).fill(EMPTY_ROW),
    currentRow: 0,
    currentCol: 0,
    draft: '',
    solution,
    gameOver: false,
    isWinner: false,
  };
};

export const useWordleGame = (solution = 'CRANE') => {
  solution =
    solution || WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
  const [gameState, setGameState] = useState<GameState>(setInitState(solution));

  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputBlur = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const evaluateGuess = useCallback(
    (guessWord: string) => {
      const solutionChars = gameState.solution.split('');
      const guessChars = guessWord.split('');

      const status: LetterStatus[] = Array(WORD_LENGTH).fill('GREY');

      guessChars.forEach((letter, i) => {
        if (letter === solutionChars[i]) {
          status[i] = 'GREEN';
          solutionChars[i] = null as any;
          guessChars[i] = null as any;
        }
      });

      guessChars.forEach((letter, i) => {
        if (letter === null) return;
        const idx = solutionChars.indexOf(letter);
        if (idx !== -1) {
          status[i] = 'YELLOW';
          solutionChars[idx] = null as any;
        }
      });

      return status;
    },
    [gameState.solution],
  );

  const handleKey = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (gameState.gameOver) return;

      if (e.altKey || e.ctrlKey || e.metaKey) return;

      const key = e.key;

      // -------- navigation keys (prevent scroll) --------
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(key)) {
        e.preventDefault();
        return;
      }
      if (key === 'Backspace') {
        e.preventDefault();
        if (gameState.draft.length > 0) {
          setGameState((s) => ({
            ...s,
            draft: s.draft.slice(0, -1),
            currentCol: Math.max(0, s.currentCol - 1),
          }));
        }
        return;
      }

      if (key === 'Enter') {
        e.preventDefault();
        if (gameState.draft.length !== WORD_LENGTH) return;

        const statuses = evaluateGuess(gameState.draft);

        setGameState((prev) => {
          const updatedGuesses = [...prev.guesses];
          updatedGuesses[prev.currentRow] = {
            letters: prev.draft.split('').map((char, i) => ({
              letter: char,
              status: statuses[i],
            })),
          };

          const isWinner = statuses.every((status) => status === 'GREEN');
          const gameOver = isWinner || prev.currentRow + 1 >= MAX_GUESSES;
          const nextRow = gameOver ? prev.currentRow : prev.currentRow + 1;

          return {
            ...prev,
            guesses: updatedGuesses,
            currentRow: gameOver ? prev.currentRow : nextRow,
            currentCol: 0,
            draft: '',
            gameOver,
            isWinner,
          };
        });
        return;
      }
      if (
        key.length === 1 &&
        /^[a-zA-Z]/.test(key) &&
        gameState.draft.length < WORD_LENGTH
      ) {
        e.preventDefault();

        setGameState((state) => ({
          ...state,
          draft: state.draft + key.toUpperCase(),
          currentCol: Math.min(WORD_LENGTH, state.currentCol + 1),
        }));
      }
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
        position: 'absolute',
        left: '-9999px',
        opacity: 0,
      } as const,
      'aria-label': 'Wordle guess input',
    }),
    [handleKey],
  );

  const getRowLetters = useCallback(
    (rowIndex: number): GuessLetter[] => {
      if (rowIndex < gameState.guesses.length)
        return gameState.guesses[rowIndex].letters;
      if (rowIndex === gameState.currentRow) {
        return gameState.draft
          .toUpperCase()
          .split('')
          .map((char) => ({ letter: char, status: 'EMPTY' as LetterStatus }))
          .concat(
            Array(WORD_LENGTH - gameState.draft.length).fill({
              letter: '',
              status: 'EMPTY' as LetterStatus,
            }),
          );
      }
      return Array(WORD_LENGTH).fill({
        letter: '',
        status: 'EMPTY' as LetterStatus,
      });
    },
    [gameState.currentRow, gameState.draft, gameState.guesses],
  );

  const getCurrentGuess = useCallback((): GuessLetter[] => {
    if (gameState.draft.length > 0) {
      const typed = gameState.draft
        .toUpperCase()
        .split('')
        .map((letter) => ({
          letter,
          status: 'EMPTY' as LetterStatus,
        }));
      const padding = Array(WORD_LENGTH - gameState.draft.length).fill(
        EMPTY_LETTER,
      );
      return [...typed, ...padding];
    }
    if (gameState.currentRow < gameState.guesses.length)
      return gameState.guesses[gameState.currentRow].letters;
    return Array(MAX_GUESSES).fill(EMPTY_ROW);
  }, [gameState.draft, gameState.currentRow, gameState.guesses]);
const resetGame = useCallback(() => {
    const newSolution = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
    setGameState(setInitState(newSolution));
  }, []);

  const getShareString = useCallback(() => {
    const rows = gameState.guesses
      .slice(0, gameState.currentRow + 1) // only rows that have been submitted
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
    return [header, ...rows].join('\n');
  }, [gameState.guesses, gameState.currentRow]);

  return {
    ...gameState,
    solution,
    evaluateGuess,
    getInputProps,
    getRowLetters,
    getCurrentGuess,
    resetGame,
    getShareString,
  };
};
