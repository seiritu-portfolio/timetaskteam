import { GroupSelectProps } from '@model/input';
import WebIcon from '@svg/web.svg';
import LockShieldIcon from '@svg/lock-shield.svg';
import { TASK_STATUS_A_DAY } from './constants';

const IMPORTANCE_OPTIONS = [
  {
    label: '低',
    value: '1',
  },
  {
    label: '中',
    value: '2',
  },
  {
    label: '高',
    value: '3',
  },
];

const LOGIN_METHODS_OPTIONS = [
  {
    label: 'メールアドレスでログイン',
    value: '1',
  },
  {
    label: 'Googleでログイン',
    value: '2',
  },
];

const WEEK_START_DATE_OPTIONS = [
  {
    label: '日曜日',
    value: '0',
  },
  {
    label: '月曜日',
    value: '1',
  },
];

const UTILRATE_OPTIONS = [
  {
    label: '3h',
    value: '180',
  },
  {
    label: '6h30m',
    value: '390',
  },
  {
    label: '8h',
    value: '480',
  },
  {
    label: '9h',
    value: '540',
  },
];

export const AVAILABLE_TIME_LIST = [
  30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360, 390, 420, 450, 480,
  510, 540, 570, 600, 630, 660, 690, 720, 750, 780, 810, 840, 870, 900, 930,
  960, 990, 1020, 1050, 1080, 1110, 1140, 1170, 1200, 1230, 1260, 1290, 1320,
  1350, 1380, 1410, 1440,
];

export const TASK_REQUIRED_DEFAULT = [
  30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360, 390, 420, 450, 480,
  510, 540, 570, 600, 630, 660, 690, 720,
];

const REMAIN_DAYS_FOR_STARTDATE_OPTIONS = [
  {
    label: '1日前',
    value: '1',
  },
  {
    label: '2日前',
    value: '2',
  },
  {
    label: '3日前',
    value: '3',
  },
  {
    label: '4日前',
    value: '4',
  },
  {
    label: '5日前',
    value: '5',
  },
  {
    label: '6日前',
    value: '6',
  },
  {
    label: '7日前',
    value: '7',
  },
  {
    label: '8日前',
    value: '8',
  },
  {
    label: '9日前',
    value: '9',
  },
];

const REMAIN_DAYS_FOR_ENDDATE_OPTIONS = [
  {
    label: '1日後',
    value: '1',
  },
  {
    label: '2日後',
    value: '2',
  },
  {
    label: '3日後',
    value: '3',
  },
  {
    label: '4日後',
    value: '4',
  },
  {
    label: '5日後',
    value: '5',
  },
  {
    label: '6日後',
    value: '6',
  },
  {
    label: '7日後',
    value: '7',
  },
  {
    label: '8日後',
    value: '8',
  },
  {
    label: '9日後',
    value: '9',
  },
];

const MEMBER_TYPE_OPTIONS = [
  {
    label: 'メンバー',
    value: 'member',
  },
  {
    label: 'ゲスト',
    value: 'guest',
  },
];

const REFLECT_OCCUPANCY_OPTIONS = [
  {
    label: '反映する',
    value: '0',
  },
  {
    label: '反映しない',
    value: '1',
  },
];

const IS_PUBLIC_OPTIONS = [
  {
    label: '公開',
    value: 1,
    icon: WebIcon,
  },
  {
    label: '非公開',
    value: 0,
    icon: LockShieldIcon,
  },
];

const GROUP_DEFAULT_OPTIONS: GroupSelectProps[] = [
  {
    label: 'なし',
    value: '-1',
    collabUsers: [],
  },
];

