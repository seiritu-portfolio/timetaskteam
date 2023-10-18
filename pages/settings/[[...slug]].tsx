import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';

import { setSettingsModalStatus, setModalUrl } from '@store/modules/home';
import { TASKS_URL } from '@util/urls';

const Settings = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    /**
     * * save the current asPath to redux
     * * get the background url, and redirect to that url
     * * then open the settings modal
     */
    dispatch(setModalUrl(router.asPath));
    const backgroundUrl =
      localStorage.getItem('task3_background_url') ?? TASKS_URL;

    router.push(backgroundUrl);
    dispatch(setSettingsModalStatus(true));
  }, [router, dispatch]);

  return null;
};

export default Settings;
