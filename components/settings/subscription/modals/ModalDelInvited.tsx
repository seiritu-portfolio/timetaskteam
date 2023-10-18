import Modal from 'react-responsive-modal';

const ModalDelInvited = ({
  isOpen,
  close,
  onSuccess,
  username,
}: {
  isOpen: boolean;
  close: () => void;
  onSuccess: () => void;
  username: string;
}) => {
  return (
    <Modal
      open={isOpen}
      onClose={close}
      center
      showCloseIcon={false}
      classNames={{
        modal: 'modal-md-size',
      }}
    >
      <div className="p-36px">
        <div className="big-title-light text-fontPrimary">
          {username}さんを解約してよろしい ですか？
        </div>
        <div className="mt-24px body2 text-fontSecondary">
          これを行うと、メンバーリストから削除されチーム連携機能が使用できなくなります。依頼や共有されたタスク・スケジュールは,,,
        </div>
        <div className="mt-24px flex-row--end">
          <div
            className="body1 text-fontSecondary cursor-pointer"
            onClick={close}
          >
            キャンセル
          </div>
          <div
            className="ml-24px px-24px h-44px rounded-8px bg-secondary text-backgroundSecondary flex-xy-center hover:opacity-80 cursor-pointer"
            onClick={onSuccess}
          >
            <span>解約</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalDelInvited;
