import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { taskArchivedSelector, taskListsSelector } from '@store/selectors/list';
import ListMenuSection from './ListMenuSection';
import { userInfoSelector } from '@store/selectors/user';
import { currentCodisplayUserSelector } from '@store/selectors/home';

const ListSubmenu = () => {
  const [listOpen, setListOpen] = useState(true);
  const [listArchiveOpen, setListArchiveOpen] = useState(false);

  const tasksList = useSelector(taskListsSelector);
  const taskArchivedLists = useSelector(taskArchivedSelector);
  const myInfo = useSelector(userInfoSelector);

  const tasksListExceptInbox = useMemo(() => {
    if (tasksList.length === 0) {
      return [];
    } else {
      return tasksList.filter((task) => task.id !== myInfo.user?.task_inbox_id);
    }
  }, [tasksList, myInfo.user]);
  const currentCodisplayUserID = useSelector(currentCodisplayUserSelector);

  return (
    <>
      <div className="p-12px border-b border-separator">
        <ListMenuSection
          title="リスト"
          isOpen={listOpen}
          listData={tasksListExceptInbox}
          onClick={() => setListOpen(!listOpen)}
          droppableId={`lists-homemenu-tasks-${currentCodisplayUserID}`}
        />
      </div>
      <div
        className={`p-12px border-b border-separator ${
          currentCodisplayUserID != myInfo.user?.id ? 'hidden' : ''
        }`}
      >
        <ListMenuSection
          title="アーカイブしたリスト"
          isOpen={listArchiveOpen}
          listData={taskArchivedLists}
          onClick={() => setListArchiveOpen(!listArchiveOpen)}
          droppableId={`lists-homemenu-tasks-archived-${currentCodisplayUserID}`}
        />
      </div>
    </>
  );
};

export default ListSubmenu;
