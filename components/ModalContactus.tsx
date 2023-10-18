import { useForm } from 'react-hook-form';
import Modal from 'react-responsive-modal';

import ModalDefaultProps from '@model/modal';
import { useContactUs } from '@service/contactMutations';

const ModalContactus = ({ isOpen, close }: ModalDefaultProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const contactMutation = useContactUs(() => {
    reset();
    close();
  });

  const onSubmit = handleSubmit((_) => {
    if (contactMutation.isLoading) {
      return false;
    }
    return contactMutation.mutate(_);
  });

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
      <div className="p-36px w-full">
        <div className="big-title-light text-fontPrimary">お問い合わせ</div>
        <form onSubmit={onSubmit}>
          <textarea
            {...register('body', { required: true })}
            className="mt-36px px-16px py-12px h-140px w-full rounded-8px bg-backgroundPrimary focus:outline-none"
            placeholder="お問い合わせ内容を入力してください。"
          ></textarea>
          {errors.body && (
            <p className="mt-8px body1 text-secondary">内容が空です。</p>
          )}
          <input
            {...register('email', {
              required: true,
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'format error',
              },
            })}
            type="text"
            className="mt-24px px-16px py-12px h-44px w-full rounded-8px bg-backgroundPrimary body1 focus:outline-none"
          />
          {errors.email && (
            <p className="mt-8px text-secondary">
              {errors.email.type === 'required'
                ? 'メールを入力してください。'
                : 'メールアドレスが無効です。'}
            </p>
          )}
          <div className="mt-36px flex flex-row justify-end items-center">
            <span
              onClick={close}
              className="button text-fontSecondary cursor-pointer"
            >
              キャンセル
            </span>
            <button
              className="ml-24px px-24px h-44px rounded-8px bg-primary button text-backgroundSecondary focus:outline-none"
              onClick={onSubmit}
            >
              完了
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ModalContactus;
