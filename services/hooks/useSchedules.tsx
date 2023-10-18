import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

import {
  tzOffsetBrowserSelector,
  tzOffsetSelector,
  userTimeDisplayFormat,
} from '@store/selectors/user';
import { useMemo } from 'react';

const useTzAddedTimeFormat = (datetime: Date) => {
  const tzOffset = useSelector(tzOffsetSelector);
  const timeDisplayFormat = useSelector(userTimeDisplayFormat);

  const newDate = new Date(datetime);
  newDate.setMinutes(newDate.getMinutes() + tzOffset);

  let hour = newDate.getHours();
  const mins = newDate.getMinutes();

  if (timeDisplayFormat === 2) {
    return `${hour}:${mins < 10 ? `0${mins}` : mins}`;
  } else {
    hour = hour > 12 ? hour - 12 : hour;
    return `${hour}:${mins < 10 ? `0${mins}` : mins}${hour > 11 ? 'pm' : 'am'}`;
  }
};

const useToday = () => {
  const tzOffsetMins = useSelector(tzOffsetSelector);
  const tzOffsetBrowser = useSelector(tzOffsetBrowserSelector);

  const today = useMemo(() => {
    const diffMins =
      (Number.isNaN(tzOffsetBrowser) ? 0 : tzOffsetBrowser) -
      (Number.isNaN(tzOffsetMins) ? 0 : tzOffsetMins);
    return dayjs().subtract(diffMins, 'minute');
  }, [tzOffsetMins, tzOffsetBrowser]);

  return today;
};

const useTodayStart = () => {
  const tzOffsetMins = useSelector(tzOffsetSelector);

  const today = useMemo(() => {
    const diffMins = Number.isNaN(tzOffsetMins) ? 0 : tzOffsetMins;
    return dayjs()
      .hour(0)
      .minute(0)
      .second(0)
      .millisecond(0)
      .subtract(diffMins, 'minute');
  }, [tzOffsetMins]);

  return today;
};

export { useToday, useTodayStart };
