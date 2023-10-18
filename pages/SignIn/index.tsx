import React, { ReactElement, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { NextPageContext } from 'next';

import SignInLayout from '@component/layout/SignInLayout';
import AuthForm from '@component/auth/AuthForm';

import { setUserAgent } from '@store/modules/auth';
import { TASKS_ALL_URL } from '@util/urls';

interface Props {
  userAgent: string;
}

const SignIn = ({ userAgent }: Props) => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (userAgent !== '') dispatch(setUserAgent(userAgent));
  }, [userAgent, dispatch]);

  const router = useRouter();
  useEffect(() => {
    const savedToken = localStorage.getItem('task3_token');
    if (savedToken && savedToken != 'null' && savedToken != '') {
      router.push(TASKS_ALL_URL);
    }
  }, [router]);

  return <AuthForm />;
};

export default SignIn;

SignIn.getInitialProps = async ({ req }: NextPageContext) => {
  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
  return { userAgent };
};

SignIn.getLayout = function getLayout(page: ReactElement) {
  return <SignInLayout>{page}</SignInLayout>;
};
