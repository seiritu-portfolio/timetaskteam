import React, { useState } from 'react';

import EmailInputForm from '@component/auth/EmailInputForm';
import SignUpForm from '@component/auth/SignUpForm';
import SignInForm from '@component/auth/SignInForm';

const AUTH_STATE_EMAIL_INPUT = 0;
const AUTH_STATE_EMAIL_SIGNIN = 4;
const AUTH_STATE_EMAIL_SIGNUP = 5;
const AUTH_STATE_GOOGLE = 8;
const AUTH_STATE_PASSWORD_RESET = 17;

const authStateList = [
  AUTH_STATE_EMAIL_INPUT,
  AUTH_STATE_EMAIL_SIGNIN,
  AUTH_STATE_EMAIL_SIGNUP,
  AUTH_STATE_GOOGLE,
  AUTH_STATE_PASSWORD_RESET,
] as const;

type AUTH_STATE = typeof authStateList[number];

const AuthForm = () => {
  const [authState, setAuthState] = useState<AUTH_STATE>(
    AUTH_STATE_EMAIL_INPUT as AUTH_STATE,
  );

  return (
    <div className="w-528px">
      {authState === AUTH_STATE_EMAIL_INPUT ? (
        <EmailInputForm
          goSignUp={() => setAuthState(AUTH_STATE_EMAIL_SIGNUP)}
          goLogIn={() => setAuthState(AUTH_STATE_EMAIL_SIGNIN)}
        />
      ) : authState === AUTH_STATE_EMAIL_SIGNUP ? (
        <SignUpForm goBack={() => setAuthState(AUTH_STATE_EMAIL_SIGNIN)} />
      ) : authState === AUTH_STATE_EMAIL_SIGNIN ? (
        <SignInForm />
      ) : null}
    </div>
  );
};

export default AuthForm;
