import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInWithPopup,
  GoogleAuthProvider,
  UserCredential,
} from 'firebase/auth';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

import { firebaseAuth } from '@service/firebase';
import { authInfoSelector } from '@store/selectors/auth';
import { useGoogleLoginQuery } from '@service/emailSigninQueries';
import {
  setToken,
  setTzOffsetMins,
  setTzOffsetMinsBrowser,
  setUser,
} from '@store/modules/user';
import { setCurrentCodisplayUser } from '@store/modules/home';

import GoogleIcon from '@svg/google.svg';
import { TASKS_ALL_URL } from '@util/urls';

const GoogleAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [idToken, setIdToken] = useState<string>('');
  const { userAgent } = useSelector(authInfoSelector);
  const gAuthResult = useGoogleLoginQuery(idToken, userAgent);

  useEffect(() => {
    if (gAuthResult.status === 'success') {
      const userInfo = gAuthResult.data.data;
      dispatch(setToken(userInfo.token));
      dispatch(setUser(userInfo.user));
      dispatch(setCurrentCodisplayUser(userInfo.user.id));
      // ! calculate timezone offset minutes, and dispatch it
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
    } else if (gAuthResult.status === 'error') {
    }
  }, [gAuthResult.status, gAuthResult.data, dispatch, router]);

  const authGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(firebaseAuth, provider)
      .then((re) => {
        signInWithGoogleAuth(re);
      })
      .catch((err) => {});
  };

  const signInWithGoogleAuth = async (re: UserCredential) => {
    const newIdToken = await re.user.getIdToken();
    setIdToken(newIdToken);
  };

  return (
    <button
      onClick={authGoogle}
      className="mt-24px button-transparent button flex flex-row justify-center"
    >
      <GoogleIcon className="mr-8px" width={20} height={20} />
      Googleで続ける
    </button>
  );
};

export default GoogleAuth;
