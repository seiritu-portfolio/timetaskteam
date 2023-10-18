import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { useQueryClient } from 'react-query';
// * hooks
import {
  calendarDateSelector,
  calendarFilterSelector,
  currentDateSelector,
  detailBarStatusSelector,
  expandedSelector,
  holidaysSelector,
  startdateUnsetSelector,
  viewModeSelector,
} from '@store/selectors/calendar';
import { useTasksForCalendar } from '@service/taskQueries';
import { useSchdulesForCalendar } from '@service/scheduleQueries';
import { getDateRangeForCalendarNew } from '@util/calendar';
import {
  tzOffsetBrowserSelector,
  tzOffsetSelector,
  userInfoSelector,
} from '@store/selectors/user';
import {
  codisplayUsersSelector,
  currentCodisplayUserSelector,
  isSidebarOpenSelector,
} from '@store/selectors/home';
import { setSchedulesForCalendar } from '@store/modules/schedules';
import { setTasksForCalendar } from '@store/modules/tasks';
import { tasksForCalendarSelector } from '@store/selectors/tasks';
import { scheduleForCalendarSelector } from '@store/selectors/schedules';
import pusher from '@service/pusher';
// * components
import PanelContainer from './PanelContainer';
import PanelWeekContainer from './PanelWeekContainer';
import Toolbar from '@component/calendar/Toolbar';
import Sidebar from '@component/calendar/Sidebar';

const channel = pusher.subscribe('calendar-sync-completed');

