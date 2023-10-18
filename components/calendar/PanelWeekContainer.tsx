import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs, { Dayjs } from 'dayjs';
import { useRouter } from 'next/router';
// * hooks
import { tasksForCalendarSelector } from '@store/selectors/tasks';
import { scheduleForCalendarSelector } from '@store/selectors/schedules';
import { tzOffsetSelector, userInfoSelector } from '@store/selectors/user';
import {
  calendarFilterSelector,
  calendarSelector,
  countLimitADaySelector,
  detailBarStatusSelector,
  scheduleListsToHideSelector,
  taskListsToHideSelector,
} from '@store/selectors/calendar';
import {
  codisplayUsersSelector,
  currentCodisplayUserSelector,
} from '@store/selectors/home';
import { setCurrentSchedule, setScheduleID } from '@store/modules/schedules';
import {
  setScheduleModalStatus,
  setTaskModalStatus,
} from '@store/modules/home';
import { setCurrentTask, setTaskID } from '@store/modules/tasks';
import {
  setCurrentDate,
  setNewTaskSchedule,
  setUserIDSelected,
  toggleDetailBar,
  toggleFullscreen,
} from '@store/modules/calendar';
import {
  useScheduleDelete,
  useScheduleOptionalUpdateMutation,
} from '@service/scheduleMutation';
import { useTaskDeleteWithID } from '@service/taskMutation';
// * components
import PanelWeek from './PanelWeek';
import {
  ScheduleDayDraggingItem,
  ScheduleDayRenderItem,
  ScheduleDayRenderItemWithGroup,
  TaskDayRenderItem,
} from '@model/calendar';
// * utils
import {
  getDateRangeForCalendarNew,
  getDayArr,
  getHourMinTimemodeFormat,
} from '@util/calendar';
import { COLOR_VALUES } from '@util/constants';
import { useToday } from '@service/hooks/useSchedules';
import { replaceState } from '@util/replaceUrl';
import { SCHEDULE_ADD_URL, TASK_ADD_URL } from '@util/urls';

