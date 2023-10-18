import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Menu, Transition } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';
import { Dayjs } from 'dayjs';
// * hooks
import {
  countLimitADaySelector,
  scheduleListsToHideSelector,
  taskListsToHideSelector,
} from '@store/selectors/calendar';
import useHolidays from '@service/calendarQueries';
import {
  setHolidays,
  setScheduleListsToHide,
  setTaskListsToHide,
} from '@store/modules/calendar';
import {
  scheduleInboxIDSelector,
  taskInboxIDSelector,
} from '@store/selectors/user';
import {
  scheduleListsSelector,
  taskListsSelector,
} from '@store/selectors/list';
// * components
import ViewMode from '@component/calendar/ViewMode';
import TodayBtn from '@component/calendar/TodayBtn';
import Navigator from '@component/calendar/Navigator';
import MenuBtn from '@component/calendar/MenuBtn';
import ModalDisplaySetting from './ModalDisplaySetting';
// * assets
import UncheckedIcon from '@svg/square.svg';
import CheckedIcon from '@svg/checkmark-square-fill.svg';
import DownTriangleIcon from '@svg/triangle-small.svg';
import InboxIcon from '@svg/tray.svg';
import ShieldIcon from '@svg/lock-shield.svg';
import { COLOR_VALUES, ICON_VALUES } from '@util/constants';

const iconsArrayExtended = [
  {
    label: 'InboxIcon',
    value: -1,
    icon: InboxIcon,
  },
  ...ICON_VALUES,
];

const Toolbar = ({
  calendarDate,
  viewMode,
  className,
}: {
  calendarDate: Dayjs;
  viewMode: 'month' | 'weeks4' | 'weeks2' | 'half' | 'week';
  className?: string;
}) => {
  const [title, setTitle] = useState('');
  const [showSetting, setShowSetting] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const currentDate = calendarDate.clone();

    if (viewMode === 'month') {
      setTitle(currentDate.add(7, 'day').format('YYYY年 M月'));
    } else if (viewMode === 'week') {
      const firstOfNextMonth = currentDate.add(1, 'month').set('date', 1);
      const diffDay = firstOfNextMonth.diff(currentDate, 'day');
      if (diffDay > 3) {
        setTitle(currentDate.format('YYYY年 M月'));
      } else {
        setTitle(currentDate.add(1, 'month').format('YYYY年 M月'));
      }
    } else {
      const nextStartOfMonth = currentDate.add(1, 'month').date(1);
      const diffDays = nextStartOfMonth.diff(currentDate, 'day');
      const halfPeriodLength = viewMode === 'weeks4' ? 14 : 7;

      if (diffDays > halfPeriodLength) {
        setTitle(currentDate.format('YYYY年 M月'));
      } else {
        setTitle(nextStartOfMonth.format('YYYY年 M月'));
      }
    }
  }, [calendarDate, viewMode]);

  const dispatch = useDispatch();
  const holidaysResult = useHolidays();
  useEffect(() => {
    if (holidaysResult.isSuccess) {
      const currentYear = new Date().getFullYear();

      const result = holidaysResult.data.items;
      const processedResult: any[] = [];
      if (result && result.length > 0) {
        result.map((_: any) => {
          const start = new Date(_.start.date);
          const end = new Date(_.end.date);

          let index = 0;
          for (
            var d = start;
            d.getTime() <= end.getTime();
            d.setDate(d.getDate() + 1)
          ) {
            processedResult.push({
              id: `${_.id}-${index}`,
              date: `${d.getMonth() + 1}-${d.getDate()}`,
              summary: _.summary,
              eventType: _.eventType,
            });
            index += 1;
          }
        });
      }
      dispatch(
        setHolidays(
          processedResult.filter(
            (item) =>
              item.id.slice(0, 4) === currentYear.toString() &&
              item.id.slice(-1) === '0',
          ),
        ),
      );
    }
  }, [holidaysResult.isSuccess, holidaysResult.data, dispatch]);
  const countLimitADay = useSelector(countLimitADaySelector);

  const taskLists = useSelector(taskListsSelector);
  const taskListsToHide = useSelector(taskListsToHideSelector);
  const TaskCheckIcon = useMemo(() => {
    const isChecked = taskLists.length !== (taskListsToHide?.length ?? 0);
    return isChecked ? CheckedIcon : UncheckedIcon;
  }, [taskLists, taskListsToHide]);
  const onTaskboxCheck = useCallback(() => {
    const isEmpty = taskListsToHide?.length === taskLists.length;
    dispatch(setTaskListsToHide(isEmpty ? [] : taskLists.map((_) => _.id)));
  }, [taskLists, taskListsToHide, dispatch]);

  const scheduleLists = useSelector(scheduleListsSelector);
  const scheduleListsToHide = useSelector(scheduleListsToHideSelector);
  const ScheduleCheckIcon = useMemo(() => {
    const isChecked =
      scheduleLists.length !== (scheduleListsToHide?.length ?? 0);
    return isChecked ? CheckedIcon : UncheckedIcon;
  }, [scheduleLists, scheduleListsToHide]);
  const onScheduleboxCheck = useCallback(() => {
    const isEmpty = scheduleListsToHide?.length === scheduleLists.length;
    dispatch(
      setScheduleListsToHide(isEmpty ? [] : scheduleLists.map((_) => _.id)),
    );
  }, [scheduleLists, scheduleListsToHide, dispatch]);

  return (
    <div className={`relative ${className}`}>
      <div className={'flex justify-between px-24px py-4px'}>
        <div className={'flex items-center space-x-24px'} ref={ref}>
          <TodayBtn />
          <div className="flex">
            <div
              className={`ml-4px p-12px rounded-8px bg-${
                countLimitADay.schedule > 0
                  ? 'backgroundSecondary text-fontPrimary'
                  : 'backgroundPrimary text-fontSecondary'
              } body1 flex flex-row items-center relative select-none cursor-pointer`}
            >
              <ScheduleCheckIcon
                onClick={onScheduleboxCheck}
                width={20}
                height={20}
                className={`flex-none mr-1 text-${
                  countLimitADay.schedule > 0 ? 'primary' : 'fontSecondary'
                } cursor-pointer`}
              />
              <ScheduleListMenu />
            </div>
            <div
              className={`p-12px rounded-8px bg-${
                countLimitADay.task > 0
                  ? 'backgroundSecondary text-fontPrimary'
                  : 'backgroundPrimary text-fontSecondary'
              } body1 flex flex-row items-center relative select-none cursor-pointer`}
            >
              <TaskCheckIcon
                onClick={onTaskboxCheck}
                width={20}
                height={20}
                className={`flex-none mr-1 text-${
                  countLimitADay.task > 0 ? 'primary' : 'fontSecondary'
                } cursor-pointer`}
              />
              <TaskListMenu />
            </div>
          </div>
          <Navigator />
          <div
            className={`px-24px flex items-center justify-center big-title-light`}
          >
            {title}
          </div>
        </div>
        <div className={'flex space-x-24px items-center'}>
          <ViewMode className="w-62px h-38px flex flex-col justify-center" />
          <MenuBtn />
        </div>
      </div>
      <ModalDisplaySetting
        isOpen={showSetting}
        close={() => setShowSetting(false)}
        container={ref.current ?? undefined}
      />
    </div>
  );
};

