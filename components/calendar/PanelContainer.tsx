import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs, { Dayjs } from 'dayjs';
import { useRouter } from 'next/router';
// * hooks
import {
  copyItemInfoSelector,
  detailBarStatusSelector,
  draggingItemSelector,
  droppedDateSelector,
  magnifiedDateSelector,
  scheduleListsToHideSelector,
  taskListsToHideSelector,
  tasksToggleSelector,
} from '@store/selectors/calendar';
import { userInfoSelector } from '@store/selectors/user';
import {
  setScheduleModalStatus,
  setTaskModalStatus,
} from '@store/modules/home';
import { setCurrentTask, setTaskID } from '@store/modules/tasks';
import { setCurrentSchedule, setScheduleID } from '@store/modules/schedules';
import {
  prev,
  next,
  setCopyItem,
  setCurrentDate,
  setDraggingItemId,
  setDroppedDate,
  setMagnifiedDate,
  setNewTaskSchedule,
  setUserIDSelected,
  toggleFullscreen,
  toggleDetailBar,
} from '@store/modules/calendar';
import { useToday } from '@service/hooks/useSchedules';
import {
  useCompleteTask,
  useTaskCopyMutation,
  useTaskDeleteWithID,
} from '@service/taskMutation';
import {
  useScheduleCopyMutation,
  useScheduleDelete,
  useScheduleDeltaUpdateMutation,
} from '@service/scheduleMutation';
import { membersSelector } from '@store/selectors/collabos';
// * components
import Panel from './Panel';
// * utils
import {
  CalendarRenderItem,
  CalendarRenderItemExtended,
} from '@model/calendar';
import { COLOR_VALUES } from '@util/constants';
import { replaceState } from '@util/replaceUrl';
import { SCHEDULE_ADD_URL, TASK_ADD_URL } from '@util/urls';
import {
  convertDayjsToTimeFormat,
  getDateRangeForCalendarNew,
  getDayArr,
} from '@util/calendar';

