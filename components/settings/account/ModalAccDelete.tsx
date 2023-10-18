import { useDispatch } from 'react-redux';
import { useMutation } from 'react-query';
import { useRouter } from 'next/router';
import Modal from 'react-responsive-modal';

import ModalDefaultProps from '@model/modal';
import { configBearerToken } from '@util/constants';
import axiosConfig from '@util/axiosConfig';
import { URL_REMOVE_ACCOUNT } from '@util/urls';
import { resetUser } from '@store/modules/user';

const ModalAccDelete = ({ isOpen, close }: ModalDefaultProps) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const mutation = useMutation(
    () => {
      const token = localStorage.getItem('task3_token');
      const config = configBearerToken(token ?? '');

      return axiosConfig.delete(URL_REMOVE_ACCOUNT, config);
    },
    {
      onSuccess: async () => {
        localStorage.setItem('task3_user', JSON.stringify(null));
        localStorage.setItem('task3_token', JSON.stringify(null));
        dispatch(resetUser);
        router.reload();
      },
    },
  );

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
      <div className="p-24px">
        <div className="p-12px big-title text-fontPrimary">
          アカウントを削除してよろしいですか？
        </div>
        <div className="p-12px body2 text-fontSecondary">
          これを行うと、スケジュール、タスクなど、すべてのデータが直ちに削除されます。これを元に戻すことはできません
        </div>
        <div className="mt-24px w-full flex justify-end">
          <span
            onClick={close}
            className="p-12px button text-fontSecondary cursor-pointer"
          >
            キャンセル
          </span>
          <button
            className="ml-12px px-24px h-44px rounded-8px bg-secondary text-backgroundSecondary button text-backgroundSecondary focus:outline-none"
            onClick={() => {
              if (mutation.isLoading) {
              } else {
                mutation.mutate();
              }
            }}
          >
            削除
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalAccDelete;
