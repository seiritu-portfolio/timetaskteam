import { ReactElement, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SearchLayout from '@component/layout/SearchLayout';
// * hooks
import {
  codisplayUsersSelector,
  onCodisplaySelector,
  searchSelector,
} from '@store/selectors/home';
import { useTasksForKeyword } from '@service/taskQueries';
import { useSchedulesForKeyword } from '@service/scheduleQueries';
import { membersSelector } from '@store/selectors/collabos';
import {
  tzOffsetBrowserSelector,
  tzOffsetSelector,
  userInfoSelector,
  userTimeDisplayFormat,
} from '@store/selectors/user';
import { setTaskID } from '@store/modules/tasks';
import { currentTaskIDSelector } from '@store/selectors/tasks';
// * components
import TaskCheckRow, { ScheduleRow } from './tasks/TaskScheduleRows';
import TaskDetail from '@component/home/tasks/TaskDetail';
// * assets
import SearchSmallIcon from '@svg/magnifyingglass-small.svg';
import ExtensionIcon from '@svg/extension.svg';
import DownTriangleIcon from '@svg/triangle-small.svg';
import FileMenuSelectIcon from '@svg/filemenu-and-cursorarrow.svg';

const Search = () => {
  const search = useSelector(searchSelector);
  const onCodisplayMode = useSelector(onCodisplaySelector);
  const codisplayUsers = useSelector(codisplayUsersSelector);
  const members = useSelector(membersSelector);
  const myInfo = useSelector(userInfoSelector);

  const tasksSearch = useTasksForKeyword(
    search,
    onCodisplayMode ? codisplayUsers : undefined,
  );
  const scheduleSearch = useSchedulesForKeyword(
    search,
    onCodisplayMode ? codisplayUsers : undefined,
  );

  const [currentUserID, setCurrentUserID] = useState(-1);
  const [selectedItem, setSelectedItem] = useState<{
    type: string;
    id: number;
  } | null>(null);
  const dispatch = useDispatch();
  const [showDetail, setShowDetail] = useState(false);
  const totalSearchCount: number = useMemo(() => {
    if (tasksSearch.isSuccess && scheduleSearch.isSuccess) {
      return tasksSearch.data.length + scheduleSearch.data.length;
    } else {
      return 0;
    }
  }, [
    tasksSearch.isSuccess,
    scheduleSearch.isSuccess,
    tasksSearch.data,
    scheduleSearch.data,
  ]);
  const taskID = useSelector(currentTaskIDSelector);
  const tzOffsetMins = useSelector(tzOffsetSelector);
  const tzOffsetBrowser = useSelector(tzOffsetBrowserSelector);
  const timeDisplayFormat = useSelector(userTimeDisplayFormat);

  return (
    <>
      <div className="flex-1 flex flex-col">
        <div className="p-24px w-full h-full border-r border-separator flex flex-col">
          <div className="pb-24px w-full border-b border-separator flex-row--between">
            <div className="flex items-center">
              <div className="h-44px w-44px rounded-8px bg-fontPrimary text-backgroundSecondary flex-xy-center">
                <SearchSmallIcon width={20} height={20} />
              </div>
              <div className="ml-24px big-title-light text-fontPrimary">
                検索結果
              </div>
              <span className="ml-4px bigger-title-en text-fontSecondary">
                {totalSearchCount ? totalSearchCount : ''}
              </span>
              <span className="big-title-light text-fontSecondary">件</span>
            </div>
            <ExtensionIcon
              width={20}
              height={20}
              className="text-fontPrimary cursor-pointer"
              onClick={() => {
                setShowDetail((old) => !old);
              }}
            />
          </div>
          {totalSearchCount > 0 ? (
            <>
              {(() => {
                if (onCodisplayMode && codisplayUsers) {
                  const selectedUsers = members.filter((_) =>
                    codisplayUsers.includes(_.id),
                  );
                  return (
                    <div className="pl-24px py-12px rounded-6px bg-backgroundPrimary flex overflow-hidden">
                      <span
                        className={`cursor-pointer ${
                          currentUserID === -1
                            ? 'text-fontPrimary'
                            : 'text-fontSecondary'
                        }`}
                        onClick={() => {
                          setCurrentUserID(-1);
                        }}
                        key="co-display-select-self"
                      >
                        {myInfo.user?.name ?? ''}
                      </span>
                      {selectedUsers.length > 0 &&
                        selectedUsers.map((_) => (
                          <span
                            className={`ml-24px cursor-pointer ${
                              currentUserID === _.id
                                ? 'text-fontPrimary'
                                : 'text-fontSecondary'
                            }`}
                            onClick={() => {
                              setCurrentUserID(_.id);
                            }}
                            key={`co-display-select-${_.id}`}
                          >
                            {_.name}
                          </span>
                        ))}
                    </div>
                  );
                }
              })()}
              <div className="mt-12px py-12px flex items-center text-fontSecondary">
                <DownTriangleIcon width={20} height={20} />
                <span className="body2">スケジュール</span>
              </div>
              {(() => {
                if (scheduleSearch.isSuccess) {
                  return scheduleSearch.data.length === 0
                    ? null
                    : scheduleSearch.data.map((schedule: any) => (
                        <ScheduleRow
                          {...schedule}
                          showListName={true}
                          tzOffsetMins={tzOffsetMins}
                          tzOffsetBrowser={tzOffsetBrowser}
                          timeDisplayFormat={timeDisplayFormat}
                          onClick={() => {
                            setSelectedItem({
                              type: 'schedule',
                              id: schedule.id,
                            });
                          }}
                          key={`schedule-search-result-${schedule.id}`}
                        />
                      ));
                }
              })()}
              <div className="py-12px flex items-center text-fontSecondary">
                <DownTriangleIcon width={20} height={20} />
                <span className="body2">タスク</span>
              </div>
              {(() => {
                if (tasksSearch.isSuccess) {
                  return tasksSearch.data.length === 0
                    ? null
                    : tasksSearch.data.map((task: any) => (
                        <TaskCheckRow
                          {...task}
                          showListName={true}
                          onClick={() => {
                            setSelectedItem({
                              type: 'task',
                              id: task.id,
                            });
                            dispatch(setTaskID(task.id));
                          }}
                          selected={taskID == task.id}
                          key={`task-search-result-${task.id}`}
                        />
                      ));
                }
              })()}
            </>
          ) : (
            <div className="flex-1 flex-xy-center text-fontSecondary body1">
              <span>該当するスケジュール・タスクが見つかりませんでした</span>
            </div>
          )}
        </div>
      </div>
      <div
        className={`flex-none w-564px flex flex-col ${
          showDetail ? '' : 'hidden'
        }`}
      >
        {selectedItem === null || selectedItem.type == 'schedule' ? (
          <div className="w-full h-full text-fontTertiary flex flex-col items-center justify-center">
            <FileMenuSelectIcon width={80} height={80} />
            <div className="mt-24px body1">
              リストを選択したら詳細が表示されます。
            </div>
          </div>
        ) : (
          <TaskDetail />
        )}
      </div>
    </>
  );
};

export default Search;

Search.getLayout = function getLayout(page: ReactElement) {
  return <SearchLayout>{page}</SearchLayout>;
};
