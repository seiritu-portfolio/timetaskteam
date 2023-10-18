import { CooperateType } from '@model/constants';

import ListBulletIcon from '@svg/list-bullet.svg';
import BriefcaseIcon from '@svg/briefcase.svg';
import Building2Icon from '@svg/building-2.svg';
import BankIcon from '@svg/bank.svg';
import BooksVerticalIcon from '@svg/books-vertical.svg';
import GraduationCapIcon from '@svg/graduationcap.svg';
import BanknoteIcon from '@svg/banknote.svg';
import ChartPieIcon from '@svg/chart-pie.svg';
import ChartlineUptrendIcon from '@svg/chart-line-uptrend-xyaxis.svg';
import ChartBarXaxisIcon from '@svg/chart-bar-xaxis.svg';
import FaceSmileIcon from '@svg/face-smiling.svg';
import HeartIcon from '@svg/heart.svg';
import StarIcon from '@svg/star.svg';
import BoltIcon from '@svg/bolt01.svg';
import LockIcon from '@svg/lock.svg';
import InfoIcon from '@svg/info.svg';
import QuestionIcon from '@svg/questionmark.svg';
import ExclamationMark2Icon from '@svg/exclamationmark-2.svg';
import CrownIcon from '@svg/crown.svg';
import PlugIcon from '@svg/plug.svg';
import ScrollIcon from '@svg/scroll.svg';
import FileIcon from '@svg/file.svg';
import DocIcon from '@svg/doc.svg';
import BookIcon from '@svg/book.svg';
import PaperclipIcon from '@svg/paperclip.svg';
import BubbleLeftIcon from '@svg/bubble-left.svg';
import PhoneIcon from '@svg/phone.svg';
import VideoIcon from '@svg/video.svg';
import CarIcon from '@svg/car.svg';
import AirplaneIcon from '@svg/airplane.svg';
import HomekitIcon from '@svg/homekit.svg';
import WalkIcon from '@svg/walk.svg';
import ForkKnifeIcon from '@svg/fork-knife.svg';
import CartIcon from '@svg/cart.svg';
import CreditcardIcon from '@svg/creditcard.svg';
import { RRule } from 'rrule';

/**
 * * user list (settings tab) related
 * * user list page state
 */
const USERLIST_STATES: { [k: string]: number } = {
  GENERAL_MODE: 0,
  GROUPEDIT_MODE: 1,
  ADDREQUEST_MODE: 2,
  SEARCH_MODE: 3,
};

const COOPERATE_TYPES_LIST: { [k: string]: CooperateType } = {
  MEMBER_ACCEPTED: 'member' as CooperateType,
  GUEST_ACCEPTED: 'guest' as CooperateType,
  MEMBER_PENDING: 'pending_members' as CooperateType,
  GUEST_PENDING: 'pending_guests' as CooperateType,
  ALL_ACCEPTED: 'accepted' as CooperateType,
};

const TASK_SORT_TYPE_ARRAY = [
  {
    text: '優先度順',
    value: 3,
    desc: 'priority',
  },
  {
    text: 'リスト別',
    value: 4,
    desc: 'list',
  },
  {
    text: 'デフォルト順にリセット',
    value: 0,
    desc: 'start_date',
  },
  {
    text: '重要度順',
    value: 5,
    desc: 'importance',
  },
];

export const TASK_SORT_TYPE_TODAY_ARRAY = [
  {
    text: '優先度順',
    value: 3,
    desc: 'priority',
  },
  {
    text: 'リスト別',
    value: 4,
    desc: 'list',
  },
  {
    text: '重要度順',
    value: 5,
    desc: 'importance',
  },
];

const taskSortTypes = [
  'start_date',
  'end_date',
  'priority',
  'list',
  'default',
  'importance',
];
export type TASK_SORT_TYPE = typeof taskSortTypes[number];

/**
 * * bearer token config
 */
const configBearerToken = (token: string) => {
  return {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  };
};

/**
 * * color array
 */
