import { useUserDelete } from '@service/userMutation';
import { currentCollaboIdSelector } from '@store/selectors/collabos';
import { useSelector } from 'react-redux';
import Modal from 'react-responsive-modal';

const ModalDeleteUser = ({
  isOpen,
  close,
  onDelete,
}: {
  isOpen: boolean;
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
        <div className="big-title text-fontPrimary">
          ユーザーを削除してもよろしいですか。
        </div>
        <div className="mt-36px flex flex-row justify-end items-center">
          <span
            onClick={close}
            className="button text-fontSecondary cursor-pointer"
          >
            キャンセル
          </span>
          <button
            className={`ml-24px px-24px h-44px rounded-8px bg-secondary button text-backgroundSecondary disabled:opacity-40`}
            disabled={deleteMutation.isLoading}
            onClick={() => {
              if (deleteMutation.isLoading) return false;
              deleteMutation.mutate();
            }}
          >
            確認
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalDeleteUser;
