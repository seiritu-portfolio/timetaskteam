import BoltIcon from '@svg/bolt.svg';
import CalendarIcon from '@svg/calendar.svg';
import LightbulbIcon from '@svg/lightbulb.svg';
import LinkIcon from '@svg/link.svg';
import PersonRectangleStackIcon from '@svg/person-rectangle-stack.svg';
import PersonIcon from '@svg/person.svg';
import AllTasksIcon from '@svg/square-stack.svg';
import TodayTaskIcon from '@svg/calendar-24.svg';
import TaskHostedIcon from '@svg/arrow_right_square.svg';
import TaskRequestedIcon from '@svg/arrow_left_square.svg';
import InboxIcon from '@svg/tray.svg';
import PolicyIcon from '@svg/policy.svg';

import { TaskMenuType } from '@model/constants';
import {
  TASKS_ALL_URL,
  TASKS_REQUESTED_URL,
  TASKS_REQUEST_URL,
  TASKS_TODAY_URL,
} from './urls';

export const SETTINGS_MENU_DATA: any[] = [
  {
    index: 0,
    text: 'アカウント',
    Icon: PersonIcon,
    link: 'account',
    active: true,
  },
  {
    index: 1,
    text: '表示設定',
    Icon: CalendarIcon,
    link: 'display',
    active: false,
  },
  {
    index: 2,
    text: '生産性',
    Icon: LightbulbIcon,
    link: 'productivity',
    active: false,
  },
  {
    index: 3,
    text: 'ユーザー一覧',
    Icon: PersonRectangleStackIcon,
    link: 'userlist',
    active: false,
  },
  {
    index: 4,
    text: 'サブスクリプション',
    Icon: BoltIcon,
    link: 'subscription',
    active: false,
  },
  {
    index: 5,
    text: '連携機能',
    Icon: LinkIcon,
    link: 'sync',
    active: false,
  },
  {
    index: 6,
    text: '利用規約・ポリシー',
    Icon: PolicyIcon,
    link: 'policies',
    active: false,
  },
];

export const TASK_MENU_LIST: TaskMenuType[] = [
  {
    text: '全てのタスク',
    icon: AllTasksIcon,
    link: TASKS_ALL_URL,
    slug: 'all',
  },
  {
    text: '今日のタスク',
    icon: TodayTaskIcon,
    link: TASKS_TODAY_URL,
    slug: 'today',
  },
  {
    text: '依頼を受けたタスク',
    icon: TaskHostedIcon,
    link: TASKS_REQUEST_URL,
    slug: 'requested',
  },
  {
    text: '依頼したタスク',
    icon: TaskRequestedIcon,
    link: TASKS_REQUESTED_URL,
    slug: 'request',
  },
  {
    text: 'インボックス',
    icon: InboxIcon,
    link: '/tasks/list/',
    slug: '',
  },
];

export const COOPERATE_TABS_LIST = [
  {
    type: 0,
    desc: 'メンバー',
    descForAdd: 'ユーザー追加',
  },
  {
    type: 1,
    desc: 'ゲスト',
    descForAdd: 'ユーザー追加',
  },
  {
    type: 2,
    desc: 'グループ',
    descForAdd: 'グループ追加',
  },
];

export const TASK_DETAIL_TAB_MENU_LIST = [
  {
    label: '詳細情報',
    value: 0,
  },
  {
    label: '継続管理',
    value: 1,
  },
  {
    label: '依頼管理',
    value: 2,
  },
];

export const MORE_MENU_ITEMS_FOR_TASK = [
  {
    text: 'スケジュールに変更',
    className: 'text-fontPrimary',
    action: 'toSchedule',
  },
  {
    text: '複製',
    className: 'text-fontPrimary',
    action: 'copy',
  },
  {
    text: '消去',
    className: 'text-secondary',
    action: 'delete',
  },
];

export const MORE_MENU_ITEMS_FOR_SCHEDULES = [
  {
    text: ' タスクに変更',
    className: 'text-fontPrimary',
    action: 'toTask',
  },
  {
    text: '複製',
    className: 'text-fontPrimary',
    action: 'copy',
  },
  {
    text: '消去',
    className: 'text-secondary',
    action: 'delete',
  },
];
