import React from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import Modal from 'react-responsive-modal';
// * hooks
import {
  setActiveSettingsTab,
  setModalUrl,
  setSettingsModalStatus,
} from '@store/modules/home';
// * assets
import { SUBSCRIPTION_URL } from '@util/urls';
import { replaceState } from '@util/replaceUrl';

const ModalLimitCount = ({
  isOpen,
  close,
  isUserLimited,
}: {
  isOpen: boolean;
  close: () => void;
  isUserLimited?: boolean;
}) => {
  const dispatch = useDispatch();
  const router = useRouter();

  return (
    <Modal
      open={isOpen}
      onClose={close}
      center
      showCloseIcon={false}
      classNames={{
        modal: 'modal-md-size',
      }}
      onOverlayClick={close}
    >
      <div className="p-36px w-full">
        <div className="big-title-light text-black whitespace-nowrap">
          {isUserLimited ? '連携ユーザー' : 'リスト'}が上限数に達しました。
          <br />
          <span className="text-primary">プレミアムプラン</span>
          にアップグレードして、
          <br />
          無制限に{isUserLimited ? '連携ユーザー' : 'リスト'}を追加しましょう。
        </div>
        <div className="mt-24px flex flex-row justify-end items-center">
          <span
            onClick={close}
            className="button text-fontSecondary cursor-pointer"
          >
            キャンセル
          </span>
          <button
            className="ml-24px px-24px h-44px rounded-8px bg-primary button text-backgroundSecondary opacity-100 focus:outline-none focus:opacity-70"
            onClick={() => {
              close();
              dispatch(setModalUrl(SUBSCRIPTION_URL));
              const currentUrl = router.asPath;
              localStorage.setItem('task3_background_url', currentUrl);
              replaceState(SUBSCRIPTION_URL);
              dispatch(setSettingsModalStatus(true));
              dispatch(setActiveSettingsTab(4));
            }}
          >
            プレミアムプランを始める
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalLimitCount;
