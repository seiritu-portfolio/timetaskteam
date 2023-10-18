import { useDispatch } from 'react-redux';
// * hooks
import { setListAddModal } from '@store/modules/home';
import { setAddListType } from '@store/modules/list';
// * constants
import ShieldIcon from '@svg/lock-shield.svg';
import InboxIcon from '@svg/tray.svg';
import { COLOR_VALUES, ICON_VALUES } from '@util/constants';

const iconsArrayExtended = [
  {
    label: 'InboxIcon',
    value: -1,
    icon: InboxIcon,
  },
  ...ICON_VALUES,
];

const GROUP_MENULIST = (props: any) => (
  <div>
    <div className="py-12px caption2-light text-center text-fontSecondary">
      グループに振り分けることが可能です。
      <br />
      リストの公開ユーザーを選択するときに便利です。
    </div>
    {props.children}
    <div className="px-24px py-12px flex flex-row justify-between items-center">
      <span
        className="text-primary body1 cursor-pointer"
        onClick={props.onAddGroup}
      >
        グループ追加
      </span>
      <span
        className="text-primary body1 cursor-pointer"
        onClick={props.onClose}
      >
        完了
      </span>
    </div>
  </div>
);

const LIST_MENULIST = (props: any) => {
  const dispatch = useDispatch();

  return (
    <div className="body1">
      {props.children}
      <div
        className="px-12px h-44px text-fontSecondary flex items-center cursor-pointer"
        onClick={() => {
          dispatch(setAddListType(props?.type ?? 1));
          dispatch(setListAddModal(true));
        }}
      >
        <span>新規リスト作成</span>
      </div>
    </div>
  );
};

const ICON_MENULIST = (props: any) => (
  <div className="p-12px flex flex-row flex-wrap">{props.children}</div>
);

const COLOR_MENULIST = (props: any) => (
  <div className="px-12px flex flex-row flex-wrap">{props.children}</div>
);

const OCCUPANCYRATE_MENULIST = (props: any) => (
  <div className="p-12px w-full">
    <div className="mb-12px px-36px caption2-light text-center text-fontSecondary">
      税務関係にあるタスクの所要時間を稼働率に反映させるか選択することができます。
    </div>
    {props.children}
  </div>
);

const LIST_SCHEDULE_ITEM = ({
  label,
  color,
  isPublic,
  additionalClass,
  ...rest
}: {
  label: string;
  color: number;
  isPublic: boolean;
  additionalClass?: string;
}) => {
  const colorCandidates = COLOR_VALUES.filter(
    (_) => parseInt(_.value) === color,
  );
  const colorClass =
    colorCandidates.length > 0
      ? colorCandidates[0].label
      : COLOR_VALUES[0].label;

  return (
    <div
      className={`p-12px rounded-6px body1 text-fontPrimary flex-row--between ${
        additionalClass ?? ''
      }`}
      {...rest}
    >
      <div className="overflow-hidden flex flex-row items-center">
        <div className={`relative h-20px w-20px flex-xy-center`}>
          <span className={`h-14px w-14px rounded-full bg-${colorClass}`} />
        </div>
        <div className="px-16px body1 text-fontPrimary truncate">{label}</div>
      </div>
      {!isPublic && <ShieldIcon className="flex-none" width={24} height={24} />}
    </div>
  );
};

const LIST_SELECTITEM = ({
  label,
  iconID,
  isPublic,
  additionalClass,
  ...rest
}: {
  label: string;
  iconID: number;
  isPublic: boolean;
  additionalClass?: string;
}) => {
  const iconCandidates = iconsArrayExtended.filter((_) => _.value === iconID);
  if (iconCandidates.length === 0) {
    return null;
  }
  const Icon = iconCandidates[0].icon;

  return (
    <div
      {...rest}
      className={`p-12px rounded-6px body1 text-fontPrimary flex-row--between ${
        additionalClass ?? ''
      }`}
    >
      <div className="flex-1 flex flex-row items-center">
        <Icon width={20} height={20} />
        <span className="px-16px truncate">{label}</span>
      </div>
      {!isPublic && <ShieldIcon width={24} height={24} className="flex-none" />}
    </div>
  );
};

export {
  GROUP_MENULIST,
  LIST_MENULIST,
  ICON_MENULIST,
  COLOR_MENULIST,
  OCCUPANCYRATE_MENULIST,
  LIST_SELECTITEM,
  LIST_SCHEDULE_ITEM,
};
