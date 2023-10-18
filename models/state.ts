import { Dayjs } from 'dayjs';
import { CalendarRenderItem, CalendarRenderItemExtended } from './calendar';
import { GroupType } from './user';

export interface AuthState {
  email: string;
  username: string;
  password: string;
  userAgent: string;
  authCode: string;
}

export interface GlobalState {
  auth: AuthState;
  user: UserState;
  calendar: CalendarState;
  home: HomeState;
  subscription: SubscriptionState;
  collabos: CollabosState;
  lists: ListState;
  tasks: TaskState;
  schedules: ScheduleState;
  sort: SortState;
}

export interface UserState {
  user: UserType | null;
  token: string;
  tzOffsetMins: number;
  tzOffsetMinsBrowser: number;
}

export interface ListType {
  id: number;
  name: string;
  type: 1 | 2;
  icon: number;
  color: number;
  occupancy_rate_visible?: 0 | 1;
  status: 0 | 1;
  cooperator_type?: 1 | 2 | 3;
  cooperator_group_id?: number;
  cooperators: UserType[];
  pivot?: any;
  calendar_id?: string;
  calendar_summary?: string;
}

export interface UserType {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  uuid?: string;
  login_method?: number;
  timezone?: string;
  time_display?: number;
  week_start?: number;
  holiday_display?: number;
  firebase_uid: string | null;
  available_time?: number;
  task_default_time?: number;
  auto_remain_days?: number;
  urgency_switch?: string;
  non_operating_days?: string;
  non_operating_week_days?: string;
  non_operating_exception_days?: string;
  google_email?: string;
  task_inbox_id: number;
  schedule_inbox_id: number;
  note_inbox_id: number | null;
  premium_method: number;
  premium_code: string;
  card_number_last4: string;
  premium_count: number;
  pivot?: {
    color?: number;
    role?: number;
  };
  color?: number;
  gc_refresh_token?: string;
  gc_email: string;
}

export interface CalendarState {
  viewMode: 'month' | 'weeks4' | 'weeks2' | 'half' | 'week';
  calendarDate: Dayjs;
  currentDate: Dayjs;
  expanded: boolean;
  holidays: {
    id: string;
    date: string;
    summary: string;
    eventType: string;
  }[];
  filter: string;
  countLimitADay: {
    schedule: number;
    task: number;
  };
  magnifiedDate: string;
  draggedDate: string;
  droppedDate: string;
  copyItem: CalendarRenderItemExtended | undefined;
  newTaskSchedule: string;
  gcalendarList: Array<{
    id: string;
    summary: string;
  }>;
  syncInfo: SyncItemInfo[];
  // ! calendar sidebar startDate set/unset tab
  startdateUnset?: boolean;
  // ! calendar panel prev day render info
  prevDayInfo: PrevDayInfo[];
  userIDSelected: number;
  draggingItemId: number;
  isSidebarOpen: boolean;
  // ! calendar tasks Expired, Today toggle
  tasksToggle: {
    expired: boolean;
    today: boolean;
  };
  hideDetailBar: boolean;
  scheduleListsToHide?: number[];
  taskListsToHide?: number[];
}

