import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ListState, ListType, NoteType } from '@model/state';

const initialState: ListState = {
  taskLists: [],
  scheduleLists: [],
  taskArchivedLists: [],
  scheduleArchivedLists: [],
  currentListID: 0,
  currentListName: '',
  addListType: 1,
  // * addtion for note
  noteLists: [],
  listNotes: [],
  currentNoteID: 0,
};

const listsSlice = createSlice({
  name: 'lists',
  initialState,
  reducers: {
    setTaskLists: (state: ListState, action: PayloadAction<ListType[]>) => {
      state.taskLists = action.payload;
    },
    setScheduleLists: (state: ListState, action: PayloadAction<ListType[]>) => {
      state.scheduleLists = action.payload;
    },
    setNoteLists: (state: ListState, action: PayloadAction<ListType[]>) => {
      state.noteLists = action.payload;
    },
    setTaskArchivedLists: (
      state: ListState,
      action: PayloadAction<ListType[]>,
    ) => {
      state.taskArchivedLists = action.payload;
    },
    setScheduleArchivedLists: (
      state: ListState,
      action: PayloadAction<ListType[]>,
    ) => {
      state.scheduleArchivedLists = action.payload;
    },
    setCurrentListID: (state: ListState, action: PayloadAction<number>) => {
      state.currentListID = action.payload;
    },
    setCurrentListName: (state: ListState, action: PayloadAction<string>) => {
      state.currentListName = action.payload;
    },
    setAddListType: (state: ListState, action: PayloadAction<1 | 2 | 3>) => {
      state.addListType = action.payload;
    },
    setListNotes: (state: ListState, action: PayloadAction<NoteType[]>) => {
      state.listNotes = action.payload;
    },
    setCurrentNoteID: (state: ListState, action: PayloadAction<number>) => {
      state.currentNoteID = action.payload;
    },
    resetCurrentNoteID: (state: ListState) => {
      state.currentNoteID = 0;
    },
  },
});

export const {
  setTaskLists,
  setScheduleLists,
  setNoteLists,
  setTaskArchivedLists,
  setScheduleArchivedLists,
  setCurrentListID,
  setCurrentListName,
  setAddListType,
  setListNotes,
  setCurrentNoteID,
  resetCurrentNoteID,
} = listsSlice.actions;

export default listsSlice.reducer;
