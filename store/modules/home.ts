import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { HomeState } from '@model/state';
import { USERLIST_STATES } from '@util/constants';

const initialState: HomeState = {
  // * this state stores the origin url before route modal opens
  modalUrl: '',
  search: '',
  codisplay: {
    currentUserID: 0,
    users: [],
    on: false,
    fetching: false,
  },
  routeModalStatus: {
    settingsModal: false,
    contactusModal: false,
    policiesModal: false,
    activeSettingsTabIndex: 0,
    taskModal: false,
    scheduleModal: false,
    noteModal: false,
    listModal: false,
    listAddModal: false,
    listEditModal: false,
  },
  // * settings userlist tab mode
  userlistSetting: {
    currentState: USERLIST_STATES.GENERAL_MODE,
    newGroup: {
      idsForGroup: [],
      groupUserSelectModal: {
        isOpen: false,
        confirmBtnText: '次へ',
      },
      groupAddModal: false,
    },
  },
  // * settings subscription related
  // * preview image url
  previewImageUrl: '',
  // * notification lists
  notifyReadList: [],
  notifyUnreadList: [],
  queueSetting: {},
  // * sidebar open status
  isSidebarOpen: false,
  noteSidebarOpen: true,
  isOnSearch: false,
};

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    setCurrentCodisplayUser: (
      state: HomeState,
      action: PayloadAction<number>,
    ) => {
      state.codisplay.currentUserID = action.payload;
    },
    setCodisplayUsers: (state: HomeState, action: PayloadAction<number[]>) => {
      state.codisplay.users = action.payload;
    },
    setSearch: (state: HomeState, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    onOffCodisplayMode: (state: HomeState, action: PayloadAction<boolean>) => {
      state.codisplay.on = action.payload;
    },
    setCodisplayFetching: (
      state: HomeState,
      action: PayloadAction<boolean>,
    ) => {
      state.codisplay.fetching = action.payload;
    },
    setModalUrl: (state: HomeState, action: PayloadAction<string>) => {
      state.modalUrl = action.payload;
    },
    setContactusModalStatus: (
      state: HomeState,
      action: PayloadAction<boolean>,
    ) => {
      state.routeModalStatus.contactusModal = action.payload;
    },
    setSettingsModalStatus: (
      state: HomeState,
      action: PayloadAction<boolean>,
    ) => {
      state.routeModalStatus.settingsModal = action.payload;
    },
    setPoliciesModalStatus: (
      state: HomeState,
      action: PayloadAction<boolean>,
    ) => {
      state.routeModalStatus.policiesModal = action.payload;
    },
    setActiveSettingsTab: (state: HomeState, action: PayloadAction<number>) => {
      state.routeModalStatus.activeSettingsTabIndex = action.payload;
    },
    setTaskModalStatus: (state: HomeState, action: PayloadAction<boolean>) => {
      state.routeModalStatus.taskModal = action.payload;
    },
    setNoteModalStatus: (state: HomeState, action: PayloadAction<boolean>) => {
      state.routeModalStatus.noteModal = action.payload;
    },
    setScheduleModalStatus: (
      state: HomeState,
      action: PayloadAction<boolean>,
    ) => {
      state.routeModalStatus.scheduleModal = action.payload;
    },
    setUserlistSettingMode: (
      state: HomeState,
      action: PayloadAction<number>,
    ) => {
      state.userlistSetting.currentState = action.payload;
    },
    setUserlistCurrentGroup: (
      state: HomeState,
      action: PayloadAction<number>,
    ) => {
      state.userlistSetting.currentGroup = action.payload;
    },
    setGroupUserSelectModal: (
      state: HomeState,
      action: PayloadAction<boolean>,
    ) => {
      state.userlistSetting.newGroup.groupUserSelectModal.isOpen =
        action.payload;
    },
    setGroupAddModal: (state: HomeState, action: PayloadAction<boolean>) => {
      state.userlistSetting.newGroup.groupAddModal = action.payload;
    },
    setListModal: (state: HomeState, action: PayloadAction<boolean>) => {
      state.routeModalStatus.listModal = action.payload;
    },
    setListAddModal: (state: HomeState, action: PayloadAction<boolean>) => {
      state.routeModalStatus.listAddModal = action.payload;
    },
    setListEditModal: (state: HomeState, action: PayloadAction<boolean>) => {
      state.routeModalStatus.listEditModal = action.payload;
    },
    setIDsForNewGroup: (state: HomeState, action: PayloadAction<number[]>) => {
      state.userlistSetting.newGroup.idsForGroup = action.payload;
    },
    setPreviewImageUrl: (state: HomeState, action: PayloadAction<string>) => {
      state.previewImageUrl = action.payload;
    },
    setNofityReadList: (state: HomeState, action: PayloadAction<any[]>) => {
      state.notifyReadList = action.payload;
    },
    setNotifyUnreadList: (state: HomeState, action: PayloadAction<any[]>) => {
      state.notifyUnreadList = action.payload;
    },
    updateQueueSetting: (
      state: HomeState,
      action: PayloadAction<{
        [key: string]: any;
      }>,
    ) => {
      state.queueSetting = {
        ...state.queueSetting,
        ...action.payload,
      };
    },
    toggleSidebar: (state: HomeState) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    toggleNoteSidebar: (state: HomeState) => {
      state.noteSidebarOpen = !state.noteSidebarOpen;
    },
    setIsOnSearch: (state: HomeState, action: PayloadAction<boolean>) => {
      state.isOnSearch = action.payload;
    },
    toggleIsOnSearch: (state: HomeState) => {
      state.isOnSearch = !state.isOnSearch;
    },
  },
});

export const {
  setSearch,
  setCurrentCodisplayUser,
  setCodisplayUsers,
  onOffCodisplayMode,
  setCodisplayFetching,
  setModalUrl,
  setContactusModalStatus,
  setSettingsModalStatus,
  setPoliciesModalStatus,
  setActiveSettingsTab,
  setTaskModalStatus,
  setScheduleModalStatus,
  setUserlistSettingMode,
  setUserlistCurrentGroup,
  setGroupUserSelectModal,
  setGroupAddModal,
  setIDsForNewGroup,
  setListModal,
  setListAddModal,
  setListEditModal,
  setPreviewImageUrl,
  setNofityReadList,
  setNotifyUnreadList,
  updateQueueSetting,
  toggleSidebar,
  toggleNoteSidebar,
  setNoteModalStatus,
  setIsOnSearch,
  toggleIsOnSearch,
} = homeSlice.actions;
export default homeSlice.reducer;
