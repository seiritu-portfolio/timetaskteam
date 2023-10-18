import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  currentListIDSelector,
  scheduleArchivedSelector,
  scheduleListsSelector,
  taskArchivedSelector,
  taskListsSelector,
} from '@store/selectors/list';
import { userInfoSelector } from '@store/selectors/user';
import { setAddListType, setCurrentListID } from '@store/modules/list';
import { setListAddModal } from '@store/modules/home';
import ListSubsection from './parts/ListSubsection';

const ListSidemenu = () => {
  const [listType, setListType] = useState(0);

  const myInfo = useSelector(userInfoSelector);
  const taskLists = useSelector(taskListsSelector);
  const scheduleLists = useSelector(scheduleListsSelector);
  const taskArchivedLists = useSelector(taskArchivedSelector);
  const scheduleArchivedLists = useSelector(scheduleArchivedSelector);
  const currentListID = useSelector(currentListIDSelector);

  const dispatch = useDispatch();
  useEffect(() => {
    if (currentListID) {
    } else if (myInfo.user) {
      dispatch(
        setCurrentListID(
          listType === 0
            ? myInfo.user.task_inbox_id
            : myInfo.user.schedule_inbox_id,
        ),
      );
    }
  }, [currentListID, dispatch, myInfo, listType]);

  return (
    <div className="relative pt-24px pb-54px w-220px flex flex-col border-r border-separator">
      <div className="mt-2px ml-12px flex-0 px-12px">
        <div className="body1 text-fontSecondary">リスト編集</div>
      </div>
      <div className="mt-24px px-12px flex-none">
        <div className="h-44px w-full rounded-6px bg-backgroundPrimary text-fontPrimary body1 flex flex-row items-center">
          {ListTypeArray.map((item, index) => (
            <div
              className={`ml-12px ${
                listType === index ? '' : 'opacity-40'
              } cursor-pointer`}
              key={`list-type-tab-${index}`}
              onClick={() => setListType(index)}
            >
              {item.text}
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 px-12px overflow-y-auto">
        <ListSubsection
          title="有効なリスト"
          renderList={listType === 0 ? taskLists : scheduleLists}
          inboxID={
            listType === 0
              ? myInfo.user?.task_inbox_id
              : myInfo.user?.schedule_inbox_id
          }
          listType={listType == 0 ? 'tasks' : 'schedules'}
          keyPrefix={listType == 0 ? 'tasks' : 'schedules'}
        />
        <ListSubsection
          title="アーカイブしたリスト"
          renderList={
            listType === 0 ? taskArchivedLists : scheduleArchivedLists
          }
          inboxID={
            listType === 0
              ? myInfo.user?.task_inbox_id
              : myInfo.user?.schedule_inbox_id
          }
          listType={listType == 0 ? 'tasks' : 'schedules'}
          keyPrefix={listType == 0 ? 'tasks-archieved' : 'schedules-archieved'}
        />
      </div>
      <div
        className="absolute bottom-24px left-24px body1 text-primary cursor-pointer"
        onClick={() => {
          dispatch(setAddListType(listType === 0 ? 1 : 2));
          dispatch(setListAddModal(true));
        }}
      >
        {listType === 0 ? 'タスクリスト追加' : 'スケジュールリスト追加'}
      </div>
    </div>
  );
};

export default ListSidemenu;

const ListTypeArray = [
  {
    text: 'タスク',
    value: 0,
  },
  {
    text: 'スケジュール',
    value: 1,
  },
];
