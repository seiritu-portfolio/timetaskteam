import { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import Link from 'next/link';

import SignInLayout from '@component/layout/SignInLayout';
import axiosConfig from '@util/axiosConfig';
import { SIGNIN_URL, URL_RESET_PWD } from '@util/urls';

interface PwdResetParams {
  token: string | string[] | undefined;
  email: string | string[] | undefined;
  password: string;
  password_confirmation: string;
}

const ResetPasswordWithToken = () => {
  const router = useRouter();
  const { token, email } = router.query;

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm();

  const mutation = useMutation(
    (data: PwdResetParams) => axiosConfig.post(URL_RESET_PWD, data),
    {
      onSuccess: async () => {
        toast.success('パスワードのリセットに成功しました', {
          hideProgressBar: false,
          progress: undefined,
          onClose: () => {
            router.push(SIGNIN_URL);
          },
        });
      },
      onError: async (error) => {
        // @ts-ignore
        const errorMessage = error.response.data.data
          ? // @ts-ignore
            error.response.data.data
          : // @ts-ignore
            error.response.data.errors.token[0];

        toast.error(errorMessage, {
          hideProgressBar: false,
          progress: undefined,
          onOpen: () => {
            reset();
          },
        });
      },
    },
  );

  const onSubmit = handleSubmit((data) => {
    if (mutation.isLoading) {
      return false;
    }

    const newData = {
      token,
      email,
      password: data.password,
      password_confirmation: data.passwordConfirm,
    };

    return mutation.mutate(newData);
  });

  return (
    <form onSubmit={onSubmit}>
      <div className="mt-12px">
        <p className="title text-fontPrimary">パスワード</p>
        <input
          {...register('password', {
            required: true,
            minLength: 8,
            maxLength: 100,
          })}
          className="mt-12px input-primary focus:outline-none"
          type="password"
        />
        {errors.password ? (
          <p className="mt-8px body1 text-secondary">
            {errors.password.type === 'required'
              ? '新しいパスワードを入力してください。'
              : 'パスワードの長さは8文字以上、100文字以下でなければなりません。'}
          </p>
        ) : null}
      </div>
      <div className="mt-12px">
        <p className="title text-fontPrimary">パスワードの確認</p>
        <input
          {...register('passwordConfirm', {
            required: true,
            minLength: 8,
            maxLength: 100,
            validate: {
              equal: (value) => {
                const valueOrigin = getValues('password');
                return (
                  value === valueOrigin ||
                  '新しいパスワードと、確認用のパスワードが異なります。もう一度パスワードを入力してください。'
                );
              },
            },
          })}
          className="mt-12px input-primary focus:outline-none"
          type="password"
        />
        {errors.passwordConfirm ? (
          <p className="mt-8px body1 text-secondary">
            {errors.passwordConfirm.type === 'required'
              ? '確認されたパスワードを入力してください。'
              : errors.passwordConfirm.type === 'equal'
              ? errors.passwordConfirm.message
              : 'パスワードの長さは8文字以上、100文字以下でなければなりません。'}
          </p>
        ) : null}
      </div>
      <div className="mt-24px">
        <button type="submit" className="button-primary button">
          パスワードをリセット
        </button>
        <div className="mt-32px w-full flex-1 h-1px bg-separator"></div>
        <div className="mt-27px body1">
          <Link href={SIGNIN_URL}>
            <a className="text-primary">サインイン</a>
          </Link>
        </div>
      </div>
    </form>
  );
};

export default ResetPasswordWithToken;

ResetPasswordWithToken.getLayout = function getLayout(page: ReactElement) {
  return <SignInLayout>{page}</SignInLayout>;
};
