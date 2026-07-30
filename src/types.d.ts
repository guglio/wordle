type LetterStatus = 'GREEN' | 'YELLOW' | 'GREY' | 'EMPTY';

interface GuessLetter {
  letter: string; // the actual letter
  status: LetterStatus;
}

interface GuessType {
  letters: GuessLetter[]; // length === 5
}

/* The board state */
type Guesses = GuessType[]; // grows as the user submits guesses

interface GameState {
  guesses: Guesses; // committed rows
  currentRow: number; // which row we are filling (0‑based)
  currentCol: number; // next column to fill in the current row (0‑5)
  draft: string; // letters typed in the current row (max 5)
  solution: string; // the secret word (for demo; normally hidden)
  gameOver: boolean; // true when solved or max rows reached
}
