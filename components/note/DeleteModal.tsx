import { useSelector } from 'react-redux';
import Modal from 'react-responsive-modal';
// * hooks
import { useUserDelete } from '@service/userMutation';
import { currentCollaboIdSelector } from '@store/selectors/collabos';

const DeleteModal = ({
  isOpen,
  title,
  desc,
  close,
  onDelete,
}: {
  isOpen: boolean;
  title: string;
  desc: string;
  close: () => void;
  onDelete: () => void;
}) => {
  const collaboID = useSelector(currentCollaboIdSelector);
  const deleteMutation = useUserDelete(collaboID ?? -1, () => {
    close();
    onDelete();
  });

  return (
    <Modal
      open={isOpen}
      onClose={() => {
        close();
      }}
      showCloseIcon={false}
      center
      classNames={{ modal: 'modal-md-size' }}
    >
      <div className="p-36px w-full h-full">
        <div className="big-title text-fontPrimary font-medium">{title}</div>
        <div className="mt-20px body1 text-fontSecondary font-medium">
          {desc}
        </div>
        <div className="mt-36px flex flex-row justify-end items-center">
          <span
            onClick={close}
            className="button text-fontSecondary cursor-pointer"
          >
            キャンセル
          </span>
          <button
            className={`ml-24px px-24px h-44px rounded-8px bg-secondary button text-backgroundSecondary disabled:opacity-40 focus:outline-none`}
            disabled={deleteMutation.isLoading}
            onClick={() => {
              if (deleteMutation.isLoading) return false;
              deleteMutation.mutate();
            }}
          >
            削除
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;
