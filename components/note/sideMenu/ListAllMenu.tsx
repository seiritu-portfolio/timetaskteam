import { useRouter } from 'next/router';

import SquareStackIcon from '@svg/square-stack.svg';
import { CLASSNAME_FOR_TASKMENU } from '@util/constants';
import { NOTES_ALL_URL } from '@util/urls';

const ListAllMenu = ({ folded }: { folded?: boolean }) => {
  const router = useRouter();
  return (
    <div
      className={`${CLASSNAME_FOR_TASKMENU} ${
        router.asPath === NOTES_ALL_URL
          ? 'bg-primarySelected text-primary'
          : 'text-fotnPrimary'
      }`}
      onClick={() => {
        router.push(NOTES_ALL_URL);
      }}
    >
      <div className="body1 flex items-center">
        <SquareStackIcon width={20} height={20} />
        {folded ? null : <span className="ml-16px">全てのノート</span>}
      </div>
    </div>
  );
};

export default ListAllMenu;
