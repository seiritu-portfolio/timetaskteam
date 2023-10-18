import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import axiosConfig from '@util/axiosConfig';
import { configBearerToken } from '@util/constants';
import {
  URL_CREATE_COOPERATOR,
  URL_DELETE_COOPERATOR,
  URL_UPDATE_USER_SETTING,
} from '@util/urls';

// * my info update
export const useUserUpdate = (callbackFn: () => void) => {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    if (localStorage) {
      setToken(localStorage.getItem('task3_token'));
    }
  }, [token]);

  return useMutation(
    (data: any) =>
      axiosConfig.put(URL_UPDATE_USER_SETTING, data, {
        ...configBearerToken(token ?? ''),
      }),
    {
      onSuccess: async () => {
        callbackFn();
        toast.success('成功', {
          hideProgressBar: true,
          progress: undefined,
          onOpen: () => {
            callbackFn();
            queryClient.invalidateQueries('my_info');
          },
        });
      },
      onError: async (error) => {},
    },
  );
};

// * collabo user add
export const useUserAdd = (callbackFn: (now: Date) => void) => {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    if (localStorage) {
      setToken(localStorage.getItem('task3_token'));
    }
  }, [token]);

  return useMutation(
    (data: any) => {
      return axiosConfig.post(URL_CREATE_COOPERATOR, data, {
        ...configBearerToken(token ?? ''),
      });
    },
    {
      onSuccess: async () => {
        const currentTime = new Date();
        queryClient.invalidateQueries('cooperate');
        toast.success('成功', {
          hideProgressBar: false,
          progress: undefined,
          onOpen: () => {
            callbackFn(currentTime);
          },
        });
      },
      onError: async (error) => {
        // @ts-ignore
        const errorMessage = error.response.data.data
          ? // @ts-ignore
            error.response.data.data
          : // @ts-ignore
            Object.values(error.response.data.errors)[0][0];
        toast.error(errorMessage, {
          hideProgressBar: false,
          progress: undefined,
        });
      },
    },
  );
};

// * collabo user update
export const useCollaboUpdate = (callbackFn: (now: Date) => void) => {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    if (localStorage) {
      setToken(localStorage.getItem('task3_token'));
    }
  }, [token]);

  return useMutation(
    (data: any) =>
      axiosConfig.put(URL_CREATE_COOPERATOR, data, {
        ...configBearerToken(token ?? ''),
      }),
    {
      onSuccess: async () => {
        const currentTime = new Date();
        queryClient.invalidateQueries('cooperate');
        toast.success('成功', {
          hideProgressBar: false,
          progress: undefined,
          onOpen: () => {
            callbackFn(currentTime);
          },
        });
      },
      onError: async (error) => {
        // @ts-ignore
        const errorMessage = error.response.data.data
          ? // @ts-ignore
            error.response.data.data
          : // @ts-ignore
            Object.values(error.response.data.errors)[0][0];
        toast.error(errorMessage, {
          hideProgressBar: false,
          progress: undefined,
        });
      },
    },
  );
};

// * user delete
export const useUserDelete = (id: number, callbackFn: () => void) => {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    if (localStorage) {
      setToken(localStorage.getItem('task3_token'));
    }
  }, [token]);

  return useMutation(
    () =>
      axiosConfig.delete(URL_DELETE_COOPERATOR.replace(/\%s/g, id.toString()), {
        ...configBearerToken(token ?? ''),
      }),
    {
      onSuccess: async () => {
        queryClient.invalidateQueries('cooperate');
        callbackFn();
      },
    },
  );
};
