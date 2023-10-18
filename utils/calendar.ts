import dayjs, { Dayjs } from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { WEEKDAYS_JP } from './constants';

const validateCalendarRoute = (
  yearMonth: string,
  viewMode: string,
  index: number,
) => {
  let isOkay = true;

  if (viewMode !== 'half' && viewMode !== 'week' && viewMode != null) {
    isOkay = false;
  }

  const dateReg = new RegExp(/(20[2345]\d{1}-(0[1-9]|1[0-2]|[1-9]))/);
  if (!dateReg.test(yearMonth)) {
    isOkay = false;
  }

  if (
    viewMode === 'month' ||
    (viewMode === 'half' && [1, 2].includes(index)) ||
    (viewMode === 'week' && [1, 2, 3, 4, 5].includes(index))
  ) {
  } else {
    isOkay = false;
  }

  return isOkay;
};

const getDateRange = (yearMonth: string, viewMode: string, index: number) => {
  const year = parseInt(yearMonth.split('-')[0]);
  const month = parseInt(yearMonth.split('-')[1]);

  const firstOfMonth = new Date(year, month, 1);
  const lastOfMonth = new Date(year, month + 1, 0);
  const dowFirstOfMonth = firstOfMonth.getDay();
  const dowLastOfMonth = lastOfMonth.getDay();
  if (viewMode === 'month') {
    return {
      first: firstOfMonth,
      last: lastOfMonth,
      firstDow: dowFirstOfMonth,
      lastDow: dowLastOfMonth,
    };
  } else if (viewMode === 'half') {
    const first = index === 1 ? firstOfMonth : new Date(year, month, 16);
    const last = index === 1 ? new Date(year, month, 15) : lastOfMonth;
    return {
      first,
      last,
      firstDow: first.getDay(),
      lastDow: last.getDay(),
    };
  } else {
    const sunday1 =
      dowFirstOfMonth === 0
        ? firstOfMonth
        : new Date(year, month, 8 - dowFirstOfMonth);
    const weeks = [
      {
        first: firstOfMonth,
        last: sunday1,
      },
    ];
    let oldSunday = sunday1;
    while (true) {
      let newMonday = new Date();
      let newSunday = new Date();
      newMonday.setDate(oldSunday.getDate() + 1);
      newSunday.setDate(oldSunday.getDate() + 7);
      if (month === newSunday.getMonth() + 1) {
        weeks.push({
          first: newMonday,
          last: newSunday,
        });
      } else if (month === newMonday.getMonth() + 1) {
        weeks.push({
          first: newMonday,
          last: lastOfMonth,
        });
        break;
      } else {
        break;
      }
      oldSunday = newSunday;
    }
    const currentWeek = weeks[index];
    return {
      first: currentWeek.first,
      last: currentWeek.last,
      firstDow: currentWeek.first.getDay(),
      lastDow: currentWeek.last.getDay(),
    };
  }
};

export const getDayArr = (date: Dayjs, len: number) => {
  const arr: Dayjs[] = [];
  const startDate = date.clone();
  for (let i = 0; i < len; i++) {
    arr.push(startDate.add(i, 'day'));
  }
  return arr;
};

/**
 *
 * * function changes - now find a range that includes calendarDate
 */
