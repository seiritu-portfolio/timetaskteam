import { ReactElement, useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
// * hooks
import { useTasksAllWithUser } from '@service/taskQueries';
import { setTaskModalStatus } from '@store/modules/home';
import {
  setCurrentTask,
  setShowTaskDetail,
  setTaskID,
} from '@store/modules/tasks';
import { resetBufferForTask } from '@store/modules/sort';
import { currentCodisplayUserSelector } from '@store/selectors/home';

import HomeLayout from '@component/layout/HomeLayout';
import NoTasks from '@component/home/listView/NoTasks';
import TaskClassifiedSection from '@component/home/tasks/TaskClassifiedSection';
import TasksHeader from '@component/home/tasks/TasksHeader';
// * utils
import { replaceState } from '@util/replaceUrl';
import { getClassified } from '@util/helpers';
// * constants
import { TASK_SORT_TYPE } from '@util/constants';
import { TASK_MENU_LIST } from '@util/menuList';
import { TASK_ADD_URL } from '@util/urls';

const TasksAll = () => {
  const router = useRouter();

  const currentCodisplayUserID = useSelector(currentCodisplayUserSelector);

  const [sortType, setSortType] = useState<TASK_SORT_TYPE>('start_date');

  // * data fetch
  const dispatch = useDispatch();
  const tasksResult = useTasksAllWithUser(currentCodisplayUserID, sortType);

  const [resultData, setResultData] = useState<any[]>([]);
  useEffect(() => {
    if (tasksResult.isSuccess) {
      const processedData = getClassified(tasksResult.data, sortType);
      setResultData(processedData);
      dispatch(resetBufferForTask());
    }
  }, [tasksResult.isSuccess, tasksResult.data, dispatch, sortType]);

  // * event handler
  const onTaskAdd = useCallback(() => {
    const currentUrl = router.asPath;
    localStorage.setItem('task3_background_url', currentUrl);
    // dispatch(setBackgroundUrl(currentUrl));
    // * change window url only and show the settings modal
    replaceState(TASK_ADD_URL);
    dispatch(setTaskID(-1));
    dispatch(setCurrentTask(null));
    dispatch(setTaskModalStatus(true));
  }, [dispatch, router.asPath]);

  return (
    <div className="h-full relative flex flex-col">
      <div
        onClick={onTaskAdd}
        className="px-24px pt-24px flex-none flex flex-col items-center"
      >
        <TasksHeader
          sortBy={setSortType}
          showSort={true}
          {...TASK_MENU_LIST[0]}
        />
      </div>
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="mt-12px px-24px relative ">
          <div className="absolute inset-0" onClick={onTaskAdd} />
          {resultData.length === 0 ? (
            <NoTasks
              text={'新しいタスクを追加しましょう'}
              disabled={false}
              onClick={() => {
                dispatch(setCurrentTask(null));
                dispatch(setTaskID(-1));
                dispatch(setShowTaskDetail(true));
              }}
            />
          ) : null}
          {resultData.map((list, index) => (
            <TaskClassifiedSection
              title={list.key}
              tasksArray={list.list}
              key={`task-collection-${index}`}
              selectedList={[]}
              onHeader={onTaskAdd}
              setSelectedList={() => {}}
              droppableId={`tasks-all-${sortType}-${list.key}-${currentCodisplayUserID}`}
            />
          ))}
        </div>
        <div className="flex-1" onClick={onTaskAdd} />
      </div>
    </div>
  );
};

export default TasksAll;

TasksAll.getLayout = function getLayout(page: ReactElement) {
  return <HomeLayout>{page}</HomeLayout>;
};
