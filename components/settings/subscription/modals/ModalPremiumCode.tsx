import { useSelector } from 'react-redux';
import Modal from 'react-responsive-modal';

import {
  premiumCodeSelector,
  userCountSelector,
} from '@store/selectors/subscription';
import ModalDefaultProps from '@model/modal';

const ModalPremiumCode = ({ isOpen, close }: ModalDefaultProps) => {
  const premiumCode = useSelector(premiumCodeSelector);
  const userCount = useSelector(userCountSelector);

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
        <div className="big-title-light text-fontPrimary">プレミアムコード</div>
        <div className="mt-36px h-44px w-full rounded-8x bg-backgroundPrimary text-primary flex-xy-center">
          <span>{premiumCode}</span>
        </div>
        <div className="mt-24px body2 text-fontSecondary">
          <div className="text-primary">
            プレミアムコードは残り{userCount ? userCount - 1 : 0}
            ユーザーの登録が可能です。
          </div>
          コードをチームメンバーのサブスクリプション画面より登録することで、プレミアムプランへのアップグレードが可能になります。
        </div>
        <div className="mt-36px w-full flex-row--end">
          <button
            className={`btn--default disabled:bg-primaryDisabled`}
            disabled={premiumCode && premiumCode !== '' ? false : true}
            onClick={() => {
              if (premiumCode && premiumCode !== '') {
                close();
              }
            }}
          >
            閉じる
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalPremiumCode;
