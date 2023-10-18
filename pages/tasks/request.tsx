import { ReactElement, useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
// * hooks
import { useTasksRequestWithUser } from '@service/taskQueries';
import { setTaskModalStatus } from '@store/modules/home';
import {
  setCurrentTask,
  setShowTaskDetail,
  setTaskID,
} from '@store/modules/tasks';
import { currentCodisplayUserSelector } from '@store/selectors/home';
// * components
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

const TasksType = () => {
  const router = useRouter();
  const currentCodisplayUserID = useSelector(currentCodisplayUserSelector);
  const [sortType, setSortType] = useState<TASK_SORT_TYPE>('start_date');

  // * data fetch
  const dispatch = useDispatch();
  const tasksRequestResult = useTasksRequestWithUser(
    currentCodisplayUserID,
    sortType,
  );
  const [resultData, setResultData] = useState<any[]>([]);

  useEffect(() => {
    if (tasksRequestResult.isSuccess) {
      const processedData = getClassified(tasksRequestResult.data, sortType);
      setResultData(processedData);
    }
  }, [
    tasksRequestResult.isSuccess,
    tasksRequestResult.data,
    dispatch,
    sortType,
  ]);

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
          sortBy={(newType: TASK_SORT_TYPE) => {
            setSortType((oldType) => {
              if (oldType !== newType) {
                setResultData([]);
              }
              return newType;
            });
          }}
          showSort={true}
          {...TASK_MENU_LIST[3]}
        />
      </div>
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="mt-12px px-24px relative">
          <div className="absolute inset-0" onClick={onTaskAdd} />
          {resultData.length === 0 ? (
            <NoTasks
              text={'依頼したタスクはありません'}
              disabled={true}
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
              droppableId={`tasks-request-${sortType}-${list.key}-${currentCodisplayUserID}`}
            />
          ))}
        </div>
        <div className="flex-1" onClick={onTaskAdd} />
      </div>
    </div>
  );
};

export default TasksType;

TasksType.getLayout = function getLayout(page: ReactElement) {
  return <HomeLayout>{page}</HomeLayout>;
};
