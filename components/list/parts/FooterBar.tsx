import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
// * hooks
import {
  currentListIDSelector,
  scheduleListsSelector,
  taskListsSelector,
} from '@store/selectors/list';
import {
  useArchiveList,
  useDeleteList,
  useListExit,
  useUnarchiveList,
} from '@service/listMutations';
import { userInfoSelector } from '@store/selectors/user';
// * hooks
import ModalLimitCount from '../ModalLimitCount';
// * constants
import {
  SCHEDULE_LIST_LIMIT_COUNT,
  TASK_LIST_LIMIT_COUNT,
} from '@util/constants';

const FooterBar = ({
  type,
  onCancel,
  isLoading,
  className,
  setLoading,
  mode,
  isMyList,
}: {
  type: number;
  onCancel: () => void;
  isLoading: boolean;
  className: string;
  setLoading: (newValue: boolean) => void;
  mode?: number;
  isMyList?: boolean;
}) => {
  const currentListID = useSelector(currentListIDSelector);
  const { user } = useSelector(userInfoSelector);

  const isInbox: boolean = useMemo(() => {
    const taskInboxId = user?.task_inbox_id ?? 0;
    const scheduleInboxId = user?.schedule_inbox_id ?? 0;

    return currentListID == taskInboxId || currentListID == scheduleInboxId;
  }, [user, currentListID]);

  const { mutate: deleteMutate, isLoading: deleteIsLoading } = useDeleteList(
    currentListID,
    () => {
      setLoading(false);
    },
  );
  const { mutate: archiveMutate, isLoading: archiveIsLoading } = useArchiveList(
    currentListID,
    () => {
      setLoading(false);
    },
  );
  const { mutate: unarchiveMutate, isLoading: unarchiveIsLoading } =
    useUnarchiveList(currentListID, () => {
      setLoading(false);
    });
  const { mutate: exitMutate, isLoading: isExitLoading } = useListExit(
    currentListID,
    (_) => {},
  );

  const taskLists = useSelector(taskListsSelector);
  const scheduleLists = useSelector(scheduleListsSelector);
  const isCountFull = useMemo(() => {
    if (user?.premium_code && user.premium_code !== '') {
      return false;
    }
    if (type === 1 && taskLists.length >= TASK_LIST_LIMIT_COUNT) {
      return true;
    } else if (
      type === 2 &&
      scheduleLists.length >= SCHEDULE_LIST_LIMIT_COUNT
    ) {
      return true;
    } else {
      return false;
    }
  }, [taskLists, scheduleLists, user, type]);

  const [limitCountModal, setLimitCountModal] = useState(false);
  const onArchiveUnarchive = useCallback(() => {
    if (isLoading || isInbox) {
      return false;
    }
    if (mode === 2 && !isCountFull) {
      unarchiveMutate();
    } else if (mode === 2) {
      setLimitCountModal(true);
    } else {
      archiveMutate();
    }
  }, [isCountFull, mode, isLoading, isInbox, archiveMutate, unarchiveMutate]);
  const cancel = useCallback(() => {
    if (isLoading) {
      return false;
    }
    onCancel();
  }, [onCancel, isLoading]);
  const onDelete = useCallback(() => {
    if (isLoading || isInbox || isExitLoading) {
      return false;
    }
    if (isMyList) deleteMutate();
    else exitMutate();
  }, [deleteMutate, isLoading, isInbox, isMyList, exitMutate, isExitLoading]);

  useEffect(() => {
    if (
      (deleteIsLoading || archiveIsLoading || unarchiveIsLoading) &&
      setLoading != undefined
    ) {
      setLoading(true);
    } else if (!isLoading && setLoading != undefined) {
      setLoading(false);
    }
  }, [
    deleteIsLoading,
    archiveIsLoading,
    unarchiveIsLoading,
    setLoading,
    isLoading,
  ]);

  return (
    <div
      className={`flex-none p-24px h-68p0x border-t border-separator body1 ${
        mode === 2 ? 'flex items-center justify-end' : 'flex-row--between'
      } ${className}`}
    >
      <div className="flex">
        <span
          className={`text-secondary cursor-pointer ${
            isInbox ? 'opacity-60' : ''
          }`}
          onClick={onDelete}
        >
          {isMyList ? '削除' : '退出'}
        </span>
        {isMyList ? (
          <span
            className="ml-24px text-fontSecondary cursor-pointer"
            onClick={onArchiveUnarchive}
          >
            {mode === 2 ? 'アーカイブ解除' : 'アーカイブ'}
          </span>
        ) : null}
      </div>
      <div className={mode === 2 || !isMyList ? 'hidden' : 'flex'}>
        <span className="text-fontSecondary cursor-pointer" onClick={cancel}>
          キャンセル
        </span>
        <button
          type="submit"
          disabled={isLoading}
          className="ml-24px text-primary cursor-pointer disabled:opacity-60"
        >
          保存
        </button>
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

export default FooterBar;
