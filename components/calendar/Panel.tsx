import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dayjs } from 'dayjs';
import _debounce from 'lodash.debounce';
// * hooks
import { useWindowDimensions } from '@util/calendar';
// * assets
import ExpandIcon from '@svg/arrow-up-left-and-arrow-down-right.svg';
import CollapseIcon from '@svg/arrow-down-forward-and-arrow-up-backward.svg';
import ArrowLeftIcon from '@svg/arrow-left.svg';
// * constants
import {
  CalendarRenderItem,
  CalendarRenderItemExtended,
} from '@model/calendar';
import { WEEKDAYS_JP } from '@util/constants';
import UncheckedIcon from '@svg/square.svg';
import CheckedIcon from '@svg/checkmark-square-fill.svg';
import CloseIcon from '@svg/multiply.svg';

const PADDING = 2;

const Panel = ({
  schedulesPerWeek,
  tasksPerWeek,
  weekStartMonday,
  dayArrPerWeek,
  currentDate,
  today,
  holidayDict,
  holidayDisplay,
  expanded,
  draggingItemInfo,
  activeMonth,
  isSidebarOpen,
  magnifiedDate,
  draggingItemId,
  droppedDate,
  copyItemInfo,
  detailBarStatus,
  viewMode,
  onDayLabelClick,
  onScheduleClick,
  onTaskClick,
  onExpand,
  onShowStatusBar,
  onContextDate,
  onMagnifiedClose,
  onItemDragStart,
  onItemDragEnd,
  onItemDragEndWithDate,
  onScheduleNew,
  onTaskNew,
  copyItem,
  moveItem,
  onSetDraggingPos,
  onDroppedModalClose,
  onPrev,
  onNext,
  onDelete,
  onCompleteIncomplete,
  onPreventPropagate,
}: {
  schedulesPerWeek: Array<CalendarRenderItem[]>;
  tasksPerWeek: Array<CalendarRenderItem[]>;
  weekStartMonday: boolean;
  dayArrPerWeek: Array<Dayjs[]>;
  currentDate: Dayjs;
  today: Dayjs;
  holidayDict: {
    [key: string]: string;
  };
  holidayDisplay: boolean;
  expanded: boolean;
  draggingItemInfo: Array<CalendarRenderItem | undefined>;
  activeMonth: number;
  isSidebarOpen: boolean;
  magnifiedDate: string;
  draggingItemId: number;
  droppedDate: string;
  copyItemInfo: CalendarRenderItemExtended | undefined;
  detailBarStatus: boolean;
  viewMode: 'month' | 'weeks4' | 'weeks2' | 'half' | 'week';
  onDayLabelClick: (date: Dayjs, isExpanded: boolean) => void;
  onScheduleClick: (id: number, userId: number) => void;
  onTaskClick: (id: number, userId: number) => void;
  onExpand: () => void;
  onShowStatusBar: () => void;
  onContextDate: (date: Dayjs) => void;
  onMagnifiedClose: () => void;
  onItemDragStart: (itemId: number) => void;
  onItemDragEnd: () => void;
  onItemDragEndWithDate: (date: Dayjs) => void;
  onScheduleNew: (date: Dayjs) => void;
  onTaskNew: (date: Dayjs) => void;
  copyItem: (id: number, diffDays: number, type: number) => void;
  moveItem: (id: number, diffDays: number, type: number) => void;
  onSetDraggingPos: ({
    chunkIndex,
    x,
    y,
  }: {
    chunkIndex: number;
    x: number;
    y: number;
  }) => void;
  onDroppedModalClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onDelete: (id: number, type: 'schedule' | 'task') => void;
  onCompleteIncomplete: (taskId: number, completed: 0 | 1) => (e: any) => void;
  onPreventPropagate: (e: any) => void;
}) => {
  const [newItemDate, setNewItemDate] = useState<Dayjs>();

  // ! modal close when blur
  const copyMenuRef = useRef<HTMLDivElement | null>(null);
  const newItemMenuRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (droppedDate !== '' && copyMenuRef.current) {
      copyMenuRef.current.focus();
    }
  }, [droppedDate]);
  useEffect(() => {
    if (newItemDate !== undefined && newItemMenuRef.current) {
      newItemMenuRef.current.focus();
    }
  }, [newItemDate]);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [maxCount, setMaxCount] = useState(0);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  useEffect(() => {
    const sidebarWidth = isSidebarOpen ? 300 : 92;
    const sidepanelWidth = detailBarStatus ? 0 : expanded ? 44 : 460;
    let containerWidth = 0;
    if (windowWidth) {
      containerWidth = windowWidth - sidebarWidth - sidepanelWidth;
    }
    const newWidth = Math.floor(((containerWidth - 6) * 10) / 7) / 10;
    setWidth(Math.max(0, newWidth - PADDING * 2));
  }, [windowWidth, expanded, isSidebarOpen, detailBarStatus]);
  useEffect(() => {
    let containerHeight = 0;
    if (windowHeight) {
      containerHeight = windowHeight - 131 - 28 - 24;
    }
    const divider = dayArrPerWeek.length === 0 ? 1 : dayArrPerWeek.length;
    const newHeight = containerHeight / divider;
    const newCount = Math.max(0, Math.floor((newHeight - 41) / 22));

    setMaxCount(newCount);
    setHeight(Math.max(0, newHeight));
  }, [windowHeight, dayArrPerWeek.length]);

  const [isWheeling, setIsWheeling] = useState<number>();

  const [delMenuInfo, setDelMenuInfo] = useState<null | {
    id: number;
    chunkIndex: number;
    subIndex: number;
    type: 'task' | 'schedule';
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

  useEffect(() => {
    // @ts-ignore
    history.pushState(null, null, location.href);
    window.onpopstate = function (event) {
      history.go(1);
    };
  }, []);

  // * render related
  const weekDaysList = weekStartMonday
    ? [1, 2, 3, 4, 5, 6, 0]
    : [0, 1, 2, 3, 4, 5, 6];

  // * event handlers
  const onWheel = useCallback(
    (e: any) => {
      if (magnifiedDate) {
        return false;
      }
      if (isWheeling) {
        clearTimeout(isWheeling);
      }
      const timer: number = window.setTimeout(() => {
        const nativeEvent = e.nativeEvent;
        const isTouchPad = nativeEvent.wheelDeltaY
          ? nativeEvent.wheelDeltaY === -3 * nativeEvent.deltaY
          : nativeEvent.deltaMode === 0;
        setIsWheeling(undefined);
        if (
          (!isTouchPad && e.deltaY > 0) ||
          (isTouchPad && (e.deltaX > 0 || e.deltaY > 0))
        )
          onNext();
        else if (
          (!isTouchPad && e.deltaY < 0) ||
          (isTouchPad && (e.deltaX < 0 || e.deltaY < 0))
        )
          onPrev();
      }, 150);
      setIsWheeling(timer);
    },
    [isWheeling, onNext, onPrev, magnifiedDate],
  );
  const onEndDrag = useCallback(() => {
    onItemDragEnd();
    onDroppedModalClose();
  }, [onItemDragEnd, onDroppedModalClose]);
  const onDel = useCallback(
    (e) => {
      onDelete(delMenuInfo?.id ?? 0, delMenuInfo?.type ?? 'task');
      setDelMenuInfo(null);
      e.stopPropagation();
      e.preventDefault();
    },
    [onDelete, delMenuInfo],
  );
  const onDelBlur = useCallback(() => {
    setDelMenuInfo(null);
  }, []);
  const onCopyMenuBlur = useCallback(() => {
    setNewItemDate(undefined);
    onMagnifiedClose();
    onDroppedModalClose();
  }, [onMagnifiedClose, onDroppedModalClose]);
  const onExpandIcon = useCallback(() => {
    onExpand();
    setNewItemDate(undefined);
    onMagnifiedClose();
  }, [onExpand, onMagnifiedClose]);
  const onMagnifyDay = useCallback(
    (date: Dayjs) => (e: any) => {
      onContextDate(date);
      e.preventDefault();
      e.stopPropagation();
      setNewItemDate(undefined);
    },
    [onContextDate],
  );
  const onMagnifyBlur = useCallback(() => {
    onMagnifiedClose();
    onDroppedModalClose();
    setNewItemDate(undefined);
  }, [onMagnifiedClose, onDroppedModalClose]);
  const onDayLabelContainer = useCallback(
    (dayItem: Dayjs) => () => setNewItemDate(dayItem),
    [],
  );
  const onDay = useCallback(
    (dayItem: Dayjs) => (e: any) => {
      onDayLabelClick(dayItem, expanded);
      e.stopPropagation();
    },
    [onDayLabelClick, expanded],
  );
  const onSchedule = useCallback(
    (schedule: any) => () => {
      onScheduleClick(schedule.id, schedule.userId);
      onItemDragEnd();
    },
    [onScheduleClick, onItemDragEnd],
  );
  const onScheduleContext = useCallback(
    (
        schedule: any,
        currentScheduleRowArray: any[],
        index: number,
        chunkIndex: number,
      ) =>
      (e: any) => {
        const menuY = e.currentTarget?.getBoundingClientRect().bottom;
        const menuX = e.clientX;
        const sidebarWidth = isSidebarOpen ? 300 : 92;
        const subIndex = currentScheduleRowArray.length - index;
        setDelMenuInfo({
          id: schedule.id,
          chunkIndex,
          subIndex,
          type: 'schedule',
          x: menuX - sidebarWidth,
          y: menuY,
        });

        onItemDragEnd();
        e.preventDefault();
        e.stopPropagation();
      },
    [isSidebarOpen, onItemDragEnd],
  );
  const onTaskScheduleDown = useCallback(
    (taskSchedule: any) => () => {
      onItemDragStart(taskSchedule.id);
    },
    [onItemDragStart],
  );
  const onTask = useCallback(
    (task: any) => (e: any) => {
      onTaskClick(task.id, task.userId);
      onItemDragEnd();
      e.stopPropagation();
    },
    [onTaskClick, onItemDragEnd],
  );
  const onTaskContext = useCallback(
    (
        task: any,
        maxCurrentTaskCount: number,
        index: number,
        chunkIndex: number,
      ) =>
      (e: any) => {
        const menuY = e.currentTarget?.getBoundingClientRect().bottom;
        const menuX = e.clientX;
        const sidebarWidth = isSidebarOpen ? 300 : 92;
        const subIndex = maxCurrentTaskCount - index;
        setDelMenuInfo({
          id: task.id,
          chunkIndex,
          subIndex,
          type: 'task',
          x: menuX - sidebarWidth,
          y: menuY,
        });

        onItemDragEnd();
        e.preventDefault();
        e.stopPropagation();
      },
    [isSidebarOpen, onItemDragEnd],
  );
  // ! drag part
  const onDragOver = useCallback(
    (dateIndex, chunkIndex) => () => {
      if (draggingItemId) {
        onSetDraggingPos({
          x: dateIndex,
          y: 0,
          chunkIndex,
        });
      }
    },
    [onSetDraggingPos, draggingItemId],
  );
  const onDragUp = useCallback(
    (date: Dayjs) => (e: any) => {
      if (draggingItemId) {
        onItemDragEndWithDate(date);
        e.stopPropagation();
      }
    },
    [onItemDragEndWithDate, draggingItemId],
  );
  const onDragDown = useCallback(
    (date: Dayjs) => (e: any) => {
      if (e.button === 0) {
        setNewItemDate(date);
      }
      e.stopPropagation();
    },
    [],
  );
  const onMove = useCallback(
    (chunkIndex: number, dateIndex: number) => (e: any) => {
      // ! this is the task move, so moving the task
      if (copyItemInfo) {
        const diffDays =
          7 * chunkIndex +
          dateIndex -
          (7 * copyItemInfo.chunkIndex + copyItemInfo.x);
        moveItem(copyItemInfo.id, diffDays, copyItemInfo.type);
      }
      onDroppedModalClose();
      e.stopPropagation();
    },
    [moveItem, onDroppedModalClose, copyItemInfo],
  );
  const onCopy = useCallback(
    (chunkIndex: number, dateIndex: number) => (e: any) => {
      // ! this is the task copy, so copying the task
      if (copyItemInfo) {
        const diffDays =
          7 * (chunkIndex - copyItemInfo.chunkIndex) +
          dateIndex -
          copyItemInfo.x;

        copyItem(copyItemInfo.id, diffDays, copyItemInfo.type);
      }
      onDroppedModalClose();
      e.stopPropagation();
    },
    [onDroppedModalClose, copyItem, copyItemInfo],
  );
  const scheduleNew = useCallback(
    (date: Dayjs) => () => {
      setNewItemDate(undefined);
      onScheduleNew(date);
    },
    [onScheduleNew],
  );
  const taskNew = useCallback(
    (date: Dayjs) => () => {
      setNewItemDate(undefined);
      onTaskNew(date);
    },
    [onTaskNew],
  );

  return (
    <div
      onWheel={onWheel}
      onBlur={onEndDrag}
      className={`flex-auto flex border-r z-50`}
    >
      <div className={'relative p-0 w-full'}>
        <div
          onMouseUp={onEndDrag}
          className={'grid grid-cols-7 w-full pt-4px body2'}
        >
          {weekDaysList.map((val, index) => (
            <div
              key={val}
              className={`${
                val === 0
                  ? 'text-secondary'
                  : val === 6
                  ? 'text-primary'
                  : 'opacity-40'
              } flex items-center justify-center select-none`}
            >
              {WEEKDAYS_JP[val]}
            </div>
          ))}
        </div>
        <div className="relative w-full pb-24px">
          <div
            className={
              'absolute grid grid-cols-7 py-4px -top-26px bottom-0 left-0 right-0 body2'
            }
          >
            {[0, 1, 2, 3, 4, 5, 6].map((val) => (
              <div
                key={`cell-border-${val}`}
                className={`flex-1 ${val === 0 ? '' : 'border-l'}`}
              />
            ))}
          </div>
          {dayArrPerWeek.length === 0
            ? null
            : dayArrPerWeek.map((chunkDateArray, chunkIndex) => {
                const currentWeekSchedules = schedulesPerWeek[chunkIndex] ?? [];

                let maxCurrentScheduleCount = 0;
                let maxDayWithSchedulesIndex = -1;
                currentWeekSchedules.forEach((schedule) => {
                  if (maxCurrentScheduleCount < schedule.y + 1) {
                    maxCurrentScheduleCount = schedule.y + 1;
                  }
                  let tempLastDayIndex = schedule.x + schedule.length - 1;
                  tempLastDayIndex =
                    tempLastDayIndex >= 6 ? 6 : tempLastDayIndex;
                  maxDayWithSchedulesIndex =
                    tempLastDayIndex > maxDayWithSchedulesIndex
                      ? tempLastDayIndex
                      : maxDayWithSchedulesIndex;
                });
                maxCurrentScheduleCount = Math.min(
                  maxCurrentScheduleCount,
                  maxCount,
                );

                const currentScheduleRowArray =
                  maxCurrentScheduleCount > 0
                    ? Array.apply(null, Array(maxCurrentScheduleCount))
                    : [];

                const maxCurrentTaskCount = maxCount - maxCurrentScheduleCount;
                const currentTaskRowArray =
                  maxCurrentTaskCount > 0
                    ? Array.apply(null, Array(maxCurrentTaskCount))
                    : [];
                const currentWeekTasks = tasksPerWeek[chunkIndex] ?? [];
                // ! minus top margin index for tasks - at the right side of the row
                let dayIndexWithEmptySchedules = maxDayWithSchedulesIndex + 1;
                if (dayIndexWithEmptySchedules > 6) {
                } else {
                  while (dayIndexWithEmptySchedules < 7) {
                    const noLongTasks =
                      currentWeekTasks.filter(
                        (task) =>
                          task.x < dayIndexWithEmptySchedules &&
                          task.x + task.length - 1 >=
                            dayIndexWithEmptySchedules,
                      ).length == 0;
                    if (noLongTasks) break;
                    dayIndexWithEmptySchedules += 1;
                  }
                }

                return (
                  <div className="relative" key={`week-render-${chunkIndex}`}>
                    <div
                      onMouseUp={onEndDrag}
                      className={`w-full grid grid-cols-7 ${
                        chunkIndex === 0 ? '' : 'border-t'
                      }`}
                    >
                      {chunkDateArray.map((dayItem) => {
                        return (
                          <div
                            className="py-2px flex-none flex justify-center z-20"
                            key={`calendar-date-label-${dayItem.format(
                              'YYYYMMDD',
                            )}`}
                            onClick={onDayLabelContainer(dayItem)}
                          >
                            <div
                              className={`flex flex-col items-center justify-center h-35px w-35px select-none cursor-pointer`}
                              onClick={onDay(dayItem)}
                            >
                              <div
                                className={`flex-none w-6 h-6 rounded-full ${
                                  dayItem.month() === activeMonth ||
                                  viewMode !== 'month'
                                    ? 'body1 opacity-90'
                                    : 'body1 opacity-30'
                                }  caption2-en ${
                                  dayItem.format('YYYYMMDD') ===
                                  currentDate.format('YYYYMMDD')
                                    ? 'bg-primary text-backgroundSecondary'
                                    : dayItem.format('YYYYMMDD') ===
                                      today.format('YYYYMMDD')
                                    ? 'bg-primarySelected text-fontPrimary'
                                    : dayItem.day() === 0
                                    ? 'text-secondary'
                                    : dayItem.day() === 6
                                    ? 'hover:bg-primaryHovered text-primary'
                                    : 'hover:bg-primaryHovered'
                                } flex flex-row items-center justify-center
                                `}
                              >
                                <span>{dayItem.format('D')}</span>
                              </div>
                              {holidayDict[dayItem.format('M-D')] !=
                              undefined ? (
                                <div
                                  className={`line-clamp-1 caption3 text-secondary truncate ${
                                    holidayDisplay
                                      ? 'overflow-visible'
                                      : 'invisible'
                                  } holidayLabel`}
                                >
                                  {holidayDict[dayItem.format('M-D')]}
                                </div>
                              ) : (
                                <div className="h-24px" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {(() => {
                      if (draggingItemInfo[chunkIndex]) {
                        // @ts-ignore
                        const currentItem: CalendarRenderItem =
                          draggingItemInfo[chunkIndex];
                        const weekLength = Math.min(
                          7 - currentItem.x,
                          currentItem.length,
                        );
                        const marginLeft =
                          currentItem.x * (width + 2 * PADDING + 1) +
                          (currentItem.hasLeft ? 0 : PADDING);
                        const itemWidth =
                          (width + 2 * PADDING) * weekLength +
                          (weekLength - 1) * 1 -
                          (currentItem.hasLeft ? 0 : PADDING) -
                          (currentItem.hasRight ? 0 : PADDING);

                        return (
                          <div className="absolute top-0 mt-40px w-full h-20px body2 text-fontPrimary">
                            <div
                              style={{
                                marginLeft: `${marginLeft}px`,
                                width: `${itemWidth}px`,
                              }}
                              className={`p-2px h-full rounded-1px bg-${
                                currentItem.bgColor
                                  ? `${currentItem.bgColor} flex flex-row items-center bg-opacity-50`
                                  : `${
                                      currentItem.type ? 'blueOp3' : 'yellowOp3'
                                    }`
                              } ${droppedDate !== '' ? '' : `opacity-50`}`}
                            >
                              {currentItem.type ? (
                                currentItem.title
                              ) : (
                                <>
                                  {currentItem.desc && (
                                    <span className="ml-4px ">
                                      {currentItem.desc}
                                    </span>
                                  )}
                                  <span className="ml-4px truncate">
                                    {currentItem.title}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      } else {
                        return null;
                      }
                    })()}
                    {maxCurrentScheduleCount > 0 &&
                      currentScheduleRowArray.map((_, index) => {
                        const currentSchedules = currentWeekSchedules
                          .filter((scheduleItem) => scheduleItem.y === index)
                          .sort((a, b) => a.x - b.x);
                        let lastXPos = 0;

                        return (
                          <div
                            className="my-2px h-20px w-full body2 text-fontPrimary flex items-center"
                            key={`week-${chunkIndex}-row-container-${index}`}
                          >
                            {currentSchedules.length > 0 &&
                              currentSchedules.map((schedule) => {
                                const weekLength = Math.min(
                                  7 - schedule.x,
                                  schedule.length,
                                );
                                const leftPos = lastXPos;
                                const marginLeft =
                                  (schedule.x - leftPos) *
                                    (width + 2 * PADDING + 1) +
                                  (schedule.hasLeft ? 0 : PADDING) +
                                  (leftPos === 0 ? 0 : PADDING + 1);
                                const itemWidth =
                                  (width + 2 * PADDING) * weekLength +
                                  (weekLength - 1) * 1 -
                                  (schedule.hasLeft ? 0 : PADDING) -
                                  (schedule.hasRight ? 0 : PADDING);

                                lastXPos = schedule.x + weekLength;
                                return schedule.type ? (
                                  <TaskItem
                                    title={schedule.title}
                                    marginTop={
                                      schedule.x >= dayIndexWithEmptySchedules
                                        ? -42 * maxCurrentScheduleCount
                                        : 0
                                    }
                                    marginLeft={marginLeft}
                                    itemWidth={itemWidth}
                                    completed={
                                      schedule.completed ? true : false
                                    }
                                    isDraggingItem={
                                      schedule.id === draggingItemId
                                    }
                                    bgColor={schedule.bgColor}
                                    onClick={onTask(schedule)}
                                    onContextMenu={onTaskContext(
                                      schedule,
                                      maxCurrentTaskCount,
                                      index,
                                      chunkIndex,
                                    )}
                                    onCompleteIncomplete={onCompleteIncomplete(
                                      schedule.id,
                                      schedule.completed ? 1 : 0,
                                    )}
                                    onMouseDown={onTaskScheduleDown(schedule)}
                                    onPreventPropagate={onPreventPropagate}
                                    key={`task-${
                                      schedule.id
                                    }-part-of-${chunkIndex}th-week-user-${
                                      schedule.userId ?? 0
                                    }`}
                                  />
                                ) : (
                                  <ScheduleItem
                                    title={schedule.title}
                                    desc={schedule.desc}
                                    bgColor={schedule.bgColor}
                                    isInactive={schedule.isInactive}
                                    isDraggingItem={
                                      schedule.id === draggingItemId
                                    }
                                    marginLeft={marginLeft}
                                    isNotOneDay={
                                      schedule.length > 1 || schedule.hasLeft
                                    }
                                    itemWidth={itemWidth}
                                    onClick={onSchedule(schedule)}
                                    onContextMenu={onScheduleContext(
                                      schedule,
                                      currentScheduleRowArray,
                                      index,
                                      chunkIndex,
                                    )}
                                    onMouseDown={onTaskScheduleDown(schedule)}
                                    key={`schedule-${schedule.id}-part-of-${chunkIndex}th-week-user-${schedule.userId}`}
                                  />
                                );
                              })}
                          </div>
                        );
                      })}
                    <div
                      className={`absolute p-2 rounded-6px border-1/2 border-separator bg-backgroundSecondary text-fontPrimary body2 shadow-md cursor-pointer
                      hover:bg-backgroundPrimary 
                      focus:outline-none z-50 ${
                        delMenuInfo?.chunkIndex === chunkIndex
                          ? 'visible'
                          : 'invisible'
                      } delMenu`}
                      style={{
                        left: delMenuInfo?.x ?? 0,
                        bottom:
                          20 *
                          ((delMenuInfo?.subIndex ?? 0) -
                            2 +
                            (delMenuInfo?.type === 'schedule'
                              ? maxCurrentTaskCount
                              : 0)),
                        width: (width * 4) / 5,
                      }}
                      onClick={onDel}
                      onBlur={onDelBlur}
                      tabIndex={-1}
                    >
                      削除
                    </div>
                    {maxCurrentTaskCount > 0 &&
                      currentTaskRowArray.map((_, index) => {
                        const currentTasks = currentWeekTasks
                          .filter((taskItem) => taskItem.y === index)
                          .sort((a, b) => a.x - b.x);
                        let lastXPos = 0;

                        return (
                          <div
                            className="my-2px h-20px w-full body2 text-fontPrimary flex items-center"
                            key={`week-${chunkIndex}-row-container-${index}`}
                          >
                            {currentTasks.length > 0 &&
                              currentTasks.map((task) => {
                                const weekLength = Math.min(
                                  7 - task.x,
                                  task.length,
                                );
                                const leftPos = lastXPos;
                                const marginLeft =
                                  (task.x - leftPos) *
                                    (width + 2 * PADDING + 1) +
                                  (task.hasLeft ? 0 : PADDING) +
                                  (leftPos === 0 ? 0 : PADDING + 1);
                                const itemWidth =
                                  (width + 2 * PADDING) * weekLength +
                                  (weekLength - 1) * 1 -
                                  (task.hasLeft ? 0 : PADDING) -
                                  (task.hasRight ? 0 : PADDING);

                                lastXPos = task.x + weekLength;
                                return task.type ? (
                                  <TaskItem
                                    title={task.title}
                                    marginTop={
                                      task.x >= dayIndexWithEmptySchedules
                                        ? -42 * maxCurrentScheduleCount
                                        : 0
                                    }
                                    marginLeft={marginLeft}
                                    itemWidth={itemWidth}
                                    completed={task.completed ? true : false}
                                    isDraggingItem={task.id === draggingItemId}
                                    bgColor={task.bgColor}
                                    onClick={onTask(task)}
                                    onContextMenu={onTaskContext(
                                      task,
                                      maxCurrentTaskCount,
                                      index,
                                      chunkIndex,
                                    )}
                                    onCompleteIncomplete={onCompleteIncomplete(
                                      task.id,
                                      task.completed ? 1 : 0,
                                    )}
                                    onMouseDown={onTaskScheduleDown(task)}
                                    onPreventPropagate={onPreventPropagate}
                                    key={`task-${
                                      task.id
                                    }-part-of-${chunkIndex}th-week-user-${
                                      task.userId ?? 0
                                    }`}
                                  />
                                ) : (
                                  <ScheduleItem
                                    title={task.title}
                                    desc={task.desc}
                                    bgColor={task.bgColor}
                                    isInactive={task.isInactive}
                                    isDraggingItem={task.id === draggingItemId}
                                    marginLeft={marginLeft}
                                    itemWidth={itemWidth}
                                    onClick={onSchedule(task)}
                                    onContextMenu={onScheduleContext(
                                      task,
                                      currentScheduleRowArray,
                                      index,
                                      chunkIndex,
                                    )}
                                    onMouseDown={onTaskScheduleDown(task)}
                                    key={`schedule-${task.id}-part-of-${chunkIndex}th-week-user-${task.userId}`}
                                  />
                                );
                              })}
                          </div>
                        );
                      })}
                    <div
                      className="margin-addon"
                      style={{
                        height: Math.floor(height - 41 - maxCount * 22),
                      }}
                    />
                    <div className="absolute top-0 grid grid-cols-7 w-full h-full">
                      {chunkDateArray.map((date, dateIndex) => (
                        <div
                          onMouseOver={onDragOver(dateIndex, chunkIndex)}
                          onMouseUp={onDragUp(date)}
                          onMouseDown={onDragDown(date)}
                          className={`w-full relative`}
                          key={`droppable-date-${date.format('YYYYMMDD')}`}
                        >
                          <div className="absolute top-16 w-full h-full">
                            {droppedDate === date.format('YYYYMMDD') && (
                              <>
                                <div
                                  ref={copyMenuRef}
                                  className="absolute mt-4px p-12px w-200px rounded-8px bg-backgroundSecondary body3 text-fontPrimary focus:outline-none shadow-menu z-50"
                                  tabIndex={-1}
                                  onBlur={onCopyMenuBlur}
                                >
                                  <div
                                    onMouseDown={onMove(chunkIndex, dateIndex)}
                                    className="p-12px rounded-6px hover:bg-backgroundPrimary cursor-pointer z-60"
                                  >
                                    移動
                                  </div>
                                  <div
                                    onMouseDown={onCopy(chunkIndex, dateIndex)}
                                    className="p-12px rounded-6px hover:bg-backgroundPrimary cursor-pointer z-60"
                                  >
                                    コピー
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                          <div
                            className={`pt-12px min-h-full body2 text-fontPrimary flex flex-col items-center ${
                              magnifiedDate === date.format('YYYYMMDD')
                                ? `${
                                    chunkIndex ? 'abs-xy-center' : 'abs-center'
                                  } p-4px w-220px max-h-48 rounded-8px border-1/2 border-separator shadow-menu bg-backgroundSecondary z-100 overflow-y-auto`
                                : 'z-30'
                            } ${
                              draggingItemId
                                ? 'hover:bg-backgroundPrimary hover:bg-opacity-50 '
                                : ''
                            }`}
                          >
                            {(() => {
                              const currentDaySchedules =
                                currentWeekSchedules.filter(
                                  (schedule) =>
                                    schedule.x <= dateIndex &&
                                    schedule.x + schedule.length - 1 >=
                                      dateIndex,
                                );

                              const currentDayTasks = currentWeekTasks.filter(
                                (task) =>
                                  task.x <= dateIndex &&
                                  task.x + task.length - 1 >= dateIndex,
                              );

                              // count of schedule not displayed
                              const schedulesNotDisplayed =
                                currentWeekSchedules.filter(
                                  (schedule) =>
                                    schedule.x <= dateIndex &&
                                    schedule.x + schedule.length - 1 >=
                                      dateIndex &&
                                    schedule.y >=
                                      currentScheduleRowArray.length,
                                );
                              const tasksNotDisplayed = currentWeekTasks.filter(
                                (task) =>
                                  task.x <= dateIndex &&
                                  task.x + task.length - 1 >= dateIndex &&
                                  task.y >= currentTaskRowArray.length,
                              );
                              const notDisplayedCount =
                                schedulesNotDisplayed.length +
                                tasksNotDisplayed.length;

                              return (
                                <>
                                  {magnifiedDate ===
                                    date.format('YYYYMMDD') && (
                                    <div
                                      className="flex-1 w-full h-full flex flex-col items-center focus:outline-none magnifiedBox z-20"
                                      // onBlur={onMagnifyBlur}
                                      tabIndex={-1}
                                    >
                                      <CloseIcon
                                        width={18}
                                        height={18}
                                        onClick={onMagnifyBlur}
                                        className="absolute right-2 top-2"
                                      />
                                      <div className="body1">
                                        {date.format('D')}
                                      </div>

                                      {currentDaySchedules.map((task) =>
                                        task.type ? (
                                          <TaskItem
                                            title={task.title}
                                            marginTop={
                                              task.x >=
                                              dayIndexWithEmptySchedules
                                                ? -42 * maxCurrentScheduleCount
                                                : 0
                                            }
                                            marginLeft={0}
                                            itemWidth={width}
                                            completed={
                                              task.completed ? true : false
                                            }
                                            isDraggingItem={
                                              task.id === draggingItemId
                                            }
                                            bgColor={task.bgColor}
                                            onClick={onTask(task)}
                                            onContextMenu={() => {}}
                                            onCompleteIncomplete={onCompleteIncomplete(
                                              task.id,
                                              task.completed ? 1 : 0,
                                            )}
                                            onMouseDown={onTaskScheduleDown(
                                              task,
                                            )}
                                            onPreventPropagate={
                                              onPreventPropagate
                                            }
                                            key={`schedule-magnified-${
                                              task.id
                                            }-part-of-${chunkIndex}th-week-user-${
                                              task.userId ?? 0
                                            }`}
                                          />
                                        ) : (
                                          <ScheduleItem
                                            title={task.title}
                                            desc={task.desc}
                                            bgColor={task.bgColor}
                                            isInactive={task.isInactive}
                                            isDraggingItem={
                                              task.id === draggingItemId
                                            }
                                            marginLeft={0}
                                            itemWidth={width}
                                            onClick={onSchedule(task)}
                                            onContextMenu={() => {}}
                                            onMouseDown={onTaskScheduleDown(
                                              task,
                                            )}
                                            key={`schedule-${task.id}-part-of-${chunkIndex}th-week-user-${task.userId}`}
                                          />
                                        ),
                                      )}
                                      {currentDayTasks.map((task) =>
                                        task.type ? (
                                          <TaskItem
                                            title={task.title}
                                            marginTop={
                                              task.x >=
                                              dayIndexWithEmptySchedules
                                                ? -42 * maxCurrentScheduleCount
                                                : 0
                                            }
                                            marginLeft={0}
                                            itemWidth={width}
                                            completed={
                                              task.completed ? true : false
                                            }
                                            isDraggingItem={
                                              task.id === draggingItemId
                                            }
                                            bgColor={task.bgColor}
                                            onClick={onTask(task)}
                                            onContextMenu={() => {}}
                                            onCompleteIncomplete={onCompleteIncomplete(
                                              task.id,
                                              task.completed ? 1 : 0,
                                            )}
                                            onMouseDown={onTaskScheduleDown(
                                              task,
                                            )}
                                            onPreventPropagate={
                                              onPreventPropagate
                                            }
                                            key={`schedule-magnified-${
                                              task.id
                                            }-part-of-${chunkIndex}th-week-user-${
                                              task.userId ?? 0
                                            }`}
                                          />
                                        ) : (
                                          <ScheduleItem
                                            title={task.title}
                                            desc={task.desc}
                                            bgColor={task.bgColor}
                                            isInactive={task.isInactive}
                                            isDraggingItem={
                                              task.id === draggingItemId
                                            }
                                            marginLeft={0}
                                            itemWidth={width}
                                            onClick={onSchedule(task)}
                                            onContextMenu={() => {}}
                                            onMouseDown={onTaskScheduleDown(
                                              task,
                                            )}
                                            key={`schedule-${task.id}-part-of-${chunkIndex}th-week-user-${task.userId}`}
                                          />
                                        ),
                                      )}
                                    </div>
                                  )}
                                  {newItemDate &&
                                    magnifiedDate === '' &&
                                    newItemDate?.format('YYYYMMDD') ===
                                      date.format('YYYYMMDD') && (
                                      <div
                                        ref={newItemMenuRef}
                                        onBlur={onCopyMenuBlur}
                                        className={`w-full absolute mt-7 rounded-1px bg-overlayWeb2 caption2-light text-fontPrimary focus:outline-none z-50 ${
                                          newItemDate == undefined
                                            ? 'hidden'
                                            : ''
                                        }`}
                                        tabIndex={-1}
                                      >
                                        <span className="invisible">予定</span>
                                        <div
                                          className="absolute px-12px py-4px rounded-8px border-1/2 border-separator bg-backgroundSecondary body1 shadow-menu z-30 cursor-pointer"
                                          style={{
                                            width: width * 1.1,
                                            minWidth: '140px',
                                          }}
                                        >
                                          <div
                                            className="px-12px py-8px rounded-6px hover:bg-primarySelected"
                                            onClick={scheduleNew(date)}
                                          >
                                            スケジュール
                                          </div>
                                          <div
                                            className="px-12px py-8px rounded-6px hover:bg-primarySelected"
                                            onClick={taskNew(date)}
                                          >
                                            タスク
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  {notDisplayedCount > 0 && (
                                    <div
                                      className={`absolute right-1 py-3/2px px-1 z-50 bg-separator cursor-pointer
                                      ${
                                        magnifiedDate ===
                                        date.format('YYYYMMDD')
                                          ? 'hidden'
                                          : ''
                                      }
                                      `}
                                      style={{
                                        bottom: Math.floor(
                                          height - 39 - maxCount * 22,
                                        ),
                                      }}
                                      onClick={onMagnifyDay(date)}
                                    >
                                      {`他${notDisplayedCount}件`}
                                    </div>
                                  )}
                                </>
                              );
                            })()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
        </div>
        {detailBarStatus ? (
          <div
            className={'absolute bottom-0 right-2 select-none cursor-pointer'}
          >
            <div
              onClick={onShowStatusBar}
              className={`ml-1 mb-2 w-32px h-32px ${'show'} rounded-full bg-secondary flex flex-col justify-center items-center cursor-pointer hover:bg-primarySelected `}
            >
              <ArrowLeftIcon width={8} height={8} />
            </div>
          </div>
        ) : (
          <div
            className={
              'absolute bottom-8 right-24px select-none cursor-pointer z-100 opacity-90'
            }
          >
            <div
              className={
                'flex items-center justify-center h-44px w-44px bg-backgroundPrimary rounded-8px tooltip'
              }
              onClick={onExpandIcon}
            >
              {expanded ? (
                <CollapseIcon width={20} height={20} />
              ) : (
                <ExpandIcon width={20} height={20} />
              )}
              <span className="absolute top-full mt-1 px-2 py-1 w-20 rounded-2px bg-fontSecondary body3 text-backgroundSecondary text-center z-50 tooltiptext">
                {expanded ? '開く' : '閉じる'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Panel;

const ScheduleItem = ({
  title,
  desc,
  bgColor,
  isInactive,
  isDraggingItem,
  marginLeft,
  itemWidth,
  isNotOneDay,
  onClick,
  onContextMenu,
  onMouseDown,
}: {
  title: string;
  desc?: string;
  bgColor?: string;
  isInactive?: boolean;
  isDraggingItem?: boolean;
  marginLeft: number;
  itemWidth: number;
  isNotOneDay?: boolean;
  onClick: () => void;
  onContextMenu: (e: any) => void;
  onMouseDown: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      onContextMenu={onContextMenu}
      onMouseDown={onMouseDown}
      style={{
        marginLeft: `${marginLeft}px`,
        width: `${itemWidth}px`,
      }}
      className={`p-2px h-full rounded-1px z-30 select-none flex items-center cursor-pointer overflow-hidden text-fontPrimary bg-${
        isNotOneDay ? bgColor ?? 'yellow' : ''
      }
      ${
        !isNotOneDay
          ? ''
          : isInactive
          ? 'bg-opacity-60'
          : isDraggingItem
          ? 'bg-opacity-50'
          : ''
      } 
      ${isInactive ? 'opacity-60' : ''} ${isDraggingItem ? 'opacity-50' : ''}`}
    >
      {isNotOneDay ? null : (
        <span
          className={`w-2 h-2 rounded-full bg-${bgColor ?? 'yellow'} flex-none`}
        />
      )}
      {desc && (
        <span
          className={`ml-4px ${isNotOneDay ? 'text-backgroundSecondary' : ''}`}
        >
          {desc}
        </span>
      )}
      <span
        className={`ml-4px truncate ${
          isNotOneDay ? 'text-backgroundSecondary' : ''
        }`}
      >
        {title}
      </span>
    </div>
  );
};

const TaskItem = ({
  title,
  bgColor,
  marginTop,
  marginLeft,
  itemWidth,
  completed,
  isDraggingItem,
  onClick,
  onContextMenu,
  onMouseDown,
  onCompleteIncomplete,
  onPreventPropagate,
}: {
  title: string;
  bgColor?: string;
  marginTop: number;
  marginLeft: number;
  itemWidth: number;
  completed: boolean;
  isDraggingItem: boolean;
  onClick: (e: any) => void;
  onContextMenu: (e: any) => void;
  onMouseDown: () => void;
  onCompleteIncomplete: (e: any) => void;
  onPreventPropagate: (e: any) => void;
}) => {
  return (
    <div
      onClick={onClick}
      onContextMenu={onContextMenu}
      onMouseDown={onMouseDown}
      style={{
        marginTop,
        marginLeft: `${marginLeft}px`,
        width: `${itemWidth}px`,
      }}
      className={`p-2px h-full rounded-1px z-30 truncate select-none flex items-center cursor-pointer relative ${
        isDraggingItem ? 'opacity-50' : ''
      } ${completed ? 'opacity-60' : ''} `}
    >
      {completed ? (
        <CheckedIcon
          width={14}
          height={14}
          onMouseDown={onCompleteIncomplete}
          onClick={onPreventPropagate}
          className={`text-${bgColor ?? 'primary'} flex-none`}
        />
      ) : (
        <UncheckedIcon
          width={14}
          height={14}
          onMouseDown={onCompleteIncomplete}
          onClick={onPreventPropagate}
          className={`text-${bgColor ?? 'primary'} flex-none`}
        />
      )}
      <span className={`ml-4px truncate`}>{title}</span>
    </div>
  );
};
