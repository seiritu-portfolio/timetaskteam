import CodeInput from '@component/auth/CodeInput';
import Modal from 'react-responsive-modal';
import Link from 'next/link';

import ModalDefaultProps from '@model/modal';

const Modal2FACode = ({ isOpen, close }: ModalDefaultProps) => {
  return (
    <Modal
      open={isOpen}
      onClose={close}
      center
      showCloseIcon={false}
      classNames={{
        overlay: 'tfa-overlay',
        modal: 'tfa-modal',
        modalContainer: 'tfa-modal-container',
        root: 'tfa-modal-root',
      }}
      onOverlayClick={close}
    >
      <h2 className="big-title text-fontPrimary">認証コード</h2>
      <p className="mt-24px caption2 text-fontSecondary">
        ご登録された電話番号のSMSに認証コードを送信いたしました。
      </p>
      <div className="mt-24px">
        <CodeInput />
      </div>
      <div className="mt-24px flex flex-row justify-between items-center">
        <p className="body2 text-fontPrimary">
          認証コードを届かない場合は
          <Link href="/">
            <a className="text-primary">こちら</a>
          </Link>
        </p>
        <button className="h-44px w-120px rounded-8px bg-primary text-backgroundSecondary button">
          サインイン
        </button>
      </div>
    </Modal>
  );
};

export default Modal2FACode;
