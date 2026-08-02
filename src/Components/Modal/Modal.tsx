import './modal.css';

interface ModalProps {
  isWinner: boolean;
  solution: string;
}

export const Modal = ({ isWinner, solution }: ModalProps) => {
  return (
    <div className='wordle-modal'>
      <div className='modal-content'>
        <p className='message'>
          {isWinner ? '🎉 You win!' : `😢 Word was ${solution}`}
        </p>
      </div>
    </div>
  );
};
