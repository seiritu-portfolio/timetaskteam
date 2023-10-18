import { useMutation } from 'react-query';

import { axiosConfigForGAuth } from '@util/axiosConfig';

export const useGAuthTokens = (callbackFn?: () => void) => {
  return useMutation(
    (code: string) =>
      axiosConfigForGAuth.post('https://www.googleapis.com/oauth2/v4/token', {
        code,
        client_id:
          '498542936471-viaf2tpel9hdmifsr3ruocg7395b6ker.apps.googleusercontent.com',
        client_secret: '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',
        redirect_uri: 'http://localhost:3000',
        grant_type: 'authorization_code',
      }),
    {
      onSuccess: async (data) => {},
      onError: async (data) => {
        console.log('error', data);
      },
    },
  );
};
