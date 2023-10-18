import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';

import axiosConfig from '@util/axiosConfig';
import { configBearerToken } from '@util/constants';
import { URL_CALENDAR } from '@util/urls';

export const useCalendarAuthMutation = (callbackFn?: (data: any) => void) => {
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    if (localStorage) {
      setToken(localStorage.getItem('task3_token'));
    }
  }, [token]);

  return useMutation(
    (data: any) => {
      return axiosConfig.post(URL_CALENDAR, data, {
        ...configBearerToken(token ?? ''),
      });
    },
    {
      onSuccess: async (_) => {
        if (callbackFn) {
          callbackFn(_);
        }
      },
      onError: async (_) => {},
    },
  );
};
