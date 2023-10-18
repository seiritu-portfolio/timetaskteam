import Modal from 'react-responsive-modal';
import { useBulkTasksUpdate } from '@service/taskMutation';

const ModalDelete = ({
  selectedList,
  isOpen,
  close,
  listName,
}: {
  selectedList: number[];
  isOpen: boolean;
  close: () => void;
  listName: string;
}) => {
  const mutation = useBulkTasksUpdate(() => {
    close();
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
          {listName}を削除してよろよろしいですか？
        </div>
        <div className="mt-24px body2 text-fontSecondary">
          このリスト内のタスクは全て削除されます。
        </div>
        <div className="mt-36px flex flex-row justify-end items-center">
          <span
            onClick={close}
            className="button text-fontSecondary cursor-pointer"
          >
            キャンセル
          </span>
          <button
            className="ml-24px px-24px h-44px rounded-8px bg-secondary button text-backgroundSecondary"
            onClick={() => {
              if (mutation.isLoading) {
              } else {
                mutation.mutate({
                  task_ids: selectedList,
                  remove: 'true',
                });
              }
            }}
          >
            完了
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalDelete;
