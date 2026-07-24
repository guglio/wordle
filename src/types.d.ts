type LetterStatus = "GREEN" | "YELLOW" | "GREY" | "EMPTY";

interface GuessLetter {
  letter: string; // the actual letter
  status: LetterStatus;
}

interface GuessType {
  letters: GuessLetter[]; // length === 5
}

/* The board state */
type Guesses = GuessType[]; // grows as the user submits guesses