const REQUIRED_TIME_OPTIONS: { label: string; value: string }[] = [
  {
    label: '0h30mins',
    value: '30',
  },
  {
    label: '1h00mins',
    value: '60',
  },
  {
    label: '1h30mins',
    value: '90',
  },
  {
    label: '2h00mins',
    value: '120',
  },
  {
    label: '2h30mins',
    value: '150',
  },
  {
    label: '3h00mins',
    value: '180',
  },
  {
    label: '3h30mins',
    value: '210',
  },
  {
    label: '4h00mins',
    value: '240',
  },
  {
    label: '4h30mins',
    value: '270',
  },
  {
    label: '5h00mins',
    value: '300',
  },
  {
    label: '5h30mins',
    value: '330',
  },
  {
    label: '6h00mins',
    value: '360',
  },
  {
    label: '6h30mins',
    value: '390',
  },
  {
    label: '7h00mins',
    value: '420',
  },
  {
    label: '7h30mins',
    value: '450',
  },
  {
    label: '8h00mins',
    value: '480',
  },
  {
    label: '8h30mins',
    value: '510',
  },
  {
    label: '9h00mins',
    value: '540',
  },
  {
    label: '9h30mins',
    value: '570',
  },
  {
    label: '10h00mins',
    value: '600',
  },
  {
    label: '10h30mins',
    value: '630',
  },
  {
    label: '11h00mins',
    value: '660',
  },
  {
    label: '11h30mins',
    value: '690',
  },
  {
    label: '12h00mins',
    value: '720',
  },
];

export const REQUIRED_TIME_CUSTOM_OPTIONS = [
  {
    label: 'minutes',
    value: '0',
  },
  {
    label: 'hours',
    value: '1',
  },
];

const REMINDER_OPTIONS = [
  {
    label: 'リマインダーなし',
    value: '-1',
    type: 'none',
  },
  {
    label: '当日',
    value: '0d',
    type: 'day',
  },
  {
    label: '1日前',
    value: '1d',
    type: 'day',
  },
  {
    label: '2日前',
    value: '2d',
    type: 'day',
  },
  {
    label: '3日前',
    value: '3d',
    type: 'day',
  },
  {
    label: '1週間前',
    value: '7d',
    type: 'day',
  },
  {
    label: '2週間前',
    value: '14d',
    type: 'day',
  },
  {
    label: '1ヶ月前',
    value: '1m',
    type: 'month',
  },
];

const REMINDER_CUSTOM_TIME_OPTIONS = [
  {
    label: '00:00am',
    value: '00:00',
  },
  {
    label: '01:00am',
    value: '01:00',
  },
  {
    label: '02:00am',
    value: '02:00',
  },
  {
    label: '03:00am',
    value: '03:00',
  },
  {
    label: '04:00am',
    value: '04:00',
  },
  {
    label: '05:00am',
    value: '05:00',
  },
  {
    label: '06:00am',
    value: '06:00',
  },
  {
    label: '07:00am',
    value: '07:00',
  },
  {
    label: '08:00am',
    value: '08:00',
  },
  {
    label: '09:00am',
    value: '09:00',
  },
  {
    label: '10:00am',
    value: '10:00',
  },
  {
    label: '11:00am',
    value: '11:00',
  },
  {
    label: '12:00pm',
    value: '12:00',
  },
  {
    label: '1:00pm',
    value: '13:00',
  },
  {
    label: '2:00pm',
    value: '14:00',
  },
  {
    label: '3:00pm',
    value: '15:00',
  },
  {
    label: '4:00pm',
    value: '16:00',
  },
  {
    label: '5:00pm',
    value: '17:00',
  },
  {
    label: '6:00pm',
    value: '18:00',
  },
  {
    label: '7:00am',
    value: '19:00',
  },
  {
    label: '8:00pm',
    value: '20:00',
  },
  {
    label: '9:00pm',
    value: '21:00',
  },
  {
    label: '10:00pm',
    value: '22:00',
  },
  {
    label: '11:00pm',
    value: '23:00',
  },
];

const REPETITION_OPTIONS = [
  {
    label: '繰り返しなし',
    value: '-1',
  },
  {
    label: '毎日',
    value: 'FREQ=DAILY;INTERVAL=1',
  },
  {
    label: '毎週',
    value: 'FREQ=WEEKLY;INTERVAL=1',
  },
  {
    label: '毎月',
    value: 'FREQ=MONTHLY;INTERVAL=1',
  },
  {
    label: '毎年',
    value: 'FREQ=YEARLY;INTERVAL=1',
  },
];

