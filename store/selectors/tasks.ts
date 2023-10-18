import { GlobalState } from '@model/state';

const currentTaskIDSelector = (state: GlobalState) => state.tasks.currentTaskID;
const currentTaskSelector = (state: GlobalState) => state.tasks.currentTask;
const tasksAllSelector = (state: GlobalState) => state.tasks.tasksAll;
const tasksTodaySelector = (state: GlobalState) => state.tasks.tasksToday;
const tasksRequestSelector = (state: GlobalState) => state.tasks.tasksRequest;
const tasksRequestedSelector = (state: GlobalState) =>
  state.tasks.tasksRequested;
const tasksInboxSelector = (state: GlobalState) => state.tasks.tasksInbox;
const tasksForListSelector = (state: GlobalState) => state.tasks.tasksForList;
const tasksListSelector = (state: GlobalState) => state.tasks.currentTasks;
const tasksForCalendarSelector = (state: GlobalState) =>
  state.tasks.tasksForCalendar;
const selectModeSelector = (state: GlobalState) =>
  state.tasks.mode.selectTaskMode;
const ratesListSelector = (state: GlobalState) => state.tasks.ratesListForTask;
const totalCountSelector = (state: GlobalState) => state.tasks.totalTasksCount;
const showTaskDetailSelector = (state: GlobalState) =>
  state.tasks.showTaskDetail;
const placeholderPropsSelector = (state: GlobalState) =>
  state.tasks.placeholderProps;
const dragItemEndDateSelector = (state: GlobalState) =>
  state.tasks.dragItemEndDate;
const dragItemPadIdSelector = (state: GlobalState) => state.tasks.dragItemPadId;
const tasksCountDictSelector = (state: GlobalState) =>
  state.tasks.tasksCountDict;

export {
  currentTaskIDSelector,
  currentTaskSelector,
  tasksAllSelector,
  tasksTodaySelector,
  tasksRequestSelector,
  tasksRequestedSelector,
  tasksInboxSelector,
  tasksListSelector,
  tasksForCalendarSelector,
  selectModeSelector,
  ratesListSelector,
  totalCountSelector,
  showTaskDetailSelector,
  tasksForListSelector,
  placeholderPropsSelector,
  dragItemEndDateSelector,
  dragItemPadIdSelector,
  tasksCountDictSelector,
};
