import { Draggable } from 'react-beautiful-dnd';

import EqualIcon from '@svg/equal-small.svg';
import PrivateIcon from '@svg/lock-shield.svg';
import DraggingIcon from '@svg/equal-small.svg';
import { COLOR_VALUES, ICON_VALUES } from '@util/constants';

const ListRow = ({
  data,
  Icon,
  onClick,
  isActive,
  showPrivate,
}: {
  data: any;
  Icon: any;
  onClick: any;
  isActive: boolean;
  showPrivate?: boolean;
}) => {
  return (
    <div
      className={`p-12px relative w-full h-44px rounded-sm ${
        isActive
          ? 'bg-primaryHoveredPure text-primary'
          : 'bg-backgroundSecondary text-fontPrimary'
      } flex-row--between hover:text-primary hover:bg-primaryHoveredPure ${'z-20'} cursor-pointer`}
      onClick={onClick}
    >
      <div className="flex-1 truncate flex items-center">
        {data.type === 1 ? (
          <Icon width={20} height={20} className="flex-none" />
        ) : (
          <div
            className={`flex-none w-14px h-14px rounded-full bg-${
              COLOR_VALUES[data.color].label
            }`}
          />
        )}
        <div
          className={`ml-16px ${
            showPrivate ? 'mr-36px' : 'mr-16px'
          } body1 truncate`}
        >
          {data.name}
        </div>
      </div>
      {showPrivate && <PrivateIcon width={20} height={20} className="" />}
      <div className={`absolute right-0 ${'hidden'}`}>
        <EqualIcon width={20} height={20} />
      </div>
    </div>
  );
};

export default ListRow;

export const ListRowDraggable = ({
  id,
  index,
  data,
  Icon,
  onClick,
  isActive,
  showPrivate,
  draggableId,
}: {
  id: number;
  index: number;
  data: any;
  Icon: any;
  onClick: any;
  isActive: boolean;
  showPrivate?: boolean;
  draggableId?: string;
}) => {
  return (
    <Draggable
      draggableId={draggableId ?? `list-listmenuitem-${id}`}
      index={index}
    >
      {(provided, snapshot) => (
        <div
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          ref={provided.innerRef}
          className={`p-12px relative w-full h-44px rounded-sm ${
            isActive && !snapshot.isDragging
              ? 'bg-primaryHoveredPure text-primary'
              : 'bg-backgroundSecondary text-fontPrimary'
          } flex-row--between  hover:text-primary hover:bg-primaryHoveredPure cursor-pointer`}
          onClick={onClick}
        >
          <div className="flex-1 truncate flex items-center">
            {data.type === 1 ? (
              <Icon width={20} height={20} className="flex-none" />
            ) : (
              <div
                className={`flex-none w-14px h-14px rounded-full bg-${
                  COLOR_VALUES[data.color].label
                }`}
              />
            )}
            <div className="ml-16px mr-36px body1 truncate">{data.name}</div>
          </div>
          {snapshot.isDragging ? (
            <DraggingIcon width={20} height={20} className="text-fontPrimary" />
          ) : (
            <>
              {showPrivate && (
                <PrivateIcon width={20} height={20} className="" />
              )}
              <div className={`absolute right-0 ${'hidden'}`}>
                <EqualIcon width={20} height={20} />
              </div>
            </>
          )}
        </div>
      )}
    </Draggable>
  );
};

export const ListClone = ({
  provided,
  item,
  isDragging,
}: {
  provided: any;
  item: any;
  isDragging: boolean;
}) => {
  const iconData = ICON_VALUES.filter(
    (_: any) => parseInt(_.value) == item?.icon ?? 0,
  );
  const Icon = iconData.length > 0 ? iconData[0].icon : ICON_VALUES[0].icon;

  return item == undefined ? null : (
    <div
      className={`p-12px relative w-full h-44px rounded-sm ${
        item.isActive
          ? 'bg-primarySelected text-primary'
          : 'bg-backgroundSecondary text-fontPrimary'
      } flex-row--between hover:text-primary hover:bg-primarySelected ${'z-20'} cursor-pointer`}
      onClick={item.onClick}
    >
      <div className="flex-1 truncate flex items-center">
        {item.type === 1 ? (
          <Icon width={20} height={20} className="flex-none" />
        ) : (
          <div
            className={`flex-none w-14px h-14px rounded-full bg-${
              COLOR_VALUES[item.color].label
            }`}
          />
        )}
        <div className="ml-16px mr-36px body1 truncate">{item.name}</div>
      </div>
      {item.showPrivate && <PrivateIcon width={20} height={20} className="" />}
      <div className={`absolute right-0 ${'hidden'}`}>
        <EqualIcon width={20} height={20} />
      </div>
    </div>
  );
};