const TIME_DISPLAY_OPTIONS = [
  { label: '12h', value: '1' },
  { label: '24h', value: '2' },
];

const WEEKDAY_OPTIONS = [
  // {
  //   label: '登録しない',
  //   value: '-1',
  // },
  {
    label: '月曜日',
    value: '1',
  },
  {
    label: '火曜日',
    value: '2',
  },
  {
    label: '水曜日',
    value: '3',
  },
  {
    label: '木曜日',
    value: '4',
  },
  {
    label: '金曜日',
    value: '5',
  },
  {
    label: '土曜日',
    value: '6',
  },
  {
    label: '日曜日',
    value: '0',
  },
  // {
  //   label: '祝日',
  //   value: '7',
  // },
];

const REPETITION_PERIOD_TYPES_OPTIONS = [
  {
    label: '日ごと',
    value: 'DAILY',
  },
  {
    label: '週間ごと',
    value: 'WEEKLY',
  },
  {
    label: 'ヶ月ごと',
    value: 'MONTHLY',
  },
  {
    label: '年ごと',
    value: 'YEARLY',
  },
];

export const TASK_EXECUTION_STATUS_OPTIONS = [
  {
    label: '実行',
    value: TASK_STATUS_A_DAY.DONE.toString(),
  },
  {
    label: '未実行',
    value: TASK_STATUS_A_DAY.UNDONE.toString(),
  },
  {
    label: '完了',
    value: TASK_STATUS_A_DAY.COMPLETED.toString(),
  },
];

export const COUNT_LIMIT_OPTIONS = [
  {
    label: '0',
    value: '0',
  },
  {
    label: '1',
    value: '1',
  },
  {
    label: '2',
    value: '2',
  },
  {
    label: '3',
    value: '3',
  },
  {
    label: '4',
    value: '4',
  },
  {
    label: '5',
    value: '5',
  },
  {
    label: '6',
    value: '6',
  },
];

export const HOURS_A_DAY_LIST: number[] = [
  30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360,
];
const SUBSCRIPTION_USERS_COUNT_LIST: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const REPETITION_PERIOD_TIMES_LIST: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export const VIEWMODE_OPTIONS = [
  {
    label: '月',
    value: 'month',
  },
  {
    label: '4週',
    value: 'weeks4',
  },
  {
    label: '2週',
    value: 'weeks2',
  },
  {
    label: '週',
    value: 'week',
  },
];

export const UTIL_RATE_MENU_LIST = [
  {
    text: '今日',
    value: 'today',
  },
  {
    text: '直近3日間',
    value: '3d',
  },
  {
    text: '直近7日間',
    value: '7d',
  },
  {
    text: '今週',
    value: '1w',
  },
  {
    text: '今月',
    value: '1m',
  },
  {
    text: '直近30日',
    value: '30d',
  },
];

export const UTIL_RATE_TAB_LIST = [
  {
    label: 'メンバー',
    value: 0,
  },
  {
    label: 'ゲスト',
    value: 1,
  },
  {
    label: '全メンバー',
    value: 2,
  },
];

export {
  IMPORTANCE_OPTIONS,
  LOGIN_METHODS_OPTIONS,
  WEEK_START_DATE_OPTIONS,
  UTILRATE_OPTIONS,
  REMAIN_DAYS_FOR_STARTDATE_OPTIONS,
  REMAIN_DAYS_FOR_ENDDATE_OPTIONS,
  SUBSCRIPTION_USERS_COUNT_LIST,
  MEMBER_TYPE_OPTIONS,
  GROUP_DEFAULT_OPTIONS,
  REQUIRED_TIME_OPTIONS,
  REMINDER_OPTIONS,
  REMINDER_CUSTOM_TIME_OPTIONS,
  REPETITION_OPTIONS,
  TIME_DISPLAY_OPTIONS,
  WEEKDAY_OPTIONS,
  REPETITION_PERIOD_TYPES_OPTIONS,
  REPETITION_PERIOD_TIMES_LIST,
  REFLECT_OCCUPANCY_OPTIONS,
  IS_PUBLIC_OPTIONS,
};
