import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
// * hooks
import {
  selectModeSelector,
  tasksForListSelector,
} from '@store/selectors/tasks';
import { currentListNameSelector } from '@store/selectors/list';
import { setTaskModalStatus } from '@store/modules/home';
import { currentCodisplayUserSelector } from '@store/selectors/home';
import {
  setCurrentTask,
  setSelectTaskMode,
  setShowTaskDetail,
  setTaskID,
} from '@store/modules/tasks';
import { setCurrentListID } from '@store/modules/list';
// * components
import NoTasks from '@component/home/listView/NoTasks';
import MultiOperationBar from '@component/home/listView/MultiOperationBar';
import ModalMultitaskMove from '@component/home/listView/ModalMultitaskMove';
import ModalPriority from '@component/home/listView/ModalPriority';
import ModalRequiredTime from '@component/home/listView/ModalRequiredTime';
import ModalDelete from '@component/home/listView/ModalDelete';
import TaskClassifiedSection from '@component/home/tasks/TaskClassifiedSection';
import HomeLayout from '@component/layout/HomeLayout';
import ListHeader from '@component/home/listView/ListHeader';
// * utils
import { replaceState } from '@util/replaceUrl';
import { TASK_ADD_URL } from '@util/urls';

const TaskList = () => {
  const router = useRouter();
  const currentListName = useSelector(currentListNameSelector);

  const tasksSelectMode = useSelector(selectModeSelector);
  const [selectedList, setSelectedList] = useState<number[]>([]);
  const [multiOperationModal, setMultiOperationModal] = useState<number>(0);
  const dispatch = useDispatch();
  const listID = useMemo(() => {
    return parseInt(router.query.id?.toString() ?? '0');
  }, [router]);
  useEffect(() => {
    if (listID !== 0) {
      dispatch(setCurrentListID(listID));
    }
  }, [listID, dispatch]);
  const tasksForList = useSelector(tasksForListSelector);
  const currentCodisplayUserID = useSelector(currentCodisplayUserSelector);
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
      <ListHeader listID={listID} />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="mt-12px px-24px relative">
          <div className="absolute inset-0" onClick={onTaskAdd} />
          {(() => {
            let tasksCount = 0;
            for (var subList in tasksForList) {
              tasksCount += tasksForList[subList].list.length;
            }

            return tasksCount > 0 ? (
              <div className="relative">
                <div className="absolute inset-0" onClick={onTaskAdd} />
                {tasksForList.map((list, index) => (
                  <TaskClassifiedSection
                    title={list.key}
                    tasksArray={list.list}
                    key={`task-collection-for-task-${listID}-${index}`}
                    showSelectedMode={tasksSelectMode}
                    selectedList={selectedList}
                    onHeader={onTaskAdd}
                    setSelectedList={setSelectedList}
                    droppableId={`tasks-list.${listID}-${list.sortType}-${list.key}-${currentCodisplayUserID}`}
                  />
                ))}
              </div>
            ) : (
              <NoTasks
                text={`${currentListName ?? ''}のタスクはありません`}
                disabled={false}
                onClick={() => {
                  dispatch(setTaskID(-1));
                  dispatch(setCurrentTask(null));
                  dispatch(setShowTaskDetail(true));
                }}
              />
            );
          })()}
        </div>
        <div className="flex-1" onClick={onTaskAdd} />
      </div>
      <MultiOperationBar
        visible={tasksSelectMode}
        onList={() => {
          setMultiOperationModal(1);
        }}
        onPriority={() => {
          setMultiOperationModal(2);
        }}
        onTime={() => {
          setMultiOperationModal(3);
        }}
        onMove={() => {}}
        onDelete={() => {
          setMultiOperationModal(4);
        }}
        onSelectAll={() => {}}
        onClose={() => {
          dispatch(setSelectTaskMode(false));
        }}
      />
      <ModalMultitaskMove
        selectedList={selectedList}
        isOpen={multiOperationModal === 1}
        close={() => setMultiOperationModal(0)}
      />
      <ModalPriority
        selectedList={selectedList}
        isOpen={multiOperationModal === 2}
        close={() => setMultiOperationModal(0)}
      />
      <ModalRequiredTime
        selectedList={selectedList}
        isOpen={multiOperationModal === 3}
        close={() => setMultiOperationModal(0)}
      />
      <ModalDelete
        selectedList={selectedList}
        isOpen={multiOperationModal === 4}
        close={() => setMultiOperationModal(0)}
        listName={currentListName}
      />
    </div>
  );
};

export default TaskList;

TaskList.getLayout = function getLayout(page: ReactElement) {
  return <HomeLayout>{page}</HomeLayout>;
};
