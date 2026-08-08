import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from '../Components/Modal/Modal';
import { vi } from 'vitest';

describe('Modal component', () => {
  const onClose = vi.fn();
  const onReset = vi.fn();
  const onCopyShare = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders title based on win/lose', () => {
    // Test winner state
    render(<Modal isWinner={true} solution='TEST' onClose={onClose} onReset={onReset} />);
    expect(screen.getByRole('heading', { name: /congratulations/i })).toBeInTheDocument();
    expect(screen.getByText(/You win!/i)).toBeInTheDocument();

    // Test loser state
    const { container } = render(<Modal isWinner={false} solution='APPLE' onClose={onClose} onReset={onReset} />);
    expect(container.querySelector('.modal-title')?.textContent).toBe('Game Over');
    expect(screen.getByText(/Word was APPLE/i)).toBeInTheDocument();
  });

  test('reset button calls onReset', () => {
    render(<Modal isWinner={true} solution='TEST' onClose={onClose} onReset={onReset} />);
    const resetBtn = screen.getByRole('button', { name: /play again/i });
    fireEvent.click(resetBtn);
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  test('close button calls onClose (once)', () => {
    render(<Modal isWinner={true} solution='TEST' onClose={onClose} onReset={onReset} />);
    const closeBtn = screen.getByText('×');
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('reset button calls onReset (internal stopPropagation handled by Modal)', () => {
    render(<Modal isWinner={true} solution='TEST' onClose={onClose} onReset={onReset} />);
    const resetBtn = screen.getByRole('button', { name: /play again/i });
    fireEvent.click(resetBtn);
    expect(onReset).toHaveBeenCalledTimes(1);
    // Note: Modal internally calls e.stopPropagation() before calling onReset()
    // We verify onReset is called, which confirms the handler worked
  });

  test('clicking backdrop calls onClose', () => {
    const { container } = render(<Modal isWinner={true} solution='TEST' onClose={onClose} onReset={onReset} />);
    const backdrop = container.querySelector('.wordle-modal');
    // click on backdrop (the outer div)
    fireEvent.click(backdrop!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('clicking inside modal-content (e.g., message) does NOT call onClose', () => {
    render(<Modal isWinner={true} solution='TEST' onClose={onClose} onReset={onReset} />);
    const messageEl = screen.getByText(/You win!/i);
    // click on the message text
    fireEvent.click(messageEl);
    expect(onClose).not.toHaveBeenCalled();
  });

  test('clicking modal-container (non-button) does NOT call onClose', () => {
    render(<Modal isWinner={true} solution='TEST' onClose={onClose} onReset={onReset} />);
    const titleEl = screen.getByRole('heading', { name: /congratulations/i });
    // click on the title (inside modal-content but not a button)
    fireEvent.click(titleEl);
    expect(onClose).not.toHaveBeenCalled();
  });

  test('renders share preview when shareString provided', () => {
    const shareString = 'test share string';
    render(<Modal isWinner={true} solution='TEST' onClose={onClose} onReset={onReset} shareString={shareString} />);
    expect(screen.getByText(shareString)).toBeInTheDocument();
  });

  test('Share button calls onCopyShare (internal stopPropagation handled by Modal)', () => {
    render(<Modal isWinner={true} solution='TEST' onClose={onClose} onReset={onReset} shareString='any string' onCopyShare={onCopyShare} />);
    const shareBtn = screen.getByRole('button', { name: /share/i });
    fireEvent.click(shareBtn);
    expect(onCopyShare).toHaveBeenCalledTimes(1);
    // Note: Modal internally calls e.stopPropagation() before calling onCopyShare()
  });
});