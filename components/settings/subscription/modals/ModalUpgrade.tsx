import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import Modal from 'react-responsive-modal';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import { configBearerToken } from '@util/constants';
import axiosConfig from '@util/axiosConfig';
import { POLICIES_URL, URL_PAYMENT_BY_STRIPE } from '@util/urls';

import { ModalSuccessProps } from '@model/modal';
import UserCountSelect from '../UserCountSelect';

const ModalUpgrade = ({ isOpen, close, onSuccess }: ModalSuccessProps) => {
  const [userCount, setUserCount] = useState(1);
  const { handleSubmit } = useForm();

  const queryClient = useQueryClient();
  const stripe = useStripe();
  const elements = useElements();

  const mutation = useMutation(
    ({ paymentID, last4 }: { paymentID: string; last4: string }) => {
      const token = localStorage.getItem('task3_token');
      const config = configBearerToken(token ?? '');

      return axiosConfig.post(
        URL_PAYMENT_BY_STRIPE,
        {
          payment_method_id: paymentID,
          card_number_last4: last4,
          quantity: userCount,
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
            queryClient.invalidateQueries('my_info');
            queryClient.invalidateQueries('premium_owner');
            close();
            onSuccess();
          },
        });
      },
      onError: async (error) => {
        // const errorStatus = error?.response.status ?? '';
        toast.error('失敗', {
          hideProgressBar: false,
          progress: undefined,
        });
      },
    },
  );

  const onSubmit = async () => {
    if (!stripe || !elements || mutation.isLoading) {
      return;
    }

    const card = elements.getElement(CardElement);

    if (card) {
      const payload = await stripe.createPaymentMethod({
        type: 'card',
        card,
      });
      const brand = payload?.paymentMethod?.card?.brand ?? '';

      const last4 =
        brand == 'unknown'
          ? ''
          : brand + ' ' + payload?.paymentMethod?.card?.last4 ?? '';
      const paymentID = payload?.paymentMethod?.id;

      if (paymentID && last4) {
        return mutation.mutate({
          paymentID,
          last4,
        });
      } else {
        return false;
      }
    }
  };

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
    >
      <div className="p-36px w-full">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="big-title-light text-fontPrimary">
            プレミアムプランへアップグレード
          </div>
          <UserCountSelect userCount={userCount} setUserCount={setUserCount} />
          <div className="mt-24px body2 text-fontSecondary">
            {userCount < 2 ? (
              '複数契約されますと、購入ユーザーを除く人数分のプレミアムコードが発行されます。コードをチームメンバーに付与することで、プレミアムプランへのアップグレードが可能になります。'
            ) : (
              <>
                <div className="text-primary">
                  購入ユーザーを除く{userCount - 1}
                  ユーザー分のプレミアムコードが発行されます。
                </div>
                コードをチームメンバーに付与することで、プレミアムプランへのアップグレードが可能になります。
              </>
            )}
          </div>
          <div className="mt-24px py-12px pl-16px -pr-4 w-full rounded-8px bg-backgroundPrimary">
            <CardElement
              options={{
                hidePostalCode: true,
                hideIcon: true,
              }}
            />
          </div>
          <div className="mt-24px w-full body2 text-fontSecondary">
            プレミアムプランにアップグレードすると、
            <span
              className="text-primary cursor-pointer"
              onClick={() => {
                router.push(POLICIES_URL);
              }}
            >
              利用規約
            </span>
            と<span className="">プライバシーポリシー</span>
            に同意したことになります。
          </div>
          <div className="mt-36px w-full flex-row--end">
            <span
              onClick={() => {
                close();
              }}
              className="p-12px body1 text-fontSecondary cursor-pointer"
            >
              キャンセル
            </span>
            <button
              disabled={mutation.isLoading}
              className="ml-12px px-24px h-44px rounded-8px bg-primary button text-backgroundSecondary disabled:opacity-20"
            >
              プレミアムプランを始める
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ModalUpgrade;
