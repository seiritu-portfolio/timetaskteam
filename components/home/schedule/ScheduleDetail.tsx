import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import dayjs from 'dayjs';
// * hooks
import {
  tzOffsetBrowserSelector,
  tzOffsetSelector,
  userInfoSelector,
} from '@store/selectors/user';
import { currentScheduleSelector } from '@store/selectors/schedules';
import { scheduleModalStatusSelector } from '@store/selectors/home';
// * component
import ListScheduleSelect from './ListScheduleSelect';
import MoreMenuForSchedule from './MoreMenuForSchedule';
// *
import ArrowRightIcon from '@svg/arrowtriangle-right-fill.svg';
import ArrowLeftRightIcon from '@svg/arrow-left-and-right.svg';
import CalendarIcon from '@svg/calendar.svg';
import BellIcon from '@svg/bell.svg';
import CirclepathIcon from '@svg/circlepath.svg';
import PersonsIcon from '@svg/person-2.svg';
import DefaultAvatarIcon from '@image/default_avatar.png';
import { convertDayjsToTimeFormat, getDateMDFormat } from '@util/calendar';
import { COLOR_VALUES } from '@util/constants';
import { reminderToString, rruleToString } from '@util/helpers';

const ScheduleDetail = ({
  onOffDetail,
  className,
}: {
  onOffDetail: () => void;
  className?: string;
}) => {
  const currentSchedule = useSelector(currentScheduleSelector);
  const tzOffsetMins = useSelector(tzOffsetSelector);
  const tzOffsetBrowser = useSelector(tzOffsetBrowserSelector);
  const isModal = useSelector(scheduleModalStatusSelector);

  const { user } = useSelector(userInfoSelector);
  const timeMode24: boolean = useMemo(() => {
    if (user?.time_display) {
      return user?.time_display == 2;
    } else {
      return false;
    }
  }, [user]);
  const currentScheduleProcessed = useMemo(() => {
    if (!currentSchedule) return null;
    const data: any = {};
    const startDate = dayjs(currentSchedule.start_date).add(
      tzOffsetMins - tzOffsetBrowser,
      'minute',
    );
    data.start_date = getDateMDFormat(startDate.toDate());
    let endDate = dayjs(currentSchedule.end_date).add(
      tzOffsetMins - tzOffsetBrowser,
      'minute',
    );
    if (
      endDate.hour() == 0 &&
      endDate.minute() == 0 &&
      startDate.isBefore(endDate)
    )
      endDate = endDate.subtract(1, 'minute').second(59);
    data.end_date = getDateMDFormat(endDate.toDate());
    data.all_day = currentSchedule?.all_day == 1;
    let startTime = startDate.clone();
    let endTime = startDate
      .clone()
      .hour(endDate.hour())
      .minute(endDate.minute())
      .second(endDate.second());

    data.startTime = startTime;
    data.endTime = endTime;
    if (
      endDate.hour() == 0 &&
      endDate.minute() == 0 &&
      startDate.isBefore(endDate)
    ) {
    } else if (startTime.isAfter(endTime)) {
      data.startTime = endTime;
      data.endTime = startTime;
    }

    const reminderValue = reminderToString(
      currentSchedule.reminder,
      tzOffsetMins,
      tzOffsetBrowser,
      user?.time_display == 2,
    );
    data.reminder = reminderValue.label;
    data.repetitonRule = rruleToString(
      currentSchedule.repetition === 0 ? '' : currentSchedule.repetition_rule,
    );

    return data;
  }, [currentSchedule, tzOffsetMins, tzOffsetBrowser, user?.time_display]);

  return (
    <div className={`body1 text-fontPrimary ${className ?? ''}`}>
      <ListScheduleSelect
        listID={currentSchedule?.list_id ?? -1}
        select={(id: number, color: number) => {}}
      />
      <div className="mt-2px py-2px body1 text-fontSecondary">
        <div className="mb-2px flex items-center">
          <div className="w-20px h-20px flex-xy-center">
            <span
              className={`w-14px h-14px rounded-full bg-${
                COLOR_VALUES[currentSchedule?.color ?? 0].label
              }`}
            />
          </div>
          <div className="ml-16px text-fontPrimary big-title-light">
            {currentSchedule?.title ?? ''}
          </div>
        </div>
        <div
          // className="mt-2px body1 text-fontSecondary"
          dangerouslySetInnerHTML={{
            __html: currentSchedule?.memo ?? '',
          }}
        />
        {/* {currentSchedule?.memo ?? ''} */}
      </div>
      <div className="py-4px flex items-center">
        <CalendarIcon width={20} height={20} />
        <span className="ml-16px">
          {currentScheduleProcessed ? currentScheduleProcessed.start_date : ''}
        </span>
        {currentScheduleProcessed &&
        currentScheduleProcessed.start_date !=
          currentScheduleProcessed.end_date ? (
          <>
            <ArrowLeftRightIcon width={20} height={20} className="ml-12px" />
            <span className="ml-12px">{currentScheduleProcessed.end_date}</span>
          </>
        ) : null}
        {currentScheduleProcessed?.all_day ? null : (
          <>
            <span className="ml-4px">
              {currentScheduleProcessed && currentScheduleProcessed.startTime
                ? convertDayjsToTimeFormat(
                    currentScheduleProcessed.startTime,
                    timeMode24,
                  )
                : ''}
            </span>
            <span className="ml-12px text-fontSecondary">
              <ArrowRightIcon width={14} height={14} />
            </span>
            <span className="ml-12px">
              {currentScheduleProcessed && currentScheduleProcessed.endTime
                ? convertDayjsToTimeFormat(
                    currentScheduleProcessed.endTime.hour() == 23 &&
                      currentScheduleProcessed.endTime.minute() == 59 &&
                      currentScheduleProcessed.endTime.second() == 59
                      ? currentScheduleProcessed.endTime.add(1, 'second')
                      : currentScheduleProcessed.endTime,
                    timeMode24,
                  )
                : ''}
            </span>
          </>
        )}
      </div>
      <div className="ml-36px h-1px bg-separator" />
      <div className="py-4px flex items-center">
        <BellIcon width={20} height={20} />
        <span className="ml-16px">
          {currentScheduleProcessed?.reminder ?? ''}
        </span>
      </div>
      <div className="ml-36px h-1px bg-separator" />
      <div className="py-4px flex items-center">
        <CirclepathIcon width={20} height={20} />
        <span className="ml-16px">
          {currentScheduleProcessed?.repetitonRule ?? '繰り返しなし'}
        </span>
      </div>
      <div className="ml-36px h-1px bg-separator" />
      <div className="py-4px flex">
        <PersonsIcon width={20} height={20} className="flex-none" />
        <div className="flex-1 ml-16px flex flex-row flex-wrap">
          {!currentSchedule ||
          !currentSchedule.cooperators ||
          currentSchedule.cooperators.length <= 1
            ? '共有なし'
            : currentSchedule.cooperators.map((couser: any) =>
                couser.id != user?.id ? (
                  <div
                    className="mb-12px flex-xy-center"
                    key={`schedule-${currentSchedule.id}-${couser.id}`}
                  >
                    <div
                      className={`relative w-22px h-22px rounded-full border-1/2 border-${
                        couser.pivot.color != undefined
                          ? COLOR_VALUES[couser.pivot.color]
                          : 'pink'
                      } flex-xy-center`}
                    >
                      <Image
                        src={
                          couser.avatar && couser.avatar != ''
                            ? couser.avatar
                            : DefaultAvatarIcon
                        }
                        width={20}
                        height={20}
                        alt=""
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div className="ml-8px mr-16px body1 whitespace-nowrap">
                      {couser.name}
                    </div>
                  </div>
                ) : null,
              )}
        </div>
      </div>
      <div className="ml-36px h-1px bg-separator" />
      <div className="mt-6px pt-8px border-t border-separator flex-row--end">
        {isModal && <MoreMenuForSchedule upward={true} />}
        <button
          className="ml-12px btn--default focus:outline-none"
          onClick={onOffDetail}
        >
          編集
        </button>
      </div>
    </div>
  );
};

export default ScheduleDetail;
