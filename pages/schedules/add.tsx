import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';

import { setScheduleModalStatus } from '@store/modules/home';
import { TASKS_URL } from '@util/urls';

const AddSchedule = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const backgroundUrl =
      localStorage.getItem('task3_background_url') ?? TASKS_URL;

    router.push(backgroundUrl);
    dispatch(setScheduleModalStatus(true));
  });

  return null;
};

export default AddSchedule;
