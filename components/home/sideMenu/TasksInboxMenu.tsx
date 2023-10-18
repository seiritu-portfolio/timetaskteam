import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import InboxIcon from '@svg/tray.svg';
import { userInfoSelector } from '@store/selectors/user';
import { useListDetailForUser } from '@service/listQueries';
import { setTasksInbox } from '@store/modules/tasks';
import { CLASSNAME_FOR_TASKMENU } from '@util/constants';
import { currentCodisplayUserSelector } from '@store/selectors/home';
import { resetBufferForTask } from '@store/modules/sort';

const TasksInboxMenu = ({ count }: { count: number }) => {
  const dispatch = useDispatch();
  const userInfo = useSelector(userInfoSelector);

  const currentCodisplayUserID = useSelector(currentCodisplayUserSelector);
  const inboxDetailResult = useListDetailForUser(
    currentCodisplayUserID,
    userInfo.user?.task_inbox_id ?? -1,
  );
  useEffect(() => {
    if (inboxDetailResult.isSuccess) {
      dispatch(setTasksInbox(inboxDetailResult.data.tasks));
      dispatch(resetBufferForTask());
    }
  }, [inboxDetailResult.isSuccess, inboxDetailResult.data, dispatch]);
  const router = useRouter();

  if (currentCodisplayUserID == userInfo.user?.id)
    return (
      <div
        className={`${CLASSNAME_FOR_TASKMENU} ${
          userInfo.user?.task_inbox_id ===
          parseInt(router.query.id?.toString() ?? '0')
            ? 'bg-primarySelected text-primary'
            : 'bg-backgroundSecondary text-fontPrimary'
        }`}
        onClick={() => {
          router.push(`/tasks/list/${userInfo.user?.task_inbox_id ?? -1}`);
        }}
      >
        <div className="body1 flex items-center">
          <InboxIcon width={20} height={20} />
          <span className="ml-16px">インボックス</span>
        </div>
        <div className="subtitle-en">{count ? count : ''}</div>
      </div>
    );
  else return null;
};

export default TasksInboxMenu;
