import { useState, useMemo, useCallback } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { useSelector } from 'react-redux';
// * hooks
import { userInfoSelector } from '@store/selectors/user';
// * components
import { ScheduleEndTimeSelect, ScheduleStartTimeSelect } from '../Selects';
import DatePicker from './DatePicker';
// * assets
import ClockIcon from '@svg/clock.svg';
import MinusIcon from '@svg/minus.svg';
import UncheckedIcon from '@svg/square.svg';
import CheckedIcon from '@svg/checkmark-square.svg';
import { dateCopy, timeCopy } from '@util/calendar';

import '@blueprintjs/datetime/lib/css/blueprint-datetime.css';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const PeriodInputs = ({
  additionalClassname,
  isAllDay,
  setIsAllday,
  startDatetime,
  endDatetime,
  setStartDateTime,
  setEndDateTime,
}: {
  additionalClassname: string;
  isAllDay: boolean;
  setIsAllday: () => void;
  startDatetime: Date;
  endDatetime: Date;
  setStartDateTime: (newValue: Date) => void;
  setEndDateTime: (newValue: Date) => void;
}) => {
  const { user } = useSelector(userInfoSelector);
  const timeMode24: boolean = useMemo(() => {
    if (user?.time_display) {
      return user?.time_display == 2;
    } else {
      return false;
    }
  }, [user]);

  const [isPicker1, setIsPicker1] = useState(false);
  const [isPicker2, setIsPicker2] = useState(false);

  const onDatePicker1 = () => {
    if (isPicker2) {
      setIsPicker2(false);
    }
    setIsPicker1((old) => !old);
  };
  const onDatePicker2 = () => {
    if (isPicker1) {
      setIsPicker1(false);
    }
    setIsPicker2((old) => !old);
  };

  const onStartTimeChange = useCallback(
    (newValue: Date) => {
      const copiedDate = timeCopy(newValue, startDatetime);
      setStartDateTime(copiedDate);

      const newStartDate = dayjs(copiedDate);
      const newStartHour = newStartDate.hour();
      const newStartMin = newStartDate.minute();
      let newEndDate = dayjs(endDatetime)
        .hour(newStartHour)
        .minute(newStartMin)
        .second(0)
        .add(1, 'hour')
        .toDate();
      if (newStartHour == 23 && newStartMin == 0)
        newEndDate = new Date(newEndDate.getTime() - 1000);
      setEndDateTime(newEndDate);
    },
    [setStartDateTime, setEndDateTime, startDatetime, endDatetime],
  );

  const onEndTimeChange = useCallback(
    (newValue: Date) => {
      let processedNewValue = new Date(newValue.getTime());
      if (newValue.getHours() == 0 && newValue.getMinutes() == 0)
        processedNewValue = new Date(newValue.getTime() - 1000);

      const copiedDate = timeCopy(processedNewValue, endDatetime);

      if (copiedDate.getTime() > startDatetime.getTime()) {
        setEndDateTime(copiedDate);
      }
    },
    [endDatetime, startDatetime, setEndDateTime],
  );

  return (
    <div className={`flex ${additionalClassname} body1 period-input text-xs`}>
      <div className="flex-none p-12px rounded-l-8px bg-backgroundPrimary text-fontPrimary">
        <ClockIcon width={20} height={20} />
      </div>
      <div className="ml-2px flex-1 flex flex-col">
        <div className="body1 text-fontPrimary flex flex-row items-center">
          {isAllDay ? (
            <>
              <DatePicker
                isOpen={isPicker1}
                onClick={onDatePicker1}
                className="flex-1 h-full text-13px bg-backgroundPrimary hover:bg-separator"
                index={0}
                date={startDatetime}
                onChange={(newValue: Date) => {
                  const copiedDate = dateCopy(newValue, startDatetime);
                  if (endDatetime.getTime() >= copiedDate.getTime()) {
                    setStartDateTime(copiedDate);
                  }
                }}
              />
              <MinusIcon width={20} height={20} />
              <DatePicker
                isOpen={isPicker2}
                onClick={onDatePicker2}
                className="ml-2px rounded-r-8px body1 text-fontPrimary text-13px flex-1 bg-backgroundPrimary hover:bg-separator"
                index={1}
                date={endDatetime}
                onChange={(newValue: Date) => {
                  const copiedDate = dateCopy(newValue, endDatetime);
                  const copiedDatetime = timeCopy(startDatetime, copiedDate);

                  if (copiedDatetime.getTime() >= startDatetime.getTime()) {
                    setEndDateTime(copiedDatetime);
                  }
                }}
                classNameCalendar="-ml-40"
              />
            </>
          ) : (
            <>
              <DatePicker
                isOpen={isPicker1}
                onClick={onDatePicker1}
                className="mr-1 flex-0 h-full bg-backgroundPrimary text-13px hover:bg-separator"
                index={0}
                date={startDatetime}
                onChange={(newValue: Date) => {
                  const copiedDate = dateCopy(newValue, startDatetime);
                  if (
                    dayjs(startDatetime).format('YYYY-MM-DD') ===
                    dayjs(endDatetime).format('YYYY-MM-DD')
                  ) {
                    const copiedEndDate = dateCopy(newValue, endDatetime);
                    setStartDateTime(copiedDate);
                    setEndDateTime(copiedEndDate);
                  } else if (endDatetime.getTime() >= copiedDate.getTime()) {
                    if (
                      dayjs(startDatetime).format('YYYY-MM-DD') ===
                      dayjs(endDatetime).format('YYYY-MM-DD')
                    ) {
                      const copiedEndDate = dateCopy(newValue, endDatetime);
                      setStartDateTime(copiedDate);
                      setEndDateTime(copiedEndDate);
                    } else {
                      setStartDateTime(copiedDate);
                    }
                  }
                }}
              />
              <div className="flex-0 ml-2px bg-backgroundPrimary">
                <ScheduleStartTimeSelect
                  value={dayjs(startDatetime)}
                  onChange={onStartTimeChange}
                  isTimeMode24={timeMode24}
                />
              </div>
              <div className="flex-0 ml-2px bg-backgroundPrimary">
                <ScheduleEndTimeSelect
                  startTime={dayjs(startDatetime)}
                  value={dayjs(endDatetime)}
                  onChange={onEndTimeChange}
                  isTimeMode24={timeMode24}
                />
              </div>
              {dayjs(startDatetime).format('YYYY-MM-DD') ===
              dayjs(endDatetime).format('YYYY-MM-DD') ? null : (
                <DatePicker
                  isOpen={isPicker2}
                  onClick={onDatePicker2}
                  className="ml-1 rounded-r-8px body1 text-fontPrimary text-13px flex-0 bg-backgroundPrimary hover:bg-separator"
                  index={1}
                  date={endDatetime}
                  onChange={(newValue: Date) => {
                    const copiedDate = dateCopy(newValue, endDatetime);
                    if (copiedDate.getTime() >= startDatetime.getTime()) {
                      setEndDateTime(copiedDate);
                    }
                  }}
                  classNameCalendar="-ml-224px"
                />
              )}
            </>
          )}
        </div>
        <div className="ml-2px flex-1 px-16px py-8px rounded-r-8px body1 text-fontSecondary flex flex-row">
          <div className="flex flex-row" onClick={setIsAllday}>
            {isAllDay ? (
              <CheckedIcon
                width={20}
                height={20}
                className={`flex-none cursor-pointer text-fontPrimary`}
              />
            ) : (
              <UncheckedIcon
                width={20}
                height={20}
                className={`flex-none cursor-pointer text-fontPrimary`}
              />
            )}
            <span className="ml-2">終日</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeriodInputs;
