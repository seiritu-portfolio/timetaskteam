import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';

import {
  useLogInQuery,
  useTwoFAChallengeQuery,
} from '@service/emailSigninQueries';
import { authInfoSelector } from '@store/selectors/auth';
import { setCurrentCodisplayUser } from '@store/modules/home';

import Modal2FACode from '@component/auth/Modal2FACode';
import Modal2FAInfo from '@component/auth/Modal2FAInfo';
import { resetEmail, setAuthCode } from '@store/modules/auth';
import {
  setToken,
  setTzOffsetMins,
  setTzOffsetMinsBrowser,
  setUser,
} from '@store/modules/user';
import { RESET_PASSWORD_URL, TASKS_ALL_URL } from '@util/urls';

const SignInForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { email, username, userAgent, authCode } =
    useSelector(authInfoSelector);

  const [password, setPassword] = useState('');
  const signInResult = useLogInQuery(email, password, userAgent);
  const twoFAResult = useTwoFAChallengeQuery({
    provider: 'email',
    email,
    password,
    id_token: '',
    device_name: userAgent,
    code: authCode,
  });

  const [isOpen2FACode, setIsOpen2FACode] = useState(false);
  const [isOpen2FAInfo, setIsOpen2FAInfo] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: '',
    },
  });

  useEffect(() => {
    if (signInResult.status === 'success') {
      if (
        'two_factor' in signInResult.data.data &&
        signInResult.data.data.two_factor
      ) {
        setIsOpen2FACode(false);
      } else {
        const userInfo = signInResult.data.data;
        dispatch(setToken(userInfo.token));
        dispatch(setUser(userInfo.user));
        dispatch(setCurrentCodisplayUser(userInfo.user.id)); // ! calculate timezone offset minutes, and dispatch it
        const tzOffsetMins = dayjs()
          .tz(
            userInfo.user?.timezone ??
              Intl.DateTimeFormat().resolvedOptions().timeZone,
          )
          .utcOffset();
        const tzOffsetBrowser = dayjs()
          .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
          .utcOffset();
        dispatch(setTzOffsetMins(tzOffsetMins));
        dispatch(setTzOffsetMinsBrowser(tzOffsetBrowser));

        localStorage.setItem('task3_user', JSON.stringify(userInfo.user));
        localStorage.setItem('task3_token', userInfo.token);
        router.push(TASKS_ALL_URL);
      }
    } else if (signInResult.status === 'error') {
      reset({
        password: '',
      });
    }
  }, [signInResult.status, signInResult.data, reset, dispatch, router]);

  useEffect(() => {
    if (twoFAResult.status === 'success') {
    } else if (twoFAResult.status === 'error') {
      dispatch(setAuthCode(''));
    }
  }, [twoFAResult, dispatch]);

  const onSubmit = handleSubmit((data) => setPassword(data.password));

  return (
    <form onSubmit={onSubmit}>
      <h2 className="big-title text-fontPrimary">{`${username}さんお帰りなさい`}</h2>
      <p className="mt-12px body1 text-fontSecondary">
        パスワードを入力してサインインします。
      </p>
      <div className="mt-32px">
        <p className="title text-fontPrimary">パスワード</p>
        <input
          {...register('password', {
            required: true,
            minLength: 8,
            maxLength: 100,
          })}
          type="password"
          className="mt-12px input-primary focus:outline-none"
          placeholder="******"
        />
        {errors.password ? (
          <p className="mt-8px body1 text-secondary">
            {errors.password.type === 'required'
              ? 'Passwordを入力してください。'
              : 'Password length min 8 max 100'}
          </p>
        ) : null}
        {signInResult?.error ? (
          <p className="mt-8px body1 text-secondary">認証に失敗しました。</p>
        ) : null}
      </div>
      <div className="mt-24px">
        <button
          type="submit"
          disabled={signInResult.isLoading}
          className="button-primary button disabled:opacity-40"
        >
          サインイン
        </button>
        <div className="mt-32px w-full flex-1 h-1px bg-separator"></div>
        <div className="mt-27px body1">
          <span
            onClick={() => {
              dispatch(resetEmail());
              router.push(RESET_PASSWORD_URL);
            }}
          >
            <a className="text-primary cursor-pointer">
              パスワードをお忘れですか？
            </a>
          </span>
        </div>
      </div>
      <Modal2FACode
        isOpen={isOpen2FACode}
        close={() => setIsOpen2FACode(false)}
      />
      <Modal2FAInfo
        isOpen={isOpen2FAInfo}
        close={() => setIsOpen2FAInfo(false)}
      />
    </form>
  );
};

export default SignInForm;
