import { useState } from 'react';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
// * hooks
// * constants
import { CLASSNAME_FOR_TASKMENU } from '@util/constants';
import { TASKS_TODAY_URL } from '@util/urls';

const TaskTodayMenu = ({ count }: { count: number }) => {
  const router = useRouter();

  const [hover, setHover] = useState(false);

  return (
    <div
      className={`${CLASSNAME_FOR_TASKMENU} ${
        router.asPath === TASKS_TODAY_URL
          ? 'bg-primarySelected text-primary'
          : 'text-fontPrimary'
      }`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => {
        router.push(TASKS_TODAY_URL);
      }}
    >
      <div className="body1 flex items-center">
        <CalendarIcon
          date={dayjs().date()}
          active={router.asPath === TASKS_TODAY_URL || hover}
        />
        {/* <TaskTodayIcon width={20} height={20} /> */}
        <span className="ml-16px">今日のタスク</span>
      </div>
      <div className="subtitle-en">{count ? count : ''}</div>
    </div>
  );
};

export default TaskTodayMenu;

const CalendarIcon = ({ date, active }: { date: number; active: boolean }) => {
  return (
    <div
      className={`ml-2px w-15px h-15px border border-2 border-t-4 rounded-2px ${
        active ? 'border-primary' : 'border-fontPrimary'
      } caption3-en flex-xy-center`}
    >
      {date}
    </div>
  );
};
