import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import dayjs, { Dayjs } from 'dayjs';

import { CalendarState, PrevDayInfo, SyncItemInfo } from '@model/state';
import { CalendarRenderItemExtended } from '@model/calendar';

const initialState: CalendarState = {
  viewMode: 'month',
  calendarDate: dayjs(),
  currentDate: dayjs(),
  expanded: false,
  holidays: [],
  filter: 'start_date',
  countLimitADay: {
    schedule: 2,
    task: 4,
  },
  magnifiedDate: '',
  draggedDate: '',
  droppedDate: '',
  copyItem: undefined,
  newTaskSchedule: '',
  gcalendarList: [],
  syncInfo: [],
  startdateUnset: false,
  prevDayInfo: [],
  userIDSelected: -1,
  draggingItemId: 0,
  isSidebarOpen: false,
  tasksToggle: {
    expired: false,
    today: false,
  },
  hideDetailBar: false,
  scheduleListsToHide: [],
  taskListsToHide: [],
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setViewMode: (
      state: CalendarState,
      action: PayloadAction<'month' | 'weeks4' | 'weeks2' | 'half' | 'week'>,
    ) => {
      if (action.payload === state.viewMode) {
      } else {
        if (action.payload === 'month') {
          const halfPeriodLength =
            state.viewMode === 'weeks4'
              ? 14
              : state.viewMode === 'weeks2'
              ? 7
              : 4;
          const nextStartOfMonth = state.calendarDate.add(1, 'month').date(1);
          const diffDays = nextStartOfMonth.diff(state.calendarDate, 'day');

          if (diffDays >= halfPeriodLength) {
            state.calendarDate = state.calendarDate.date(1).startOf('week');
          } else {
            state.calendarDate = nextStartOfMonth.startOf('week');
          }
        } else if (action.payload === 'weeks2' || action.payload === 'weeks4') {
          const startOfToday = dayjs().startOf('week');
          const weekCount = startOfToday.diff(state.calendarDate, 'week');
          const weekUnit = action.payload === 'weeks2' ? 2 : 4;

          const maxWeekCount = Math.ceil(weekCount / weekUnit) * weekUnit;
          state.calendarDate = startOfToday.subtract(maxWeekCount, 'week');
        } else if (action.payload === 'week') {
          const today = dayjs();
          // ! check if current viewMode shows today, and if yes, we just show that week
          let isIncludingToday = false;
          if (state.viewMode === 'month') {
            isIncludingToday =
              state.calendarDate.endOf('week').month() === today.month();
          } else {
            const periodLength =
              state.viewMode === 'weeks4'
                ? 28
                : state.viewMode === 'weeks2'
                ? 14
                : 7;

            isIncludingToday =
              today.diff(state.calendarDate, 'day') < periodLength;
          }
          if (isIncludingToday) {
            state.calendarDate = dayjs().startOf('week');
          }
        }
        state.viewMode = action.payload;
      }
    },
    setCalendarDate: (state: CalendarState, action: PayloadAction<Dayjs>) => {
      state.calendarDate = action.payload;
    },
    setCurrentDate: (state: CalendarState, action: PayloadAction<Dayjs>) => {
      state.currentDate = action.payload;
    },
    today: (state: CalendarState) => {
      if (state.viewMode === 'month')
        state.calendarDate = dayjs().date(1).startOf('week');
      else state.calendarDate = dayjs().startOf('week');
      state.currentDate = dayjs();
    },
    prev: (state: CalendarState) => {
      if (state.viewMode === 'month') {
        state.calendarDate = state.calendarDate
          .add(7, 'day')
          .subtract(1, 'month')
          .date(1)
          .startOf('week');
      } else if (state.viewMode === 'week') {
        state.calendarDate = state.calendarDate.subtract(7, 'day');
      } else if (state.viewMode === 'weeks2') {
        state.calendarDate = state.calendarDate.subtract(14, 'day');
      } else if (state.viewMode === 'weeks4') {
        state.calendarDate = state.calendarDate.subtract(28, 'day');
      }
    },
    next: (state: CalendarState) => {
      if (state.viewMode === 'month') {
        state.calendarDate = state.calendarDate
          .add(7, 'day')
          .add(1, 'month')
          .date(1)
          .startOf('week');
      } else if (state.viewMode === 'week') {
        state.calendarDate = state.calendarDate.add(7, 'day');
      } else if (state.viewMode === 'weeks2') {
        state.calendarDate = state.calendarDate.add(14, 'day');
      } else if (state.viewMode === 'weeks4') {
        state.calendarDate = state.calendarDate.add(28, 'day');
      }
    },
    offExpanded: (state: CalendarState) => {
      state.expanded = false;
    },
    toggleFullscreen: (state: CalendarState) => {
      if (!state.expanded) {
        state.hideDetailBar = false;
      }
      state.expanded = !state.expanded;
    },
    setHolidays: (state: CalendarState, action: PayloadAction<any[]>) => {
      state.holidays = action.payload;
    },
    setFilter: (state: CalendarState, action: PayloadAction<string>) => {
      state.filter = action.payload;
    },
    setCountLimitADay: (
      state: CalendarState,
      action: PayloadAction<{
        schedule: number;
        task: number;
      }>,
    ) => {
      state.countLimitADay = action.payload;
    },
    setTasksCountLimit: (
      state: CalendarState,
      action: PayloadAction<number>,
    ) => {
      state.countLimitADay.task = action.payload;
    },
    toggleTaskCountLimit: (state: CalendarState) => {
      state.countLimitADay.task = state.countLimitADay.task > 0 ? 0 : 25;
    },
    setSchedulesCountLimit: (
      state: CalendarState,
      action: PayloadAction<number>,
    ) => {
      state.countLimitADay.schedule = action.payload;
    },
    toggleScheduleCountLimit: (state: CalendarState) => {
      state.countLimitADay.schedule =
        state.countLimitADay.schedule > 0 ? 0 : 25;
    },
    setMagnifiedDate: (
      state: CalendarState,
      action: PayloadAction<Dayjs | null>,
    ) => {
      if (
        !action.payload ||
        state.magnifiedDate === action.payload.format('YYYYMMDD')
      ) {
        state.magnifiedDate = '';
      } else {
        state.magnifiedDate = action.payload.format('YYYYMMDD');
      }
    },
    setDraggedDate: (state: CalendarState, action: PayloadAction<string>) => {
      state.draggedDate = action.payload;
    },
    setDroppedDate: (state: CalendarState, action: PayloadAction<string>) => {
      state.droppedDate = action.payload;
    },
    setCopyItem: (
      state: CalendarState,
      action: PayloadAction<CalendarRenderItemExtended | undefined>,
    ) => {
      if (action.payload === null) {
        state.copyItem = undefined;
      } else state.copyItem = action.payload;
    },
    setNewTaskSchedule: (
      state: CalendarState,
      action: PayloadAction<Dayjs | null>,
    ) => {
      if (!action.payload) {
        state.newTaskSchedule = '';
      } else {
        state.newTaskSchedule = action.payload.format('YYYYMMDD');
      }
    },
    setGCalendarList: (
      state: CalendarState,
      action: PayloadAction<
        Array<{
          id: string;
          summary: string;
        }>
      >,
    ) => {
      state.gcalendarList = action.payload;
    },
    setSyncInfo: (
      state: CalendarState,
      action: PayloadAction<SyncItemInfo[]>,
    ) => {
      state.syncInfo = action.payload;
    },
    setStartdateUnset: (
      state: CalendarState,
      action: PayloadAction<boolean | undefined>,
    ) => {
      state.startdateUnset = action.payload;
    },
    initPrevDayInfo: (
      state: CalendarState,
      action: PayloadAction<PrevDayInfo>,
    ) => {
      state.prevDayInfo = [action.payload];
    },
    setPrevDayInfo: (
      state: CalendarState,
      action: PayloadAction<{
        date: string;
        schedules?: number[];
        tasks?: number[];
      }>,
    ) => {
      let notFound = true;
      const newDaysInfo = state.prevDayInfo.map((dayInfo) => {
        if (dayInfo.date === action.payload.date) {
          notFound = false;
          return { ...dayInfo, ...action.payload };
        } else return dayInfo;
      });
      if (notFound)
        newDaysInfo.push({
          date: action.payload.date,
          schedules: action.payload.schedules ?? [],
          tasks: action.payload.tasks ?? [],
        });
      state.prevDayInfo = newDaysInfo;
      // state.prevDayInfo = [
      //   ...state.prevDayInfo,
      //   action.payload
      // ];
    },
    setUserIDSelected: (
      state: CalendarState,
      action: PayloadAction<number>,
    ) => {
      state.userIDSelected = action.payload;
    },
    setDraggingItemId: (
      state: CalendarState,
      action: PayloadAction<number>,
    ) => {
      state.draggingItemId = action.payload;
    },
    toggleSidebar: (state: CalendarState) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    toggleDetailBar: (state: CalendarState) => {
      state.hideDetailBar = !state.hideDetailBar;
    },
    setTaskListsToHide: (
      state: CalendarState,
      action: PayloadAction<number[]>,
    ) => {
      state.taskListsToHide = action.payload;
    },
    setScheduleListsToHide: (
      state: CalendarState,
      action: PayloadAction<number[]>,
    ) => {
      state.scheduleListsToHide = action.payload;
    },
  },
});

export const {
  setViewMode,
  setCalendarDate,
  setCurrentDate,
  today,
  prev,
  next,
  offExpanded,
  toggleFullscreen,
  setHolidays,
  setFilter,
  setCountLimitADay,
  setTasksCountLimit,
  toggleTaskCountLimit,
  setSchedulesCountLimit,
  toggleScheduleCountLimit,
  setMagnifiedDate,
  setDraggedDate,
  setDroppedDate,
  setCopyItem,
  setNewTaskSchedule,
  setGCalendarList,
  setSyncInfo,
  setStartdateUnset,
  initPrevDayInfo,
  setPrevDayInfo,
  setUserIDSelected,
  setDraggingItemId,
  toggleSidebar,
  toggleDetailBar,
  setTaskListsToHide,
  setScheduleListsToHide,
} = calendarSlice.actions;

export default calendarSlice.reducer;
