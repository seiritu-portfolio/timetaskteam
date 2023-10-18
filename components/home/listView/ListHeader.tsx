import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useQueryClient } from 'react-query';
// * hooks
import { useListDetailForUser } from '@service/listQueries';
import {
  setSelectTaskMode,
  setShowTaskDetail,
  setTasksForList,
} from '@store/modules/tasks';
import {
  useArchiveList,
  useDeleteList,
  useListExit,
  useUnarchiveList,
} from '@service/listMutations';
import { useTasksForListWithUser } from '@service/taskQueries';
import { setListModal } from '@store/modules/home';
import { setCurrentListID, setCurrentListName } from '@store/modules/list';
import { resetBufferForTask } from '@store/modules/sort';
import { taskListsSelector } from '@store/selectors/list';
import { showTaskDetailSelector } from '@store/selectors/tasks';
import { currentCodisplayUserSelector } from '@store/selectors/home';
import { userInfoSelector } from '@store/selectors/user';
// * custom components
import { GroupUsersIconListMenu } from '@component/settings/userList/parts/GroupUsersIconList';
import { SortMenu } from '../dropdownMenus/sortMenu';
import { MoreMenuForList } from '../dropdownMenus/MoreMenu';
import ModalLimitCount from '@component/list/ModalLimitCount';
// * assets
import LockShieldIcon from '@svg/lock-shield.svg';
import TrayIcon from '@svg/tray.svg';
import DefaultListIcon from '@svg/square-stack-3-d-down-right.svg';
import {
  ICON_VALUES,
  TASKS_CLASSIFY_BY_DATE,
  TASK_LIST_LIMIT_COUNT,
  TASK_SORT_TYPE,
} from '@util/constants';
import ExtensionIcon from '@svg/extension.svg';

