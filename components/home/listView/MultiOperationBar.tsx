import ListIcon from '@svg/list-bullet.svg';
import PriorityIcon from '@svg/flame.svg';
import TimeIcon from '@svg/stopwatch.svg';
import MoveIcon from '@svg/square-on-square-dashed.svg';
import DeleteIcon from '@svg/trash.svg';
import CloseIcon from '@svg/multiply.svg';

const MultiOperationBar = ({
  visible,
  onList,
  onPriority,
  onTime,
  onMove,
  onDelete,
  onSelectAll,
  onClose,
}: {
  visible: boolean;
  onList: () => void;
  onPriority: () => void;
  onTime: () => void;
  onMove: () => void;
  onDelete: () => void;
  onSelectAll: () => void;
  onClose: () => void;
}) => {
  return (
    <div
      className={`absolute bottom-40px w-full flex-xy-center ${
        visible ? '' : 'hidden'
      }`}
    >
      <div className="p-12px rounded-8px border-1/2 border-separator bg-backgroundSecondary text-fontPrimary shadow-menu flex flex-row items-center">
        <div
          className="p-12px rounded-6px hover:bg-primarySelected hover:text-primary cursor-pointer"
          onClick={onList}
        >
          <ListIcon width={20} height={20} />
        </div>
        <div
          className="ml-24px p-12px rounded-6px hover:bg-primarySelected hover:text-primary cursor-pointer"
          onClick={onPriority}
        >
          <PriorityIcon width={20} height={20} />
        </div>
        <div
          className="ml-24px p-12px rounded-6px hover:bg-primarySelected hover:text-primary cursor-pointer"
          onClick={onTime}
        >
          <TimeIcon width={20} height={20} />
        </div>
        <div
          className="ml-24px p-12px rounded-6px hover:bg-primarySelected hover:text-primary cursor-pointer"
          onClick={onMove}
        >
          <MoveIcon width={20} height={20} />
        </div>
        <div
          className="ml-24px p-12px rounded-6px hover:bg-primarySelected hover:font-primary cursor-pointer"
          onClick={onDelete}
        >
          <DeleteIcon width={20} height={20} />
        </div>
        <div
          className="ml-24px rounded-6px text-primary body1 cursor-pointer"
          onClick={onSelectAll}
        >
          全て選択
        </div>
        <div
          className="ml-24px p-12px rounded-6px hover:bg-primarySelected hover:font-primary cursor-pointer"
          onClick={onClose}
        >
          <CloseIcon width={20} height={20} />
        </div>
      </div>
    </div>
  );
};

export default MultiOperationBar;
