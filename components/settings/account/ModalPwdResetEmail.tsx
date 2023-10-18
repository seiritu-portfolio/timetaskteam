import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import Modal from 'react-responsive-modal';
import { toast } from 'react-toastify';

import { emailSelector } from '@store/selectors/user';
import CircledCloseIcon from '@svg/multiply-circle-fill-small.svg';
import ModalDefaultProps from '@model/modal';
import { DefaultInputWrap } from '@component/general/input';
import axiosConfig from '@util/axiosConfig';
import { URL_FORGOT_PWD } from '@util/urls';

const ModalPwdResetEmail = ({ isOpen, close }: ModalDefaultProps) => {
  const currentEmail = useSelector(emailSelector);

  const { register, handleSubmit, reset, formState } = useForm({
    mode: 'onChange',
  });
  const { ref, name, onChange, onBlur } = register('email', {
    required: true,
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: '有効なメールアドレスを入力してください。',
    },
    validate: {
      equal: (value: any) => {
        return value === currentEmail || 'メールアドレスが正しくありません';
      },
    },
  });
  const [inputNameReset, setInputNameReset] = useState(false);

  const mutation = useMutation(
    (data: any) => axiosConfig.post(URL_FORGOT_PWD, data),
    {
      onSuccess: async () => {
        // @ts-ignore
        toast.success('リセットリンクのメールをチェックしてください。', {
          hideProgressBar: true,
          progress: undefined,
          onOpen: () => {
            close();
          },
        });
      },
      onError: async (error) => {
        // @ts-ignore
        const errorMessage = error.response.data.data
          ? // @ts-ignore
            error.response.data.data
          : //@ts-ignore
            Object.values(error.response.data.errors)[0][0];

        toast.error(errorMessage ?? '失敗', {
          hideProgressBar: false,
          progress: undefined,
          onOpen: () => {
            reset();
          },
        });
      },
    },
  );

  const onSubmit = handleSubmit((data) => {
    if (mutation.isLoading) {
      return false;
    }
    return mutation.mutate(data);
  });

  return (
    <Modal
      open={isOpen}
      onClose={() => {
        close();
      }}
      center
      showCloseIcon={false}
      classNames={{
        modal: 'modal-md-size',
      }}
    >
      <div className="p-24px">
        <div className="p-12px big-title-light text-fontPrimary">
          パスワードリセット
        </div>
        <div className="p-12px w-full">
          <form onSubmit={onSubmit}>
            <div className="py-12px w-full">
              <DefaultInputWrap additionalPositionClass="">
                <input
                  name={name}
                  ref={ref}
                  type="text"
                  onChange={(e) => {
                    onChange(e);
                    if (e.target.value !== '') {
                      setInputNameReset(true);
                    } else {
                      setInputNameReset(false);
                    }
                  }}
                  onBlur={onBlur}
                  placeholder="登録済みメールアドレス"
                  className="w-full bg-backgroundPrimary focus:outline-none"
                />
                {inputNameReset ? (
                  <CircledCloseIcon
                    width="21"
                    height="20"
                    className="text-fontSecondary"
                    onClick={() => {
                      reset();
                      setInputNameReset(false);
                    }}
                  />
                ) : null}
              </DefaultInputWrap>
              {formState.errors.email?.message && (
                <p className="mt-8px body1 text-secondary">
                  {formState.errors.email.message ?? ''}
                </p>
              )}
              {formState.errors.email?.type === 'required' && (
                <p className="mt-8px body1 text-secondary">
                  メールアドレスを入力してください
                </p>
              )}
            </div>
            <div className="py-12px text-fontSecondary">
              logo
              spaceへのサインインに使用するメールアドレスを入力してください。
            </div>
            <div className="mt-24px w-full flex justify-end">
              <span
                onClick={close}
                className="p-12px button text-fontSecondary cursor-pointer"
              >
                キャンセル
              </span>
              <button
                className={`ml-12px px-24px h-44px rounded-8px ${
                  formState.isValid ? 'bg-primary' : 'bg-primaryDisabled'
                } text-backgroundSecondary button text-backgroundSecondary`}
                type="submit"
                disabled={!formState.isValid}
              >
                パスワードリセットメール
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default ModalPwdResetEmail;

const PwdInput = ({
  registerName,
  placeholder,
  register,
  reset,
  validate,
}: {
  registerName: string;
  placeholder: string;
  register: any;
  reset: () => void;
  validate?: any;
}) => {
  const { ref, name, onChange, onBlur } = register(registerName, {
    required: true,
    ...validate,
  });
  const [inputNameReset, setInputNameReset] = useState(false);

  return (
    <DefaultInputWrap additionalPositionClass="">
      <input
        name={name}
        ref={ref}
        type="password"
        onChange={(e) => {
          onChange(e);
          if (e.target.value !== '') {
            setInputNameReset(true);
          } else {
            setInputNameReset(false);
          }
        }}
        onBlur={onBlur}
        placeholder={placeholder}
        className="w-full bg-backgroundPrimary focus:outline-none"
      />
      {inputNameReset ? (
        <CircledCloseIcon
          width="21"
          height="20"
          className="text-fontSecondary"
          onClick={() => {
            reset();
            setInputNameReset(false);
          }}
        />
      ) : null}
    </DefaultInputWrap>
  );
};
