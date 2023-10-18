import { GlobalState } from '@model/state';

const taskListsSelector = (state: GlobalState) => state.lists.taskLists;
const scheduleListsSelector = (state: GlobalState) => state.lists.scheduleLists;
const noteListsSelector = (state: GlobalState) => state.lists.noteLists;
const taskArchivedSelector = (state: GlobalState) =>
  state.lists.taskArchivedLists;
const scheduleArchivedSelector = (state: GlobalState) =>
  state.lists.scheduleArchivedLists;
const currentListIDSelector = (state: GlobalState) => state.lists.currentListID;
const currentListNameSelector = (state: GlobalState) =>
  state.lists.currentListName;
const addListTypeSelector = (state: GlobalState) => state.lists.addListType;
const listNotesSelector = (state: GlobalState) => state.lists.listNotes;
const currentNoteIDSelector = (state: GlobalState) => state.lists.currentNoteID;

export {
  taskListsSelector,
  scheduleListsSelector,
  noteListsSelector,
  taskArchivedSelector,
  scheduleArchivedSelector,
  currentListIDSelector,
  currentListNameSelector,
  addListTypeSelector,
  listNotesSelector,
  currentNoteIDSelector,
};
