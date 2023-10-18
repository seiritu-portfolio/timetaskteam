import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { SortState } from '@model/state';

const initialState: SortState = {
  tasksSortDict: {},
  listsSortDict: {},
  collabosSortDict: {},
  dropPadsDict: {},
  bufferForTaskDrag: {
    droppableId: undefined,
    srcDroppableId: undefined,
    draggingId: 0,
  },
};

const sortSlice = createSlice({
  name: 'sort',
  initialState,
  reducers: {
    setSortInfoForType: (
      state: SortState,
      action: PayloadAction<{ type: string; data: { [id: number]: number } }>,
    ) => {
      const type = action.payload.type;
      const data = action.payload.data;
      if (type == 'tasks') {
        state.tasksSortDict = data;
      } else if (type == 'lists') {
        state.listsSortDict = data;
      } else if (type == 'collabos') {
        state.collabosSortDict = data;
      }
    },
    setDropPadsDict: (
      state: SortState,
      action: PayloadAction<{ droppadID: string; data: number[] }>,
    ) => {
      state.dropPadsDict = {
        ...state.dropPadsDict,
        [action.payload.droppadID]: action.payload.data,
      };
    },
    setBufferForTaskDrag: (
      state: SortState,
      action: PayloadAction<{
        droppableId: string;
        srcDroppableId: string;
        draggingId: number;
      }>,
    ) => {
      state.bufferForTaskDrag = { ...action.payload };
    },
    resetBufferForTask: (state: SortState) => {
      state.bufferForTaskDrag = {
        droppableId: undefined,
        srcDroppableId: undefined,
        draggingId: 0,
      };
    },
  },
});

export const {
  setSortInfoForType,
  setDropPadsDict,
  setBufferForTaskDrag,
  resetBufferForTask,
} = sortSlice.actions;

export default sortSlice.reducer;
