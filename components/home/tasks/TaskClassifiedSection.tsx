import React, { useState } from 'react';
// * hooks
import { TaskDropPad } from '../TaskDropPad';
import { TaskSelectableRow } from 'pages/tasks/TaskScheduleRows';

const TaskClassifiedSection = ({
  title,
  tasksArray,
  showSelectedMode,
  selectedList,
  onHeader,
  setSelectedList,
  droppableId,
}: {
  title: string;
  tasksArray: any[];
  showSelectedMode?: boolean;
  selectedList: number[];
  onHeader: () => void;
  setSelectedList: (newValue: number[]) => void;
  droppableId: string;
}) => {
  const [open, setOpen] = useState(true);

  return (
    <React.Fragment>
      <div
        className="py-12px text-fontSecondary flex flex-row items-center cursor-pointer"
        onClick={onHeader}
      >
        <span className="ml-12px body2">{title}</span>
        <span className={`ml-8px body2-en ${open ? 'hidden' : ''}`}>
          {tasksArray.length ? tasksArray.length : ''}
        </span>
      </div>
      <div className={`relative ${open ? '' : 'hidden'}`}>
        {showSelectedMode &&
          tasksArray.map((task) => (
            <TaskSelectableRow
              isSelected={selectedList.includes(task.id)}
              setIsSelected={() => {
                if (selectedList.includes(task.id)) {
                  setSelectedList(selectedList.filter((_) => _ !== task.id));
                } else {
                  setSelectedList([...selectedList, task.id]);
                }
              }}
              {...task}
              key={`list-${title}-selectable-task-id-${task.id}`}
            />
          ))}
      </div>
      {!showSelectedMode && (
        <TaskDropPad droppableId={droppableId} tasksArray={tasksArray} />
      )}
    </React.Fragment>
  );
};

export default TaskClassifiedSection;
