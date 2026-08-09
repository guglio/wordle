import { render } from '@testing-library/react';
import { GuessRow } from '../Components/GuessRow/GuessRow';

describe('GuessRow component', () => {
  test('renders letters with correct status', () => {
    const letters = [
      { letter: 'A', status: 'CORRECT' as const },
      { letter: 'B', status: 'PRESENT' as const },
      { letter: 'C', status: 'ABSENT' as const },
      { letter: '', status: 'EMPTY' as const },
      { letter: 'D', status: 'CORRECT' as const },
    ];
    const { container } = render(<GuessRow letters={letters} />);
    const spans = Array.from(container.querySelectorAll('span.letter'));
    expect(spans).toHaveLength(5);
    expect(spans[0].textContent).toBe('A');
    expect(spans[0].classList.contains('correct')).toBe(true);
    expect(spans[1].textContent).toBe('B');
    expect(spans[1].classList.contains('present')).toBe(true);
    expect(spans[2].textContent).toBe('C');
    expect(spans[2].classList.contains('absent')).toBe(true);
    expect(spans[3].textContent).toBe('');
    expect(spans[3].classList.contains('empty')).toBe(true);
    expect(spans[4].textContent).toBe('D');
    expect(spans[4].classList.contains('correct')).toBe(true);
  });
});
