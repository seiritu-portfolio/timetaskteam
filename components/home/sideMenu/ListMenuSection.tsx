import { useRouter } from 'next/router';

import { ListMenuDropPad } from './ListMenuDropPad';
import DownTriangleIcon from '@svg/triangle-small.svg';
import ClosedTriangleIcon from '@svg/triangle-small-right.svg';

const ListMenuSection = ({
  title,
  isOpen,
  listData,
  onClick,
  droppableId,
}: {
  title: string;
  isOpen: boolean;
  listData: any[];
  onClick: () => void;
  droppableId: string;
}) => {
  const router = useRouter();

  return (
    <div className="transition-all ease-in-out delay-400">
      <div
        className="h-44px text-fontSecondary flex-row--between cursor-pointer"
        onClick={onClick}
      >
        <div className="flex">
          {isOpen ? (
            <DownTriangleIcon width={20} height={20} className="ml-12px" />
          ) : (
            <ClosedTriangleIcon width={20} height={20} className="ml-12px" />
          )}
          <span className="ml-16px">{title}</span>
        </div>
        <span
          className={`${
            isOpen || listData.length === 0 ? 'invisible' : ''
          } mr-12px`}
        >
          {listData.length}
        </span>
      </div>
      {isOpen && listData.length > 0 && (
        <ListMenuDropPad
          droppableId={droppableId}
          listArray={listData}
          currentListId={parseInt(router.query.id?.toString() ?? '0')}
        />
      )}
    </div>
  );
};

export default ListMenuSection;
