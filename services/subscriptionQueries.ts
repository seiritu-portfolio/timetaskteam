import { useQuery } from 'react-query';
import axiosConfig from '@util/axiosConfig';

import { configBearerToken } from '@util/constants';
import {
  URL_HISTORY,
  URL_PREMIUM_OWNER,
  URL_SUBSCRIPTION_INVITED_LIST,
} from '@util/urls';

const getPremiumOwnerInfo = async () => {
  const token = localStorage.getItem('task3_token');
  const config = configBearerToken(token ?? '');

  const { data } = await axiosConfig.get(URL_PREMIUM_OWNER, config);
  return data;
};

const getInvitedUsersList = async () => {
  const token = localStorage.getItem('task3_token');
  const config = configBearerToken(token ?? '');

  const { data } = await axiosConfig.get(URL_SUBSCRIPTION_INVITED_LIST, config);
  return data;
};

const getPaymentHistory = async () => {
  const token = localStorage.getItem('task3_token');
  const config = configBearerToken(token ?? '');

  const { data } = await axiosConfig.get(URL_HISTORY, config);
  return data;
};

const usePremiumOwner = () =>
  useQuery('premium_owner', () => getPremiumOwnerInfo());

const useInvitedList = () =>
  useQuery('invited_list', () => getInvitedUsersList());

const usePaymentHistory = () =>
  useQuery('payment_history', () => getPaymentHistory());

export { usePremiumOwner, useInvitedList, usePaymentHistory };
