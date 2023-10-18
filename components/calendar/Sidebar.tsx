import { useCallback, useEffect, useState } from 'react';
import { Dayjs } from 'dayjs';
import { useDispatch } from 'react-redux';
// * hooks
import {
  setMagnifiedDate,
  toggleDetailBar,
  toggleFullscreen,
} from '@store/modules/calendar';
// * custom components
import Filter from '@component/calendar/Filter';
import List from '@component/calendar/List';
// * assets & constants
import ExtensionIcon from '@svg/extension.svg';
import ArrowRightIcon from '@svg/arrow-right.svg';
import { TASK_SORT_TYPE } from '@util/constants';
import { useWindowDimensions } from '@util/calendar';

const Sidebar = ({
  currentDate,
  startdateUnset,
  calendarFilter,
  isOpen,
  hideStatus,
  className,
}: {
  currentDate: Dayjs;
  startdateUnset?: boolean;
  calendarFilter: string;
  isOpen?: boolean;
  hideStatus?: boolean;
  className?: string;
}) => {
  const dispatch = useDispatch();
  const onCloseSidebar = useCallback(() => {
    dispatch(toggleFullscreen());
    dispatch(setMagnifiedDate(null));
  }, [dispatch]);
  const onHideSidebar = useCallback(() => {
    dispatch(toggleDetailBar());
  }, [dispatch]);

  const [height, setHeight] = useState(0);
  const { height: windowHeight } = useWindowDimensions();
  useEffect(() => {
    let containerHeight = 0;
    if (windowHeight) {
      containerHeight = windowHeight - 54 - 61;
    }
    setHeight(Math.max(0, containerHeight));
  }, [windowHeight]);

  return (
    <div
      className={`flex-none ${
        hideStatus ? 'hidden' : isOpen ? 'w-460px' : 'w-44px'
      } ${className ?? ''} ${isOpen ? '' : 'flex flex-col justify-between'}`}
      style={{ height: `${height}px` }}
    >
      <div
        onClick={onCloseSidebar}
        className={`h-44px ${
          isOpen ? 'hidden' : 'show'
        } flex flex-col justify-center items-center cursor-pointer hover:bg-primarySelected tooltip`}
      >
        <ExtensionIcon width={20} height={20} />
        <span className="absolute top-full mt-1 px-2 py-1 w-16 rounded-2px bg-fontSecondary body3 text-backgroundSecondary text-center z-50 tooltiptext truncate">
          {isOpen ? '閉じる' : '開く'}
        </span>
      </div>
      <div
        onClick={onHideSidebar}
        className={`ml-1 mb-2 w-32px h-32px ${
          isOpen ? 'hidden' : 'show'
        } rounded-full bg-separator flex flex-col justify-center items-center cursor-pointer hover:bg-primarySelected`}
      >
        <ArrowRightIcon width={8} height={8} />
      </div>
      <div
        className={`flex flex-col ${isOpen ? '' : 'hidden'}`}
        style={{ height: `${height}px` }}
      >
        <Filter
          currentDate={currentDate}
          startdateUnset={startdateUnset}
          calendarFilter={calendarFilter}
          className={'px-24px'}
          sortBy={(newSortType: TASK_SORT_TYPE) => {}}
          onCloseSidebar={onCloseSidebar}
        />
        <List
          currentDate={currentDate}
          calendarFilter={calendarFilter}
          startdateUnset={startdateUnset}
          className={'px-12px'}
        />
      </div>
    </div>
  );
};

export default Sidebar;