export interface HomeState {
  modalUrl: string;
  search: string;
  codisplay: {
    currentUserID: number;
    users: number[];
    on: boolean;
    fetching: boolean;
  };
  routeModalStatus: {
    settingsModal: boolean;
    contactusModal: boolean;
    policiesModal: boolean;
    activeSettingsTabIndex: number;
    taskModal: boolean;
    scheduleModal: boolean;
    listModal: boolean;
    listAddModal: boolean;
    listEditModal: boolean;
    noteModal: boolean;
  };
  userlistSetting: {
    currentState: number;
    currentGroup?: number;
    newGroup: {
      idsForGroup: number[];
      groupUserSelectModal: {
        isOpen: boolean;
        confirmBtnText: string;
      };
      groupAddModal: boolean;
    };
  };
  previewImageUrl: string;
  // * notify list
  notifyReadList: any[];
  notifyUnreadList: any[];
  queueSetting: {
    // account
    googleAccount?: string;
    loginMethod?: number;
    avatar?: string;
    name?: string;
    email?: string;
    id_token?: string;
    // display
    tz?: string;
    timeDisplay?: number;
    weekStart?: number;
    displayHoliday?: number;
    // productivity
    availableTime?: number;
    taskDefaultTime?: number;
    autoRemainDays?: number;
    urgencySwitch?: string;
    nonOperatingDays?: string[];
    nonOperatingWeekDays?: string[];
    nonOperatingExceptionDays?: string;
    noInactiveDays?: string[];
    urgencyStart?: number;
    urgencyEnd?: number;
  };
  isSidebarOpen: boolean;
  noteSidebarOpen: boolean;
  isOnSearch: boolean;
}

export interface TaskState {
  currentTaskID: number | null;
  currentTask: any | null;
  tasksAll: any[];
  tasksToday: any[];
  tasksRequested: any[];
  tasksRequest: any[];
  tasksInbox: any[];
  tasksForList: any[];
  tasksForCalendar: any[];
  currentTasks: any[];
  mode: {
    selectTaskMode: boolean;
    modal: {
      modalMoveList: boolean;
      modalPriority: boolean;
      modalRequiredTime: boolean;
      modalRemoveTasks: boolean;
    };
  };
  ratesListForTask: Array<{
    task_id: number;
    due_date: string;
    required_time: number;
    actual_time: number;
    status: number;
  }>;
  totalTasksCount: number;
  showTaskDetail: boolean;
  placeholderProps: PlaceholderState | undefined;
  dragItemEndDate?: string;
  dragItemPadId?: string;
  tasksCountDict: any;
}

export interface ScheduleState {
  currentScheduleID: number | null;
  currentSchedule: any | null;
  scheduleAll: any[];
  schedulesForCalendar: any[];
}

export interface SubscriptionState {
  currentSettingState: number;
  premiumCode: string;
  purchasedInfo: PurchasedInfoState | null;
  currentOpenModal: number;
}

export interface PurchasedInfoState {
  last4?: string;
  userCount?: number;
  method?: string;
}

export interface CollabosState {
  member: UserType[];
  guest: UserType[];
  requesters: UserType[];
  memberToAdd: UserType[];
  guestToAdd: UserType[];
  group: GroupType[];
  workRatesMembers: {
    id: string;
    rate: number;
    actualTime: number;
    requiredTime: number;
  }[];
  currentCollaboId: number;
}

export interface ListState {
  taskLists: ListType[];
  scheduleLists: ListType[];
  noteLists: ListType[];
  listNotes: NoteType[];
  taskArchivedLists: ListType[];
  scheduleArchivedLists: ListType[];
  currentListID: number;
  currentListName: string;
  addListType: 1 | 2 | 3;
  currentNoteID: number;
}

export interface SortState {
  tasksSortDict: {
    [id: number]: number;
  };
  listsSortDict: {
    [id: number]: number;
  };
  collabosSortDict: {
    [id: number]: number;
  };
  dropPadsDict: {
    [droppableId: string]: number[];
  };
  bufferForTaskDrag: {
    droppableId: string | undefined;
    srcDroppableId: string | undefined;
    draggingId: number;
  };
}

export interface SyncItemInfo {
  list_id: number;
  calendar_id: string;
  calendar_summary: string;
}

export interface PrevDayInfo {
  date: string;
  schedules: number[];
  tasks: number[];
}

// ! state for managing a placeholder for task drag&drop at tasks page
export interface PlaceholderState {
  droppableId: number;
  clientHeight: number;
  clientWidth: number;
  clientY: number;
  clientX: number;
}

export interface NoteType {
  id: number;
  list_id: number;
  user_id: number;
  title: string;
  memo: string;
  created_at: string;
  updated_at: string;
  viewers?: UserType[];
}
