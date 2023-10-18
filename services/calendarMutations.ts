import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';

import axiosConfig from '@util/axiosConfig';
import { configBearerToken } from '@util/constants';
import {
  URL_CALENDAR,
  URL_CALENDAR_REMOVE_EVENT,
  URL_CALENDAR_RESET,
} from '@util/urls';

export const useUpdateSyncInfo = (callbackFn?: () => void) => {
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    if (localStorage) {
      setToken(localStorage.getItem('task3_token'));
    }
  }, [token]);

  return useMutation(
    (data: any) => {
      return axiosConfig.put(URL_CALENDAR, data, {
        ...configBearerToken(token ?? ''),
      });
    },
    {
      onSuccess: async () => {
        toast.success('成功', {
          hideProgressBar: false,
          progress: undefined,
          onOpen: () => {
            if (callbackFn) callbackFn();
          },
        });
      },
      onError: async () => {
        toast.error('失敗', {
          hideProgressBar: false,
          progress: undefined,
        });
      },
    },
  );
};

export const useResetSync = (callbackFn?: () => void) => {
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    if (localStorage) {
      setToken(localStorage.getItem('task3_token'));
    }
  }, [token]);

  return useMutation(
    (data: any) => {
      return axiosConfig.post(URL_CALENDAR_RESET, data, {
        ...configBearerToken(token ?? ''),
      });
    },
    {
      onSuccess: async () => {
        toast.success('成功', {
          hideProgressBar: false,
          progress: undefined,
          onOpen: () => {
            if (callbackFn) callbackFn();
          },
        });
      },
      onError: async () => {
        toast.error('失敗', {
          hideProgressBar: false,
          progress: undefined,
        });
      },
    },
  );
};

export const useRemoveSyncInfo = (callbackFn?: () => void) => {
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    if (localStorage) {
      setToken(localStorage.getItem('task3_token'));
    }
  }, [token]);

  return useMutation(
    () => {
      return axiosConfig.delete(URL_CALENDAR, {
        ...configBearerToken(token ?? ''),
      });
    },
    {
      onSuccess: async () => {
        toast.success('成功', {
          hideProgressBar: false,
          progress: undefined,
          onOpen: () => {
            if (callbackFn) callbackFn();
          },
        });
      },
      onError: async () => {
        toast.error('失敗', {
          hideProgressBar: false,
          progress: undefined,
        });
      },
    },
  );
};

export const useRemoveEvent = () => {
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    if (localStorage) {
      setToken(localStorage.getItem('task3_token'));
    }
  }, [token]);

  return useMutation(
    (data: any) => {
      return axiosConfig.post(URL_CALENDAR_REMOVE_EVENT, data, {
        ...configBearerToken(token ?? ''),
      });
    },
    {
      onSuccess: async () => {},
      onError: async () => {},
    },
  );
};
