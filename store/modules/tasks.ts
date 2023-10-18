import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { PlaceholderState, TaskState } from '@model/state';

const initialState: TaskState = {
  currentTaskID: -1,
  currentTask: null,
  tasksAll: [],
  tasksToday: [],
  tasksRequested: [],
  tasksRequest: [],
  tasksInbox: [],
  tasksForList: [],
  tasksForCalendar: [],
  currentTasks: [],
  mode: {
    selectTaskMode: false,
    modal: {
      modalMoveList: false,
      modalPriority: false,
      modalRequiredTime: false,
      modalRemoveTasks: false,
    },
  },
  ratesListForTask: [],
  totalTasksCount: 0,
  showTaskDetail: true,
  placeholderProps: undefined,
  dragItemEndDate: undefined,
  dragItemPadId: undefined,
  tasksCountDict: {
    all: 0,
    today: 0,
    request: 0,
    requested: 0,
  },
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTaskID: (state: TaskState, action: PayloadAction<number | null>) => {
      state.currentTaskID = action.payload;
    },
    setCurrentTask: (state: TaskState, action: PayloadAction<any | null>) => {
      state.currentTask = action.payload;
    },
    setTasksAll: (state: TaskState, action: PayloadAction<any[]>) => {
      state.tasksAll = action.payload;
    },
    setTasksToday: (state: TaskState, action: PayloadAction<any[]>) => {
      state.tasksToday = action.payload;
    },
    setTasksRequested: (state: TaskState, action: PayloadAction<any[]>) => {
      state.tasksRequested = action.payload;
    },
    setTasksRequest: (state: TaskState, action: PayloadAction<any[]>) => {
      state.tasksRequest = action.payload;
    },
    setTasksInbox: (state: TaskState, action: PayloadAction<any[]>) => {
      state.tasksInbox = action.payload;
    },
    setTasksForList: (state: TaskState, action: PayloadAction<any[]>) => {
      state.tasksForList = action.payload;
    },
    setTasksForCalendar: (state: TaskState, action: PayloadAction<any[]>) => {
      state.tasksForCalendar = action.payload;
    },
    setCurrentTasks: (state: TaskState, action: PayloadAction<any[]>) => {
      state.currentTasks = action.payload;
    },
    setSelectTaskMode: (state: TaskState, action: PayloadAction<boolean>) => {
      state.mode.selectTaskMode = action.payload;
    },
    setModalMoveList: (state: TaskState, action: PayloadAction<boolean>) => {
      state.mode.modal.modalMoveList = action.payload;
    },
    setModalPriority: (state: TaskState, action: PayloadAction<boolean>) => {
      state.mode.modal.modalPriority = action.payload;
    },
    setModalRequiredTime: (
      state: TaskState,
      action: PayloadAction<boolean>,
    ) => {
      state.mode.modal.modalRemoveTasks = action.payload;
    },
    setModalRemoveTasks: (state: TaskState, action: PayloadAction<boolean>) => {
      state.mode.modal.modalRequiredTime = action.payload;
    },
    setCurrentRatesList: (state: TaskState, action: PayloadAction<any[]>) => {
      state.ratesListForTask = action.payload;
    },
    setTotalTasksCount: (state: TaskState, action: PayloadAction<number>) => {
      state.totalTasksCount = action.payload;
    },
    setShowTaskDetail: (state: TaskState, action: PayloadAction<boolean>) => {
      state.showTaskDetail = action.payload;
    },
    updatePlaceholderProps: (
      state: TaskState,
      action: PayloadAction<PlaceholderState | undefined>,
    ) => {
      state.placeholderProps = action.payload;
    },
    setDragItemEndDate: (
      state: TaskState,
      action: PayloadAction<string | undefined>,
    ) => {
      state.dragItemEndDate = action.payload;
    },
    setDragItemPadId: (
      state: TaskState,
      action: PayloadAction<string | undefined>,
    ) => {
      state.dragItemPadId = action.payload;
    },
    updateTasksCountDict: (state: TaskState, action: PayloadAction<any>) => {
      state.tasksCountDict = action.payload;
    },
  },
});

export const {
  setTaskID,
  setCurrentTask,
  setTasksAll,
  setTasksToday,
  setTasksRequested,
  setTasksRequest,
  setTasksInbox,
  setTasksForList,
  setCurrentTasks,
  setTasksForCalendar,
  setSelectTaskMode,
  setModalMoveList,
  setModalPriority,
  setModalRequiredTime,
  setModalRemoveTasks,
  setCurrentRatesList,
  setTotalTasksCount,
  setShowTaskDetail,
  updatePlaceholderProps,
  setDragItemEndDate,
  setDragItemPadId,
  updateTasksCountDict,
} = tasksSlice.actions;

export default tasksSlice.reducer;
