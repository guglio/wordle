import './modal.css';

interface ModalProps {
  isWinner: boolean;
  solution: string;
  onClose: () => void;
  onReset: () => void;
}

export const Modal = ({ isWinner, solution, onClose, onReset }: ModalProps) => {
  const message = isWinner ? '🎉 You win!' : `😢 Word was ${solution}`;

  return (
    <div className='wordle-modal'>
      <div className='modal-content' onClick={(e) => e.stopPropagation()}>
        <div className='modal-header'>
          <h2 className='modal-title'>
            {isWinner ? 'Congratulations!' : 'Game Over'}
          </h2>
          <button className='modal-close' onClick={onClose}>
            ×
          </button>
        </div>
        <div className='modal-body'>
          <p className='message'>{message}</p>
          <div className='modal-actions'>
            <button
              className='btn-reset'
              onClick={(e) => {
                e.stopPropagation();
                onReset();
                onClose();
              }}
            >
              Play Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
