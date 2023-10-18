import { useSelector } from 'react-redux';

import {
  tzOffsetBrowserSelector,
  tzOffsetSelector,
  urgencyCriteriaSelector,
} from '@store/selectors/user';
import dayjs from 'dayjs';

const useLeftDaysTask = (task: any) => {
  const urgencyCriteria = useSelector(urgencyCriteriaSelector);
  const tzOffset = useSelector(tzOffsetSelector);
  const tzOffsetBrowser = useSelector(tzOffsetBrowserSelector);

  if (urgencyCriteria == '') {
    return ['', ''];
  }

  const [urgent, still] = urgencyCriteria.split('-').map((_) => parseInt(_));
  const endDate = dayjs(task.end_date)
    .add(tzOffset - tzOffsetBrowser, 'minutes')
    .hour(0)
    .minute(0)
    .second(0)
    .millisecond(0);
  const currentDay = dayjs().hour(0).minute(0).second(0).millisecond(0);
  const diffDaysRaw: number = endDate.diff(currentDay, 'day');

  const completed = task.pivot?.completed ?? 0;
  const priority =
    (completed == 1
      ? 0
      : diffDaysRaw > still
      ? 1
      : diffDaysRaw > urgent
      ? 2
      : 3) * task.importance;
  const urgencyColor =
    priority === 0
      ? 'fontSecondary'
      : priority < 3
      ? 'deepSkyBlue'
      : priority < 6
      ? 'yellow'
      : 'carminePink';

  const diffDays = Math.abs(diffDaysRaw);
  const year = Math.abs(endDate.diff(currentDay, 'year'));
  const month = Math.abs(endDate.diff(currentDay, 'month'));

  const leftDaysLabel =
    currentDay.year() !== endDate.year() ||
    currentDay.month() !== endDate.month() ||
    diffDaysRaw > 2 ||
    diffDaysRaw < -1 ? (
      <span
        className={diffDaysRaw < 0 ? 'text-secondary' : 'text-fontSecondary'}
      >
        {`${diffDaysRaw > 0 ? '残り' : ''}${
          year > 0 ? `${year}年` : month > 0 ? `${month}ヶ月` : `${diffDays}日`
        }`}
        {`${diffDaysRaw < 0 ? '前' : ''}`}
      </span>
    ) : diffDaysRaw === 0 ? (
      '今日'
    ) : diffDaysRaw === -1 ? (
      '昨日'
    ) : diffDaysRaw === 1 ? (
      '明日'
    ) : (
      '明後日'
    );

  return [leftDaysLabel, urgencyColor];
};

export default useLeftDaysTask;
