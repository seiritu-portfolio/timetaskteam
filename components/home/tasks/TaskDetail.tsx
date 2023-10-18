import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// * hooks
import { useTaskDetailForUser } from '@service/taskQueries';
import {
  currentCodisplayUserSelector,
  onCodisplaySelector,
} from '@store/selectors/home';
import { userIDSelectedSelector } from '@store/selectors/calendar';
import { setCurrentTask } from '@store/modules/tasks';
import { currentTaskIDSelector } from '@store/selectors/tasks';
// * components
import TaskAdd from './TaskAdd';
import TaskEdit from './TaskEdit';
import ManageContinuation from './ManageContinuation';
import RequestManagement from './TaskDetailRequest';
// * css
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { CALENDAR_URL } from '@util/urls';

const TaskDetail = (props: any) => {
  const taskID = useSelector(currentTaskIDSelector);
  const [currentTab, setCurrentTab] = useState(0);

  const [isFetching, setIsFetching] = useState(false);
  const onCodisplayMode = useSelector(onCodisplaySelector);
  const currentCodisplayUserID = useSelector(currentCodisplayUserSelector);
  const userIDSelected = useSelector(userIDSelectedSelector);

  const [isCalendar, setIsCalendar] = useState(false);
  useEffect(() => {
    const backgroundUrl = localStorage.getItem('task3_background_url') ?? '';
    setIsCalendar(backgroundUrl.includes(CALENDAR_URL));
  }, []);

  const currentUserID = useMemo(() => {
    const selectedUserID =
      !userIDSelected || userIDSelected < 1
        ? currentCodisplayUserID
        : userIDSelected;
    const id =
      onCodisplayMode || isCalendar ? selectedUserID : currentCodisplayUserID;
    return id;
  }, [onCodisplayMode, currentCodisplayUserID, userIDSelected, isCalendar]);
  const currentTaskResult = useTaskDetailForUser(
    currentUserID,
    taskID,
    isFetching,
  );
  useEffect(() => {
    if (currentTaskResult.status == 'loading') {
      setIsFetching(true);
    } else {
      setIsFetching(false);
    }
  }, [currentTaskResult.status]);
  const dispatch = useDispatch();
  useEffect(() => {
    if (currentTaskResult.isSuccess) {
      dispatch(setCurrentTask(currentTaskResult.data));
    }
  }, [currentTaskResult.isSuccess, currentTaskResult.data, dispatch]);

  return (
    <div className={`relative px-24px flex flex-col ${props.className ?? ''}`}>
      <div
        className={`lds-dual-ring absolute z-20 ${
          isFetching ? '' : 'invisible'
        }`}
      />
      {currentTab === 0 ? (
        <>
          {taskID && taskID >= 0 ? (
            <TaskEdit
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
              close={props.close}
            />
          ) : (
            <TaskAdd close={props.close} />
          )}
        </>
      ) : currentTab === -1 ? (
        <TaskAdd close={() => setCurrentTab(0)} />
      ) : currentTab === 1 ? (
        <ManageContinuation
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        />
      ) : (
        <>
          <RequestManagement
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
          />
        </>
      )}
    </div>
  );
};

export default TaskDetail;
