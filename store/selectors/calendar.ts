import { GlobalState } from '@model/state';

const calendarSelector = (state: GlobalState) => state.calendar;
const viewModeSelector = (state: GlobalState) => state.calendar.viewMode;
const calendarDateSelector = (state: GlobalState) =>
  state.calendar.calendarDate;
const holidaysSelector = (state: GlobalState) => state.calendar.holidays;
const expandedSelector = (state: GlobalState) => state.calendar.expanded;
const calendarFilterSelector = (state: GlobalState) => state.calendar.filter;
const currentDateSelector = (state: GlobalState) => state.calendar.currentDate;
const countLimitADaySelector = (state: GlobalState) =>
  state.calendar.countLimitADay;
const magnifiedDateSelector = (state: GlobalState) =>
  state.calendar.magnifiedDate;
const draggedDateSelector = (state: GlobalState) => state.calendar.draggedDate;
const droppedDateSelector = (state: GlobalState) => state.calendar.droppedDate;
const copyItemInfoSelector = (state: GlobalState) => state.calendar.copyItem;
const newTaskScheduleSelector = (state: GlobalState) =>
  state.calendar.newTaskSchedule;
const gcalendarSelector = (state: GlobalState) => state.calendar.gcalendarList;
const syncInfoSelector = (state: GlobalState) => state.calendar.syncInfo;
const startdateUnsetSelector = (state: GlobalState) =>
  state.calendar.startdateUnset;
const prevDayInfoSelector = (state: GlobalState) => state.calendar.prevDayInfo;
const userIDSelectedSelector = (state: GlobalState) =>
  state.calendar.userIDSelected;
const draggingItemSelector = (state: GlobalState) =>
  state.calendar.draggingItemId;
const isSidebarOpenSelector = (state: GlobalState) =>
  state.calendar.isSidebarOpen;
const tasksToggleSelector = (state: GlobalState) => state.calendar.tasksToggle;
const detailBarStatusSelector = (state: GlobalState) =>
  state.calendar.hideDetailBar;
const taskListsToHideSelector = (state: GlobalState) =>
  state.calendar.taskListsToHide;
const scheduleListsToHideSelector = (state: GlobalState) =>
  state.calendar.scheduleListsToHide;

export {
  calendarSelector,
  viewModeSelector,
  calendarDateSelector,
  holidaysSelector,
  expandedSelector,
  calendarFilterSelector,
  currentDateSelector,
  countLimitADaySelector,
  magnifiedDateSelector,
  draggedDateSelector,
  droppedDateSelector,
  copyItemInfoSelector,
  newTaskScheduleSelector,
  gcalendarSelector,
  syncInfoSelector,
  startdateUnsetSelector,
  prevDayInfoSelector,
  userIDSelectedSelector,
  draggingItemSelector,
  isSidebarOpenSelector,
  tasksToggleSelector,
  detailBarStatusSelector,
  taskListsToHideSelector,
  scheduleListsToHideSelector,
};
