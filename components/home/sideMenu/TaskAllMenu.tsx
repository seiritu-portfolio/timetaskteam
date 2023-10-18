import { useRouter } from 'next/router';

import SquareStackIcon from '@svg/square-stack.svg';
import { CLASSNAME_FOR_TASKMENU } from '@util/constants';
import { TASKS_ALL_URL } from '@util/urls';

const TaskAllMenu = ({ count }: { count: number }) => {
  const router = useRouter();
  return (
    <div
      className={`${CLASSNAME_FOR_TASKMENU} ${
        router.asPath === TASKS_ALL_URL
          ? 'bg-primarySelected text-primary'
          : 'text-fotnPrimary'
      }`}
      onClick={() => {
        router.push(TASKS_ALL_URL);
      }}
    >
      <div className="body1 flex items-center">
        <SquareStackIcon width={20} height={20} />
        <span className="ml-16px">全てのタスク</span>
      </div>
      <div className="subtitle-en">{count ? count : ''}</div>
    </div>
  );
};

export default TaskAllMenu;
