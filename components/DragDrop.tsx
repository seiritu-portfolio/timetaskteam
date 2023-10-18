import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext } from 'react-beautiful-dnd';
import dayjs from 'dayjs';
// * hooks
import {
  collabosSortDictSelector,
  dropPadsDictSelector,
  listsSortDictSelector,
  tasksSortDictSelector,
} from '@store/selectors/sort';
import {
  useCompleteTask,
  useTaskSortUpdate,
  useTaskUpdateForSort,
} from '@service/taskMutation';
import { setBufferForTaskDrag, setSortInfoForType } from '@store/modules/sort';
import { useListSortUpdate } from '@service/listMutations';
import { setDraggedDate, setDroppedDate } from '@store/modules/calendar';
import { taskListsSelector } from '@store/selectors/list';
import { tzOffsetSelector } from '@store/selectors/user';
import {
  setDragItemEndDate,
  setDragItemPadId,
  updatePlaceholderProps,
} from '@store/modules/tasks';

const DragDrop = (props: any) => {
  const tasksSortDict = useSelector(tasksSortDictSelector);
  const listsSortDict = useSelector(listsSortDictSelector);
  const collabosSortDict = useSelector(collabosSortDictSelector);
  const dropPadsDict = useSelector(dropPadsDictSelector);
  const tzOffsetMins = useSelector(tzOffsetSelector);

  const tasksSortMutation = useTaskSortUpdate(() => {});
  const listsSortMutation = useListSortUpdate(() => {});
  // const taskUpdateMutation = useTaskUpdateMutation(id, () => {});
  const taskCompleteMutation = useCompleteTask(() => {});
  const taskUpdateMutation = useTaskUpdateForSort(() => {});
  const taskLists = useSelector(taskListsSelector);
  const [newData, setNewData] = useState<{
    totalDict: { [id: number]: number };
    type: 'tasks' | 'lists' | 'collabos';
    invalidateKey: string | [string, { [key: string]: string | number }];
  }>();

  const dispatch = useDispatch();

  const handleDragEnd = useCallback(
    (result: any) => {
      const { destination, source, draggableId } = result;
      const srcDroppableId = source.droppableId;
      const destDroppableId = destination?.droppableId;

      dispatch(setDragItemEndDate(undefined));
      dispatch(setDragItemPadId(undefined));
      // * if move outside, no change
      if (!destination) {
        return;
      }
      // * if no move, no change
      if (
        srcDroppableId === destDroppableId &&
        destination.index === source.index
      ) {
        return;
      }
      // * move between calendar droppad
      const calendarPanelLabel = 'calendar-panelday';
      if (
        srcDroppableId !== destDroppableId &&
        srcDroppableId.includes(calendarPanelLabel) &&
        destDroppableId?.includes(calendarPanelLabel)
      ) {
        // ! this case, we are gonna set dropped date
        const draggedDate = srcDroppableId.split('-')[2];
        const droppedDate = destDroppableId.split('-')[2];
        dispatch(setDraggedDate(draggedDate));
        dispatch(setDroppedDate(droppedDate));
        const scheduleTask = draggableId.includes('task') ? 1 : 0;
        const tmp = draggableId.split('-');
        const id = parseInt(tmp[tmp.length - 1]);
        tmp.shift();
        tmp.pop();
        tmp.pop();
        // dispatch(
        //   setCopyItem({ type: scheduleTask, id, title: tmp.join('-') }),
        // );
      }
      if (srcDroppableId !== destDroppableId && destDroppableId) {
        const destIndex = destination.index;

        const currentDestDroppadIds = dropPadsDict[destDroppableId] ?? [];
        const totalDict = tasksSortDict;
        const mutation = tasksSortMutation;
        // if (!currentDestDroppadIds) {
        //   return false;
        // }
        const newDestIDsList = [...currentDestDroppadIds];
        newDestIDsList.splice(destIndex, 0, parseInt(draggableId));
        const newSortValuesList = newDestIDsList
          .map((_) => totalDict[_])
          .sort((a, b) => a - b);

        const newTotalDict: { [itemId: number]: number } = {};
        for (var key in totalDict) {
          const tempIndex = newDestIDsList.indexOf(parseInt(key));
          newTotalDict[key] =
            tempIndex > -1 ? newSortValuesList[tempIndex] : totalDict[key];
        }
        const newIdSortArray = newDestIDsList.map((itemId, index) => ({
          id: itemId,
          sort: newSortValuesList[index],
        }));
        mutation.mutate(newIdSortArray);
        dispatch(
          setSortInfoForType({
            type: 'tasks',
            data: newTotalDict,
          }),
        );
        dispatch(
          setBufferForTaskDrag({
            droppableId: destDroppableId,
            srcDroppableId: srcDroppableId,
            draggingId: parseInt(draggableId),
          }),
        );

        // * if move to the other drop, no change
        const srcIDList = srcDroppableId.split('-');
        const destIDList = destDroppableId.split('-');

        const dropType = srcIDList[0];
        const srcSortType = srcIDList[2] ?? destIDList[2];
        const srcSubset = srcIDList[3];
        const destSubset = destIDList[3];
        if (dropType !== 'tasks') return;

        // const currentTask = tasksAll.filter(
        //   (item) => item.id === parseInt(draggableId),
        // )[0];
        // if (currentTask == undefined) return;
        if (srcSubset === '完了') {
          taskCompleteMutation.mutate({
            id: parseInt(draggableId),
            completed: 0,
          });
        }
        if (destSubset === '完了') {
          taskCompleteMutation.mutate({
            id: parseInt(draggableId),
            completed: 1,
          });
        } else if (srcSortType === 'start_date' || srcSortType === 'end_date') {
          // * date sort
          const updateData: any = {};
          const todayStartDate = dayjs()
            .hour(0)
            .minute(0)
            .second(0)
            .subtract(tzOffsetMins, 'minute');
          const todayEndDate = dayjs()
            .hour(23)
            .minute(59)
            .second(59)
            .subtract(tzOffsetMins, 'minute');
          if (destSubset === '期限切れ') {
            updateData.start_date = todayStartDate
              .subtract(1, 'day')
              .format('YYYY-MM-DD HH:mm:ss');
            updateData.end_date = todayEndDate
              .subtract(1, 'day')
              .format('YYYY-MM-DD HH:mm:ss');
            // updateData.end_date = todayEndDate
            //   .subtract(1, 'day')
            //   .format('YYYY-MM-DD HH:mm:ss');
          } else if (destSubset === '今日') {
            updateData.start_date = todayStartDate.format(
              'YYYY-MM-DD HH:mm:ss',
            );
            // updateData.end_date = todayEndDate.format('YYYY-MM-DD HH:mm:ss');
          } else if (destSubset === '明日') {
            updateData.start_date = todayStartDate
              .add(1, 'day')
              .format('YYYY-MM-DD HH:mm:ss');
            // updateData.end_date = todayEndDate
            //   .add(1, 'day')
            //   .format('YYYY-MM-DD HH:mm:ss');
          } else if (destSubset === '1週間以内') {
            updateData.start_date = todayStartDate
              .add(2, 'day')
              .format('YYYY-MM-DD HH:mm:ss');
            // updateData.end_date = todayEndDate
            //   .add(2, 'day')
            //   .format('YYYY-MM-DD HH:mm:ss');
          } else if (destSubset === '以降') {
            updateData.start_date = todayStartDate
              .add(9, 'day')
              .format('YYYY-MM-DD HH:mm:ss');
            // updateData.end_date = todayEndDate
            //   .add(9, 'day')
            //   .format('YYYY-MM-DD HH:mm:ss');
          } else if (destSubset === '日付指定なし') {
            updateData.start_date = null;
          }

          taskUpdateMutation.mutate({
            id: parseInt(draggableId),
            object: updateData,
          });
        } else if (srcSortType === 'priority') {
          // * importance sort
          taskUpdateMutation.mutate({
            id: parseInt(draggableId),
            object: {
              importance:
                destSubset === '低'
                  ? 1
                  : destSubset === '中'
                  ? 2
                  : destSubset === '高'
                  ? 3
                  : 1,
            },
          });
        } else if (srcSortType === 'list') {
          // * list sort
          const destList = taskLists.filter(
            (item) => item.name === destSubset,
          )[0];
          if (destList) {
            taskUpdateMutation.mutate({
              id: parseInt(draggableId),
              object: {
                list_id: destList.id,
              },
            });
          }
        }

        return;
      }
      // * else
      const currentDroppadIds = dropPadsDict[srcDroppableId];
      const [dropType, mainType, sortType, _] = srcDroppableId.split('-');
      const totalDict =
        dropType == 'tasks'
          ? tasksSortDict
          : dropType == 'lists'
          ? listsSortDict
          : collabosSortDict;
      const mutation =
        dropType == 'tasks'
          ? tasksSortMutation
          : dropType == 'lists'
          ? listsSortMutation
          : tasksSortMutation; // ! should be collabos sort mutation
      const newTotalDict = { ...totalDict };
      if (!currentDroppadIds) {
        return false;
      }
      let idSortArray = currentDroppadIds.map((_) => ({
        id: _,
        sort: totalDict[_],
      }));
      idSortArray.sort((a, b) => a.sort - b.sort);

      const srcIndex = source.index;
      const destIndex = destination.index;
      const currentInfo = { ...idSortArray[srcIndex] };
      const newIdSortArray = [...idSortArray];
      if (srcIndex < destIndex) {
        for (let i = srcIndex; i < destIndex; i++) {
          const itemId = idSortArray[i + 1].id;
          const itemValue = idSortArray[i].sort;
          newIdSortArray[i] = {
            id: itemId,
            sort: itemValue,
          };
          newTotalDict[itemId] = itemValue;
        }
      } else {
        for (let i = destIndex; i < srcIndex; i++) {
          const itemId = idSortArray[i].id;
          const itemValue = idSortArray[i + 1].sort;
          newIdSortArray[i + 1] = {
            id: itemId,
            sort: itemValue,
          };
          newTotalDict[itemId] = itemValue;
        }
      }
      const itemId = currentInfo.id;
      const itemValue = newIdSortArray[destIndex].sort;
      newIdSortArray[destIndex] = {
        id: itemId,
        sort: itemValue,
      };
      newTotalDict[itemId] = itemValue;
      mutation.mutate(newIdSortArray);

      let newType: 'tasks' | 'lists' | 'collabos' = 'tasks';
      let invalidateKey: string | [string, { [key: string]: string | number }] =
        'tasks';
      if (dropType === 'tasks') {
        if (mainType == 'all') {
          invalidateKey = ['tasks', { filter: sortType }];
        } else if (mainType == 'request') {
          invalidateKey = ['tasks', { filter: 'request' }];
        } else if (mainType == 'requested') {
          invalidateKey = ['tasks', { filter: 'requested' }];
        } else if (mainType.includes('list')) {
          const listID = parseInt(mainType.split('.')[1]);
          invalidateKey = ['tasks', { filter: sortType, listID }];
        } else {
          invalidateKey = 'tasks';
        }
      } else if (dropType === 'lists') {
        newType = 'lists';
        invalidateKey = 'list';
      }
      setNewData({
        totalDict: newTotalDict,
        type: newType,
        invalidateKey,
      });
      dispatch(
        setSortInfoForType({
          type: newType,
          data: newTotalDict,
        }),
      );
      dispatch(updatePlaceholderProps(undefined));
    },
    [
      dispatch,
      collabosSortDict,
      dropPadsDict,
      listsSortDict,
      listsSortMutation,
      taskCompleteMutation,
      taskLists,
      taskUpdateMutation,
      tasksSortDict,
      tasksSortMutation,
      tzOffsetMins,
    ],
  );

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      {props.children}
    </DragDropContext>
  );
};

export default DragDrop;

const queryAttr = 'data-rbd-drag-handle-draggable-id';
