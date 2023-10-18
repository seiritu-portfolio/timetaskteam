import { GlobalState } from '@model/state';

const homeInfoSelector = (state: GlobalState) => state.home;
const searchSelector = (state: GlobalState) => state.home.search;
const codisplayUsersSelector = (state: GlobalState) =>
  state.home.codisplay.users;
const onCodisplaySelector = (state: GlobalState) => state.home.codisplay.on;
const currentCodisplayUserSelector = (state: GlobalState) =>
  state.home.codisplay.currentUserID;
const codisplayFetchingSelector = (state: GlobalState) =>
  state.home.codisplay.fetching;
const modalUrlSelector = (state: GlobalState) => state.home.modalUrl;
const settingsModalStatusSelector = (state: GlobalState) =>
  state.home.routeModalStatus.settingsModal;
const activeSettingsTabSelector = (state: GlobalState) =>
  state.home.routeModalStatus.activeSettingsTabIndex;
const contactusModalStatusSelector = (state: GlobalState) =>
  state.home.routeModalStatus.contactusModal;
const policiesModalStatusSelector = (state: GlobalState) =>
  state.home.routeModalStatus.policiesModal;
const taskModalStatusSelector = (state: GlobalState) =>
  state.home.routeModalStatus.taskModal;
const scheduleModalStatusSelector = (state: GlobalState) =>
  state.home.routeModalStatus.scheduleModal;
const userlistSettingModeSelector = (state: GlobalState) =>
  state.home.userlistSetting.currentState;
const userlistSettingGroupIDSelector = (state: GlobalState) =>
  state.home.userlistSetting.currentGroup;
const groupUserSelectModalSelector = (state: GlobalState) =>
  state.home.userlistSetting.newGroup.groupUserSelectModal.isOpen;
const groupUserSelectModalConfirmText = (state: GlobalState) =>
  state.home.userlistSetting.newGroup.groupUserSelectModal.confirmBtnText;
const groupAddModalSelector = (state: GlobalState) =>
  state.home.userlistSetting.newGroup.groupAddModal;
const idsForNewGroupSelector = (state: GlobalState) =>
  state.home.userlistSetting.newGroup.idsForGroup;
const listModalStatusSelector = (state: GlobalState) =>
  state.home.routeModalStatus.listModal;
const listAddModalStatusSelector = (state: GlobalState) =>
  state.home.routeModalStatus.listAddModal;
const listEditModalStatusSelector = (state: GlobalState) =>
  state.home.routeModalStatus.listEditModal;
const previewImageSelector = (state: GlobalState) => state.home.previewImageUrl;
const nofityReadListSelector = (state: GlobalState) =>
  state.home.notifyReadList;
const notifyUnreadListSelector = (state: GlobalState) =>
  state.home.notifyUnreadList;
const queueSettingSelector = (state: GlobalState) => state.home.queueSetting;
const isSidebarOpenSelector = (state: GlobalState) => state.home.isSidebarOpen;
const isNoteSidebarOpenSelector = (state: GlobalState) =>
  state.home.noteSidebarOpen;
const noteModalStatusSelector = (state: GlobalState) =>
  state.home.routeModalStatus.noteModal;
const isOnSearchSelector = (state: GlobalState) => state.home.isOnSearch;

export {
  homeInfoSelector,
  searchSelector,
  currentCodisplayUserSelector,
  codisplayUsersSelector,
  onCodisplaySelector,
  codisplayFetchingSelector,
  modalUrlSelector,
  settingsModalStatusSelector,
  activeSettingsTabSelector,
  contactusModalStatusSelector,
  policiesModalStatusSelector,
  taskModalStatusSelector,
  scheduleModalStatusSelector,
  userlistSettingModeSelector,
  userlistSettingGroupIDSelector,
  groupUserSelectModalSelector,
  groupUserSelectModalConfirmText,
  groupAddModalSelector,
  idsForNewGroupSelector,
  listModalStatusSelector,
  listAddModalStatusSelector,
  listEditModalStatusSelector,
  previewImageSelector,
  nofityReadListSelector,
  notifyUnreadListSelector,
  queueSettingSelector,
  isSidebarOpenSelector,
  isNoteSidebarOpenSelector,
  noteModalStatusSelector,
  isOnSearchSelector,
};
