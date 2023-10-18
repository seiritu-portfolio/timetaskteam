import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { setScheduleID } from '@store/modules/schedules';
import { setScheduleModalStatus } from '@store/modules/home';
import { TASKS_URL } from '@util/urls';

const ScheduleDetail = () => {
  const router = useRouter();
  const currentScheduleID = useMemo(
    () => (router.query.id ? parseInt(router.query.id?.toString()) : -1),
    [router],
  );
  const dispatch = useDispatch();
  useEffect(() => {
    const backgroundUrl =
      localStorage.getItem('task3_background_url') ?? TASKS_URL;
    dispatch(setScheduleID(currentScheduleID));
    router.push(backgroundUrl);
    dispatch(setScheduleModalStatus(true));
  }, [currentScheduleID, dispatch, router]);

  return null;
};

export default ScheduleDetail;
