import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  KeyboardEvent,
  FocusEvent,
} from 'react';

export type LetterStatus = 'GREEN' | 'YELLOW' | 'GREY' | 'EMPTY';

export interface GuessLetter {
  letter: string;
  status: LetterStatus;
}

export interface GuessType {
  letters: GuessLetter[];
}

export type Guesses = GuessType[];

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

// A tiny word list for demo – replace with your own source.
const WORD_LIST: string[] = [
  'CRANE',
  'SLATE',
  'TRACE',
  'ROAST',
  'SAUCE',
  // …add as many 5‑letter words as you like…;
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
  };
};

export const useWordleGame = (solution = 'CRANE') => {
  solution =
    solution || WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
  const [gameState, setGameState] = useState<GameState>(setInitState(solution));

  const inputRef = useRef<HTMLInputElement>(null);

  // Keep the hidden input focused whenever it loses focus.
  const handleInputBlur = useCallback(
    (_e: FocusEvent<HTMLInputElement>) => {
      inputRef.current?.focus();
    },
    [],
  );

  // Ensure the input has focus on mount and after each round ends.
  useEffect(() => {
    inputRef.current?.focus();
  }, [gameState.currentRow, gameState.gameOver]);

  /* --------------------------------------------------------------
   *  Scoring – classic two‑pass Wordle algorithm
   *  -------------------------------------------------------------- */
  const evaluateGuess = useCallback((guess: string): LetterStatus[] => {
    const solutionChars = solution.split('');
    const guessChars = guess.toUpperCase().split('');
    const result: LetterStatus[] = Array(WORD_LENGTH).fill('GREY');

    // 1️⃣ Mark greens
    guessChars.forEach((ch, i) => {
      if (ch === solutionChars[i]) {
        result[i] = 'GREEN';
        solutionChars[i] = null as any; // mark as used
        guessChars[i] = null as any;
      }
    });

    // 2️⃣ Mark yellows
    guessChars.forEach((ch, i) => {
      if (ch === null) return;
      const idx = solutionChars.indexOf(ch);
      if (idx !== -1) {
        result[i] = 'YELLOW';
        solutionChars[idx] = null as any; // mark as used
      }
    });

    return result;
  }, [solution]);

  /* --------------------------------------------------------------
   *  Keyboard handling
   *  -------------------------------------------------------------- */
  const handleKey = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (gameState.gameOver) return;

      // Ignore modifier‑key combos (copy/paste, etc.)
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

      // -------- Enter --------
      if (key === 'Enter') {
        e.preventDefault();
        if (gameState.draft.length !== WORD_LENGTH) return;

        const statuses = evaluateGuess(gameState.draft);

        setGameState((prev) => {
          const updatedGuesses = [...prev.guesses];
          updatedGuesses[prev.currentRow] = {
            letters: prev.draft
              .split('')
              .map((char, i) => ({
                letter: char,
                status: statuses[i],
              })),
          };

          const isWinner = statuses.every((status) => status === 'GREEN');
          const nextRow = prev.currentRow + 1;
          const gameOver = isWinner || nextRow >= MAX_GUESSES;

          return {
            ...prev,
            guesses: updatedGuesses,
            currentRow: gameOver ? prev.currentRow : nextRow,
            currentCol: 0,
            draft: '',
            gameOver,
          };
        });
        return;
      }

      // -------- Letter keys --------
      if (
        key.length === 1 &&
        /^[a-zA-Z]/.test(key) &&
        gameState.draft.length < WORD_LENGTH
      ) {
        e.preventDefault();
        setGameState((s) => ({
          ...s,
          draft: s.draft + key.toUpperCase(),
          currentCol: Math.min(WORD_LENGTH, s.currentCol + 1),
        }));
        return;
      }

      // -------- Any other key (Tab, Shift, Escape, Space, etc.) --------
      // Prevent default to avoid scrolling or focus loss, but otherwise ignore.
      e.preventDefault();
      return;
    },
    [
      gameState.currentCol,
      gameState.currentRow,
      gameState.draft,
      gameState.gameOver,
      evaluateGuess,
    ]
  );

  /* --------------------------------------------------------------
   *  Props for the hidden input
   *  -------------------------------------------------------------- */
  const getInputProps = useCallback(() => ({
    ref: inputRef,
    onKeyDown: handleKey,
    onBlur: handleInputBlur,
    autoComplete: 'off',
    'aria-label': 'Wordle guess input',
    style: {
      position: 'absolute',
      left: '-9999px',
      opacity: 0,
    } as const,
  }), [handleKey, handleInputBlur]);

  /* --------------------------------------------------------------
   *  Derive what to render for a given row (committed or draft)
   *  -------------------------------------------------------------- */
  const getRowLetters = useCallback(
    (rowIndex: number): GuessLetter[] => {
      if (rowIndex < gameState.guesses.length) {
        return gameState.guesses[rowIndex].letters;
      }
      if (rowIndex === gameState.currentRow) {
        const draftLetters = gameState.draft
          .toUpperCase()
          .split('')
          .map(ch => ({ letter: ch, status: 'EMPTY' as LetterStatus }));
        const padding = Array(WORD_LENGTH - gameState.draft.length).fill({
          letter: '',
          status: 'EMPTY' as LetterStatus,
        });
        return [...draftLetters, ...padding];
      }
      // Future rows are completely empty
      return Array(WORD_LENGTH).fill({
        letter: '',
        status: 'EMPTY' as LetterStatus,
      });
    },
    [gameState.currentRow, gameState.draft, gameState.guesses]
  );

  const getCurrentGuess = useCallback((): GuessLetter[] => {
    const typed = gameState.draft
      .toUpperCase()
      .split('')
      .map((letter) => ({
        letter,
        status: 'EMPTY' as LetterStatus,
      }));
    const padding = Array(WORD_LENGTH - gameState.draft.length).fill(EMPTY_LETTER);
    return [...typed, ...padding];
  }, [gameState.draft, gameState.currentCol]);

  return {
    ...gameState,
    solution,
    evaluateGuess,
    getInputProps,
    getRowLetters,
    getCurrentGuess,
  };
};