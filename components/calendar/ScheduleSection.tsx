import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { Dayjs } from 'dayjs';
// * hooks
import { useScheduleADay } from '@service/scheduleQueries';
import { codisplayUsersSelector } from '@store/selectors/home';
import {
  tzOffsetBrowserSelector,
  tzOffsetSelector,
  userInfoSelector,
  userTimeDisplayFormat,
} from '@store/selectors/user';
import { setScheduleID } from '@store/modules/schedules';
import { setScheduleModalStatus } from '@store/modules/home';
// * custom component
import { ScheduleRow } from 'pages/tasks/TaskScheduleRows';
// * constants
import DownTriangleIcon from '@svg/triangle-small.svg';
import ClosedTriangleIcon from '@svg/triangle-small-right.svg';
import { replaceState } from '@util/replaceUrl';

const ScheduleSection = ({
  currentDate,
  calendarFilter,
}: {
  currentDate: Dayjs;
  calendarFilter: string;
}) => {
  const { user } = useSelector(userInfoSelector);
  const [scheduleList, setScheduleList] = useState<any>(null);

  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(true);
  }, [currentDate]);

  const [onCodisplayMode, setOnCodisplayMode] = useState(false);
  const codisplayUserIDs = useSelector(codisplayUsersSelector);
  const calendarUsers = useMemo(() => {
    if (codisplayUserIDs.length == 1 && codisplayUserIDs[0] == user?.id)
      setOnCodisplayMode(false);
    else setOnCodisplayMode(true);
    return codisplayUserIDs;
  }, [codisplayUserIDs, user?.id]);
  const scheduleForDay = useScheduleADay(
    currentDate.format('YYYY-MM-DD') ?? '',
    calendarFilter,
    calendarUsers,
  );
  const timeMode24: boolean = useMemo(() => {
    if (user?.time_display) {
      return user?.time_display == 2;
    } else {
      return false;
    }
  }, [user]);

  useEffect(() => {
    if (scheduleForDay.isSuccess) {
      const data = scheduleForDay.data;
      let arrayData: any[] = [];
      if (Array.isArray(data)) {
        arrayData = data;
      } else {
        let filteredArray: any[] = [];
        Object.keys(data).forEach(function (key) {
          if (key == user?.id.toString()) arrayData = [...data[key]];
          else filteredArray = [...filteredArray, ...data[key]];
        });
        arrayData = [...arrayData, ...filteredArray];
      }

      const idList: number[] = [];
      const filtered: any[] = [];
      for (let i = 0; i < arrayData.length; i++) {
        const loopElem = arrayData[i];
        if (!idList.includes(loopElem.id)) {
          idList.push(loopElem.id);
          filtered.push(loopElem);
        }
      }

      if (filtered.length)
        filtered.sort((a, b) => {
          const aDate = new Date(a.start_date);
          const bDate = new Date(b.start_date);
          return aDate.getTime() - bDate.getTime();
        });
      setScheduleList(filtered);
    }
  }, [scheduleForDay.isSuccess, scheduleForDay.data, calendarUsers, user]);
  const tzOffsetMins = useSelector(tzOffsetSelector);
  const tzOffsetBrowser = useSelector(tzOffsetBrowserSelector);
  const timeDisplayFormat = useSelector(userTimeDisplayFormat);

  const dispatch = useDispatch();
  const router = useRouter();
  const onScheduleClick = useCallback(
    (id: number) => {
      const currentUrl = router.asPath;
      localStorage.setItem('task3_background_url', currentUrl);
      replaceState(`/schedules/detail/${id}`);
      dispatch(setScheduleID(id));
      dispatch(setScheduleModalStatus(true));
    },
    [dispatch, router.asPath],
  );

  return (
    <div className={'flex-0 pt-12px transition-all ease-in-out delay-400'}>
      <div
        className="p-12px body2 text-fontSecondary flex items-center cursor-pointer"
        onClick={() => {
          setOpen((old) => !old);
        }}
      >
        {open ? (
          <DownTriangleIcon width={20} height={20} className="" />
        ) : (
          <ClosedTriangleIcon width={20} height={20} className="" />
        )}
        <span className="">スケジュール</span>
        <span className={`${'ml-8px'}`}>
          {(() => {
            if (Array.isArray(scheduleList)) {
              return scheduleList.length;
            } else if (scheduleList) {
              let count = 0;
              for (var key in scheduleList) {
                count += scheduleList[key].length;
              }
              return count;
            }
          })()}
        </span>
      </div>
      <div className={`flex-1 ${open ? '' : 'hidden'}`}>
        {scheduleList &&
          scheduleList.map((schedule: any, index: number) => (
            <ScheduleRow
              {...schedule}
              showListName={true}
              isCodisplayMode={onCodisplayMode}
              onScheduleClick={onScheduleClick}
              tzOffsetMins={tzOffsetMins}
              tzOffsetBrowser={tzOffsetBrowser}
              timeDisplayFormat={timeDisplayFormat}
              timeMode24={timeMode24}
              key={`schedule-row-for-calendar-date-${
                currentDate.format('YYYY-MM-DD') ?? ''
              }-${schedule.id}-${index}`}
            />
          ))}
      </div>
    </div>
  );
};

export default ScheduleSection;