export const getDateRangeForCalendarNew = (
  viewMode: string,
  calendarDate: Dayjs,
  weekStart?: number,
) => {
  const today = dayjs();
  let fromDate: Dayjs, toDate: Dayjs;
  let daysCount: number;

  const startOfThisWeek =
    weekStart === 1
      ? today.subtract(1, 'day').startOf('week').add(1, 'day')
      : today.startOf('week');
  const weekCount = startOfThisWeek.diff(calendarDate, 'week');
  if (viewMode === 'month') {
    fromDate =
      weekStart === 1
        ? calendarDate.date() > 1
          ? calendarDate.add(1, 'day')
          : calendarDate.subtract(6, 'day')
        : calendarDate.clone();
    const lastSaturday01 = calendarDate.add(7 * 4 - 1, 'day');
    const lastSunday01 = calendarDate.add(7 * 4, 'day');
    const lastSaturday02 = calendarDate.add(7 * 5 - 1, 'day');
    const lastSunday02 = calendarDate.add(7 * 5, 'day');

    if (lastSunday01.month() !== lastSaturday01.month()) {
      toDate = lastSaturday01.clone();
      daysCount = 28;
    } else if (
      lastSaturday01.month() !== lastSaturday02.month() ||
      lastSaturday02.month() !== lastSunday02.month()
    ) {
      toDate = lastSaturday02.clone();
      daysCount = 35;
    } else {
      toDate = lastSaturday02.add(7, 'day');
      daysCount = 42;
    }
    toDate = weekStart === 1 ? toDate.add(1, 'day') : toDate;
  } else if (viewMode === 'weeks4') {
    const maxWeekCount = Math.ceil(weekCount / 4) * 4;
    fromDate = startOfThisWeek.subtract(maxWeekCount, 'week');
    toDate = fromDate.add(4, 'week');
    daysCount = 28;
  } else if (viewMode === 'weeks2') {
    const maxWeekCount = Math.ceil(weekCount / 2) * 2;
    fromDate = startOfThisWeek.subtract(maxWeekCount, 'week');
    toDate = fromDate.add(2, 'week');
    daysCount = 14;
  } else {
    fromDate = startOfThisWeek.subtract(weekCount, 'week');
    toDate = fromDate.add(1, 'week');
    daysCount = 7;
  }
  return {
    from_date: fromDate.format('YYYY-M-D'),
    to_date: toDate.format('YYYY-M-D'),
    daysCount,
  };
};

/**
 *
 * * old range - find a range that starts with calendarDate
 */
const getDateRangeForCalendar = (
  viewMode: string,
  calendarDate: Dayjs,
  weekStart?: number, // ! weekStart 0 | undefined means sunday based calendar
) => {
  let fromDate = calendarDate.clone();
  let toDate: Dayjs; //!format('YYYY-M-D')

  let daysCount = 0;
  if (viewMode === 'month') {
    const lastSaturday01 = calendarDate.add(7 * 4 - 1, 'day');
    const lastSunday01 = calendarDate.add(7 * 4, 'day');
    const lastSaturday02 = calendarDate.add(7 * 5 - 1, 'day');
    const lastSunday02 = calendarDate.add(7 * 5, 'day');

    if (lastSunday01.month() !== lastSaturday01.month()) {
      toDate = lastSaturday01.clone();
      daysCount = 28;
    } else if (
      lastSaturday01.month() !== lastSaturday02.month() ||
      lastSaturday02.month() !== lastSunday02.month()
    ) {
      toDate = lastSaturday02.clone();
      daysCount = 35;
    } else {
      toDate = lastSaturday02.add(7, 'day');
      daysCount = 42;
    }
    // if (weekStart === 1 && fromDate.date() > 1) {
    //   fromDate = fromDate.
    // }
  } else if (viewMode === 'half') {
    toDate = calendarDate.add(7 * 3 - 1, 'day');
    daysCount = 21;
  } else if (viewMode === 'week') {
    toDate = calendarDate.add(7, 'day');
    daysCount = 7;
  } else if (viewMode === 'weeks4') {
    toDate = calendarDate.add(28, 'day');
    daysCount = 28;
  } else if (viewMode === 'weeks2') {
    toDate = calendarDate.add(14, 'day');
    daysCount = 14;
  } else {
    return {
      from_date: '',
      to_date: '',
      daysCount: 0,
    };
  }

  if (weekStart == 1) {
    fromDate =
      fromDate.date() > 1
        ? fromDate.add(1, 'day')
        : fromDate.subtract(6, 'day');
    toDate = toDate.add(1, 'day');
  }

  return {
    from_date: fromDate.format('YYYY-M-D'),
    to_date: toDate.format('YYYY-M-D'),
    daysCount,
  };
};

