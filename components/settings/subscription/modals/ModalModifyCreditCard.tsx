import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import Modal from 'react-responsive-modal';
import { toast } from 'react-toastify';

import axiosConfig from '@util/axiosConfig';
import { ModalSuccessProps } from '@model/modal';
import { configBearerToken } from '@util/constants';
import { URL_UPDATE_STRIPE_CARD } from '@util/urls';

const ModalModifyCreditCard = ({
  isOpen,
  close,
  onSuccess,
}: ModalSuccessProps) => {
  const { handleSubmit } = useForm();
  const stripe = useStripe();
  const elements = useElements();
  const queryClient = useQueryClient();

  const mutation = useMutation(
    ({ paymentID, last4 }: { paymentID: string; last4: string }) => {
      const token = localStorage.getItem('task3_token');
      const config = configBearerToken(token ?? '');

      return axiosConfig.put(
        URL_UPDATE_STRIPE_CARD,
        {
          payment_method_id: paymentID,
          card_number_last4: last4,
        },
        { ...config },
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
          },
        });
        close();
        onSuccess();
      },
      onError: async () => {
        toast.error('Failed', {
          hideProgressBar: false,
          progress: undefined,
        });
      },
    },
  );

  const onSubmit = async () => {
    if (!stripe || !elements) {
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
        <div className="big-title-light text-fontPrimary">
          クレジットカード変更
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-36px py-12px pl-16px -pr-4 w-full rounded-8px bg-backgroundPrimary">
            <CardElement
              options={{
                hidePostalCode: true,
                hideIcon: true,
              }}
            />
          </div>
          <div className="mt-36px h-44px flex-row--end">
            <span
              onClick={() => {
                close();
              }}
              className="p-12px body1 text-fontSecondary cursor-pointer"
            >
              キャンセル
            </span>
            <button className="ml-12px px-24px h-44px rounded-8px bg-primary button text-backgroundSecondary">
              変更
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ModalModifyCreditCard;
