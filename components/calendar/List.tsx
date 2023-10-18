import React from 'react';
import { Dayjs } from 'dayjs';
import ScheduleSection from './ScheduleSection';
import TaskSection from './TaskSection';

const List = ({
  currentDate,
  calendarFilter,
  startdateUnset,
  className,
}: {
  currentDate: Dayjs;
  calendarFilter: string;
  startdateUnset?: boolean;
  className?: string;
}) => {
  return (
    <div className={`flex-1 ${className} flex flex-col overflow-y-auto`}>
      <ScheduleSection
        currentDate={currentDate}
        calendarFilter={calendarFilter}
      />
      <TaskSection
        currentDate={currentDate}
        calendarFilter={calendarFilter}
        startdateUnset={startdateUnset}
      />
    </div>
  );
};

export default List;
