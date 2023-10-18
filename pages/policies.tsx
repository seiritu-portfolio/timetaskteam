import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';

import { setPoliciesModalStatus } from '@store/modules/home';
import { TASKS_URL } from '@util/urls';

const Policies = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const backgroundUrl =
      localStorage.getItem('task3_background_url') ?? TASKS_URL;
    router.push(backgroundUrl);
    dispatch(setPoliciesModalStatus(true));
  }, [router, dispatch]);

  return null;
};

export default Policies;
