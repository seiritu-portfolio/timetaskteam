import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';

import { setContactusModalStatus } from '@store/modules/home';
import { TASKS_URL } from '@util/urls';

const ContactUs = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const backgroundUrl =
      localStorage.getItem('task3_background_url') ?? TASKS_URL;
    router.push(backgroundUrl);
    dispatch(setContactusModalStatus(true));
  }, [router, dispatch]);

  return null;
};

export default ContactUs;
