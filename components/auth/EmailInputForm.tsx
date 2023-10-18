import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { useCheckEmailQuery } from '@service/emailSigninQueries';
import { authEmailSelector } from '@store/selectors/auth';
import { setEmail, setUsername } from '@store/modules/auth';
import GoogleAuth from '@component/auth/GoogleAuth';

interface EmailInputFormType {
  goSignUp: () => void;
  goLogIn: () => void;
}

const EmailInputForm = ({ goSignUp, goLogIn }: EmailInputFormType) => {
  const dispatch = useDispatch();
  const email = useSelector(authEmailSelector);
  const { status, data } = useCheckEmailQuery(email);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = handleSubmit((data) => {
    dispatch(setEmail(data.email));
  });

  useEffect(() => {
    if (status === 'success') {
      const username = data?.data ?? '';
      dispatch(setUsername(username));

      if (username !== '') {
        goLogIn();
      } else {
        goSignUp();
      }
    }
  }, [status, data, goSignUp, goLogIn, email, dispatch]);

  return (
    <>
      <form onSubmit={onSubmit}>
        <h2 className="big-title text-fontPrimary">タスククリアへようこそ</h2>
        <p className="mt-12px body1 text-fontSecondary">
          メールアドレスを入力して次に進みます。
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
            type="text"
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
          <button
            type="submit"
            className="button-primary button"
            disabled={status === 'loading'}
          >
            次へ進む
          </button>
          <div className="mt-24px flex flex-row items-center">
            <div className="flex-1 h-1px bg-separator"></div>
            <p className="px-8px flex-0 body1-en text-fontSecondary">or</p>
            <div className="flex-1 h-1px bg-separator"></div>
          </div>
        </div>
      </form>
      <GoogleAuth />
    </>
  );
};

export default EmailInputForm;
