import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from '../Components/Modal/Modal';

describe('Modal component', () => {
  let onClose: ReturnType<typeof vi.fn>;
  let onReset: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onClose = vi.fn();
    onReset = vi.fn();
  });

  test('renders title based on win/lose', () => {
    render(<Modal isWinner={true} solution='TEST' onClose={onClose} onReset={onReset} />);
    expect(screen.getByRole('heading', { name: /congratulations/i })).toBeInTheDocument();
    expect(screen.getByText(/🎉 you win!/i)).toBeInTheDocument();

    // re-render with loss
    const { container } = render(<Modal isWinner={false} solution='APPLE' onClose={onClose} onReset={onReset} />);
    expect(container.querySelector('.modal-title')?.textContent).toBe('Game Over');
    expect(screen.getByText(/😢 word was apple/i)).toBeInTheDocument();
  });

  test('close button calls onClose (once)', () => {
    render(<Modal isWinner={true} solution='TEST' onClose={onClose} onReset={onReset} />);
    const closeBtn = screen.getByText('×');
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('reset button calls onReset and stops propagation', () => {
    const stopPropagation = vi.fn();
    const onResetWithStop = (e: React.MouseEvent<HTMLButtonElement>) => {
      stopPropagation();
      onReset();
    };
    render(<Modal isWinner={true} solution='TEST' onClose={onClose} onReset={onResetWithStop} />);
    const resetBtn = screen.getByRole('button', { name: /play again/i });
    fireEvent.click(resetBtn);
    expect(onReset).toHaveBeenCalledTimes(1);
    expect(stopPropagation).toHaveBeenCalledTimes(1);
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
    const messageEl = screen.getByText(/🎉 you win!/i);
    // click on the message text
    fireEvent.click(messageEl);
    expect(onClose).not.toHaveBeenCalled();
  });

  test('clicking modal-container (non-button) does NOT call onClose', () => {
    render(<Modal isWinner={true} solution='TEST' onClose={onClose} onReset={onReset} />);
    const modalContent = document.querySelector('.modal-content');
    if (!modalContent) throw new Error('modal-content not found');
    // click somewhere inside modal-content but not on button
    // we can click on the title
    const titleEl = screen.getByRole('heading', { name: /congratulations/i });
    fireEvent.click(titleEl);
    expect(onClose).not.toHaveBeenCalled();
  });

  test('renders share preview when shareString provided', () => {
    const shareString = 'test share string';
    render(<Modal isWinner={true} solution='TEST' onClose={onClose} onReset={onReset} shareString={shareString} />);
    expect(screen.getByText(shareString)).toBeInTheDocument();
  });

  test('Share button calls onCopyShare and stops propagation', () => {
    const onCopyShare = vi.fn();
    const stopPropagation = vi.fn();
    const onCopyShareWithStop = (e: React.MouseEvent<HTMLButtonElement>) => {
      stopPropagation();
      onCopyShare();
    };
    render(<Modal isWinner={true} solution='TEST' onClose={onClose} onReset={onReset} shareString='any string' onCopyShare={onCopyShareWithStop} />);
    const shareBtn = screen.getByRole('button', { name: /share/i });
    fireEvent.click(shareBtn);
    expect(onCopyShare).toHaveBeenCalledTimes(1);
    expect(stopPropagation).toHaveBeenCalledTimes(1);
  });
});
