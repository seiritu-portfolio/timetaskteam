import { useQuery } from 'react-query';

import axiosConfig from '@util/axiosConfig';
import {
  URL_CHECK_EMAIL_EXIST,
  URL_LOGIN,
  URL_GOOGLE_LOGIN,
  URL_TwoFA_CHALLENGE,
  DEFAULT_AVATAR_URL,
} from '@util/urls';
import { TwoFactorChallengeProp } from '@model/auth';

const checkEmailExist = async (email: string) => {
  const data = await axiosConfig.post(URL_CHECK_EMAIL_EXIST, {
    email,
  });

  return data;
};

const useCheckEmailQuery = (email: string) => {
  return useQuery(['email', email], () => checkEmailExist(email), {
    enabled: email !== '',
  });
};

const doLogIn = async (email: string, password: string, deviceName: string) => {
  const data = await axiosConfig.post(URL_LOGIN, {
    email,
    password,
    device_name: deviceName,
  });
  return data;
};

const googleLogIn = async (idToken: string, deviceName: string) => {
  const data = await axiosConfig.post(URL_GOOGLE_LOGIN, {
    id_token: idToken,
    device_name: deviceName,
    avatar: DEFAULT_AVATAR_URL,
  });

  return data;
};

const useLogInQuery = (email: string, password: string, deviceName: string) => {
  return useQuery(
    ['login', { email, password }],
    () => doLogIn(email, password, deviceName),
    {
      enabled: password !== '',
      retry: false,
    },
  );
};

const useGoogleLoginQuery = (idToken: string, deviceName: string) => {
  return useQuery(
    ['googleLogin', idToken],
    () => googleLogIn(idToken, deviceName),
    {
      enabled: idToken !== '' && deviceName !== '',
    },
  );
};

const doTwoFAChallenge = async (props: TwoFactorChallengeProp) => {
  const data = await axiosConfig.post(URL_TwoFA_CHALLENGE, props);
};

const useTwoFAChallengeQuery = (props: TwoFactorChallengeProp) => {
  return useQuery(
    ['twoFA', { email: props.email, code: props.code }],
    () => doTwoFAChallenge(props),
    {
      enabled: props.code !== '',
    },
  );
};

export {
  useCheckEmailQuery,
  useLogInQuery,
  useTwoFAChallengeQuery,
  useGoogleLoginQuery,
};
