import { useRouter } from 'next/router';
import { Draggable } from 'react-beautiful-dnd';
import DraggingIcon from '@svg/equal-small.svg';

const MenuItem = (props: any) => {
  const router = useRouter();
  const Icon = props.icon;
  const Subicon = props?.subicon ?? null;

  return (
    <div
      onClick={() => {
        if (props.onClick) {
          props.onClick();
        }
        router.push(props.link);
      }}
      className={`px-12px w-full h-44px rounded-8px hover:text-primary hover:bg-primarySelected flex-row--between cursor-pointer ${
        props.isActive
          ? 'bg-primarySelected text-primary'
          : 'bg-backgroundSecondary text-fontPrimary'
      }`}
    >
      <div className="body1 flex items-center">
        <Icon width={20} height={20} className="" />
        <span className="ml-16px">{props.text}</span>
      </div>
      <div className="subtitle-en flex items-center">
        {Subicon && <Subicon width={20} height={20} className="mr-16px" />}
        <span className="">{props.count}</span>
      </div>
    </div>
  );
};

export default MenuItem;

export const MenuItemDraggable = (props: any) => {
  const router = useRouter();
  const Icon = props.icon;
  const Subicon = props?.subicon ?? null;

  return (
    <Draggable draggableId={`list-menuitem-${props.id}`} index={props.index}>
      {(provided, snapshot) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={`px-12px w-full h-44px rounded-8px
          ${
            snapshot.isDragging
              ? 'shadow-menu border-1/2 border-separator'
              : 'hover:text-primary hover:bg-primaryHoveredPure'
          }
           flex-row--between cursor-pointer ${
             props.isActive && !snapshot.isDragging
               ? 'bg-primaryHoveredPure text-primary'
               : 'bg-backgroundSecondary text-fontPrimary'
           }`}
          onClick={() => {
            if (props.onClick) {
              props.onClick();
            }
            router.push(props.link);
          }}
        >
          <div className="body1 flex items-center">
            <Icon width={20} height={20} className="flex-none" />
            <span className="ml-16px mr-4px line-clamp-1">{props.text}</span>
          </div>
          {snapshot.isDragging ? (
            <DraggingIcon width={20} height={20} className="text-fontPrimary" />
          ) : (
            <div className="subtitle-en flex items-center">
              {Subicon && (
                <Subicon
                  width={20}
                  height={20}
                  className={props.hideTasksNumber ? `` : `mr-8px`}
                />
              )}
              <span className="w-6 text-right">{props.count ?? ''}</span>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};
