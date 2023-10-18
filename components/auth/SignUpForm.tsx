import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';

import { useLogInQuery } from '@service/emailSigninQueries';
import { setUsername } from '@store/modules/auth';
import { authInfoSelector } from '@store/selectors/auth';
import {
  setToken,
  setTzOffsetMins,
  setTzOffsetMinsBrowser,
  setUser,
} from '@store/modules/user';
import { setCurrentCodisplayUser } from '@store/modules/home';

import axiosConfig from '@util/axiosConfig';
import { DEFAULT_AVATAR_URL, TASKS_ALL_URL, URL_SIGNUP } from '@util/urls';

interface SignUpParamType {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

interface SignUpProps {
  goBack: () => void;
}

const fnSignUpMutation = (data: SignUpParamType) =>
  axiosConfig.post(URL_SIGNUP, data);

const SignUpForm = ({ goBack }: SignUpProps) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { email, userAgent } = useSelector(authInfoSelector);
  const [password, setPassword] = useState('');

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

  const mutation = useMutation(fnSignUpMutation, {
    onSuccess: async (data) => {
      reset();
      queryClient.invalidateQueries();
      dispatch(setUsername(email));
    },
    onError: async (error, variables, context) => {
      // @ts-ignore
      const errorMessage = error.response.data.data
        ? // @ts-ignore
          error.response.data.data
        : // @ts-ignore
          error.response.data.errors.email[0];
      toast.error(errorMessage, {
        hideProgressBar: false,
        progress: undefined,
      });
    },
  });
  const signInResult = useLogInQuery(email, password, userAgent);
  const router = useRouter();
  useEffect(() => {
    if (signInResult.status === 'success') {
      const userInfo = signInResult.data.data;
      dispatch(setToken(userInfo.tokens));
      dispatch(setUser(userInfo.user));
      dispatch(setCurrentCodisplayUser(userInfo.user.id));
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
      toast.success('成功', {
        hideProgressBar: false,
        progress: undefined,
        onClose: () => {
          router.push(TASKS_ALL_URL);
        },
      });
    } else {
    }
  }, [signInResult.status, signInResult.data, reset, dispatch, router]);

  const onSubmit = handleSubmit((data) => {
    if (mutation.isLoading) {
      return false;
    }

    const password = data.password;
    const newData = {
      name: email.substring(0, email.lastIndexOf('@')),
      email,
      avatar: DEFAULT_AVATAR_URL,
      password,
      password_confirmation: password,
    };
    setPassword(password);

    return mutation.mutate(newData);
  });

  return (
    <form onSubmit={onSubmit}>
      <h2 className="big-title text-fontPrimary">アカウント作成</h2>
      <p className="mt-12px body1 text-fontSecondary">
        パスワードを登録してアカウントを作成します。
      </p>
      <div className="mt-32px">
        <p className="title text-fontPrimary">パスワード</p>
        <input
          {...register('password', {
            required: true,
            maxLength: 100,
            pattern: {
              value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/i,
              message: '最低8文字以上の大文字を含んだ英数字にしてください',
            },
          })}
          type="password"
          className="mt-12px input-primary focus:outline-none"
          placeholder="******"
          autoFocus={true}
        />
        {errors.password ? (
          <p className="mt-8px body1 text-secondary">
            {errors.password.type === 'required'
              ? 'パスワードを入力してください。'
              : '最低8文字以上の大文字を含んだ英数字にしてください'}
          </p>
        ) : null}
      </div>
      <div className="mt-24px">
        <button
          type="submit"
          disabled={mutation.isLoading}
          className="button-primary button"
        >
          アカウント作成
        </button>
        <div className="mt-32px w-full flex-1 h-1px bg-separator"></div>
        <div className="mt-32px body1 text-fontPrimary">
          登録すると、
          <Link href="/">
            <a className="text-primary">利用規約</a>
          </Link>
          と
          <Link href="/">
            <a className="text-primary">プライバシーポリシー</a>
          </Link>
          に同意したことになります。
        </div>
      </div>
    </form>
  );
};

export default SignUpForm;
