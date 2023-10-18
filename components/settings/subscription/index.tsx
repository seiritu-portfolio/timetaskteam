import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import {
  currentOpenModalSelector,
  premiumCodeSelector,
  purchasedInfoSelector,
  subscriptionSettingStateSelector,
} from '@store/selectors/subscription';
import {
  setCurrentOpenModal,
  setPaymentLast4,
  setPaymentMethod,
  setPremiumCode,
  setPurchasedUserCount,
} from '@store/modules/subscription';
import { usePremiumOwner } from '@service/subscriptionQueries';
import { userInfoSelector } from '@store/selectors/user';

import InitialSetting from './InitialSetting';
import InvitedManageSetting from './InvitedManageSetting';
import PremiumPurchased from './PremiumPurchased';
import PremiumInvited from './PremiumInvited';
import PurchaseHistory from './PurchaseHistory';
import ModalCodeInput from './modals/ModalCodeInput';
import ModalUpgrade from './modals/ModalUpgrade';
import ModalPremiumCode from './modals/ModalPremiumCode';
import ModalModifyCreditCard from './modals/ModalModifyCreditCard';
import ModalUpdateCount from './modals/ModalUpdateCount';

const stripePromise = loadStripe(
  process.env.stripe ?? 'pk_test_CJ6J1lmdTISQnnl2Afelcyox00HA5iCILG',
  {
    locale: 'ja',
  },
);

const Subscription = () => {
  const currentSettingState = useSelector(subscriptionSettingStateSelector);
  const premiumCode = useSelector(premiumCodeSelector);
  const purchasedInfo = useSelector(purchasedInfoSelector);
  const currentModal = useSelector(currentOpenModalSelector);

  const userInfo = useSelector(userInfoSelector);
  const dispatch = useDispatch();
  const premiumOwner = usePremiumOwner();
  useEffect(() => {
    if (userInfo) {
      const premiumMethod = userInfo.user?.premium_method ?? 0;
      dispatch(
        setPaymentMethod(
          premiumMethod === 1
            ? 'stripe'
            : premiumMethod === 2
            ? 'google'
            : premiumMethod === 3
            ? 'apple'
            : '',
        ),
      );
      dispatch(setPremiumCode(userInfo.user?.premium_code ?? ''));
      dispatch(setPaymentLast4(userInfo.user?.card_number_last4 ?? ''));
      dispatch(setPurchasedUserCount(userInfo.user?.premium_count ?? 0));

      if (premiumMethod === 0) {
        dispatch(setCurrentOpenModal(-1));
      }
    }
  }, [userInfo, dispatch]);
  useEffect(() => {
    if (premiumOwner.status === 'success' && premiumOwner.data.length > 0) {
      dispatch(setPremiumCode(premiumOwner.data[0].premium_code ?? ''));
    }
  }, [premiumOwner.status, premiumOwner.data, dispatch]);

  return (
    <Elements stripe={stripePromise}>
      {premiumCode === '' ? (
        <InitialSetting />
      ) : !purchasedInfo ? (
        <PremiumInvited />
      ) : currentSettingState === 0 ? (
        <PremiumPurchased />
      ) : currentSettingState === 1 ? (
        <InvitedManageSetting />
      ) : (
        <PurchaseHistory />
      )}
      <ModalUpgrade
        isOpen={currentModal === 0}
        close={() => {
          dispatch(setCurrentOpenModal(-1));
        }}
        onSuccess={() => {
          dispatch(setCurrentOpenModal(2));
        }}
      />
      <ModalCodeInput
        isOpen={currentModal === 1}
        close={() => {
          dispatch(setCurrentOpenModal(-1));
        }}
      />
      <ModalPremiumCode
        isOpen={currentModal === 2}
        close={() => {
          dispatch(setCurrentOpenModal(-1));
        }}
      />
      <ModalModifyCreditCard
        isOpen={currentModal === 3}
        close={() => {
          dispatch(setCurrentOpenModal(-1));
        }}
        onSuccess={() => {}}
      />
      <ModalUpdateCount
        isOpen={currentModal === 4}
        close={() => {
          dispatch(setCurrentOpenModal(-1));
        }}
      />
    </Elements>
  );
};

export default Subscription;
