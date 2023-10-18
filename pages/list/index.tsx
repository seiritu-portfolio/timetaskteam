import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { setListModal } from '@store/modules/home';
import { TASKS_URL } from '@util/urls';

const List = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const backgroundUrl =
      localStorage.getItem('task3_background_url') ?? TASKS_URL;
    router.push(backgroundUrl);
    dispatch(setListModal(true));
  }, [router, dispatch]);

  return null;
};

export default List;
