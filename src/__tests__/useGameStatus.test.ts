import { renderHook, act } from '@testing-library/react';
import { useWordleGame } from '../hooks/useGameStatus';

describe('useWordleGame hook', () => {
  test('initializes with provided solution', () => {
    const solution = 'TESTS';
    const { result } = renderHook(() => useWordleGame(solution));
    expect(result.current.solution).toBe(solution);
  });

  test('resetGame picks a new solution and resets state', () => {
    const { result } = renderHook(() => useWordleGame('CRANE'));
    const initialSolution = result.current.solution;

    act(() => {
      result.current.resetGame();
    });

    // solution should be a 5-letter uppercase string (from word list)
    expect(typeof result.current.solution).toBe('string');
    expect(result.current.solution.length).toBe(5);
    expect(/^[A-Z]+$/.test(result.current.solution)).toBe(true);

    // state reset: guesses array of 6 rows, each row letters array of 5 empty letters
    expect(result.current.guesses).toHaveLength(6);
    expect(
      result.current.guesses.every(
        (g) =>
          g.letters.length === 5 &&
          g.letters.every((l) => l.letter === '' && l.status === 'EMPTY')
      )
    ).toBe(true);
    expect(result.current.currentRow).toBe(0);
    expect(result.current.currentCol).toBe(0);
    expect(result.current.draft).toBe('');
    expect(result.current.gameOver).toBe(false);
    expect(result.current.solution).not.toBe(initialSolution);
    expect(result.current.isWinner).toBe(false);
  });

  test('getShareString returns correct string after resetGame (no guesses)', () => {
    const { result } = renderHook(() => useWordleGame('TESTS'));
    const shareString = result.current.getShareString();
    // After resetGame, currentRow = 0, so rows.length = 1 (the first empty row)
    // Each empty letter -> status 'EMPTY' -> maps to '��������������������������������������������������������������⬜' (white square)
    // So we expect one row of five white squares.
    const expected = 'Wordle 1/6\n\u2B1C\u2B1C\u2B1C\u2B1C\u2B1C';
    expect(shareString).toBe(expected);
  });
});
