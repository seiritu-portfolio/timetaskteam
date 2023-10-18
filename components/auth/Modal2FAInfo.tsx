import Modal from 'react-responsive-modal';
import Link from 'next/link';

import ModalDefaultProps from '@model/modal';

const Modal2FAInfo = ({ isOpen, close }: ModalDefaultProps) => {
  return (
    <Modal
      open={isOpen}
      onClose={() => close}
      center
      showCloseIcon={false}
      classNames={{
        overlay: 'tfa-modal-overlay',
        modal: 'tfa-modal',
        modalContainer: 'tfa-modal-container',
        root: 'tfa-modal-root',
      }}
      onOverlayClick={close}
    >
      <div className="w-full flex flex-row-reverse">
        <Link href="">
          <a className="body1 text-teal">{`< 入力画面に戻る`}</a>
        </Link>
      </div>
      <div className="mt-12px mx-24px mb-24px">
        <h2 className="mt-12px big-title">認証コードが届かない場合</h2>
        <p className="mt-24px title text-secondary">
          ご登録されている電話番号にてSMSが正常に届いてい
          ないかをご確認の上、以下の項目をお確かめください。
        </p>
        <h3 className="mt-24px title">・ご使用の通信環境</h3>
        <p className="mt-24px ml-32px mr-12px body2">
          SMSは各携帯電話会社の電波を使用して送信しておりま
          す。電波の通信状況が悪かったりすると受信に時間がか
          かることがあります。通信環境の良い場所で再度お確か めください。
        </p>
        <h3 className="mt-24px title">・ご利用の携帯電話の契約内容</h3>
        <p className="mt-12px ml-32px mr-12px body2">
          ご利用の携帯電話によってはSMSに対応していなかった
          り、別途オプションとしての契約が必要な場合がござい
          ます。お手数ですが、ご利用の電話番号の契約内容をご 確認ください。
        </p>
        <h3 className="mt-24px title">・SMSの受信設定</h3>
        <p className="mt-12px ml-32px mr-12px body2">
          ご利用しの携帯電話でSMSを受信しない設定になってい
          る場合や、登録していない連絡先からは受信できない設
          定になっている可能性があります。
        </p>
      </div>
    </Modal>
  );
};

export default Modal2FAInfo;
