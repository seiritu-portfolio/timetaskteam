import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

const TaskMinibar = ({
  title,
  onClick,
  leftContinue,
  rightContinue,
}: {
  title: string;
  onClick: () => void;
  leftContinue?: boolean;
  rightContinue?: boolean;
}) => {
  return (
    <div
      className={`my-px ${leftContinue ? '' : 'ml-px'} ${
        rightContinue ? '' : 'mr-px'
      } p-2px h-12px rounded-1px bg-blueOp3 body2 text-fontPrimary truncate flex items-center cursor-pointer`}
      onClick={onClick}
    >
      {title}
    </div>
  );
};

export const TaskMinibarDraggable = ({
  id,
  index,
  title,
  onClick,
  leftContinue,
  rightContinue,
  bgColor,
}: {
  id: string;
  index: number;
  title: string;
  onClick: () => void;
  leftContinue?: boolean;
  rightContinue?: boolean;
  bgColor?: string;
}) => {
  return (
    <Draggable draggableId={`task-${title}-${id}`} index={index}>
      {(provided, snapshot) => (
        <React.Fragment>
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <div
              className={`my-px ${leftContinue ? '' : 'ml-px'} ${
                rightContinue ? '' : 'mr-px'
              } p-2px h-12px rounded-1px bg-${
                bgColor ? `${bgColor} bg-opacity-50` : 'blueOp3'
              } body2 text-fontPrimary truncate flex items-center cursor-pointer`}
              onClick={onClick}
            >
              {leftContinue ? '' : title}
            </div>
          </div>
          {snapshot.isDragging && (
            <div
              className={`my-px ${leftContinue ? '' : 'ml-px'} ${
                rightContinue ? '' : 'mr-px'
              } p-2px h-12px rounded-1px bg-${
                bgColor ?? 'blueOp3'
              } body2 text-fontPrimary truncate flex items-center opacity-50 cursor-pointer`}
              onClick={onClick}
            >
              {title}
            </div>
          )}
        </React.Fragment>
      )}
    </Draggable>
  );
};

const ScheduleMinibar = ({
  time,
  title,
  onClick,
}: {
  time?: string;
  title: string;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className="m-px p-2px h-12px rounded-1px bg-yellowOp3 body2 text-fontPrimary flex items-center cursor-pointer"
    >
      {time && <span className="flex-1 line-clamp-1 ">{time}</span>}
      <span className="flex-1 ml-4px truncate">{title}</span>
    </div>
  );
};

export const ScheduleMinibarDraggable = ({
  id,
  index,
  time,
  title,
  onClick,
  bgColor,
  leftContinue,
  rightContinue,
}: {
  id: string;
  index: number;
  time?: string;
  title: string;
  onClick: () => void;
  bgColor?: string;
  leftContinue?: boolean;
  rightContinue?: boolean;
}) => {
  return (
    <Draggable draggableId={`schedule-${title}-${id}`} index={index}>
      {(provided, snapshot) => (
        <React.Fragment>
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <div
              onClick={onClick}
              className={`my-px p-2px ${leftContinue ? '' : 'ml-3/2px'} ${
                rightContinue ? '' : 'mr-px'
              } h-12px rounded-1px bg-${
                bgColor
                  ? `${bgColor} ${leftContinue ? '' : 'ml-px'} bg-opacity-50`
                  : 'yellowOp3'
              } body2 text-fontPrimary flex items-center cursor-pointer`}
            >
              {time && <span className="flex-1 line-clamp-1 ">{time}</span>}
              <span className="flex-1 ml-4px truncate">{title}</span>
            </div>
          </div>
          {snapshot.isDragging && (
            <div
              className={`m-px p-2px h-12px rounded-1px bg-${
                bgColor ?? 'yellowOp3'
              } body2 text-fontPrimary opacity-50 flex items-center cursor-pointer`}
            >
              {time && <span className="flex-1 line-clamp-1 ">{time}</span>}
              <span className="flex-1 ml-4px truncate">{title}</span>
            </div>
          )}
        </React.Fragment>
      )}
    </Draggable>
  );
};

export { TaskMinibar, TaskEmptyMinibar, ScheduleMinibar, ScheduleEmptyMinibar };

const TaskEmptyMinibar = () => {
  return <div className={`my-px p-2px h-12px`}></div>;
};

const ScheduleEmptyMinibar = () => {
  return <div className="m-px p-2px h-12px"></div>;
};