export default Toolbar;

const TaskListMenu = () => {
  const tasksList = useSelector(taskListsSelector);
  const taskInboxID = useSelector(taskInboxIDSelector);
  const dispatch = useDispatch();
  const taskListsToHide = useSelector(taskListsToHideSelector);

  const sortedLists = useMemo(() => {
    if (tasksList.length === 0) {
      return [];
    }
    const listCollection = tasksList.reduce(
      (
        ctx: {
          [id: string]: any;
        },
        el: any,
      ) => {
        if (el.id === taskInboxID) {
          ctx.inbox.push(el);
        } else {
          ctx.general.push(el);
        }
        return ctx;
      },
      {
        inbox: [],
        general: [],
      },
    );
    let resultArray: any[] = [];
    if (listCollection.inbox.length > 0) {
      resultArray.push({
        label: 'インボックス',
        value: taskInboxID.toString(),
        icon: -1,
        isPublic: listCollection.inbox[0].status === 1,
      });
    }
    const generals: any[] = [];
    if (listCollection.general.length > 0) {
      listCollection.general.map((_: any) => {
        generals.push({
          label: _.name,
          value: _.id.toString(),
          icon: _.icon,
          isPublic: _.status === 1,
        });
      });
    }
    resultArray = [...resultArray, ...generals];
    return resultArray;
  }, [tasksList, taskInboxID]);

  const onTaskClick = useCallback(
    (id: string) => (e: any) => {
      e.stopPropagation();
      const currentId = parseInt(id);
      const currentList = taskListsToHide ?? [];
      const filteredList = currentList.filter((item) => item !== currentId);

      dispatch(
        setTaskListsToHide(
          filteredList.length !== currentList.length
            ? filteredList
            : [...filteredList, currentId],
        ),
      );
    },
    [taskListsToHide, dispatch],
  );

  return (
    <Menu as="div" className="flex flex-col z-9999">
      <Menu.Button>
        <div className="flex flex-row items-center">
          <span>タスク</span>
          <DownTriangleIcon width={24} height={24} className="" />
        </div>
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute mt-4px left-0 top-44px w-356px max-h-500px overflow-y-auto bg-white divide-y divide-gray-100 rounded-md shadow-lg border-1/2 border-separator focus:outline-none z-50">
          {sortedLists.map((item) => {
            return (
              <TaskItem
                {...item}
                iconID={item.icon}
                isChecked={!taskListsToHide?.includes(parseInt(item.value))}
                onClick={onTaskClick(item.value)}
                key={`task-list-${item.value}`}
              />
            );
          })}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

const TaskItem = ({
  label,
  iconID,
  isPublic,
  additionalClass,
  isChecked,
  onClick,
  ...rest
}: {
  label: string;
  iconID: number;
  isPublic: boolean;
  isChecked: boolean;
  onClick: () => void;
  additionalClass?: string;
}) => {
  const iconCandidates = iconsArrayExtended.filter((_) => _.value === iconID);
  if (iconCandidates.length === 0) {
    return null;
  }
  const Icon = iconCandidates[0].icon;
  const CheckIcon = isChecked ? CheckedIcon : UncheckedIcon;

  return (
    <div
      onClick={onClick}
      {...rest}
      className={`p-12px body1 text-fontPrimary flex-row--between ${
        additionalClass ?? ''
      }`}
    >
      <div className="flex flex-1 flex-row items-center">
        <CheckIcon
          width={20}
          height={20}
          className={`flex-none mr-1 text-${
            isChecked ? 'primary' : 'fontSecondary'
          } cursor-pointer`}
        />
        <Icon width={20} height={20} className="ml-8px" />
        <span className="px-16px truncate">{label}</span>
      </div>
      {!isPublic && <ShieldIcon width={24} height={24} className="flex-none" />}
    </div>
  );
};

const ScheduleListMenu = () => {
  const scheduleLists = useSelector(scheduleListsSelector);
  const scheduleInboxID = useSelector(scheduleInboxIDSelector);

  const sortedList: any[] = useMemo(() => {
    if (scheduleLists.length === 0) {
      return [];
    }
    const listCollection = scheduleLists.reduce(
      (
        ctx: {
          [id: string]: any;
        },
        el: any,
      ) => {
        if (el.id === scheduleInboxID) {
          ctx.inbox.push(el);
        } else {
          ctx.general.push(el);
        }
        return ctx;
      },
      {
        inbox: [],
        general: [],
      },
    );
    const listInbox =
      listCollection.inbox.length > 0
        ? {
            label: 'インボックス',
            value: scheduleInboxID.toString(),
            color: listCollection.inbox[0].color,
            isPublic: listCollection.inbox[0].status === 1,
          }
        : undefined;
    // ! :)
    // setValue(listInbox);
    let resultArray: any[] = [];
    if (listInbox) {
      resultArray.push(listInbox);
    }
    if (listCollection.general.length > 0) {
      listCollection.general.map((_: any) => {
        resultArray.push({
          label: _.name,
          value: _.id.toString(),
          color: _.color,
          isPublic: _.status === 1,
        });
      });
    }
    return resultArray;
  }, [scheduleLists, scheduleInboxID]);

  const dispatch = useDispatch();
  const scheduleListsToHide = useSelector(scheduleListsToHideSelector);
  const onScheduleClick = useCallback(
    (id: string) => (e: any) => {
      e.preventDefault();
      // e.stopPropagation();
      const currentId = parseInt(id);
      const currentList = scheduleListsToHide ?? [];
      const filteredList = currentList.filter((item) => item !== currentId);

      dispatch(
        setScheduleListsToHide(
          filteredList.length !== currentList.length
            ? filteredList
            : [...filteredList, currentId],
        ),
      );
    },
    [scheduleListsToHide, dispatch],
  );

  return (
    <Menu as="div" className="flex flex-col z-9999">
      <Menu.Button>
        <div className="flex flex-row items-center">
          <span>スケジュール</span>
          <DownTriangleIcon width={24} height={24} className="" />
        </div>
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute mt-4px left-0 top-44px w-356px max-h-500px overflow-y-auto bg-white divide-y divide-gray-100 rounded-md shadow-lg border-1/2 border-separator focus:outline-none z-50">
          <div className="py-4px">
            {sortedList.map((item) => {
              return (
                <ScheduleItem
                  {...item}
                  isChecked={
                    !scheduleListsToHide?.includes(parseInt(item.value))
                  }
                  onClick={onScheduleClick(item.value)}
                  key={`schedule-list-${item.value}`}
                />
              );
            })}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

const ScheduleItem = ({
  label,
  color,
  isPublic,
  additionalClass,
  isChecked,
  onClick,
  ...rest
}: {
  label: string;
  color: number;
  isPublic: boolean;
  isChecked: boolean;
  additionalClass?: string;
  onClick: (e: any) => void;
}) => {
  const colorCandidates = COLOR_VALUES.filter(
    (_) => parseInt(_.value) === color,
  );
  const colorClass =
    colorCandidates.length > 0
      ? colorCandidates[0].label
      : COLOR_VALUES[0].label;
  const CheckIcon = isChecked ? CheckedIcon : UncheckedIcon;

  return (
    <div
      onClick={onClick}
      // {...rest}
      className={`p-12px body1 text-fontPrimary flex-row--between ${
        additionalClass ?? ''
      }`}
    >
      <div className="flex flex-1 flex-row items-center">
        <CheckIcon
          width={20}
          height={20}
          className={`flex-none mr-1 text-${
            isChecked ? 'primary' : 'fontSecondary'
          } cursor-pointer`}
        />
        <div className={`relative ml-4px h-20px w-20px flex-xy-center`}>
          <span className={`h-14px w-14px rounded-full bg-${colorClass}`} />
        </div>
        <span className="px-16px truncate">{label}</span>
      </div>
      {!isPublic && <ShieldIcon width={24} height={24} className="flex-none" />}
    </div>
  );
};
