import { GlobalState } from '@model/state';

const currentScheduleIDSelector = (state: GlobalState) =>
  state.schedules.currentScheduleID;
const currentScheduleSelector = (state: GlobalState) =>
  state.schedules.currentSchedule;
const scheduleAllSelector = (state: GlobalState) => state.schedules.scheduleAll;
const scheduleForCalendarSelector = (state: GlobalState) =>
  state.schedules.schedulesForCalendar;

export {
  currentScheduleIDSelector,
  currentScheduleSelector,
  scheduleAllSelector,
  scheduleForCalendarSelector,
};