const COLOR_VALUES = [
  {
    label: 'carminePink',
    value: '0',
    // value: "#eb4d3d",
  },
  {
    label: 'watermelonPink',
    value: '1',
    // value: "#f86f8b",
  },
  {
    label: 'tyrianPurple',
    value: '2',
    // value: '#bf5af2',
  },
  {
    label: 'iris',
    value: '3',
    // value: '#575acf',
  },
  {
    label: 'deepSkyBlue',
    value: '4',
    // value: '#007aff',
  },
  {
    label: 'crystalBlue',
    value: '5',
    // value: '#64b2ff',
  },
  {
    label: 'malachite',
    value: '6',
    // value: '#30d158',
  },
  {
    label: 'rubberYellow',
    value: '7',
    // value: '#ffd60a',
  },
  {
    label: 'orangePeel',
    value: '8',
    // value: '#ff9f0a',
  },
  {
    label: 'ginger',
    value: '9',
    // value: '#ad5c00',
  },
  {
    label: 'grayBlack',
    value: '10',
    // value: '#00000066',
  },
  {
    label: 'darkBlack',
    value: '11',
    // value: '#000000DF',
  },
];

/**
 * * tasks types by start_date, end_date
 */
export const TASKS_CLASSIFY_BY_DATE: { [key: string]: string } = {
  expired: '期限切れ',
  today: '今日',
  tomorrow: '明日',
  next_7_days: '1週間以内',
  later: '以降',
  none: '日付指定なし',
  completed: '完了',
};

/**
 * * icon array
 */

const ICON_VALUES = [
  {
    label: 'ListBulletIcon',
    value: 0,
    icon: ListBulletIcon,
  },
  {
    label: 'BriefcaseIcon',
    value: 1,
    icon: BriefcaseIcon,
  },
  {
    label: 'Building2Icon',
    value: 2,
    icon: Building2Icon,
  },
  {
    label: 'BankIcon',
    value: 3,
    icon: BankIcon,
  },
  {
    label: 'BooksVerticalIcon',
    value: 4,
    icon: BooksVerticalIcon,
  },
  {
    label: 'GraduationCapIcon',
    value: 5,
    icon: GraduationCapIcon,
  },
  {
    label: 'BanknoteIcon',
    value: 6,
    icon: BanknoteIcon,
  },
  {
    label: 'ChartPieIcon',
    value: 7,
    icon: ChartPieIcon,
  },
  {
    label: 'ChartlineUptrendIcon',
    value: 8,
    icon: ChartlineUptrendIcon,
  },
  {
    label: 'ChartBarXaxisIcon',
    value: 9,
    icon: ChartBarXaxisIcon,
  },
  {
    label: 'FaceSmileIcon',
    value: 10,
    icon: FaceSmileIcon,
  },
  {
    label: 'HeartIcon',
    value: 11,
    icon: HeartIcon,
  },
  {
    label: 'StarIcon',
    value: 12,
    icon: StarIcon,
  },
  {
    label: 'BoltIcon',
    value: 13,
    icon: BoltIcon,
  },
  {
    label: 'LockIcon',
    value: 14,
    icon: LockIcon,
  },
  {
    label: 'InfoIcon',
    value: 15,
    icon: InfoIcon,
  },
  {
    label: 'QuestionIcon',
    value: 16,
    icon: QuestionIcon,
  },
  {
    label: 'ExclamationMark2Icon',
    value: 17,
    icon: ExclamationMark2Icon,
  },
  {
    label: 'CrownIcon',
    value: 18,
    icon: CrownIcon,
  },
  {
    label: 'PlugIcon',
    value: 19,
    icon: PlugIcon,
  },
  {
    label: 'ScrollIcon',
    value: 20,
    icon: ScrollIcon,
  },
  {
    label: 'FileIcon',
    value: 21,
    icon: FileIcon,
  },
  {
    label: 'DocIcon',
    value: 22,
    icon: DocIcon,
  },
  {
    label: 'BookIcon',
    value: 23,
    icon: BookIcon,
  },
  {
    label: 'PaperclipIcon',
    value: 24,
    icon: PaperclipIcon,
  },
  {
    label: 'BubbleLeftIcon',
    value: 25,
    icon: BubbleLeftIcon,
  },
  {
    label: 'PhoneIcon',
    value: 26,
    icon: PhoneIcon,
  },
  {
    label: 'VideoIcon',
    value: 27,
    icon: VideoIcon,
  },
  {
    label: 'CarIcon',
    value: 28,
    icon: CarIcon,
  },
  {
    label: 'AirplaneIcon',
    value: 29,
    icon: AirplaneIcon,
  },
  {
    label: 'HomekitIcon',
    value: 30,
    icon: HomekitIcon,
  },
  {
    label: 'WalkIcon',
    value: 31,
    icon: WalkIcon,
  },
  {
    label: 'ForkKnifeIcon',
    value: 32,
    icon: ForkKnifeIcon,
  },
  {
    label: 'CartIcon',
    value: 33,
    icon: CartIcon,
  },
  {
    label: 'CreditcardIcon',
    value: 34,
    icon: CreditcardIcon,
  },
];