export const getDateISOFormat = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}-${month > 9 ? month : `0${month}`}-${
    day > 9 ? day : `0${day}`
  }`;
};

export const getDateMMDDFormat = (date: Date) => {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${month > 9 ? month : `0${month}`}月${day > 9 ? day : `0${day}`}日(${
    WEEKDAYS_JP[date.getDay()]
  })`;
};

export const getDateMDFormat = (date: Date) => {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${month}月${day}日(${WEEKDAYS_JP[date.getDay()]})`;
};

export const getHourMinFormat = (mins: number) => {
  const hour = Math.floor(mins / 60);
  const remainder = Math.ceil(mins % 60);

  return `${hour > 0 ? `${hour}h` : ''}${
    hour > 0 && remainder < 9 ? `0${remainder}` : remainder
  }mins`;
};

export const getHourMinTimemodeFormat = (
  mins: number,
  isTimeMode24: boolean,
) => {
  const hour = Math.floor(mins / 60);
  const remainder = Math.ceil(mins % 60);

  if (isTimeMode24)
    return `${hour > 0 ? `${hour}` : ''}:${
      hour > 0 && remainder < 9 ? `0${remainder}` : remainder
    }`;
  else
    return `${hour > 12 ? `${hour - 12}h` : hour > 0 ? `${hour}h` : ''}${
      hour > 0 && remainder < 9 ? `0${remainder}` : remainder
    } ${hour > 11 ? 'pm' : 'am'}`;
};

export const getHourMinFormatFromDayjs = (
  value: Dayjs,
  isTimeMode24: boolean,
) => {
  const hour = value.hour();
  const mins = value.minute();

  if (isTimeMode24)
    return `${hour > 0 ? `${hour}` : ''}:${
      hour > 0 && mins < 9 ? `0${mins}` : mins
    }`;
  else
    return `${hour > 12 ? `${hour - 12}h` : hour > 0 ? `${hour}h` : ''}${
      hour > 0 && mins < 9 ? `0${mins}` : mins
    } ${hour > 11 ? 'pm' : 'am'}`;
};

export const dateCopy = (srcDate: Date, destDate: Date) => {
  const copiedDestDate = new Date(destDate);
  copiedDestDate.setFullYear(srcDate.getFullYear());
  copiedDestDate.setMonth(srcDate.getMonth());
  copiedDestDate.setDate(srcDate.getDate());
  return copiedDestDate;
};

export const timeCopy = (srcDate: Date, destDate: Date | null) => {
  const copiedDestDate = destDate ? new Date(destDate) : new Date();
  copiedDestDate.setHours(srcDate.getHours());
  copiedDestDate.setMinutes(srcDate.getMinutes());
  copiedDestDate.setSeconds(srcDate.getSeconds());
  copiedDestDate.setMilliseconds(srcDate.getMilliseconds());
  return copiedDestDate;
};

export const convertDayjsToTimeFormat = (
  srcDatetime: Dayjs,
  timeMode24: boolean,
) =>
  timeMode24
    ? srcDatetime.format('HH:mm')
    : `${srcDatetime.format('hh:mm')}${srcDatetime.hour() >= 12 ? 'pm' : 'am'}`;

export { validateCalendarRoute, getDateRange, getDateRangeForCalendar };

export const useWindowDimensions = () => {
  const hasWindow = typeof window !== 'undefined';

  const getWindowDimensions = useCallback(() => {
    const width = hasWindow ? window.innerWidth : null;
    const height = hasWindow ? window.innerHeight : null;
    return {
      width,
      height,
    };
  }, [hasWindow]);

  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions(),
  );

  useEffect(() => {
    if (hasWindow) {
      const handleResize = () => {
        setWindowDimensions(getWindowDimensions());
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [hasWindow, getWindowDimensions]);

  return windowDimensions;
};
