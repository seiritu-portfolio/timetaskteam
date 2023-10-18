import { GlobalState } from '@model/state';

const tasksSortDictSelector = (state: GlobalState) => state.sort.tasksSortDict;
const listsSortDictSelector = (state: GlobalState) => state.sort.listsSortDict;
const collabosSortDictSelector = (state: GlobalState) =>
  state.sort.collabosSortDict;
const dropPadsDictSelector = (state: GlobalState) => state.sort.dropPadsDict;
const bufferForTaskDragSelector = (state: GlobalState) =>
  state.sort.bufferForTaskDrag;

export {
  tasksSortDictSelector,
  listsSortDictSelector,
  collabosSortDictSelector,
  dropPadsDictSelector,
  bufferForTaskDragSelector,
};
