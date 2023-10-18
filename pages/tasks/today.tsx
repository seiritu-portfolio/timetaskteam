import { ReactElement, useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
// * hooks
import { useTasksForCalendar } from '@service/taskQueries';
import { setTaskModalStatus } from '@store/modules/home';
import {
  setCurrentTask,
  setShowTaskDetail,
  setTaskID,
} from '@store/modules/tasks';
import { currentCodisplayUserSelector } from '@store/selectors/home';
import {
  tzOffsetBrowserSelector,
  tzOffsetSelector,
} from '@store/selectors/user';
// * components
import HomeLayout from '@component/layout/HomeLayout';
import NoTasks from '@component/home/listView/NoTasks';
import TaskClassifiedSection from '@component/home/tasks/TaskClassifiedSection';
import { TasksTodayHeader } from '@component/home/tasks/TasksHeader';
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
  const tzOffsetMins = useSelector(tzOffsetSelector);
  const tzOffsetBrowser = useSelector(tzOffsetBrowserSelector);
  const today = useMemo(() => {
    const diffMins =
      (Number.isNaN(tzOffsetBrowser) ? 0 : tzOffsetBrowser) -
      (Number.isNaN(tzOffsetMins) ? 0 : tzOffsetMins);
    return dayjs().subtract(diffMins, 'minute');
  }, [tzOffsetMins, tzOffsetBrowser]);
  const [sortType, setSortType] = useState<TASK_SORT_TYPE>('start_date');

  // * data fetch
  const dispatch = useDispatch();
  const tasksTodayResult = useTasksForCalendar({
    from_date: today?.format('YYYY-M-D') ?? '',
    to_date: today?.format('YYYY-M-D') ?? '',
    user_ids: [currentCodisplayUserID],
    sortType:
      sortType == 'start_date' || sortType == 'default' ? 'priority' : sortType,
    is_repetition_off: true,
  });

  const [resultData, setResultData] = useState<any[]>([]);

  useEffect(() => {
    if (tasksTodayResult.isSuccess) {
      const processedData = getClassified(
        tasksTodayResult.data,
        sortType == 'start_date' || sortType == 'default'
          ? 'priority'
          : sortType,
      );
      setResultData(processedData);
      // dispatch(setTasksToday())
    }
  }, [tasksTodayResult.isSuccess, tasksTodayResult.data, dispatch, sortType]);

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
    <div className="h-full flex-none relative flex flex-col">
      <div
        onClick={onTaskAdd}
        className="px-24px pt-24px flex-none flex flex-col items-center"
      >
        <TasksTodayHeader
          sortBy={(newType: TASK_SORT_TYPE) => {
            setSortType((oldType) => {
              if (oldType !== newType) {
                setResultData([]);
              }
              return newType;
            });
          }}
          showSort={true}
          {...TASK_MENU_LIST[1]}
        />
      </div>
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="mt-12px px-24px relative ">
          <div className="absolute inset-0" onClick={onTaskAdd} />
          {resultData.length === 0 ? (
            <NoTasks
              text={'今日のタスクはありません'}
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
              droppableId={`tasks-today-${
                sortType == 'start_date' || sortType == 'default'
                  ? 'priority'
                  : sortType
              }-${list.key}-${currentCodisplayUserID}`}
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
