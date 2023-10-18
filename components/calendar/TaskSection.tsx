import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { Dayjs } from 'dayjs';
// * hooks
import { useTasksADay } from '@service/taskQueries';
import { codisplayUsersSelector } from '@store/selectors/home';
import { userInfoSelector } from '@store/selectors/user';
import { setTaskID } from '@store/modules/tasks';
import { setTaskModalStatus } from '@store/modules/home';
// * custom components
import TaskCheckRow from 'pages/tasks/TaskScheduleRows';
// * constants
import DownTriangleIcon from '@svg/triangle-small.svg';
import ClosedTriangleIcon from '@svg/triangle-small-right.svg';
import { replaceState } from '@util/replaceUrl';

const TaskSection = ({
  currentDate,
  calendarFilter,
  startdateUnset,
}: {
  currentDate: Dayjs;
  calendarFilter: string;
  startdateUnset?: boolean;
}) => {
  const { user } = useSelector(userInfoSelector);
  const [tasksList, setTasksList] = useState<any>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(true);
  }, [currentDate]);

  const [onCodisplayMode, setOnCodisplayMode] = useState(false);
  const codisplayUserIDs = useSelector(codisplayUsersSelector);
  const calendarUsers = useMemo(() => {
    if (codisplayUserIDs.length == 1 && codisplayUserIDs[0] == user?.id)
      setOnCodisplayMode(false);
    else setOnCodisplayMode(true);
    return codisplayUserIDs;
    // if (onCodisplayMode) return codisplayUserIDs;
    // else return [currentCodisplayUserID];
  }, [codisplayUserIDs, user?.id]);

  const tasksForDay = useTasksADay(
    startdateUnset === true
      ? 'null'
      : startdateUnset === false
      ? currentDate.format('YYYY-MM-DD') ?? ''
      : `null:${currentDate.format('YYYY-MM-DD') ?? ''}`,
    calendarFilter,
    calendarUsers,
  );

  const dispatch = useDispatch();
  const router = useRouter();
  const onTaskClick = useCallback(
    (id: number) => {
      const currentUrl = router.asPath;
      localStorage.setItem('task3_background_url', currentUrl);
      replaceState(`/tasks/detail/${id}`);
      dispatch(setTaskID(id));
      dispatch(setTaskModalStatus(true));
    },
    [dispatch, router.asPath],
  );

  useEffect(() => {
    if (tasksForDay.isSuccess) {
      const data = tasksForDay.data;
      let arrayData: any[] = [];
      if (calendarUsers.length > 1) {
        let filteredArray: any[] = [];
        if (Array.isArray(data)) {
          arrayData = [...data];
        } else {
          Object.keys(data).forEach(function (key) {
            if (key == user?.id.toString()) arrayData = [...data[key]];
            else {
              filteredArray = [...filteredArray, ...data[key]];
            }
          });
        }
        arrayData = [...arrayData, ...filteredArray];
      } else {
        arrayData = data;
      }

      const idList: number[] = [];
      const filtered: any[] = [];
      for (let i = 0; i < arrayData.length; i++) {
        const loopElem = arrayData[i];
        if (!idList.includes(loopElem.id)) {
          idList.push(loopElem.id);
          filtered.push(loopElem);
        }
      }

      if (filtered.length)
        filtered.sort((a, b) => {
          const aDate = new Date(a.start_date);
          const bDate = new Date(b.start_date);
          return aDate.getTime() - bDate.getTime();
        });
      setTasksList(filtered);
    }
  }, [tasksForDay.isSuccess, tasksForDay.data, calendarUsers, user]);

  return (
    <div className="flex-0 pt-12px transition-all ease-in-out delay-400">
      <div
        className="p-12px body2 text-fontSecondary flex items-center cursor-pointer"
        onClick={() => {
          setOpen((old) => !old);
        }}
      >
        {open ? (
          <DownTriangleIcon width={20} height={20} className="" />
        ) : (
          <ClosedTriangleIcon width={20} height={20} className="" />
        )}
        <span className="">タスク</span>
        <span className={'ml-8px'}>
          {(() => {
            if (Array.isArray(tasksList)) {
              return tasksList.length;
            } else if (tasksList) {
              let count = 0;
              for (var key in tasksList) {
                count += tasksList[key].length;
              }
              return count;
            }
          })()}
        </span>
      </div>
      <div className={`flex-1 ${open ? '' : 'hidden'}`}>
        {tasksList &&
          Array.isArray(tasksList) &&
          tasksList.map((task: any, index: number) => (
            <TaskCheckRow
              {...task}
              showListName={true}
              isCodisplayMode={onCodisplayMode}
              onTaskClick={onTaskClick}
              key={`task-row-${task.id}-for-calendar-date-better-${
                currentDate.format('YYYY-MM-DD') ?? ''
              }-${index}`}
            />
          ))}
        {tasksList &&
          !Array.isArray(tasksList) &&
          Object.keys(tasksList).map((key) => {
            <div
              className=""
              key={`task-subsection-${key}-${currentDate.format('YYYYMMDD')}`}
            >
              {tasksList[key].length > 0 &&
                tasksList[key].map((task: any, index: number) => (
                  <TaskCheckRow
                    {...task}
                    showListName={true}
                    isCodisplayMode={onCodisplayMode}
                    onTaskClick={onTaskClick}
                    key={`task-row-${
                      task.id
                    }-for-calendar-date-${currentDate.format(
                      'YYYY-MM-DD',
                    )}-${index}`}
                  />
                ))}
            </div>;
          })}
      </div>
    </div>
  );
};

export default TaskSection;
