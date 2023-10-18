import { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import Link from 'next/link';

import SignInLayout from '@component/layout/SignInLayout';
import axiosConfig from '@util/axiosConfig';
import { SIGNIN_URL, URL_FORGOT_PWD } from '@util/urls';

const ResetPassword = () => {
  // const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const mutation = useMutation(
    (data: { email: string }) => axiosConfig.post(URL_FORGOT_PWD, data),
    {
      onSuccess: async () => {
        toast.success('リセットリンクのメールをチェックしてください。'); // パスワードリセットのリンクをあなたに電子メールで送信されます。
      },
      onError: async (error) => {
        // @ts-ignore
        const errorMessage = error.response.data.data
          ? // @ts-ignore
            error.response.data.data
          : // @ts-ignore
            error.response.data.errors.email[0];
        toast.error(errorMessage, {
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

    return mutation.mutate({
      email: data.email,
    });
  });

  return (
    <form onSubmit={onSubmit}>
      <h2 className="big-title text-fontPrimary">パスワードリセット</h2>
      <p className="mt-12px body1 text-fontSecondary">
        logo spaceへのサインインに使用するメールアドレスを入力してください。
      </p>
      <div className="mt-32px">
        <p className="title text-fontPrimary">メールアドレス</p>
        <input
          {...register('email', {
            required: true,
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'format error',
            },
          })}
          className="mt-12px input-primary focus:outline-none"
          placeholder="emily@gmail.com"
        />
        {errors.email ? (
          <p className="mt-8px body1 text-secondary">
            {errors.email.type === 'required'
              ? 'メールを入力してください。'
              : 'Email invalid'}
          </p>
        ) : null}
      </div>
      <div className="mt-24px">
        <button type="submit" className="button-primary button">
          パスワードリセットメール
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

export default ResetPassword;

ResetPassword.getLayout = function getLayout(page: ReactElement) {
  return <SignInLayout>{page}</SignInLayout>;
};