const ListHeader = ({ listID }: { listID: number }) => {
  const userInfo = useSelector(userInfoSelector);
  const [sortType, setSortType] = useState<TASK_SORT_TYPE>('start_date');

  const currentCodisplayUserID = useSelector(currentCodisplayUserSelector);
  const tasksResult = useTasksForListWithUser(
    currentCodisplayUserID,
    sortType,
    listID,
  );
  const dispatch = useDispatch();
  useEffect(() => {
    if (tasksResult.isSuccess) {
      let resultData: any[] = [];
      let totalCount = 0;
      if (sortType == 'start_date' || sortType == 'end_date') {
        for (var key in tasksResult.data) {
          resultData.push({
            key: TASKS_CLASSIFY_BY_DATE[key],
            list: tasksResult.data[key],
            sortType: sortType,
          });
          totalCount += tasksResult.data[key].length;
        }
      } else if (sortType == 'priority') {
        let low: any[] = [];
        let mid: any[] = [];
        let high: any[] = [];
        let completed: any[] = [];
        const keyList = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
        for (let i = 0; i < 10; i++) {
          const key = keyList[i];
          const subset = tasksResult.data[key.toString()];
          if (key < 1 || key > 9) {
            completed = [...completed, ...subset];
          } else if (key < 3) {
            low = [...low, ...subset];
          } else if (key < 6) {
            mid = [...mid, ...subset];
          } else {
            high = [...high, ...subset];
          }
          totalCount += subset.length;
        }
        resultData.push({
          key: '高',
          list: high,
          sortType: sortType,
        });
        resultData.push({
          key: '中',
          list: mid,
          sortType: sortType,
        });
        resultData.push({
          key: '低',
          list: low,
          sortType: sortType,
        });
        resultData.push({
          key: '完了',
          list: completed,
        });
      } else if (sortType == 'list') {
        for (var key in tasksResult.data) {
          const name = tasksResult.data[key].name;
          const subset = tasksResult.data[key].tasks;
          const subsetLength = subset.length;

          if (subsetLength > 0) {
            resultData.push({
              key: name,
              list: subset,
              sortType: sortType,
            });
            totalCount += subsetLength;
          }
        }
      } else if (sortType == 'importance') {
        let low: any[] = tasksResult.data['1'];
        let mid: any[] = tasksResult.data['2'];
        let high: any[] = tasksResult.data['3'];
        let completed: any[] = tasksResult.data['0'];
        totalCount = completed.length + low.length + mid.length + high.length;

        resultData.push({
          key: '高',
          list: high,
          sortType: sortType,
        });
        resultData.push({
          key: '中',
          list: mid,
          sortType: sortType,
        });
        resultData.push({
          key: '低',
          list: low,
          sortType: sortType,
        });
        resultData.push({
          key: '完了',
          list: completed,
        });
      }
      dispatch(setTasksForList(resultData));
      dispatch(resetBufferForTask());
    }
  }, [tasksResult.isSuccess, tasksResult.data, dispatch, sortType]);

  const listDetailResult = useListDetailForUser(currentCodisplayUserID, listID);
  const [isNotMine, setIsNotMine] = useState(false);
  useEffect(() => {
    if (listDetailResult.isSuccess) {
      const cooperators = listDetailResult.data?.cooperators ?? [];
      const filtered = cooperators.filter(
        (item: any) => item.pivot?.role === 1,
      );

      const writerId = filtered.length > 0 ? filtered[0].id : undefined;
      setIsNotMine(writerId != userInfo.user?.id);

      dispatch(setCurrentListName(listDetailResult.data.name));
    }
  }, [
    listDetailResult.isSuccess,
    listDetailResult.data,
    dispatch,
    userInfo.user,
  ]);

  const ListIcon = useMemo(() => {
    if (userInfo.user && listDetailResult.isSuccess) {
      const inboxId = userInfo.user.task_inbox_id;
      if (inboxId === listDetailResult.data.id) {
        return TrayIcon;
      } else {
        const listIconID = listDetailResult.data.icon;
        return ICON_VALUES[listIconID]?.icon ?? ICON_VALUES[0]?.icon;
      }
    }
  }, [userInfo.user, listDetailResult.isSuccess, listDetailResult.data]);

  const queryClient = useQueryClient();
  const { mutate: deleteMutate, isLoading: deleteIsLoading } = useDeleteList(
    listID,
    () => {
      queryClient.invalidateQueries([
        'list',
        {
          id: listID,
        },
      ]);
    },
  );
  const { mutate: archiveMutate, isLoading: archiveIsLoading } = useArchiveList(
    listID,
    () => {
      queryClient.invalidateQueries([
        'list',
        {
          id: listID,
        },
      ]);
    },
  );
  const { mutate: unarchiveMutate, isLoading: unarchiveIsLoading } =
    useUnarchiveList(listID, () => {
      queryClient.invalidateQueries([
        'list',
        {
          id: listID,
        },
      ]);
    });
  const showTaskDetail = useSelector(showTaskDetailSelector);
  const router = useRouter();

  const onArchive = useCallback(() => {
    if (!archiveIsLoading && !deleteIsLoading && !unarchiveIsLoading)
      archiveMutate();
  }, [archiveIsLoading, deleteIsLoading, unarchiveIsLoading, archiveMutate]);
  const taskLists = useSelector(taskListsSelector);
  const isCountFull = useMemo(() => {
    if (userInfo.user?.premium_code && userInfo.user.premium_code !== '') {
      return false;
    }
    if (taskLists.length >= TASK_LIST_LIMIT_COUNT) {
      return true;
    } else {
      return false;
    }
  }, [taskLists, userInfo.user]);

  const [limitCountModal, setLimitCountModal] = useState(false);
  const onUnarchive = useCallback(() => {
    if (isCountFull) {
      setLimitCountModal(true);
    } else if (!archiveIsLoading && !deleteIsLoading && !unarchiveIsLoading)
      unarchiveMutate();
  }, [
    archiveIsLoading,
    deleteIsLoading,
    unarchiveIsLoading,
    unarchiveMutate,
    isCountFull,
  ]);
  const { mutate: exitMutate, isLoading: isExitLoading } = useListExit(
    listID,
    (_) => {},
  );
  const onDelete = useCallback(() => {
    if (
      !archiveIsLoading &&
      !deleteIsLoading &&
      !unarchiveIsLoading &&
      !isExitLoading
    )
      if (isNotMine) exitMutate();
      else deleteMutate();
  }, [
    archiveIsLoading,
    deleteIsLoading,
    unarchiveIsLoading,
    deleteMutate,
    isExitLoading,
    exitMutate,
    isNotMine,
  ]);

  return (
    <div className="flex-none px-24px pt-24px h-92px">
      <div className="pb-24px border-b border-separator flex-row--between">
        <div className="flex items-center text-fontPrimary">
          <div className="h-44px w-44px rounded-8px bg-fontPrimary text-backgroundSecondary flex-xy-center">
            {ListIcon ? (
              <ListIcon width={20} height={20} />
            ) : (
              <DefaultListIcon width={20} height={20} />
            )}
          </div>
          <div className="ml-24px flex flex-row items-center">
            {listDetailResult.isSuccess &&
              listDetailResult.data.status === 0 && (
                <LockShieldIcon width={24} height={24} className="mr-8px" />
              )}
            <div className="big-title">
              {userInfo.user?.task_inbox_id === listID
                ? 'インボックス'
                : listDetailResult.isSuccess
                ? listDetailResult.data.name
                : ''}
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <GroupUsersIconListMenu
            users={
              listDetailResult.isSuccess
                ? listDetailResult.data.cooperators
                : []
            }
            groupId={0}
          />
          <ExtensionIcon
            width={20}
            height={20}
            className="ml-16px cursor-pointer"
            onClick={() => {
              dispatch(setShowTaskDetail(!showTaskDetail));
            }}
          />
          <SortMenu idToHide={4} sortBy={setSortType} />
          <MoreMenuForList
            isInbox={userInfo.user?.task_inbox_id === listID}
            isNotMine={isNotMine}
            onEdit={() => {
              const currentUrl = router.asPath;
              localStorage.setItem('task3_background_url', currentUrl);
              dispatch(setListModal(true));
              dispatch(setCurrentListID(listID));
            }}
            onMultiSelect={() => {
              dispatch(setSelectTaskMode(true));
            }}
            onCopy={() => {}}
            archiveStatus={
              listDetailResult.isSuccess
                ? listDetailResult.data.archived_at != null
                  ? true
                  : false
                : false
            }
            onArchive={onArchive}
            onUnarchive={onUnarchive}
            onDelete={onDelete}
          />
        </div>
      </div>
      <ModalLimitCount
        isOpen={limitCountModal}
        close={() => {
          setLimitCountModal(false);
        }}
      />
    </div>
  );
};

export default ListHeader;
