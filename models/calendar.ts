interface CalendarRenderItem {
  type: number; // ! 0 - schedule 1 - task
  id: number; // ! schedule/task id
  title: string;
  desc?: string;
  x: number; // ! xPos  0 1
  y: number; // ! yPos  0 1
  length: number; // ! can be larger than 7
  hasLeft: boolean;
  hasRight: boolean;
  bgColor?: string;
  userId: number;
  isInactive?: boolean;
  completed?: number;
}

interface CalendarRenderItemExtended extends CalendarRenderItem {
  chunkIndex: number;
}

interface ScheduleDayRenderItem {
  id: number;
  title: string;
  x: number; // ! xPos percentage in the column
  xLength?: number; // ! xLength percentage in the column
  y: number;
  yLength: number;
  bgColor?: string;
  userId: number;
  timeLabel: string;
  allDay?: boolean;
  startDate: string;
  endDate: string;
}

interface ScheduleDayDraggingItem {
  id: number | undefined;
  title: string | undefined;
  dayIndex: number;
  y: number;
  yLength: number;
  bgColor?: string;
  userId: number;
  timeLabel: string;
  allDay?: boolean;
  daySpan?: number;
  startDate?: string;
  endDate?: string;
  originalDayIndex?: number;
  indexInTerm?: number;
}

interface TaskDayRenderItem {
  id: number;
  title: string;
  bgColor?: string;
  userId: number;
}

interface ScheduleDayRenderItemWithGroup extends ScheduleDayRenderItem {
  groupIndex: number;
  subIndex: number;
}

interface ScheduleDayRenderItemExtended extends ScheduleDayRenderItem {
  chunkIndex: number;
}

export type {
  CalendarRenderItem,
  CalendarRenderItemExtended,
  ScheduleDayRenderItem,
  ScheduleDayRenderItemWithGroup,
  ScheduleDayRenderItemExtended,
  TaskDayRenderItem,
  ScheduleDayDraggingItem,
};
