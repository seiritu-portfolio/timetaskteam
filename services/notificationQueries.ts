import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';

import axiosConfig from '@util/axiosConfig';
import { configBearerToken } from '@util/constants';
import { URL_NOTIFICATIONS, URL_NOTIFICATION_READ } from '@util/urls';

export const useNotifyCreate = (callbackFn?: () => void) => {
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    if (localStorage) {
      setToken(localStorage.getItem('task3_token'));
    }
  }, [token]);

  return useMutation(
    (data: any) => {
      return axiosConfig.post(URL_NOTIFICATIONS, data, {
        ...configBearerToken(token ?? ''),
      });
    },
    {
      onSuccess: async (data) => {
        if (callbackFn) {
          callbackFn();
        }
      },
      onError: async () => {},
    },
  );
};

const getNofityLists = async ({ status }: { status: number }) => {
  const token = localStorage.getItem('task3_token');
  const config = configBearerToken(token ?? '');
  const params: any = {
    status,
  };
  const { data } = await axiosConfig.get(URL_NOTIFICATIONS, {
    params,
    ...config,
  });
  return data;
};

export const useNotifyLists = (status: number) => {
  return useQuery(
    ['notifications', { status }],
    () => getNofityLists({ status }),
    {
      refetchInterval: 5000,
    },
  );
};

const getAllNofityLists = async () => {
  const token = localStorage.getItem('task3_token');
  const config = configBearerToken(token ?? '');
  const { data } = await axiosConfig.get(URL_NOTIFICATIONS, {
    ...config,
  });
  return data;
};

export const useAllNotifyLists = () => {
  return useQuery('notifications', getAllNofityLists, {
    refetchInterval: 5000,
  });
};

export const useNotifyStatuses = (callbackFn?: () => void) => {
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    if (localStorage) {
      setToken(localStorage.getItem('task3_token'));
    }
  }, [token]);

  return useMutation(
    (ids: number[]) => {
      return axiosConfig.put(
        URL_NOTIFICATION_READ,
        {
          notification_ids: ids,
        },
        {
          ...configBearerToken(token ?? ''),
        },
      );
    },
    {
      onSuccess: async (_) => {
        if (callbackFn) callbackFn();
      },
      onError: async () => {},
    },
  );
};
