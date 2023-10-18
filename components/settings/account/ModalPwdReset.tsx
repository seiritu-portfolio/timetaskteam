import { useCallback, useState } from 'react';
import Modal from 'react-responsive-modal';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import CircledCloseIcon from '@svg/multiply-circle-fill-small.svg';
import ModalDefaultProps from '@model/modal';
import { DefaultInputWrap } from '@component/general/input';
import { configBearerToken } from '@util/constants';
import axiosConfig from '@util/axiosConfig';
import { URL_UPDATE_PASSWORD } from '@util/urls';

interface ModalPwdResetProps extends ModalDefaultProps {
  emailReset: () => void;
}

const ModalPwdReset = ({ isOpen, close, emailReset }: ModalPwdResetProps) => {
  const { register, handleSubmit, getValues, reset, formState } = useForm({
    mode: 'onChange',
  });
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (data: any) => {
      const token = localStorage.getItem('task3_token');
      const config = configBearerToken(token ?? '');

      return axiosConfig.put(URL_UPDATE_PASSWORD, data, config);
    },
    {
      onSuccess: async () => {
        toast.success('成功', {
          hideProgressBar: false,
          progress: undefined,
          onOpen: () => {
            queryClient.invalidateQueries('my_info');
            close();
            reset();
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

  const onClose = useCallback(() => {
    close();
    reset();
  }, [close, reset]);

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      center
      showCloseIcon={false}
      classNames={{
        modal: 'modal-md-size',
      }}
    >
      <div className="p-24px">
        <div className="p-12px big-title-light text-fontPrimary">
          パスワード再設定
        </div>
        <div className="p-12px w-full">
          <form onSubmit={onSubmit}>
            <div className="py-12px w-full">
              <PwdInput
                registerName="current_password"
                placeholder="現在のパスワード"
                register={register}
                reset={reset}
              />
              {formState.errors.current_password && (
                <p className="mt-8px body1 text-secondary">内容が空です。</p>
              )}
            </div>
            <div className="py-12px w-full">
              <PwdInput
                registerName="password"
                placeholder="新しいパスワード"
                register={register}
                reset={reset}
                validate={{
                  pattern: {
                    value: /.{8,}/i,
                    message: '最低限必要なパスワードの長さ: 8',
                  },
                  validate: {
                    different: (value: any) => {
                      const valueOrigin = getValues('current_password');
                      return (
                        value !== valueOrigin ||
                        '新しいパスワードは元のパスワードとは異なる必要があります'
                      );
                    },
                  },
                }}
              />
              {formState.errors.password && (
                <p className="mt-8px body1 text-secondary">
                  {formState.errors.password.message ?? '内容が空です。'}
                </p>
              )}
            </div>
            <div className="py-12px w-full">
              <PwdInput
                registerName="password_confirmation"
                placeholder="新しいパスワード確認"
                register={register}
                reset={reset}
                validate={{
                  validate: {
                    equal: (value: any) => {
                      const valueOrigin = getValues('password');
                      return (
                        value === valueOrigin ||
                        '新しいパスワードと、確認用のパスワードが異なります。もう一度パスワードを入力してください。'
                      );
                    },
                  },
                }}
              />
              {formState.errors.password_confirmation && (
                <p className="mt-8px body1 text-secondary">
                  {formState.errors.password_confirmation.message}
                </p>
              )}
            </div>
            <div
              className="py-12px text-primary cursor-pointer"
              onClick={() => {
                emailReset();
              }}
            >
              パスワードをお忘れですか？
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
                完了
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default ModalPwdReset;

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
        autoComplete="off"
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