/**
 * * others
 */
const SLIDE_CLASSNAME_LIST = [
  'bg-gradient--auth-blue',
  'bg-gradient--auth-red',
  'bg-gradient--auth-green',
];

export const TASK_STATUS_A_DAY = {
  UNSET: 0,
  DONE: 1,
  UNDONE: 2,
  COMPLETED: 3,
};

/**
 * * messages
 */
const SUBSCRIPTION_USERCOUNT_MESSAGES = {
  NO_SPACE_LEFT: 'プレミアムコードに空きはありません。',
  SPACES_LEFT: 'プレミアムコードは残り%sユーザーの登録が可能です。',
  TO_ADD: '新たに%s名分の枠が追加されたプレミアムコードが発行されます。',
  TO_REMOVE: 'プレミアムコードから%sユーザー分の枠が削除されます',
};

export const GENERAL_MESSAGES = {
  FILE_UPLOAD_FAILED: 'ファイルをアップロードできませんでした。',
};

export const NOTIFY_TYPES: any = {
  TASK_REQUESTED: 0,
  ADD_USER_REQUEST: 1,
  REQUEST_TASK_REREQUESTED: 2,
  REQUEST_TASK_COMPLETED: 3,
  REQUESTED_TASK_CANCELED: 4,
  REQUESTED_CHANGED_FOR_TASK: 5,
  USER_REQUEST_ACCEPTED: 6,
  TASK_REMINDER: 7,
};

export const NOTIFICATION_MESSAGES: any = {
  [NOTIFY_TYPES.TASK_REQUESTED]: `%sさんから依頼を受けました。`,
  [NOTIFY_TYPES.ADD_USER_REQUEST]: `%sさんから追加申請のリクエストを受けました。`,
  [NOTIFY_TYPES.REQUEST_TASK_REREQUESTED]: `%sさんに依頼したタスクが再依頼されました。`,
  [NOTIFY_TYPES.REQUEST_TASK_COMPLETED]: `%sさんに依頼したタスクが完了しました。`,
  [NOTIFY_TYPES.REQUESTED_TASK_CANCELED]: `%sさんから依頼を受けたタスクが削除されました。`,
  [NOTIFY_TYPES.REQUESTED_CHANGED_FOR_TASK]: `%sさんから依頼を受けたタスクの依頼先が変更されました。`,
  [NOTIFY_TYPES.USER_REQUEST_ACCEPTED]: `%sさんから追加リクエストを受けました。`,
};
/**
 * * Datetime
 */
const WEEKDAYS_JP = ['日', '月', '火', '水', '木', '金', '土'];
const WEEKDAYS_EN = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
const WEEKDAYS_RRULE = [
  RRule.SU,
  RRule.MO,
  RRule.TU,
  RRule.WE,
  RRule.TH,
  RRule.FR,
  RRule.SA,
];

/**
 * * list count limit
 */
export const TASK_LIST_LIMIT_COUNT = 5;
export const SCHEDULE_LIST_LIMIT_COUNT = 3;
export const NOTE_LIST_LIMIT_COUNT = 50;
export const COLLABOS_LIMIT_COUNT = 5;

/**
 * * classNames
 */
export const CLASSNAME_FOR_TASKMENU =
  'px-12px w-full h-44px rounded-8px hover:text-primary hover:bg-primarySelected flex-row--between cursor-pointer';

export {
  // api functions and constants
  configBearerToken,
  // arrays
  USERLIST_STATES,
  COOPERATE_TYPES_LIST,
  TASK_SORT_TYPE_ARRAY,
  COLOR_VALUES,
  ICON_VALUES,
  // other
  SLIDE_CLASSNAME_LIST,
  // messages
  SUBSCRIPTION_USERCOUNT_MESSAGES,
  // datetime
  WEEKDAYS_JP,
  WEEKDAYS_EN,
  WEEKDAYS_RRULE,
};