const PanelContainer = ({
  calendarFilter,
  viewMode,
  calendarDate,
  currentDate,
  expanded,
  holidays,
  tasksForCalendar,
  schedulesForCalendar,
  isSidebarOpen,
  calendarUsers,
}: {
  calendarFilter: string;
  viewMode: 'month' | 'weeks4' | 'weeks2' | 'half' | 'week';
  calendarDate: Dayjs;
  currentDate: Dayjs;
  expanded: boolean;
  holidays: Array<{
    id: string;
    date: string;
    summary: string;
    eventType: string;
  }>;
  tasksForCalendar: any[];
  schedulesForCalendar: any[];
  isSidebarOpen: boolean;
  calendarUsers: number[];
}) => {
  const draggingItemId = useSelector(draggingItemSelector);
  const droppedDate = useSelector(droppedDateSelector);
  const copyItemInfo = useSelector(copyItemInfoSelector);
  const magnifiedDate = useSelector(magnifiedDateSelector);
  const detailBarStatus = useSelector(detailBarStatusSelector);
  const today = useToday();
  const { user } = useSelector(userInfoSelector);
  const timeMode24: boolean = useMemo(() => {
    if (user?.time_display) {
      return user?.time_display == 2;
    } else {
      return false;
    }
  }, [user]);
  const holidayDisplay: boolean = useMemo(() => {
    return user?.holiday_display == 1;
  }, [user]);
  const members = useSelector(membersSelector);

  const dateRange = useMemo(() => {
    let fromDate = calendarDate.clone();
    fromDate =
      fromDate.date() > 1
        ? fromDate.add(1, 'day')
        : fromDate.subtract(6, 'day');

    return getDateRangeForCalendarNew(
      viewMode,
      calendarDate.clone(),
      user?.week_start,
    );
  }, [viewMode, calendarDate, user]);
  const holidayDict = useMemo(() => {
    const resultDict: {
      [key: string]: string;
    } = {};
    if (holidays.length !== 0) {
      const fromMonth = dayjs(dateRange.from_date).month();
      const toMonth = dayjs(dateRange.to_date).month();
      holidays.forEach((holiday) => {
        const holidayDate = holiday.date;
        const currentMonth = parseInt(holidayDate.split('-')[0]) - 1;
        if (currentMonth >= fromMonth && currentMonth <= toMonth) {
          resultDict[holidayDate] = holiday.summary;
        }
      });
    }
    return resultDict;
  }, [holidays, dateRange]);
  const { mutate: completeMutate, isLoading: isCompleteLoading } =
    useCompleteTask();
  const onCompleteIncomplete = useCallback(
    (taskId: number, completed: 0 | 1) => (e: any) => {
      e.stopPropagation();
      e.preventDefault();
      if (isCompleteLoading) {
      } else {
        completeMutate({
          id: taskId,
          completed: 1 - completed,
        });
      }
    },
    [completeMutate, isCompleteLoading],
  );
  const onPreventPropagate = useCallback((e: any) => {
    e.stopPropagation();
  }, []);

  const scheduleListsToHide = useSelector(scheduleListsToHideSelector);
  const taskListsToHide = useSelector(taskListsToHideSelector);

  const toggleTasksStatus = useSelector(tasksToggleSelector);
  // ! fetching data
  const dispatch = useDispatch();
  // useEffect(() => {
  //   if (user?.id) dispatch(setCodisplayUsers([user.id]));
  // }, [dispatch, user]);

  // ! render calendar panel
  const [schedulesPerWeek, setSchedulesPerWeek] = useState<
    Array<CalendarRenderItem[]>
  >([]);

  useEffect(() => {
    let initDate = dayjs(dateRange.from_date).hour(0).second(0).millisecond(0);
    const schedulesRenderInfo: Array<CalendarRenderItem[]> = [];
    let currentWeekRenderInfo: CalendarRenderItem[] = [];

    const todayStart = dayjs().hour(0).minute(0).second(0).millisecond(0);
    const todayEnd = dayjs().hour(23).minute(59).second(59).millisecond(59);

    let listsToHide = scheduleListsToHide ?? [];
    const schedulesFiltered = schedulesForCalendar.filter(
      (_) => !listsToHide.includes(_.list_id),
    );
    listsToHide = taskListsToHide ?? [];
    let tasksFiltered = tasksForCalendar.filter(
      (_) => !listsToHide.includes(_.list_id),
    );
    const colorsDict: any = {};
    members.forEach((member) => {
      colorsDict[member.id] = member.pivot?.color ?? 4;
    });

    for (let i = 0; i < dateRange.daysCount; i += 1) {
      if (i > 0 && i % 7 === 0) {
        schedulesRenderInfo.push(currentWeekRenderInfo);
        const priorWeekRenderInfo = currentWeekRenderInfo
          .filter((item) => item.hasRight)
          .sort((a, b) => -a.length + b.length);
        currentWeekRenderInfo = priorWeekRenderInfo.map((item, index) => {
          const newLength = item.length - (7 - item.x);
          return {
            ...item,
            x: 0,
            y: index,
            length: newLength,
            hasLeft: true,
            hasRight: newLength > 7,
          };
        });
      }
      const startDate = initDate.add(i, 'day');
      const endDate = startDate.add(1, 'day');
      const schedulesRender = schedulesFiltered.filter((schedule) => {
        const scheduleStartDate = dayjs(schedule.start_date);

        const scheduleEndDate = dayjs(schedule.end_date);
        return !(
          scheduleStartDate.isAfter(endDate) ||
          scheduleStartDate.isSame(endDate, 'second') ||
          scheduleEndDate.isBefore(startDate)
        );
      });
      if (calendarFilter === 'start_date')
        tasksFiltered = tasksFiltered.map((task) => {
          const taskStartDate = dayjs(task.start_date);
          const taskEndDate = dayjs(task.end_date);

          if (taskStartDate.isAfter(todayStart, 'day')) {
            return {
              ...task,
              end_date: task.start_date,
            };
          } else if (taskEndDate.isBefore(todayEnd, 'day')) {
            return {
              ...task,
              start_date: task.end_date,
            };
          } else {
            return {
              ...task,
              start_date: todayStart.valueOf(),
              end_date: todayEnd.valueOf(),
            };
          }
        });

      let tasksRender = tasksFiltered.filter((task) => {
        const taskStartDate = dayjs(task.start_date);
        const taskEndDate = dayjs(task.end_date);

        let criteriaResult =
          calendarFilter === 'start_date'
            ? !(
                taskStartDate.isAfter(endDate) ||
                taskStartDate.isSame(endDate, 'second') ||
                taskEndDate.isBefore(startDate)
              )
            : !(
                taskEndDate.isAfter(endDate) ||
                taskEndDate.isSame(endDate, 'second') ||
                taskEndDate.isBefore(startDate)
              );
        if (toggleTasksStatus.expired) {
          criteriaResult = criteriaResult && taskEndDate.isBefore(todayStart);
        }
        if (toggleTasksStatus.today) {
          const isToday =
            (taskStartDate.isBefore(todayStart) ||
              taskStartDate.isSame(todayStart, 'day')) &&
            (taskEndDate.isAfter(todayEnd) ||
              taskEndDate.isSame(todayEnd, 'day'));
          criteriaResult = criteriaResult && isToday;
        }

        return criteriaResult;
      });
      tasksRender.sort((a, b) => {
        const aDate = new Date(a.start_date);
        const bDate = new Date(b.start_date);
        return aDate.getTime() - bDate.getTime();
      });

      const isBeforeToday = endDate.isBefore(todayStart, 'day');
      const schedulesRenderID = schedulesRender.map((item) => item.id);
      const priorSchedulesList = currentWeekRenderInfo.filter((item) =>
        schedulesRenderID.includes(item.id),
      );
      const priorScheduleIDs = priorSchedulesList.map((item) => item.id);
      const priorYPosList = priorSchedulesList.map((item) => item.y);
      const remainedIDsList =
        schedulesRender.length > 0
          ? Array.apply(null, Array(schedulesRender.length))
              .map((_, i) => i)
              .filter((i) => !priorYPosList.includes(i))
          : [];
      const currentXPos = i % 7;
      let currentYPos = 0;
      const maxPriorIndex = Math.max(...priorYPosList);

      if (schedulesRender.length > 0 && remainedIDsList.length > 0) {
        schedulesRender.forEach((schedule) => {
          if (priorScheduleIDs.includes(schedule.id)) {
            return false;
          }
          currentYPos = remainedIDsList.shift() ?? currentYPos + 1;
          currentWeekRenderInfo.push({
            type: 0,
            id: schedule.id,
            title: schedule.title,
            desc:
              schedule.all_day === 1
                ? undefined
                : convertDayjsToTimeFormat(
                    dayjs(schedule.start_date),
                    timeMode24,
                  ),
            x: currentXPos,
            y: currentYPos,
            length: schedule.duration,
            hasLeft: false,
            hasRight: schedule.duration > 7 - currentXPos,
            bgColor:
              calendarUsers.length > 1 && schedule?.color != null
                ? COLOR_VALUES[schedule.color].label
                : schedule?.list.color != undefined
                ? COLOR_VALUES[schedule.list.color].label
                : undefined,
            userId: schedule?.pivot?.user_id ?? 0,
            isInactive: isBeforeToday,
          });
        });
      }

      currentYPos =
        priorYPosList.length == 0 && schedulesRender.length == 0
          ? 0
          : Math.max(maxPriorIndex + 1, currentYPos + 1);
      if (calendarFilter === 'start_date')
        tasksRender.forEach((task, index) => {
          const curColorIndex = colorsDict[task.pivot?.user_id] ?? 4;

          currentWeekRenderInfo.push({
            type: 1,
            id: task.id,
            title: task.title,
            x: currentXPos,
            y: currentYPos,
            length: 1,
            // length: calendarFilter === 'start_date' ? task.duration : 1,
            hasLeft: false,
            hasRight: false,
            bgColor:
              calendarUsers.length > 1
                ? COLOR_VALUES[curColorIndex].label
                : COLOR_VALUES[4].label,
            userId: task?.pivot?.user_id ?? 0,
            completed: task?.pivot?.completed ?? 0,
          });
          currentYPos++;
        });
      else
        tasksRender.forEach((task, index) => {
          currentWeekRenderInfo.push({
            type: 1,
            id: task.id,
            title: task.title,
            x: currentXPos,
            y: currentYPos,
            length: 1,
            // length: calendarFilter === 'start_date' ? task.duration : 1,
            hasLeft: false,
            hasRight: false,
            bgColor:
              calendarUsers.length > 1 && task?.color != null
                ? COLOR_VALUES[task.color].label
                : undefined,
            userId: task?.pivot?.user_id ?? 0,
            completed: task?.pivot?.completed ?? 0,
          });
          currentYPos++;
        });
    }
    // ! adding the last one week renderInfo
    schedulesRenderInfo.push(currentWeekRenderInfo);
    setSchedulesPerWeek(schedulesRenderInfo);
  }, [
    schedulesForCalendar,
    // calendarFilter,
    dateRange,
    timeMode24,
    calendarUsers,
    viewMode,
    scheduleListsToHide,
    calendarFilter,
    members,
    taskListsToHide,
    tasksForCalendar,
    toggleTasksStatus,
  ]);

  const [dayArr, setDayArr] = useState<Array<Dayjs[]>>([]);
  useEffect(() => {
    const { daysCount } = dateRange;
    let startDate: Dayjs;
    let totalDays: Dayjs[] = [];
    if (user?.week_start === 1 && calendarDate.date() === 1) {
      startDate = calendarDate.subtract(6, 'day');
      totalDays = getDayArr(startDate, daysCount + 7);
    } else {
      startDate =
        user?.week_start === 1
          ? calendarDate.add(1, 'day')
          : calendarDate.clone();
      totalDays = getDayArr(startDate, daysCount);
    }
    const resultDayArr: Array<Dayjs[]> = [];
    for (let i = 0; i < daysCount; i += 7) {
      const chunk = totalDays.slice(i, i + 7);
      resultDayArr.push(chunk);
    }
    setDayArr(resultDayArr);
  }, [dateRange, calendarDate, user?.week_start]);
  // ! dragging item render
  const currentDraggingItem: Array<CalendarRenderItemExtended> | [] =
    useMemo(() => {
      if (draggingItemId) {
        let currentItem: CalendarRenderItemExtended[] = [];

        for (let i = 0; i < schedulesPerWeek.length; i++) {
          const filtered = schedulesPerWeek[i].filter(
            (taskItem) => taskItem.id === draggingItemId,
          );
          if (filtered.length > 0) {
            currentItem.push({ ...filtered[0], chunkIndex: i });
            break;
          }
        }
        if (currentItem.length > 0) dispatch(setCopyItem(currentItem[0]));
        return currentItem;
      } else return [];
    }, [draggingItemId, schedulesPerWeek, dispatch]);

  // ! event handler
  const router = useRouter();
  const onDayLabelClick = useCallback(
    (date: Dayjs, isExpanded: boolean) => {
      dispatch(setCurrentDate(date));
      if (isExpanded) {
        dispatch(toggleFullscreen());
      }
    },
    [dispatch],
  );
  const onScheduleClick = useCallback(
    (id: number, userId: number) => {
      const currentUrl = router.asPath;
      localStorage.setItem('task3_background_url', currentUrl);
      replaceState(`/schedules/detail/${id}`);
      dispatch(setUserIDSelected(userId));
      dispatch(setScheduleID(id));
      dispatch(setScheduleModalStatus(true));
    },
    [dispatch, router.asPath],
  );
  const onTaskClick = useCallback(
    (id: number, userId: number) => {
      const currentUrl = router.asPath;
      localStorage.setItem('task3_background_url', currentUrl);
      replaceState(`/tasks/detail/${id}`);
      dispatch(setUserIDSelected(userId));
      dispatch(setTaskID(id));
      dispatch(setTaskModalStatus(true));
    },
    [dispatch, router.asPath],
  );
  const onContextDate = useCallback(
    (date: Dayjs) => {
      if (magnifiedDate !== date.format('YYYYMMDD')) {
        dispatch(setMagnifiedDate(date));
        setTimeout(() => {
          const magBox: HTMLElement | null =
            document.querySelector('.magnifiedBox');
          if (magBox) magBox.focus();
        }, 200);
      } else {
        dispatch(setMagnifiedDate(null));
      }
    },
    [dispatch, magnifiedDate],
  );
  const onMagnifiedClose = useCallback(() => {
    dispatch(setMagnifiedDate(null));
  }, [dispatch]);
  const onExpand = useCallback(() => {
    dispatch(toggleFullscreen());
  }, [dispatch]);
  const onShowStatusBar = useCallback(() => {
    dispatch(toggleDetailBar());
  }, [dispatch]);
  const onItemDragStart = useCallback(
    (itemId: number) => {
      dispatch(setDraggingItemId(itemId));
    },
    [dispatch],
  );

  const onItemDragEnd = useCallback(() => {
    dispatch(setDraggingItemId(0));
  }, [dispatch]);
  const onItemDragEndWithDate = useCallback(
    (date: Dayjs) => {
      dispatch(setDraggingItemId(0));
      dispatch(setDroppedDate(date.format('YYYYMMDD')));
    },
    [dispatch],
  );

  const onScheduleNew = useCallback(
    (date: Dayjs, hour?: number) => {
      dispatch(setNewTaskSchedule(null));
      // ! new schedule
      const currentUrl = router.asPath;
      localStorage.setItem('task3_background_url', currentUrl);
      replaceState(SCHEDULE_ADD_URL);
      dispatch(setScheduleID(-1));
      dispatch(
        setCurrentSchedule({
          date: date.valueOf(),
          hour,
        }),
      );
      dispatch(setScheduleModalStatus(true));
    },
    [dispatch, router.asPath],
  );
  const onTaskNew = useCallback(
    (date: Dayjs) => {
      dispatch(setNewTaskSchedule(null));
      // ! new task
      const currentUrl = router.asPath;
      localStorage.setItem('task3_background_url', currentUrl);
      replaceState(TASK_ADD_URL);
      dispatch(setTaskID(-1));
      dispatch(
        setCurrentTask({
          date,
        }),
      );
      dispatch(setTaskModalStatus(true));
    },
    [dispatch, router.asPath],
  );

  const [draggingItemInfo, setDraggingItemInfo] = useState<
    Array<CalendarRenderItem | undefined>
  >([]);
  const onSetDraggingPos = useCallback(
    ({ chunkIndex, x, y }: { chunkIndex: number; x: number; y: number }) => {
      if (currentDraggingItem.length === 0) {
        setDraggingItemInfo([]);
      } else if (
        currentDraggingItem[0].x === x &&
        currentDraggingItem[0].chunkIndex === chunkIndex
      ) {
        setDraggingItemInfo([]);
      } else {
        const currentItem = currentDraggingItem[0];
        let length = currentItem.length;
        const newArray: Array<CalendarRenderItem | undefined> = [];
        let initX = x;
        let initY = y;
        let initChunkIndex = chunkIndex;
        for (let i = 0; i < initChunkIndex; i++) {
          newArray.push(undefined);
        }

        while (initChunkIndex < dateRange.daysCount / 7 && length > 0) {
          const newDraggingInfo = {
            ...currentDraggingItem[0],
            x: initX,
            y: initY,
            length: Math.min(length, 7 - initX),
            chunkIndex: initChunkIndex,
          };
          newArray.push(newDraggingInfo);
          length -= Math.min(length, 7 - initX);
          initChunkIndex += 1;
          initX = 0;
        }

        setDraggingItemInfo(newArray);
      }
    },
    [currentDraggingItem, dateRange],
  );
  const onDroppedModalClose = useCallback(() => {
    dispatch(setDraggingItemId(0));
    setDraggingItemInfo([]);
    dispatch(setDroppedDate(''));
    dispatch(setCopyItem(undefined));
  }, [dispatch]);

  const taskDeleteMutation = useTaskDeleteWithID(() => {});
  const taskCopyMutation = useTaskCopyMutation((_: any) => {});
  const scheduleCopyMutation = useScheduleCopyMutation((_: any) => {});
  const { mutate: taskMoveMutate, isLoading: isTaskMoving } =
    useTaskCopyMutation((_: any) => {
      if (_ !== undefined && _.id !== undefined && _.id > 0) {
        taskDeleteMutation.mutate(_.id);
      }
    });

  const { mutate: scheduleDeltaUpdate, isLoading: isScheduleDeltaUpdating } =
    useScheduleDeltaUpdateMutation();
  const copyBetweenDays = useCallback(
    (id: number, diffDays: number, type: number) => {
      if (scheduleCopyMutation.isLoading || taskCopyMutation.isLoading)
        return false;
      // ! currently calendar fetch tasks and schedules have no attachments | cooperators info.
      // ! should ask to backend.
      const copyMutation = type === 0 ? scheduleCopyMutation : taskCopyMutation;
      copyMutation.mutate({
        id,
        delta: diffDays,
      });
      dispatch(setDroppedDate(''));
    },
    [dispatch, scheduleCopyMutation, taskCopyMutation],
  );
  const moveBetweenDays = useCallback(
    (id: number, diffDays: number, type: number) => {
      if (
        isTaskMoving ||
        taskDeleteMutation.isLoading ||
        isScheduleDeltaUpdating
      )
        return false;

      if (type === 0) {
        scheduleDeltaUpdate({
          id,
          delta: diffDays,
        });
      } else {
        taskMoveMutate({
          id,
          delta: diffDays,
        });
      }
      // const moveMutation = type === 0 ? scheduleMoveMutation : taskMoveMutation;
      // moveMutation.mutate({
      //   id,
      //   delta: diffDays,
      // });
      dispatch(setDroppedDate(''));
    },
    [
      taskDeleteMutation,
      taskMoveMutate,
      isTaskMoving,
      dispatch,
      scheduleDeltaUpdate,
      isScheduleDeltaUpdating,
    ],
  );

  const onPrev = useCallback(() => {
    dispatch(prev());
  }, [dispatch]);
  const onNext = useCallback(() => {
    dispatch(next());
  }, [dispatch]);

  // * task & schedule delete handler
  const deleteSchedule = useScheduleDelete();
  const deleteTask = useTaskDeleteWithID();
  const onDelete = useCallback(
    (id: number, type: 'schedule' | 'task') => {
      if (deleteSchedule.isLoading || deleteTask.isLoading) {
        return false;
      }
      if (type === 'schedule') {
        deleteSchedule.mutate(id);
      } else {
        deleteTask.mutate(id);
      }
    },
    [deleteSchedule, deleteTask],
  );

  const activeMonth: number = useMemo(() => {
    const currentDate = calendarDate.clone();

    if (viewMode === 'month') {
      return currentDate.add(7, 'day').month();
    } else {
      const nextStartOfMonth = currentDate.add(1, 'month').date(1);
      const diffDays = nextStartOfMonth.diff(currentDate, 'day');
      const halfPeriodLength = viewMode === 'weeks4' ? 14 : 7;

      if (diffDays >= halfPeriodLength) {
        return currentDate.month();
      } else {
        return nextStartOfMonth.month();
      }
    }
  }, [viewMode, calendarDate]);

  return (
    <Panel
      schedulesPerWeek={schedulesPerWeek}
      tasksPerWeek={[]}
      weekStartMonday={user?.week_start == 1}
      dayArrPerWeek={dayArr}
      currentDate={currentDate}
      today={today}
      holidayDict={holidayDict}
      holidayDisplay={holidayDisplay}
      expanded={expanded}
      draggingItemInfo={draggingItemInfo}
      activeMonth={activeMonth}
      isSidebarOpen={isSidebarOpen}
      magnifiedDate={magnifiedDate}
      draggingItemId={draggingItemId}
      droppedDate={droppedDate}
      copyItemInfo={copyItemInfo}
      detailBarStatus={detailBarStatus}
      viewMode={viewMode}
      onDayLabelClick={onDayLabelClick}
      onScheduleClick={onScheduleClick}
      onTaskClick={onTaskClick}
      onExpand={onExpand}
      onShowStatusBar={onShowStatusBar}
      onContextDate={onContextDate}
      onMagnifiedClose={onMagnifiedClose}
      onItemDragStart={onItemDragStart}
      onItemDragEnd={onItemDragEnd}
      onItemDragEndWithDate={onItemDragEndWithDate}
      onScheduleNew={onScheduleNew}
      onTaskNew={onTaskNew}
      copyItem={copyBetweenDays}
      moveItem={moveBetweenDays}
      onSetDraggingPos={onSetDraggingPos}
      onDroppedModalClose={onDroppedModalClose}
      onPrev={onPrev}
      onNext={onNext}
      onDelete={onDelete}
      onCompleteIncomplete={onCompleteIncomplete}
      onPreventPropagate={onPreventPropagate}
    />
  );
};

export default PanelContainer;
