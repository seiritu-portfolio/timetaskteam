import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

import { useUserUpdate } from '@service/userMutation';
import { updateQueueSetting } from '@store/modules/home';
import { queueSettingSelector } from '@store/selectors/home';
import { DefaultSelect1 } from '@component/general/select';
import ModalPwdReset from './ModalPwdReset';
import ModalPwdResetEmail from './ModalPwdResetEmail';
import ModalAccDelete from './ModalAccDelete';
import SettingsHeader from '@component/settings/SettingsHeader';
import { LOGIN_METHODS_OPTIONS } from '@util/selectOptions';
import AccountFooter from './AccountFooter';
import { EmailInput, NameInput } from './inputs';
import { DEFAULT_AVATAR_URL } from '@util/urls';
import ConnectGoogleBtn from './ConnectGoogle';
import AvatarUpload from './AvatarUpload';
import { UserType } from '@model/state';

const AccountSetting = ({ userInfo }: { userInfo: UserType | null }) => {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [isModalDel, setIsModalDel] = useState(false);
  const [isModalPwdReset, setIsModalPwdReset] = useState(false);
  const [isModalPwdResetEmail, setIsModalPwdResetEmail] = useState(false);

  const queueSetting = useSelector(queueSettingSelector);
  useEffect(() => {
    if (queueSetting?.avatar !== userInfo?.avatar) {
      setShowSave(true);
    } else {
      setShowSave(false);
    }
  }, [queueSetting?.avatar, userInfo?.avatar]);

  const dispatch = useDispatch();

  const setGoogleAccount = useCallback(
    (newGoogleAccount: string) => {
      dispatch(
        updateQueueSetting({
          googleAccount: newGoogleAccount,
        }),
      );
    },
    [dispatch],
  );
  const setAvatar = useCallback(
    (newAvatar: string) => {
      dispatch(
        updateQueueSetting({
          avatar: newAvatar,
        }),
      );
    },
    [dispatch],
  );
  const onIdToken = useCallback(
    (newToken: string) => {
      dispatch(
        updateQueueSetting({
          id_token: newToken,
        }),
      );
    },
    [dispatch],
  );
  const setLoginMethod = useCallback(
    (newValue: number | undefined) => {
      dispatch(
        updateQueueSetting({
          loginMethod: newValue,
        }),
      );
    },
    [dispatch],
  );
  const nameChange = useCallback(
    (newValue: string) => {
      dispatch(
        updateQueueSetting({
          name: newValue,
        }),
      );
    },
    [dispatch],
  );
  const emailChange = useCallback(
    (newValue: string) => {
      dispatch(
        updateQueueSetting({
          email: newValue,
        }),
      );
    },
    [dispatch],
  );

  const [showSave, setShowSave] = useState(false);
  const mutation = useUserUpdate(() => {
    setShowSave(false);
  });

  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (mutation.isLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [mutation.isLoading, setIsLoading]);

  const onSubmit = handleSubmit((data) => {
    if (isLoading) {
      return false;
    } else {
      const newData: any = {
        avatar: queueSetting?.avatar,
        email: queueSetting?.email,
        name: queueSetting?.name,
        login_method: queueSetting?.loginMethod,
      };
      if (queueSetting?.id_token || queueSetting.id_token !== '') {
        newData.id_token = queueSetting.id_token;
      }
      mutation.mutate(newData);
    }
  });

  return (
    <div className="h-full flex flex-col">
      <SettingsHeader title="アカウント設定" />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <form onSubmit={onSubmit}>
          <div className="p-24px w-full border-b border-separator">
            <span className="body2 text-fontSecondary">プロフィール</span>
            <div className="mt-24px w-full flex flex-row items-center">
              <AvatarUpload
                avatar={queueSetting?.avatar ?? DEFAULT_AVATAR_URL}
                setAvatar={setAvatar}
                isLoading={isLoading}
                setLoading={setIsLoading}
                className={
                  isLoading
                    ? 'h-40px w-40px rounded-full object-cover cursor-pointer opacity-60'
                    : 'h-40px w-40px rounded-full object-cover cursor-pointer'
                }
              />
              <div className="ml-24px w-full">
                <span className="body1 text-fontPrimary">ユーザーネーム</span>
                <NameInput
                  defaultValue={queueSetting?.name ?? ''}
                  register={register}
                  reset={(registerName: string) => {
                    setValue(registerName, '');
                  }}
                  change={nameChange}
                  setChange={setShowSave}
                />
                {errors.name && (
                  <p className="mt-8px body1 text-secondary">
                    名前を入力してください
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex-1 p-24px w-full border-b border-separator">
            <div className="body2 text-fontSecondary">ログイン情報</div>
            <div className="mt-24px body1 text-fontPrimary">ログイン方法</div>
            <div className="mt-12px w-full">
              <DefaultSelect1
                value={
                  LOGIN_METHODS_OPTIONS[(queueSetting?.loginMethod ?? 1) - 1]
                }
                options={LOGIN_METHODS_OPTIONS}
                onChange={(e: any) => {
                  const newValue = e?.value ? parseInt(e?.value) : undefined;
                  setLoginMethod(newValue);
                  setValue('login_method', newValue);
                  if (newValue != userInfo?.login_method) {
                    setShowSave(true);
                  } else {
                    setShowSave(false);
                  }
                }}
              />
            </div>
            {queueSetting?.loginMethod === 2 ? (
              <div className="mt-24px body1 text-fontPrimary">
                接続アカウント
              </div>
            ) : (
              <div className="mt-24px body1 text-fontPrimary">
                メールアドレス
              </div>
            )}
            {queueSetting?.loginMethod === 2 ? (
              <ConnectGoogleBtn
                register={register}
                setGoogleToken={onIdToken}
                googleAccount={queueSetting?.googleAccount ?? ''}
                setGoogleAccount={setGoogleAccount}
              />
            ) : (
              <EmailInput
                defaultValue={queueSetting?.email ?? ''}
                register={register}
                reset={(registerName: string) => {
                  setValue(registerName, '');
                }}
                setChange={(state: boolean) => {
                  setShowSave(state);
                }}
                change={emailChange}
              />
            )}
            {errors.email && errors.email.message && (
              <p className="mt-8px body1 text-secondary">
                {errors.email.message}
              </p>
            )}
            {errors.email && errors.email.type === 'required' && (
              <p className="mt-8px body1 text-secondary">
                メールアドレスを入力してください
              </p>
            )}
            <div className="mt-12px body1 text-primary flex justify-end">
              <span
                className={`cursor-pointer ${
                  queueSetting?.loginMethod === 2 ? 'text-primaryDisabled' : ''
                }`}
                onClick={() => {
                  if (queueSetting?.loginMethod === 2) {
                  } else {
                    setIsModalPwdReset(true);
                  }
                }}
              >
                パスワード再設定
              </span>
            </div>
          </div>
          <AccountFooter
            deleteAccount={() => {
              setIsModalDel(true);
            }}
            showSave={showSave}
            disabledSaveBtn={
              queueSetting?.loginMethod === 2 &&
              queueSetting?.googleAccount === ''
            }
            cancel={() => {
              setShowSave(false);
            }}
          />
        </form>
      </div>
      <div className="hidden">
        <span className="text-primary border-primary bg-primary" />
        <span className="text-secondary border-secondary bg-secondary" />
        <span className="text-green border-green bg-green" />
        <span className="text-teal border-teal bg-teal" />
        <span className="text-indigo border-indigo bg-indigtext-teal o" />
        <span className="text-purple border-purple bg-purple" />
        <span className="text-primary border-primary bg-primary" />
        <span className="text-pink border-pink bg-pink" />
        <span className="text-orange border-orange bg-orange" />
        <span className="text-yellow border-yellow bg-yellow" />
        <span className="text-brown border-brown bg-brown" />
        <span className="text-carminePink border-carminePink bg-carminePink" />
        <span className="text-watermelonPink border-watermelonPink bg-watermelonPink" />
        <span className="text-tyrianPurple border-tyrianPurple bg-tyrianPurple" />
        <span className="text-iris border-iris bg-iris" />
        <span className="text-deepSkyBlue border-deepSkyBlue bg-deepSkyBlue" />
        <span className="text-crystalBlue border-crystalBlue bg-crystalBlue" />
        <span className="text-malachite border-malachite bg-malachite" />
        <span className="text-rubberYellow border-rubberYellow bg-rubberYellow" />
        <span className="text-orangePeel border-orangePeel bg-orangePeel" />
        <span className="text-ginger border-ginger bg-ginger" />
        <span className="text-grayBlack border-grayBlack bg-grayBlack" />
        <span className="text-darkBlack border-darkBlack bg-darkBlack" />
        <span className="text-yellowOp3 border-yellowOp3 bg-yellowOp3" />
        <span className="text-blueOp3 border-blueOp3 bg-blueOp3" />
      </div>
      <ModalPwdReset
        isOpen={isModalPwdReset}
        close={() => {
          setIsModalPwdReset(false);
        }}
        emailReset={() => {
          setIsModalPwdReset(false);
          setIsModalPwdResetEmail(true);
        }}
      />
      <ModalPwdResetEmail
        isOpen={isModalPwdResetEmail}
        close={() => {
          setIsModalPwdResetEmail(false);
        }}
      />
      <ModalAccDelete
        isOpen={isModalDel}
        close={() => {
          setIsModalDel(false);
        }}
      />
    </div>
  );
};

export default AccountSetting;
