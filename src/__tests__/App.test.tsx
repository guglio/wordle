import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';
import { useWordleGame } from '../hooks/useGameStatus';

// Mock the hook using Vitest's vi
vi.mock('../hooks/useGameStatus');

describe('App', () => {
  beforeEach(() => {
    useWordleGame.mockReset();
  });

  test('renders initial state without modal', () => {
    const emptyLetter = { letter: '', status: 'EMPTY' };
    const emptyRowLetters = Array(5).fill(emptyLetter);
    const emptyRowObject = { letters: emptyRowLetters };
    useWordleGame.mockReturnValue({
      solution: 'CRANE',
      guesses: Array(6).fill(emptyRowObject),
      currentRow: 0,
      gameOver: false,
      getInputProps: vi.fn().mockReturnValue({}),
      getCurrentGuess: vi.fn().mockReturnValue(emptyRowLetters),
      isWinner: false,
      resetGame: vi.fn(),
      getShareString: vi.fn().mockReturnValue(''),
    });

    const { container } = render(<App />);

    // Check header
    expect(
      screen.getByRole('heading', { name: /wordle/i }),
    ).toBeInTheDocument();

    // Check that there are 6 guess rows
    const guessRows = Array.from(container.querySelectorAll('.guess'));
    expect(guessRows).toHaveLength(6);

    // Check that each guess row has 5 letter tiles
    guessRows.forEach((guessRow) => {
      const letterTiles = Array.from(guessRow.querySelectorAll('.letter'));
      expect(letterTiles).toHaveLength(5);
      // Check that each letter tile is empty
      letterTiles.forEach((letterTile) => {
        expect(letterTile).toHaveTextContent('');
        expect(letterTile).toHaveClass('empty');
      });
    });

    // Check that modal is not present
    expect(container.querySelector('.wordle-modal')).toBeNull();
  });

  test('shows modal when game is over', async () => {
    const emptyLetter = { letter: '', status: 'EMPTY' };
    const emptyRowLetters = Array(5).fill(emptyLetter);
    const emptyRowObject = { letters: emptyRowLetters };
    const winningRowLetters = [
      { letter: 'C', status: 'GREEN' },
      { letter: 'R', status: 'GREEN' },
      { letter: 'A', status: 'GREEN' },
      { letter: 'N', status: 'GREEN' },
      { letter: 'E', status: 'GREEN' },
    ];
    const winningRowObject = { letters: winningRowLetters };
    const guesses = [winningRowObject, ...Array(5).fill(emptyRowObject)];
    useWordleGame.mockReturnValue({
      solution: 'CRANE',
      guesses,
      currentRow: 1, // after winning, we stay on the same row (the winning row)
      gameOver: true,
      getInputProps: vi.fn().mockReturnValue({}),
      getCurrentGuess: vi.fn().mockReturnValue(emptyRowLetters), // current row (index 1) is empty
      isWinner: true,
      resetGame: vi.fn(),
      getShareString: vi.fn().mockReturnValue('Test share string'),
    });

    const { container } = render(<App />);

    // Wait for modal to appear
    await waitFor(() => {
      expect(container.querySelector('.wordle-modal')).not.toBeNull();
    });

    // Check that the modal contains the winner message
    const modal = container.querySelector('.wordle-modal');
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveTextContent(/congratulations/i);
    expect(modal).toHaveTextContent(/Test share string/i);
  });
});