const Calendar = ({ className }: { className: string }) => {
  const viewMode = useSelector(viewModeSelector);
  const calendarDate = useSelector(calendarDateSelector);
  const currentDate = useSelector(currentDateSelector);
  const holidays = useSelector(holidaysSelector);
  const expanded = useSelector(expandedSelector);
  const { user } = useSelector(userInfoSelector);
  const dateRange = useMemo(
    () =>
      getDateRangeForCalendarNew(
        viewMode,
        calendarDate.clone(),
        user?.week_start,
      ),
    [viewMode, calendarDate, user?.week_start],
  );
  const tzOffsetMins = useSelector(tzOffsetSelector);
  const tzOffsetBrowser = useSelector(tzOffsetBrowserSelector);
  const startdateUnset = useSelector(startdateUnsetSelector);
  const calendarFilter = useSelector(calendarFilterSelector);
  const detailBarStatus = useSelector(detailBarStatusSelector);

  const onCodisplayMode = true;
  const codisplayUserIDs = useSelector(codisplayUsersSelector);
  const currentCodisplayUserID = useSelector(currentCodisplayUserSelector);
  const calendarUsers = useMemo(() => {
    if (onCodisplayMode) return codisplayUserIDs;
    else return [currentCodisplayUserID];
  }, [onCodisplayMode, codisplayUserIDs, currentCodisplayUserID]);

  // * fetching data
  const tasksForCalendarResult = useTasksForCalendar({
    ...dateRange,
    user_ids: calendarUsers,
  });
  const schedulesForCalendarResult = useSchdulesForCalendar({
    ...dateRange,
    user_ids: calendarUsers,
  });
  const dispatch = useDispatch();
  useEffect(() => {
    if (schedulesForCalendarResult.isSuccess) {
      const monthStart = dayjs(dateRange.from_date);
      const monthEnd = dayjs(dateRange.to_date);

      let schedulesListTemp =
        schedulesForCalendarResult.data.length > 0
          ? schedulesForCalendarResult.data.map((item: any) => {
              const startDate = dayjs(item.start_date).add(
                tzOffsetMins - tzOffsetBrowser,
                'minute',
              );
              let endDate = dayjs(item.end_date).add(
                tzOffsetMins - tzOffsetBrowser,
                'minute',
              );
              if (endDate.hour() == 0 && endDate.minute() == 0) {
                endDate = endDate.subtract(1, 'minute').second(59);
              }
              const duration =
                (endDate.isAfter(monthEnd) ? monthEnd : endDate)
                  .hour(0)
                  .minute(0)
                  .second(0)
                  .millisecond(0)
                  .diff(
                    (startDate.isBefore(monthStart) ? monthStart : startDate)
                      .hour(0)
                      .minute(0)
                      .second(0)
                      .millisecond(0),
                    'day',
                  ) + 1;

              return {
                ...item,
                start_date: startDate.valueOf(),
                end_date: endDate.valueOf(),
                duration,
              };
            })
          : [];
      let schedulesList: any[] = [];

      const idList: number[] = [];
      for (let i = 0; i < schedulesListTemp.length; i++) {
        if (!idList.includes(schedulesListTemp[i].id)) {
          schedulesList.push(schedulesListTemp[i]);
          idList.push(schedulesListTemp[i].id);
        }
      }

      if (!user?.gc_refresh_token) {
        // ! this case, we don't need to show synced events
        schedulesList = schedulesList.filter(
          (schedule: any) => schedule.event_id == null,
        );
      }
      dispatch(
        setSchedulesForCalendar(
          schedulesList.sort((a: any, b: any) => -a.duration + b.duration),
        ),
      );
    }
  }, [
    schedulesForCalendarResult.isSuccess,
    schedulesForCalendarResult.data,
    dispatch,
    tzOffsetMins,
    tzOffsetBrowser,
    dateRange,
    user,
  ]);
  useEffect(() => {
    if (tasksForCalendarResult.isSuccess) {
      const tasksWithStartDateSet =
        tasksForCalendarResult.data.length === 0
          ? []
          : tasksForCalendarResult.data.filter(
              (item: any) => !(item.start_date === null),
            );

      const monthStart = dayjs(dateRange.from_date);
      const monthEnd = dayjs(dateRange.to_date);
      const tasksListTemp =
        tasksWithStartDateSet === 0
          ? []
          : tasksWithStartDateSet.map((item: any) => {
              const startDate = dayjs(item.start_date).add(
                tzOffsetMins - tzOffsetBrowser,
                'minute',
              );
              const endDate = dayjs(item.end_date).add(
                tzOffsetMins - tzOffsetBrowser,
                'minute',
              );
              const duration =
                (endDate.isAfter(monthEnd) ? monthEnd : endDate)
                  .hour(0)
                  .minute(0)
                  .second(0)
                  .millisecond(0)
                  .diff(
                    (startDate.isBefore(monthStart) ? monthStart : startDate)
                      .hour(0)
                      .minute(0)
                      .second(0)
                      .millisecond(0),
                    'day',
                  ) + 1;

              return {
                ...item,
                start_date: startDate.valueOf(),
                end_date: endDate.valueOf(),
                duration,
              };
            });
      const tasksList: any[] = [];

      const idList: number[] = [];
      for (let i = 0; i < tasksListTemp.length; i++) {
        if (!idList.includes(tasksListTemp[i].id)) {
          tasksList.push(tasksListTemp[i]);
          idList.push(tasksListTemp[i].id);
        }
      }
      dispatch(
        setTasksForCalendar(
          tasksList.sort((a: any, b: any) => -a.duration + b.duration),
        ),
      );
    }
  }, [
    tasksForCalendarResult.isSuccess,
    tasksForCalendarResult.data,
    dispatch,
    tzOffsetMins,
    tzOffsetBrowser,
    dateRange,
  ]);

  const tasksForCalendar = useSelector(tasksForCalendarSelector);
  const schedulesForCalendar = useSelector(scheduleForCalendarSelector);
  const isSidebarOpen = useSelector(isSidebarOpenSelector);

  const queryClient = useQueryClient();
  useEffect(() => {
    // const channel = pusher.subscribe('private-calendar-sync-completed');

    let timeoutId: ReturnType<typeof setTimeout>;
    channel.bind_global((eventName: string, eventData: any) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (eventData.user_id == user?.id && eventData.is_successful) {
          queryClient.invalidateQueries('schedules');
        }
      }, 1000);
    });

    return () => {
      pusher.unsubscribe('private-calendar-sync-completed');
    };
  }, [queryClient, user?.id]);

  return (
    <div className={`${className} flex-1`}>
      <div className={'flex border-b z-100'}>
        <Toolbar
          className={'w-full'}
          calendarDate={calendarDate}
          viewMode={viewMode}
        />
      </div>
      <div className={'flex-1 flex h-full'}>
        {viewMode === 'week' ? (
          <PanelWeekContainer isSidebarOpen={isSidebarOpen} />
        ) : (
          <PanelContainer
            calendarFilter={calendarFilter}
            viewMode={viewMode}
            calendarDate={calendarDate}
            currentDate={currentDate}
            holidays={holidays}
            tasksForCalendar={tasksForCalendar ?? []}
            schedulesForCalendar={schedulesForCalendar ?? []}
            expanded={expanded}
            isSidebarOpen={isSidebarOpen}
            calendarUsers={calendarUsers}
          />
        )}
        <Sidebar
          currentDate={currentDate}
          startdateUnset={startdateUnset}
          calendarFilter={calendarFilter}
          isOpen={expanded ? false : true}
          hideStatus={detailBarStatus}
          className=""
        />
      </div>
    </div>
  );
};

export default Calendar;
