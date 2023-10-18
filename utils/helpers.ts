import dayjs from 'dayjs';
import { datetime, RRule, RRuleSet } from 'rrule';
import {
  TASKS_CLASSIFY_BY_DATE,
  TASK_SORT_TYPE,
  WEEKDAYS_EN,
  WEEKDAYS_JP,
  WEEKDAYS_RRULE,
} from './constants';

const rruleToString = (repetitionRule: string) => {
  if (repetitionRule === undefined) {
    return '繰り返しなし';
  }
  const rrule = repetitionRule.split(';');
  if (repetitionRule === '' || rrule.length === 0 || repetitionRule == '-1') {
    return '繰り返しなし';
  }
  const returnData: any = {
    FREQ: '',
    BYDAY: '',
    INTERVAL: 1,
    UNTIL: '',
  };

  rrule.forEach((rule: string) => {
    const [name, value] = rule.split('=');
    if (name == 'FREQ') {
      returnData.FREQ =
        value == 'YEARLY'
          ? '年'
          : value == 'MONTHLY'
          ? 'ヶ月'
          : value == 'WEEKLY'
          ? '週'
          : '日';
    } else if (name == 'BYDAY') {
      const weekdaysEn =
        value.split(',').length > 0
          ? value
              .split(',')
              .map(
                (weekday: string) => WEEKDAYS_JP[WEEKDAYS_EN.indexOf(weekday)],
              )
          : [];
      returnData.BYDAY = weekdaysEn.join('と');
    } else if (name === 'INTERVAL') {
      returnData[name] = parseInt(value);
    } else if (name === 'UNTIL') {
      returnData[name] = `${parseInt(value.substr(4, 2))}月${parseInt(
        value.substr(6, 2),
      )}日まで`;
    }
  });
  return `毎${returnData.INTERVAL === 1 ? '' : returnData.INTERVAL}${
    returnData.FREQ
  }${returnData.BYDAY}${returnData.UNTIL ? `,${returnData.UNTIL}` : ''}`;
};

const reminderToString = (
  reminder: string | null,
  tzOffset: number,
  tzOffsetBrowser: number,
  timeMode24: boolean,
) => {
  if (!reminder || reminder == '') {
    return {
      type: 'none',
      value: '-1',
      label: 'リマインダーなし',
    };
  }
  const reminderDate = dayjs(reminder).add(
    tzOffset - tzOffsetBrowser,
    'minute',
  );
  let label = reminderDate.format('M月DD日(dd),H:mm');
  if (!timeMode24) {
    label = `${reminderDate.format('M月DD日(dd),h:mm')}${
      reminderDate.hour() > 11 ? 'pm' : 'am'
    }`;
  }

  return {
    label: label,
    value: reminderDate.format('YYYY-MM-DD HH:mm'),
    type: 'custom',
  };
};

export { rruleToString, reminderToString };

export const getClassified = (
  responseData: any,
  currentSortType: TASK_SORT_TYPE,
) => {
  let resultData: any[] = [];
  let isNotEmpty = false;
  if (currentSortType == 'priority') {
    let low: any[] = [];
    let mid: any[] = [];
    let high: any[] = [];
    let completed: any[] = [];
    const keyList = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
    for (let i = 0; i < 10; i++) {
      const key = keyList[i];
      const subset = responseData[key.toString()];
      if (!subset) continue;
      if (subset.length === 0) {
        continue;
      }
      isNotEmpty = true;
      if (key < 1 || key > 9) {
        completed = [...completed, ...subset];
      } else if (key < 3) {
        low = [...low, ...subset];
      } else if (key < 6) {
        mid = [...mid, ...subset];
      } else {
        high = [...high, ...subset];
      }
    }
    resultData.push({
      key: '高',
      list: high,
    });
    resultData.push({
      key: '中',
      list: mid,
    });
    resultData.push({
      key: '低',
      list: low,
    });
    resultData.push({
      key: '完了',
      list: completed,
    });
  } else if (currentSortType == 'list') {
    for (var key in responseData) {
      const name = responseData[key].name;
      const subset = responseData[key].tasks;
      const subsetLength = subset ? subset.length : 0;
      if (subsetLength > 0) {
        isNotEmpty = true;
        resultData.push({
          key: name,
          list: subset,
        });
      }
    }
  } else if (currentSortType == 'importance') {
    let low: any[] = responseData['1'] ?? [];
    let mid: any[] = responseData['2'] ?? [];
    let high: any[] = responseData['3'] ?? [];
    let completed: any[] = responseData['0'] ?? [];

    isNotEmpty =
      low.length > 0 ||
      mid.length > 0 ||
      high.length > 0 ||
      completed.length > 0;
    resultData.push({
      key: '高',
      list: high,
      sortType: currentSortType,
    });
    resultData.push({
      key: '中',
      list: mid,
      sortType: currentSortType,
    });
    resultData.push({
      key: '低',
      list: low,
      sortType: currentSortType,
    });
    resultData.push({
      key: '完了',
      list: completed,
    });
  } else {
    for (var key in responseData) {
      const subset = responseData[key] ?? [];

      if (subset.length > 0) {
        isNotEmpty = true;
      }
      resultData.push({
        key: TASKS_CLASSIFY_BY_DATE[key],
        list: subset,
      });
    }
  }
  return isNotEmpty ? resultData : [];
};

export const rruleToDates = (
  repetitionRule: string,
  startDate: string | undefined,
  endDate: string,
) => {
  if (repetitionRule === undefined || repetitionRule === '') return {};
  const rrule = repetitionRule.split(';');
  if (repetitionRule === '' || rrule.length === 0 || repetitionRule == '-1') {
    return {};
  }

  const returnData: any = {};
  rrule.forEach((rule: string) => {
    const [name, value] = rule.split('=');
    if (name == 'FREQ') {
      returnData.freq =
        value == 'YEARLY'
          ? RRule.YEARLY
          : value == 'MONTHLY'
          ? RRule.MONTHLY
          : value == 'WEEKLY'
          ? RRule.WEEKLY
          : RRule.DAILY;
    } else if (name == 'BYDAY') {
      const byday = value.split(',');
      returnData.byweekday = byday.map(
        (weekday: string) => WEEKDAYS_RRULE[WEEKDAYS_EN.indexOf(weekday)],
      );
    } else if (name === 'INTERVAL') {
      returnData.interval = parseInt(value);
    } else if (name === 'UNTIL') {
      returnData.until = datetime(
        parseInt(value.substring(0, 4)),
        parseInt(value.substring(4, 6)),
        parseInt(value.substring(6, 8)),
      );
    } else if (name === 'BYMONTHDAY') {
      returnData.until = parseInt(value);
    } else if (name === 'BYSETPOS') {
      returnData.bysetpos = parseInt(value);
    }
  });

  if (!returnData.until) {
    const untilDate = dayjs(endDate).add(1, 'year');
    returnData.until = datetime(
      untilDate.year(),
      untilDate.month() + 1,
      untilDate.date(),
    );
  }
  const dtStart = dayjs(startDate ?? endDate).add(1, 'day');
  returnData.dtstart = datetime(
    dtStart.year(),
    dtStart.month() + 1,
    dtStart.date(),
  );

  const rruleSet = new RRuleSet();
  rruleSet.rrule(new RRule(returnData));
  const shifted = rruleSet.all();
  shifted.shift();
  return shifted;
};
