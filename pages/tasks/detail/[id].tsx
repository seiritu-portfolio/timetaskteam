import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { setTaskID } from '@store/modules/tasks';
import { setTaskModalStatus } from '@store/modules/home';
import { TASKS_URL } from '@util/urls';

const TaskDetail = () => {
  const router = useRouter();
  const currentTaskID = useMemo(() => {
    return router.query.id ? parseInt(router.query.id?.toString()) : -1;
  }, [router]);
  const dispatch = useDispatch();
  useEffect(() => {
    const backgroundUrl =
      localStorage.getItem('task3_background_url') ?? TASKS_URL;
    dispatch(setTaskID(currentTaskID));
    router.push(backgroundUrl);
    dispatch(setTaskModalStatus(true));
  }, [currentTaskID, dispatch, router]);

  return null;
};

export default TaskDetail;
