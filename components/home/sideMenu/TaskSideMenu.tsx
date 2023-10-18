import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// * hooks
import { setAddListType } from '@store/modules/list';
import { setCodisplayFetching, setListAddModal } from '@store/modules/home';
import { useTasksAllWithUser, useTasksCount } from '@service/taskQueries';
import { setTotalTasksCount, updateTasksCountDict } from '@store/modules/tasks';
import { setSortInfoForType } from '@store/modules/sort';
import { currentCodisplayUserSelector } from '@store/selectors/home';
import { userInfoSelector } from '@store/selectors/user';
import { tasksCountDictSelector } from '@store/selectors/tasks';
// * components
import ListSubmenu from './ListSubmenu';
import TaskRequestMenu from './TaskRequestMenu';
import TaskRequestedMenu from './TaskRequestedMenu';
import TaskTodayMenu from './TaskTodayMenu';
import TasksInboxMenu from './TasksInboxMenu';
import TaskAllMenu from './TaskAllMenu';
// * assets
import ListBulletIcon from '@svg/list-bullet.svg';

const TaskSideMenu = () => {
  // get task list array
  const dispatch = useDispatch();
  const userInfo = useSelector(userInfoSelector);

  const currentCodisplayUserID = useSelector(currentCodisplayUserSelector);
  const tasksResult = useTasksAllWithUser(currentCodisplayUserID, 'start_date');
  // const tasksResult = useTasksAll('start_date');
  useEffect(() => {
    if (tasksResult.isSuccess) {
      let sortData: {
        [id: number]: number;
      } = {};
      let totalCount = 0;
      for (var key in tasksResult.data) {
        if (tasksResult.data[key].length > 0) {
          totalCount += tasksResult.data[key].length;
          tasksResult.data[key].map((_: any) => {
            sortData[_.id] = _.pivot.sort != 0 ? _.pivot.sort : _.id;
          });
        }
      }
      dispatch(setTotalTasksCount(totalCount));
      dispatch(
        setSortInfoForType({
          type: 'tasks',
          data: sortData,
        }),
      );
    }
  }, [tasksResult.isSuccess, tasksResult.data, dispatch]);
  useEffect(() => {
    if (!tasksResult.isLoading) dispatch(setCodisplayFetching(false));
  }, [tasksResult, dispatch]);

  const tasksCountDict = useSelector(tasksCountDictSelector);
  const tasksCountResult = useTasksCount(currentCodisplayUserID);
  useEffect(() => {
    if (tasksCountResult.isSuccess) {
      dispatch(updateTasksCountDict(tasksCountResult.data));
    }
  }, [tasksCountResult.isSuccess, tasksCountResult.data, dispatch]);

  return (
    <div className="relative pb-36px flex-1 border-r-1/2 border-separator flex flex-col">
      <div className="p-12px border-b border-separator">
        <TaskAllMenu count={tasksCountDict.all} />
        <TaskTodayMenu count={tasksCountDict.today} />
        <TaskRequestedMenu count={tasksCountDict.requested} />
        <TaskRequestMenu count={tasksCountDict.request} />
        <TasksInboxMenu
          count={tasksCountDict[userInfo.user?.task_inbox_id ?? -1]}
        />
      </div>
      <div className="flex-1 mb-72px">
        <ListSubmenu />
      </div>
      <div
        className="absolute mb-48px bottom-0 px-24px h-20px w-full flex items-center cursor-pointer"
        onClick={() => {
          dispatch(setAddListType(1));
          dispatch(setListAddModal(true));
        }}
      >
        <ListBulletIcon width={20} height={20} className="text-fontPrimary" />
        <span className="ml-24px body1 bg-backgroundSecondary text-primary cursor-pointer">
          リスト追加
        </span>
      </div>
    </div>
  );
};

export default TaskSideMenu;
