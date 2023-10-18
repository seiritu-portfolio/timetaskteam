import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import Modal from 'react-responsive-modal';
import { toast } from 'react-toastify';

import { configBearerToken } from '@util/constants';
import { URL_SUBSCRIPTION_USECODE } from '@util/urls';
import axiosConfig from '@util/axiosConfig';

import { DefaultInputWrap } from '@component/general/input';
import CircledCloseIcon from '@svg/multiply-circle-fill-small.svg';

import ModalDefaultProps from '@model/modal';

const ModalCodeInput = ({ isOpen, close }: ModalDefaultProps) => {
  const {
    register,
    handleSubmit,
    reset,
    // formState: { errors },
  } = useForm();
  const codeInputRef = register('code', { required: true });
  const [inputNameReset, setInputNameReset] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (premiumCode: string) => {
      const token = localStorage.getItem('task3_token');
      const config = configBearerToken(token ?? '');

      return axiosConfig.post(
        URL_SUBSCRIPTION_USECODE,
        {
          premium_code: premiumCode,
        },
        config,
      );
    },
    {
      onSuccess: async () => {
        toast.success('成功', {
          hideProgressBar: false,
          progress: undefined,
          onOpen: () => {
            queryClient.invalidateQueries('premium_owner');
          },
        });
        close();
      },
      onError: async (error) => {
        // check if the code is wrong or any other problem.
        // @ts-ignore
        const errorStatus = error?.response.status ?? '';

        let errorMsg = '失敗';
        if (errorStatus === 409) {
          errorMsg = 'You have already purchased the product';
        } else if (errorStatus === 404) {
          errorMsg = 'No such premium code exists';
        } else if (errorStatus === 420) {
          errorMsg = 'The premium code is full of use.';
        }
        toast.error(errorMsg, {
          hideProgressBar: false,
          progress: undefined,
        });
        reset();
      },
    },
  );

  const onSubmit = handleSubmit((data) => {
    if (mutation.isLoading) {
      return;
    }

    return mutation.mutate(data.code);
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
        <div className="big-title-light text-fontPrimary">コード入力</div>
        <form onSubmit={onSubmit} className="mt-36px">
          <DefaultInputWrap>
            <input
              name={codeInputRef.name}
              ref={codeInputRef.ref}
              type="text"
              onChange={(e) => {
                codeInputRef.onChange(e);
                if (e.target.value !== '') {
                  setInputNameReset(true);
                } else {
                  setInputNameReset(false);
                }
              }}
              onBlur={codeInputRef.onBlur}
              placeholder="コード番号"
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
          <div className="mt-36px flex flex-row justify-end items-center">
            <span
              onClick={close}
              className="p-12px body1 text-fontSecondary cursor-pointer"
            >
              キャンセル
            </span>
            <button
              className="ml-24px px-24px h-44px rounded-8px bg-primary button text-backgroundSecondary"
              onClick={() => {}}
            >
              完了
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ModalCodeInput;
