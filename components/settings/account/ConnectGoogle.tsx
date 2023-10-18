import {
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential,
} from 'firebase/auth';

import { firebaseAuth } from '@service/firebase';

const ConnectGoogleBtn = ({
  register,
  setGoogleToken,
  googleAccount,
  setGoogleAccount,
}: {
  register: any;
  setGoogleToken: (newValue: string) => void;
  googleAccount: string;
  setGoogleAccount: (newValue: string) => void;
}) => {
  const signInWithGoogleAuth = async (re: UserCredential) => {
    const newIdToken = await re.user.getIdToken();
    setGoogleToken(newIdToken);
    setGoogleAccount(re.user?.email ?? '');
  };

  const authGoogle = () => {
    const provider = new GoogleAuthProvider();

    signInWithPopup(firebaseAuth, provider).then((re) => {
      signInWithGoogleAuth(re);
    });
  };

  return (
    <>
      <div className="mt-12px px-16px py-12px rounded-8px border-1/2 border-separator flex-row--between">
        {googleAccount !== '' ? (
          <>
            <span className="body1-en text-fontPrimary">{googleAccount}</span>
            <span
              className="body3 text-primary cursor-pointer"
              onClick={authGoogle}
            >
              別のアカウントに変更
            </span>
          </>
        ) : (
          <span
            className="body1 text-primary cursor-pointer"
            onClick={authGoogle}
          >
            Googleアカウント接続
          </span>
        )}
      </div>
      <input {...register('id_token')} type="hidden" />
    </>
  );
};

export default ConnectGoogleBtn;
