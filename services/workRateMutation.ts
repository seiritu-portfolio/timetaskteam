import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';

import axiosConfig from '@util/axiosConfig';
import { configBearerToken } from '@util/constants';
import { URL_RATE } from '@util/urls';

export const useWorkRateMutation = (callbackFn: () => void) => {
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    if (localStorage) {
      setToken(localStorage.getItem('task3_token'));
    }
  }, [token]);

  return useMutation(
    (data: any) => {
      return axiosConfig.post(URL_RATE, data, {
        ...configBearerToken(token ?? ''),
      });
    },
    {
      onSuccess: async () => {
        callbackFn();
      },
      onError: async () => {
        toast.error('失敗', {
          hideProgressBar: false,
          progress: undefined,
          onOpen: () => {},
        });
      },
    },
  );
};
