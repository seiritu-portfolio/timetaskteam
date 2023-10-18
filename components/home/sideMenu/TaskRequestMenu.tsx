import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
// * assets
import TaskRequestIcon from '@svg/arrow_right_square.svg';
import { CLASSNAME_FOR_TASKMENU } from '@util/constants';
import { TASKS_REQUEST_URL } from '@util/urls';

const TaskRequestMenu = ({ count }: { count: number }) => {
  const [isActive, setIsActive] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (router.asPath === TASKS_REQUEST_URL) {
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
        router.push(TASKS_REQUEST_URL);
      }}
    >
      <div className="body1 flex items-center">
        <TaskRequestIcon width={20} height={20} />
        <span className="ml-16px">依頼したタスク</span>
      </div>
      <div className="subtitle-en">{count ? count : ''}</div>
    </div>
  );
};

export default TaskRequestMenu;