const scdlStartDateMode = true;
const PanelWeekContainer = ({ isSidebarOpen }: { isSidebarOpen: boolean }) => {
  const tasksForCalendar = useSelector(tasksForCalendarSelector);
  const schedulesForCalendar = useSelector(scheduleForCalendarSelector);
  const detailBarStatus = useSelector(detailBarStatusSelector);

  const { user } = useSelector(userInfoSelector);
  const holidayDisplay: boolean = useMemo(() => {
    return user?.holiday_display == 1;
  }, [user]);
  const { viewMode, holidays, calendarDate, currentDate, expanded } =
    useSelector(calendarSelector);
  const calendarFilter = useSelector(calendarFilterSelector);
  const onCodisplayMode = true;
  const codisplayUserIDs = useSelector(codisplayUsersSelector);
  const currentCodisplayUserID = useSelector(currentCodisplayUserSelector);
  const calendarUsers = useMemo(() => {
    if (onCodisplayMode) return codisplayUserIDs;
    else return [currentCodisplayUserID];
  }, [onCodisplayMode, codisplayUserIDs, currentCodisplayUserID]);
  const today = useToday();

  // * render data
  const timeMode24: boolean = useMemo(() => {
    if (user?.time_display) {
      return user?.time_display == 2;
    } else {
      return false;
    }
  }, [user]);
  const dateRange = useMemo(
    () =>
      getDateRangeForCalendarNew(
        viewMode,
        calendarDate.clone(),
        user?.week_start,
      ),
    [viewMode, calendarDate, user?.week_start],
  );
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

  const { schedule: scheduleLimit, task: taskLimit } = useSelector(
    countLimitADaySelector,
  );
  const [schedulesPerDay, setSchedulesPerDay] = useState<
    Array<ScheduleDayRenderItem[]>
  >([]);
  const [tasksPerDay, setTasksPerDay] = useState<Array<TaskDayRenderItem[]>>(
    [],
  );

  const scheduleListsToHide = useSelector(scheduleListsToHideSelector);
  const taskListsToHide = useSelector(taskListsToHideSelector);

  useEffect(() => {
    let initDate = dayjs(dateRange.from_date)
      .hour(0)
      .minute(0)
      .second(0)
      .millisecond(0);
    // const schedulesForRange = schedulesForCalendar.filter((schedule) => {})
    const schedulesRenderInfo: Array<ScheduleDayRenderItem[]> = [];
    let currentDayRenderInfo: ScheduleDayRenderItemWithGroup[] = [];
    let resultRenderInfo: ScheduleDayRenderItem[] = [];
    const todayStart = dayjs().hour(0).minute(0).second(0).millisecond(0);

    const listsToHide = scheduleListsToHide;
    let schedulesFiltered = schedulesForCalendar.filter(
      (_) => !listsToHide?.includes(_.list_id),
    );

    for (let i = 0; i < dateRange.daysCount; i += 1) {
      const startDate = initDate.add(i, 'day');
      const endDate = startDate.add(1, 'day');
      const isBeforeToday = startDate.isBefore(todayStart, 'day');

      const schedulesAllRender = schedulesFiltered
        .filter((schedule) => {
          const scheduleStartDate = dayjs(schedule.start_date);
          if (scdlStartDateMode) {
            return scheduleStartDate.isSame(startDate, 'day');
          } else {
            const scheduleEndDate = dayjs(schedule.end_date);
            return !(
              scheduleStartDate.isAfter(endDate) ||
              scheduleStartDate.isSame(endDate, 'second') ||
              scheduleEndDate.isBefore(startDate)
            );
          }
        })
        .map((schedule) => {
          const scheduleStartDate = dayjs(schedule.start_date);
          const scheduleEndDate = dayjs(schedule.end_date)
            .year(scheduleStartDate.year())
            .month(scheduleStartDate.month())
            .date(scheduleStartDate.date());

          const duration = scheduleEndDate.diff(scheduleStartDate, 'minute');
          const startMin =
            scheduleStartDate.hour() * 60 + scheduleStartDate.minute();

          return {
            id: schedule.id,
            title: schedule.title,
            x: 0,
            xLength: 0,
            y: startMin,
            yLength: duration,
            bgColor:
              calendarUsers.length > 1 && schedule?.color != null
                ? COLOR_VALUES[schedule.color].label
                : undefined,
            userId: schedule?.pivot?.user_id ?? 0,
            timeLabel: `${
              timeMode24
                ? scheduleStartDate.format('H:mm')
                : `${scheduleStartDate.format('h:mm')}${
                    scheduleStartDate.hour() > 11 ? 'pm' : 'am'
                  }`
            } - ${
              scheduleEndDate.hour() == 23 &&
              scheduleEndDate.minute() == 59 &&
              scheduleEndDate.second() == 59
                ? timeMode24
                  ? '00:00'
                  : '00:00am'
                : timeMode24
                ? scheduleEndDate.format('H:mm')
                : `${scheduleEndDate.format('h:mm')}${
                    scheduleEndDate.hour() > 11 ? 'pm' : 'am'
                  }`
            }`,
            allDay: schedule.all_day === 1,
            startDate: schedule.start_date,
            endDate: schedule.end_date,
          };
        })
        .sort((a, b) => a.y - b.y);

      const schedulesRender = schedulesAllRender.filter((_) => !_.allDay);
      const filteredAllDay = schedulesAllRender.filter((_) => _.allDay);

      resultRenderInfo = [];
      if (filteredAllDay.length > 0) {
        currentDayRenderInfo = [
          ...filteredAllDay.map((item) => ({
            ...item,
            groupIndex: -1,
            subIndex: -1,
          })),
        ];
      }
      if (schedulesRender.length > 0) {
        let groupIndex = 0;
        let subIndex = 0;
        currentDayRenderInfo.push({
          ...schedulesRender[0],
          groupIndex,
          subIndex,
        });

        let isSameAddedBefore = false;
        while (currentDayRenderInfo.length <= schedulesRender.length) {
          const startItem =
            currentDayRenderInfo[currentDayRenderInfo.length - 1];
          const filteredSameStart = schedulesRender
            .filter(
              (item) => item.y === startItem.y && item.id !== startItem.id,
            )
            .sort((a, b) => -a.yLength + b.yLength);
          const filteredWithin45min = schedulesRender.filter(
            (item) => item.y > startItem.y && item.y - 45 < startItem.y,
          );
          const filteredWithIntersection = schedulesRender.filter(
            (item) =>
              item.y > startItem.y && item.y < startItem.y + startItem.yLength,
          );
          const filteredWithNonIntersection = schedulesRender.filter(
            (item) =>
              item.y > startItem.y &&
              item.y > startItem.y + startItem.yLength &&
              item.id !== startItem.id,
          );

          if (filteredSameStart.length > 0 && !isSameAddedBefore) {
            currentDayRenderInfo = [
              ...currentDayRenderInfo,
              ...filteredSameStart.map((item, index) => ({
                ...item,
                groupIndex,
                subIndex: subIndex + 1 + index,
              })),
            ];
            subIndex = subIndex + filteredSameStart.length;
            isSameAddedBefore = true;
          } else if (filteredWithin45min.length > 0) {
            isSameAddedBefore = false;
            currentDayRenderInfo.push({
              ...filteredWithin45min[0],
              groupIndex,
              subIndex: subIndex + 1,
            });
            subIndex++;
          } else if (filteredWithIntersection.length > 0) {
            isSameAddedBefore = false;
            currentDayRenderInfo = currentDayRenderInfo.map((item, index) =>
              index === currentDayRenderInfo.length - 1
                ? {
                    ...item,
                    xLength: undefined,
                  }
                : item,
            );
            currentDayRenderInfo.push({
              ...filteredWithIntersection[0],
              groupIndex,
              subIndex: subIndex + 1,
            });
            subIndex++;
          } else if (filteredWithNonIntersection.length > 0) {
            isSameAddedBefore = false;
            groupIndex++;
            subIndex = 0;
            currentDayRenderInfo.push({
              ...filteredWithNonIntersection[0],
              groupIndex,
              subIndex,
            });
          } else {
            break;
          }
        }
      }
      const currentGroupInfoList = currentDayRenderInfo.map(
        (item) => item.groupIndex,
      );
      const groupIndexDict: { [key: string]: number } =
        currentGroupInfoList.reduce(
          (ctx: { [id: string]: number }, el: number) => {
            ctx[el] = (ctx[el] ?? 0) + 1;
            return ctx;
          },
          {},
        );
      resultRenderInfo = currentDayRenderInfo.map((item) => {
        const currentGroupCount = groupIndexDict[item.groupIndex] ?? 1;
        const itemInterval = Math.round(100 / currentGroupCount);
        const itemWidth =
          item.xLength != undefined
            ? Math.round((itemInterval * 5) / 3)
            : undefined;
        return {
          ...item,
          x: itemInterval * item.subIndex,
          xLength: itemWidth,
        };
      });
      currentDayRenderInfo = [];

      schedulesRenderInfo.push(resultRenderInfo);
    }

    setSchedulesPerDay(
      scheduleLimit && scheduleLimit > 0
        ? schedulesRenderInfo
        : [[], [], [], [], [], [], []],
    );
  }, [
    dateRange,
    schedulesForCalendar,
    timeMode24,
    calendarUsers.length,
    scheduleLimit,
    scheduleListsToHide,
  ]);

  useEffect(() => {
    let initDate = dayjs(dateRange.from_date)
      .hour(0)
      .minute(0)
      .second(0)
      .millisecond(0);

    let listsToHide = taskListsToHide ?? [];
    let tasksFiltered = tasksForCalendar.filter(
      (_) => !listsToHide.includes(_.list_id),
    );

    const tasksRenderInfo: Array<TaskDayRenderItem[]> = [];

    for (let i = 0; i < dateRange.daysCount; i += 1) {
      const startDate = initDate.add(i, 'day');
      const endDate = startDate.add(1, 'day');

      const tasksRender = tasksFiltered
        .filter((task, index) => {
          const taskStartDate = dayjs(task.start_date);
          const taskEndDate = dayjs(task.end_date);
          return index > 3
            ? false
            : calendarFilter === 'start_date'
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
        })
        .map((task) => {
          return {
            id: task.id,
            title: task.title,
            bgColor:
              calendarUsers.length > 1 && task?.color != null
                ? COLOR_VALUES[task.color].label
                : undefined,
            userId: task?.pivot?.user_id,
          };
        });
      tasksRenderInfo.push(tasksRender);
    }

    setTasksPerDay(
      taskLimit && taskLimit > 0
        ? tasksRenderInfo
        : [[], [], [], [], [], [], []],
    );
  }, [
    tasksForCalendar,
    calendarFilter,
    dateRange,
    timeMode24,
    calendarUsers,
    taskLimit,
    taskListsToHide,
  ]);

  const dispatch = useDispatch();
  // * event handler functions
  const router = useRouter();
  const onDayLabelClick = useCallback(
    (date: Dayjs) => {
      dispatch(setCurrentDate(date));
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

  const onExpand = useCallback(() => {
    dispatch(toggleFullscreen());
  }, [dispatch]);
  const onShowStatusBar = useCallback(() => {
    dispatch(toggleDetailBar());
  }, [dispatch]);

  // * related to dragging
  // * dragging type : undefined - none, 0 - creating by drag, 1 - resizing by drag, 2 - moving by drag
  const [draggingType, setDraggingType] = useState<number>();
  const [draggingObject, setDraggingObject] =
    useState<ScheduleDayDraggingItem>();
  // * schedule create by dragging - mouse down handler
  const onMouseDownCalendar = useCallback(
    (date: Dayjs, dayIndex: number, yMins: number) => {
      setDraggingType(0);
      setDraggingObject({
        id: -1,
        title: undefined,
        dayIndex,
        y: yMins,
        yLength: 60,
        bgColor: undefined,
        userId: currentCodisplayUserID,
        timeLabel: `${getHourMinTimemodeFormat(
          yMins,
          timeMode24,
        )} - ${getHourMinTimemodeFormat(yMins + 60, timeMode24)}`,
        allDay: false,
        daySpan: 1,
        startDate: date.format('YYYY-MM-DD HH:mm:ss'),
      });
    },
    [currentCodisplayUserID, timeMode24],
  );
  // * schedule resizing by dragging the footer of the schedule - mouse down handler
  const onMouseDownScheduleFooter = useCallback(
    (
      {
        id,
        title,
        y,
        yLength,
        bgColor,
        userId,
        timeLabel,
        allDay,
        startDate,
        endDate,
      },
      dayIndex,
    ) => {
      setDraggingType(1);
      const endDatetime = dayjs(endDate)
        .hour(0)
        .minute(0)
        .second(0)
        .millisecond(0);
      const startDatetime = dayjs(startDate)
        .hour(0)
        .minute(0)
        .second(0)
        .millisecond(0);
      const daySpan = endDatetime.diff(startDatetime, 'day') + 1;
      setDraggingObject({
        id,
        title,
        dayIndex,
        y,
        yLength,
        bgColor,
        userId,
        timeLabel,
        allDay,
        daySpan,
        startDate,
        endDate,
      });
    },
    [],
  );
  // * schedule moving by clicking the body of the schedule - mouse down handler
  const onMouseDownScheduleBody = useCallback(
    (
      {
        id,
        title,
        y,
        yLength,
        bgColor,
        userId,
        timeLabel,
        allDay,
        startDate,
        endDate,
      },
      dayIndex,
    ) => {
      setDraggingType(2);
      const endDatetime = dayjs(endDate)
        .hour(0)
        .minute(0)
        .second(0)
        .millisecond(0);
      const startDatetime = dayjs(startDate)
        .hour(0)
        .minute(0)
        .second(0)
        .millisecond(0);
      const daySpan = endDatetime.diff(startDatetime, 'day') + 1;
      setDraggingObject({
        id,
        title,
        dayIndex,
        originalDayIndex: dayIndex,
        indexInTerm: 0,
        y,
        yLength,
        bgColor,
        userId,
        timeLabel,
        allDay,
        daySpan,
        startDate,
        endDate,
      });
    },
    [],
  );
  // * mouse move handler for dragging
  const onMouseMoveHandler = useCallback(
    (dayIndex: number, mins: number) => {
      if (draggingType === 0) {
        // * schedule create by dragging
        setDraggingObject((oldObject) => {
          if (!oldObject) return oldObject;
          const newY =
            mins >= oldObject.y
              ? oldObject.y
              : Math.min(oldObject.y - 30, mins);
          const newLength = Math.max(Math.abs(mins - oldObject.y), 30);

          return {
            ...oldObject,
            y: newY,
            yLength: newLength,
            timeLabel: `${getHourMinTimemodeFormat(
              newY,
              timeMode24,
            )} - ${getHourMinTimemodeFormat(newY + newLength, timeMode24)}`,
          };
        });
      } else if (draggingType === 1) {
        // * schedule resize by dragging
        setDraggingObject((oldObject) => {
          if (!oldObject) return oldObject;
          // const newY = Math.max(oldObject.y + 15, mins);
          const newLength = Math.max(Math.abs(mins - oldObject.y), 30);

          return {
            ...oldObject,
            yLength: newLength,
            timeLabel: `${getHourMinTimemodeFormat(
              oldObject.y,
              timeMode24,
            )} - ${getHourMinTimemodeFormat(
              oldObject.y + newLength,
              timeMode24,
            )}`,
          };
        });
      } else if (draggingType === 2) {
        // * schedule move by dragging
        setDraggingObject((oldObject) => {
          if (!oldObject) return oldObject;
          // ! didn't change startDate, because it's just moving, hanle this on mouse up

          return {
            ...oldObject,
            dayIndex,
            y: mins,
            timeLabel: `${getHourMinTimemodeFormat(
              mins,
              timeMode24,
            )} - ${getHourMinTimemodeFormat(
              mins + oldObject.yLength,
              timeMode24,
            )}`,
          };
        });
      }
    },
    [draggingType, timeMode24],
  );
  const onMouseMoveOnSelf = useCallback(
    (newMinsLength: number) => {
      const newLength = Math.max(30, newMinsLength);
      if (draggingType !== 2) {
        setDraggingObject((oldObject) => {
          if (!oldObject) return oldObject;

          return {
            ...oldObject,
            yLength: Math.max(30, newMinsLength),
            timeLabel: `${getHourMinTimemodeFormat(
              oldObject.y,
              timeMode24,
            )} - ${getHourMinTimemodeFormat(
              oldObject.y + newLength,
              timeMode24,
            )}`,
          };
        });
      }
    },
    [timeMode24, draggingType],
  );
  // * mouse up handler for dragging
  const tzOffsetMins = useSelector(tzOffsetSelector);
  const scheduleOptionalUpdate = useScheduleOptionalUpdateMutation();
  const onMouseUpHandler = useCallback(
    (
      date: Dayjs,
      dayIndex: number,
      mins: number,
      currentDraggingObject: ScheduleDayDraggingItem,
    ) => {
      if (draggingType === undefined) {
      } else {
        if (draggingType === 0) {
          // * schedule create by dragging, so show New Schedule Modal
          dispatch(setNewTaskSchedule(null));
          // ! new schedule
          const currentUrl = router.asPath;
          localStorage.setItem('task3_background_url', currentUrl);
          replaceState(SCHEDULE_ADD_URL);
          dispatch(setScheduleID(-1));
          const newY =
            mins >= currentDraggingObject.y
              ? currentDraggingObject.y
              : Math.min(currentDraggingObject.y - 60, mins);
          const newLength = Math.max(
            Math.abs(mins - currentDraggingObject.y),
            60,
          );
          const startDate = (
            currentDraggingObject?.startDate
              ? dayjs(currentDraggingObject.startDate)
              : dayjs()
          )
            .hour(Math.floor(newY / 60))
            .minute(Math.round(newY % 60))
            .second(0)
            .subtract(tzOffsetMins, 'minutes');
          let endDate = startDate.add(newLength + tzOffsetMins, 'minute');
          console.log(endDate.format('HH:mm:ss'));
          if (endDate.hour() == 0 && endDate.minute() == 0) {
            endDate = endDate.subtract(1, 'minute').second(59);
          }
          endDate = endDate.subtract(tzOffsetMins, 'minute');

          dispatch(
            setCurrentSchedule({
              start_date: startDate.format('YYYY-MM-DD HH:mm:ss'),
              end_date: endDate.format('YYYY-MM-DD HH:mm:ss'),
            }),
          );
          dispatch(setScheduleModalStatus(true));
        } else if (draggingType === 1) {
          // * schedule resize by dragging
          const newLength = Math.max(
            Math.abs(mins - currentDraggingObject.y),
            30,
          );
          let endDate = (
            currentDraggingObject?.endDate
              ? dayjs(currentDraggingObject.endDate)
              : dayjs()
          )
            .hour(Math.floor(currentDraggingObject.y / 60))
            .minute(Math.round(currentDraggingObject.y % 60))
            .second(0)
            .add(newLength, 'minute');
          if (endDate.hour() == 0 && endDate.minute() == 0) {
            endDate = endDate.subtract(1, 'minute').second(59);
          }
          endDate = endDate.subtract(tzOffsetMins, 'minute');

          scheduleOptionalUpdate.mutate({
            id: currentDraggingObject?.id ?? 0,
            object: {
              end_date: endDate.format('YYYY-MM-DD HH:mm:ss'),
            },
          });
        } else {
          // * schedule move by dragging
          // const newStartDate = date
          //   .hour(Math.floor(mins / 60))
          //   .minute(Math.round(mins % 60))
          //   .second(0);
          const oldStartDate = dayjs(currentDraggingObject.startDate);
          const newStartDate = oldStartDate
            .add(
              dayIndex -
                (currentDraggingObject.originalDayIndex ??
                  currentDraggingObject.dayIndex),
              'day',
            )
            .hour(Math.floor(mins / 60))
            .minute(Math.round(mins % 60))
            .second(0);

          const deltaMins = newStartDate.diff(oldStartDate, 'minute');
          let newEndDate = dayjs(currentDraggingObject.endDate).add(
            deltaMins,
            'minute',
          );
          if (
            (newEndDate.hour() != 23 || newEndDate.minute() != 59) &&
            newEndDate.second() == 59
          ) {
            newEndDate = newEndDate.add(1, 'second');
          } else if (newEndDate.hour() == 0 && newEndDate.minute() == 0) {
            newEndDate = newEndDate.subtract(1, 'minute').second(59);
          }

          scheduleOptionalUpdate.mutate({
            id: currentDraggingObject.id ?? 0,
            object: {
              start_date: newStartDate
                .subtract(tzOffsetMins, 'minute')
                .format('YYYY-MM-DD HH:mm:ss'),
              end_date: newEndDate
                .subtract(tzOffsetMins, 'minute')
                .format('YYYY-MM-DD HH:mm:ss'),
            },
          });
        }
        setDraggingObject(undefined);
        setDraggingType(undefined);
      }
    },
    [
      draggingType,
      dispatch,
      router.asPath,
      scheduleOptionalUpdate,
      tzOffsetMins,
    ],
  );
  const onDragEnd = useCallback(() => {
    setDraggingObject(undefined);
    setDraggingType(undefined);
  }, []);

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

  return (
    <PanelWeek
      schedulesPerDay={schedulesPerDay}
      tasksPerDay={tasksPerDay}
      dayArr={dayArr[0] ?? []}
      timeMode24={timeMode24}
      tzOffsetMins={tzOffsetMins}
      currentDate={currentDate}
      today={today}
      holidayDict={holidayDict}
      holidayDisplay={holidayDisplay}
      expanded={expanded}
      draggingObject={draggingObject}
      isSidebarOpen={isSidebarOpen}
      detailBarStatus={detailBarStatus}
      onDayLabelClick={onDayLabelClick}
      onScheduleClick={onScheduleClick}
      onExpand={onExpand}
      onShowStatusBar={onShowStatusBar}
      onTaskClick={onTaskClick}
      onTaskNew={onTaskNew}
      onMouseDownCalendar={onMouseDownCalendar}
      onMouseDownScheduleFooter={onMouseDownScheduleFooter}
      onMouseDownScheduleBody={onMouseDownScheduleBody}
      onMouseMoveHandler={onMouseMoveHandler}
      onMouseMoveOnSelf={onMouseMoveOnSelf}
      onMouseUpHandler={onMouseUpHandler}
      onDragEnd={onDragEnd}
      onDelete={onDelete}
    />
  );
};

export default PanelWeekContainer;
