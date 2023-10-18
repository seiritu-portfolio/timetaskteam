import { useQuery } from 'react-query';
import { useEffect, useState } from 'react';

import axiosConfig from '@util/axiosConfig';
import { configBearerToken } from '@util/constants';
import {
  URL_GET_USER_BY_ID,
  URL_GET_COOPERATORS,
  URL_MY_INFO,
  URL_REQUESTERS,
} from '@util/urls';
import { CooperateType } from '@model/constants';

const getUserByIdOrUUID = async (
  id: string,
  email: string | null,
  uuid: string | null,
) => {
  const token = localStorage.getItem('task3_token');
  const config = configBearerToken(token ?? '');

  const data = await axiosConfig.get(URL_GET_USER_BY_ID, {
    params: {
      id: id === '' ? null : id,
      email: email ?? undefined,
      uuid: uuid ?? undefined,
    },
    ...config,
  });

  return data;
};

const getCooperatorListByType = async (type: CooperateType) => {
  const token = localStorage.getItem('task3_token');
  const config = configBearerToken(token ?? '');

  const { data } = await axiosConfig.get(URL_GET_COOPERATORS, {
    params: {
      type,
    },
    ...config,
  });

  return data;
};

const getRequestersList = async (type: string) => {
  const token = localStorage.getItem('task3_token');
  const config = configBearerToken(token ?? '');

  const { data } = await axiosConfig.get(URL_REQUESTERS, {
    params: {
      type,
    },
    ...config,
  });

  return data;
};

const getMyInfo = async () => {
  const token = localStorage.getItem('task3_token');
  const config = configBearerToken(token ?? '');

  const { data } = await axiosConfig.get(URL_MY_INFO, { ...config });

  return data;
};

const useUserByUUID = (uuidOrEmail: string) => {
  const isEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(uuidOrEmail);
  return useQuery(
    ['users', uuidOrEmail],
    () =>
      getUserByIdOrUUID(
        '',
        isEmail ? uuidOrEmail : null,
        isEmail ? null : uuidOrEmail,
      ),
    {
      enabled: uuidOrEmail !== '',
      retry: false,
    },
  );
};

const useCooperatorList = (type: CooperateType) => {
  return useQuery(['cooperate', type], () => getCooperatorListByType(type));
};

const usePendingRequestersList = () => {
  return useQuery(['requesters', 'pending'], () =>
    getRequestersList('pending'),
  );
};

const useMyInfo = () => {
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    if (localStorage) {
      setToken(localStorage.getItem('task3_token'));
    }
  }, [token]);

  return useQuery('my_info', () => getMyInfo(), {
    enabled: token != undefined && token != '' && token != 'null',
  });
};

export {
  useUserByUUID,
  useCooperatorList,
  usePendingRequestersList,
  useMyInfo,
};
