import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Droppable } from 'react-beautiful-dnd';
import dayjs, { Dayjs } from 'dayjs';
// * hooks
import { useCompleteTask, useTaskDeleteWithID } from '@service/taskMutation';
import {
  setDragItemEndDate,
  setDragItemPadId,
  setShowTaskDetail,
  setTaskID,
} from '@store/modules/tasks';
import { setDropPadsDict } from '@store/modules/sort';
import {
  currentTaskIDSelector,
  dragItemEndDateSelector,
  dragItemPadIdSelector,
  placeholderPropsSelector,
  tasksAllSelector,
} from '@store/selectors/tasks';
import {
  bufferForTaskDragSelector,
  tasksSortDictSelector,
} from '@store/selectors/sort';
import { tzOffsetSelector } from '@store/selectors/user';
// * components
import { TaskRowOrdered } from 'pages/tasks/TaskScheduleRows';
// * assets

export const TaskDropPad = ({
  droppableId,
  tasksArray,
}: {
  droppableId: string;
  tasksArray: any[];
}) => {
  const taskID = useSelector(currentTaskIDSelector);
  const tasksSortDict = useSelector(tasksSortDictSelector);
  const bufferForTaskDrag = useSelector(bufferForTaskDragSelector);
  const tasksAll = useSelector(tasksAllSelector);
  const placeholderProps = useSelector(placeholderPropsSelector);

  const renderTasksArray = useMemo(() => {
    if (bufferForTaskDrag?.droppableId === droppableId) {
      const tasksAllSpread: any[] = [];
      tasksAll.forEach((sublist) => {
        tasksAllSpread.push(...(sublist?.list ?? []));
      });
      const draggingTaskList = tasksAllSpread.filter(
        (_) => _.id === bufferForTaskDrag.draggingId,
      );
      return draggingTaskList.length === 0
        ? tasksArray
        : [...tasksArray, draggingTaskList[0]];
    } else if (bufferForTaskDrag?.srcDroppableId === droppableId) {
      const filtered = tasksArray.filter(
        (_) => _.id !== bufferForTaskDrag.draggingId,
      );
      return filtered;
    } else {
      return tasksArray;
    }
  }, [bufferForTaskDrag, tasksArray, tasksAll, droppableId]);

  const dispatch = useDispatch();
  useEffect(() => {
    if (droppableId && droppableId != '' && tasksArray.length > 0) {
      const idsList = tasksArray.map((_) => _.id);
      dispatch(setDropPadsDict({ droppadID: droppableId, data: idsList }));
    }
  }, [tasksArray, droppableId, dispatch]);
  const tasksSorted = useMemo(() => {
    const newTasksArray = [...renderTasksArray];
    newTasksArray.sort((a, b) => {
      return (
        (tasksSortDict[a.id] ?? a.pivot.sort) -
        (tasksSortDict[b.id] ?? b.pivot.sort)
      );
    });
    return newTasksArray;
  }, [tasksSortDict, renderTasksArray]);

  // * event handlers
  const deleteTask = useTaskDeleteWithID();
  const onDelete = useCallback(
    (id: number) => {
      if (deleteTask.isLoading) {
        return false;
      }
      deleteTask.mutate(id);
    },
    [deleteTask],
  );
  const [delMenuInfo, setDelMenuInfo] = useState<null | {
    id: number;
    x: number;
    y: number;
  }>(null);
  useEffect(() => {
    if (delMenuInfo && delMenuInfo.id) {
      const delMenu: HTMLElement | null =
        document.querySelector('.delMenu.visible');
      if (delMenu) {
        delMenu.focus();
      }
    }
  }, [delMenuInfo]);
  // *
  const onTaskDragStart = useCallback(
    (taskEndDate: string) => () => {
      dispatch(setDragItemEndDate(taskEndDate));
      dispatch(setDragItemPadId(droppableId));
    },
    [dispatch, droppableId],
  );
  const onTaskClick = useCallback(
    (taskId: number) => () => {
      dispatch(setTaskID(taskId));
      dispatch(setShowTaskDetail(true));
    },
    [dispatch],
  );
  const onContextMenu = useCallback(
    (taskId: number) => (e: any) => {
      const menuY = e.clientY;
      const menuX = e.clientX;
      if (
        e.currentTarget &&
        e.currentTarget.getBoundingClientRect().width + 12 <=
          menuX + 120 - e.currentTarget.getBoundingClientRect().left
      ) {
        setDelMenuInfo({
          id: taskId,
          x: menuX - 92 - 457 - 24 - 120,
          y: menuY,
        });
      } else {
        setDelMenuInfo({
          id: taskId,
          x: menuX - 92 - 457 - 24,
          y: menuY,
        });
      }
      e.preventDefault();
      e.stopPropagation();
    },
    [],
  );
  const onDeleteClick = useCallback(
    (taskId: number) => (e: any) => {
      onDelete(taskId ?? 0);
      setDelMenuInfo(null);
      e.stopPropagation();
      e.preventDefault();
    },
    [onDelete],
  );
  const onDeleteBlur = useCallback(() => {
    setDelMenuInfo(null);
  }, []);

  const completeMutation = useCompleteTask((data) => {});

  const onComplete = useCallback(
    (taskId: number, taskCompleted) => (e: any) => {
      e.stopPropagation();
      if (completeMutation.isLoading) {
      } else {
        completeMutation.mutate({
          id: taskId,
          completed: 1 - taskCompleted,
        });
      }
    },
    [completeMutation],
  );

  // *

  const dragItemEndDate = useSelector(dragItemEndDateSelector);
  const originalDropPadId = useSelector(dragItemPadIdSelector);
  const tzOffsetMins = useSelector(tzOffsetSelector);
  const isDropDisabled = useMemo(() => {
    const droppableIDList = droppableId.split('-');
    const set = droppableIDList[2];
    const subset = droppableIDList[3];
    if (!set.includes('date')) {
      return false;
    } else if (droppableId === originalDropPadId) {
      return false;
    }

    const todayStartDate = dayjs()
      .hour(0)
      .minute(0)
      .second(0)
      .subtract(tzOffsetMins, 'minute');

    let newStartDate: Dayjs | undefined = undefined;
    if (subset === '期限切れ') {
      newStartDate = todayStartDate.subtract(1, 'day');
    } else if (subset === '今日') {
      newStartDate = todayStartDate;
    } else if (subset === '明日') {
      newStartDate = todayStartDate.add(1, 'day');
    } else if (subset === '1週間以内') {
      newStartDate = todayStartDate.add(2, 'day');
    } else if (subset === '以降') {
      newStartDate = todayStartDate.add(9, 'day');
    }
    const currentEndDate = dayjs(dragItemEndDate);

    return newStartDate ? newStartDate.isAfter(currentEndDate) : false;
    // return newStartDate ? currentEndDate.isBefore(newStartDate) || currentEndDate.isSame : false;
  }, [droppableId, tzOffsetMins, dragItemEndDate, originalDropPadId]);

  return (
    <Droppable droppableId={droppableId} isDropDisabled={isDropDisabled}>
      {(provided, snapshot) => (
        <div ref={provided.innerRef} {...provided.droppableProps}>
          {placeholderProps && snapshot.isDraggingOver && (
            <div
              className="bg-separator rounded-8px"
              style={{
                position: 'absolute',
                top: placeholderProps.clientY,
                left: placeholderProps.clientX,
                height: placeholderProps.clientHeight,
                width: placeholderProps.clientWidth,
              }}
            />
          )}
          {tasksSorted.map((task, index) => (
            <TaskRowOrdered
              {...task}
              showListName={!droppableId.includes('list.')}
              selected={taskID == task.id}
              key={`tasks-${droppableId}-id-${task.id}`}
              index={index}
              delMenuInfo={delMenuInfo}
              setDelMenuInfo={setDelMenuInfo}
              onTaskClick={onTaskClick(task.id)}
              onTaskDragStart={onTaskDragStart(task.end_date)}
              onContextMenu={onContextMenu}
              onDelete={onDeleteClick(task.id)}
              onDeleteBlur={onDeleteBlur}
              onComplete={onComplete(task.id, task.pivot?.completed ?? 0)}
            />
          ))}
          {tasksSorted.length === 0 && <div className="h-20px" />}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};
