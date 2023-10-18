import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
// * assets
import TaskRequestedIcon from '@svg/arrow_left_square.svg';
import { CLASSNAME_FOR_TASKMENU } from '@util/constants';
import { TASKS_REQUESTED_URL } from '@util/urls';

const TaskRequestedMenu = ({ count }: { count: number }) => {
  const router = useRouter();
  const [isActive, setIsActive] = useState(false);
  useEffect(() => {
    if (router.asPath === TASKS_REQUESTED_URL) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [router.asPath]);

  return (
    <div
      className={`${CLASSNAME_FOR_TASKMENU} ${
        isActive ? 'bg-primarySelected text-primary' : 'text-fontPrimary'
      }`}
      onClick={() => {
        // ! maybe add invalidate queries here
        router.push(TASKS_REQUESTED_URL);
      }}
    >
      <div className="body1 flex items-center">
        <TaskRequestedIcon width={20} height={20} />
        <span className="ml-16px">依頼を受けたタスク</span>
      </div>
      <div className="subtitle-en">{count ? count : ''}</div>
    </div>
  );
};

export default TaskRequestedMenu;
