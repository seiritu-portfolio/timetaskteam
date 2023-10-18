import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Dayjs } from 'dayjs';
// * hooks
import { useWindowDimensions } from '@util/calendar';
// * components
import {
  ScheduleDayDraggingItem,
  ScheduleDayRenderItem,
  TaskDayRenderItem,
} from '@model/calendar';
// * assets
import ExpandIcon from '@svg/arrow-up-left-and-arrow-down-right.svg';
import CollapseIcon from '@svg/arrow-down-forward-and-arrow-up-backward.svg';
import ArrowLeftIcon from '@svg/arrow-left.svg';
import { WEEKDAYS_JP } from '@util/constants';

const PADDING = 2;
const CELL_HEIGHT = 48;
const PanelWeek = ({
  schedulesPerDay,
  tasksPerDay,
  dayArr,
  timeMode24,
  tzOffsetMins,
  currentDate,
  today,
  holidayDict,
  holidayDisplay,
  expanded,
  draggingObject,
  isSidebarOpen,
  detailBarStatus,
  onDayLabelClick,
  onScheduleClick,
  onTaskClick,
  onTaskNew,
  onExpand,
  onShowStatusBar,
  onMouseDownCalendar,
  onMouseDownScheduleFooter,
  onMouseDownScheduleBody,
  onMouseMoveHandler,
  onMouseUpHandler,
  onMouseMoveOnSelf,
  onDragEnd,
  onDelete,
}: {
  schedulesPerDay: Array<ScheduleDayRenderItem[]>;
  tasksPerDay: Array<TaskDayRenderItem[]>;
  dayArr: Dayjs[];
  timeMode24: boolean;
  tzOffsetMins: number;
  currentDate: Dayjs;
  today: Dayjs;
  holidayDict: {
    [key: string]: string;
  };
  holidayDisplay: boolean;
  expanded: boolean;
  draggingObject: ScheduleDayDraggingItem | undefined;
  isSidebarOpen: boolean;
  detailBarStatus: boolean;
  onDayLabelClick: (date: Dayjs) => void;
  onScheduleClick: (id: number, userId: number) => void;
  onTaskClick: (id: number, userId: number) => void;
  onTaskNew: (newDate: Dayjs) => void;
  onExpand: () => void;
  onShowStatusBar: () => void;
  onMouseDownCalendar: (date: Dayjs, dayIndex: number, yMins: number) => void;
  onMouseDownScheduleFooter: (
    {
      id,
      title,
      y,
      yLength,
      bgColor,
      userId,
      timeLabel,
      allDay,
      startDate,
      endDate,
    }: {
      id: number;
      title: string;
      y: number;
      yLength: number;
      bgColor?: string;
      userId: number;
      timeLabel?: string;
      allDay?: boolean;
      startDate: string;
      endDate: string;
    },
    dayIndex: number,
  ) => void;
  onMouseDownScheduleBody: (
    {
      id,
      title,
      y,
      yLength,
      bgColor,
      userId,
      timeLabel,
      allDay,
      startDate,
      endDate,
    }: {
      id: number;
      title: string;
      y: number;
      yLength: number;
      bgColor?: string;
      userId: number;
      timeLabel?: string;
      allDay?: boolean;
      startDate: string;
      endDate: string;
    },
    dayIndex: number,
  ) => void;
  onMouseMoveHandler: (dayIndex: number, mins: number) => void;
  onMouseUpHandler: (
    date: Dayjs,
    dayIndex: number,
    mins: number,
    currentDraggingObject: ScheduleDayDraggingItem,
  ) => void;
  onMouseMoveOnSelf: (newLength: number) => void;
  onDragEnd: () => void;
  onDelete: (id: number, type: 'task' | 'schedule') => void;
}) => {
  const [draggingMin, draggingMax] = useMemo(() => {
    if (draggingObject) {
      const min = draggingObject.dayIndex;
      const max = min + (draggingObject.daySpan ?? 1) - 1;
      return [min, max];
    } else {
      return [-1, -1];
    }
  }, [draggingObject]);

  const [width, setWidth] = useState(0);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [tasksBarExtended, setTasksBarExtended] = useState(false);

  useEffect(() => {
    const sidebarWidth = isSidebarOpen ? 356 : 92;
    const sidepanelWidth = detailBarStatus ? 0 : expanded ? 44 : 460;
    let containerWidth = 0;
    if (windowWidth) {
      containerWidth = windowWidth - sidebarWidth - sidepanelWidth - 64;
    }
    const newWidth = Math.max(
      0,
      Math.floor(containerWidth / 7) - PADDING * 2 - 0.5,
    );
    setWidth(newWidth);

    const scrollBodyElement = document.querySelector(
      '#calendar-scroll-container',
    );
    const headerElement = document.querySelector('#week-header');
    const headerRemnant = document.querySelector('#fixed-header-remnant');
    // const virtualHeaderRemnant: HTMLDivElement | null = document.querySelector(
    //   '#virtual-fixed-header-remnant',
    // );
    const headerTimeColumn = document.querySelector('#calendar-time-column');
    const handleScroll = () => {
      const scrollY = scrollBodyElement?.scrollTop ?? 0;
      if (
        scrollY >= 44 &&
        headerElement &&
        !headerElement.classList.contains('fixed-custom')
      ) {
        headerElement.classList.add(
          tasksBarExtended ? 'fixed-custom-extended' : 'fixed-custom',
        );
        headerRemnant?.classList.add('calender-fix-header');
        headerTimeColumn?.classList.add('-mt-12px');
        // if (virtualHeaderRemnant) virtualHeaderRemnant.style.display = 'block';
      } else if (
        scrollY < 44 &&
        headerElement &&
        (headerElement.classList.contains('fixed-custom') ||
          headerElement.classList.contains('fixed-custom-extended'))
      ) {
        headerElement.classList.remove('fixed-custom');
        headerElement.classList.remove('fixed-custom-extended');
        headerRemnant?.classList.remove('calender-fix-header');
        headerTimeColumn?.classList.remove('-mt-12px');
        // if (virtualHeaderRemnant) virtualHeaderRemnant.style.display = 'none';
      }
    };
    if (scrollBodyElement) {
      scrollBodyElement.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (scrollBodyElement)
        scrollBodyElement.removeEventListener('scroll', handleScroll);
    };
  }, [windowWidth, expanded, isSidebarOpen, detailBarStatus, tasksBarExtended]);

  const maxScheduleAllDayCount = useMemo(() => {
    let maxCount = 0;
    schedulesPerDay.forEach((schedulesDay) => {
      if (schedulesDay) {
        const filteredAllDays = schedulesDay.filter((_) => _.allDay);
        maxCount = Math.max(maxCount, filteredAllDays.length);
      }
    });
    return maxCount ?? 1;
  }, [schedulesPerDay]);
  // ! scroll to the 06:00 am position at startup
  // useEffect(() => {
  //   const scrollBodyElement = document.querySelector(
  //     '#calendar-scroll-container',
  //   );
  //   scrollBodyElement?.scrollTo(
  //     0,
  //     CELL_HEIGHT * 3 + CELL_HEIGHT * maxScheduleAllDayCount * 0.5,
  //   );
  // }, [dayArr, maxScheduleAllDayCount]);

  const [delMenuInfo, setDelMenuInfo] = useState<null | {
    id: number;
    type: 'task' | 'schedule' | 'scheduleAllDay';
    chunkIndex: number;
    subIndex?: number;
    x: number;
    y: number;
  }>(null);
  useEffect(() => {
    if (delMenuInfo && delMenuInfo.id) {
      const delMenu: HTMLElement | null =
        document.querySelector('.delMenu.visible');
      if (delMenu) {
        delMenu.focus();
      }
    }
  }, [delMenuInfo]);

  const [height, setHeight] = useState(0);
  useEffect(() => {
    let containerHeight = 0;
    if (windowHeight) {
      containerHeight = windowHeight - 115;
    }
    setHeight(containerHeight);
  }, [windowHeight]);

  const extendTasksBar = useCallback((newValue: boolean) => {
    setTasksBarExtended(newValue);
    const headerElement = document.querySelector('#week-header');
    const headerRemnant = document.querySelector('#fixed-header-remnant');
    // const headerRemnantExtendedTasks: HTMLDivElement | null =
    //   document.querySelector('#fixed-header-remnant-extended');
    // headerRemnant?.classList.add(
    //   tasksBarExtended ? '-mt-384px' : '-mt-167px',
    // );
    if (
      headerElement &&
      headerRemnant &&
      headerElement.classList.contains('fixed-custom') &&
      newValue
    ) {
      headerElement.classList.remove('fixed-custom');
      headerElement.classList.add('fixed-custom-extended');
      // headerRemnantExtendedTasks.style.display = 'none';
    } else if (
      headerElement &&
      headerRemnant &&
      headerElement.classList.contains('fixed-custom-extended') &&
      !newValue
    ) {
      headerElement.classList.add('fixed-custom');
      headerElement.classList.remove('fixed-custom-extended');
      // headerRemnantExtendedTasks.style.display = 'block';
    }
  }, []);

  return (
    <div
      onClick={() => {}}
      onWheel={(e) => {
        if (e.deltaY > 0) {
          // onNext();
        } else {
          // onPrev();
        }
      }}
      onBlur={() => {
        onDragEnd();
      }}
      className={`flex-1 flex flex-row border-r h-full overflow-y-auto relative`}
      id={'calendar-scroll-container'}
      style={{
        height,
      }}
    >
      <div
        onMouseUp={() => {
          onDragEnd();
        }}
        id="calendar-time-column"
        className="pt-24px pb-54px px-12px w-16"
      >
        <div
          className={'mt-4px py-2px body2 text-backgroundSecondary truncate'}
        >{`hours label`}</div>
        <div className="py-2px flex justify-center">
          <div className="flex flex-col items-center justify-center h-40px w-30px rounded-full select-none cursor-pointer" />
        </div>
        {Array.apply(null, Array(maxScheduleAllDayCount)).map((_, index) => {
          return (
            <div
              className={`my-2px px-4px`}
              style={{
                height: `${CELL_HEIGHT / 2}px`,
              }}
              key={`virtual-schedule-render-column-${index}`}
            />
          );
        })}
        <div id="fixed-header-remnant" className="relative flex flex-col">
          <div
            id="fixed-header-remnant-extended"
            className="flex-none"
            style={{
              height: `${
                tasksBarExtended ? (height * 7) / 10 : CELL_HEIGHT * 2 + 12
              }px`,
            }}
          />
        </div>
      </div>
      {/* <div
        id="virtual-fixed-header-remnant"
        className="relative border border-secondary"
        style={{
          flex: 0,
          height: `${
            tasksBarExtended ? (height * 7) / 10 : CELL_HEIGHT * 2 + 12
          }px`,
        }}
      /> */}
      <div className={'relative pr-0 pb-54px w-full'}>
        <FixedHeader
          width={width}
          height={height}
          dayArr={dayArr}
          currentDate={currentDate}
          today={today}
          tasksPerDay={tasksPerDay}
          holidayDict={holidayDict}
          holidayDisplay={holidayDisplay}
          isSidebarOpen={isSidebarOpen}
          delMenuInfo={delMenuInfo}
          tasksBarExtended={tasksBarExtended}
          tzOffsetMins={tzOffsetMins}
          onDragEnd={onDragEnd}
          onDayLabelClick={onDayLabelClick}
          onTaskClick={onTaskClick}
          onTaskNew={onTaskNew}
          setDelMenuInfo={setDelMenuInfo}
          onDelete={onDelete}
          setTasksBarExtended={extendTasksBar}
        />
        <div
          className="w-full h-full flex flex-row pb-24px"
          style={{
            width: `${(width + 2 * PADDING + 0.5) * 7}px`,
          }}
        >
          {dayArr.length === 0
            ? null
            : dayArr.map((dayItem, dayIndex) => {
                const currentDayAllSchedules = schedulesPerDay[dayIndex];
                if (!currentDayAllSchedules) return null;
                const currentDaySchedules = currentDayAllSchedules.filter(
                  (_) => !_.allDay,
                );
                const currentAllDaySchedules = currentDayAllSchedules.filter(
                  (_) => _.allDay,
                );
                const hasDraggingObject =
                  dayIndex >= draggingMin && dayIndex <= draggingMax;
                // const dragItem = draggingObject?.dayIndex >= dayIndex && draggingObject?.dayIndex

                return (
                  <div
                    className="flex-1 flex flex-col"
                    key={`calendar-week-view-weekday-column-${dayItem.format(
                      'YYYYMMDD',
                    )}`}
                  >
                    <div className="relative">
                      {Array.apply(null, Array(maxScheduleAllDayCount)).map(
                        (_, index) => {
                          const schedule: ScheduleDayRenderItem | undefined =
                            currentAllDaySchedules[index];
                          return schedule ? (
                            <div
                              onClick={(e) => {
                                onScheduleClick(schedule.id, schedule.userId);
                                onDragEnd();
                                e.stopPropagation();
                                e.preventDefault();
                              }}
                              onContextMenu={(e) => {
                                const menuX = e.clientX;
                                const menuY = e.clientY;
                                const sidebarWidth = isSidebarOpen ? 300 : 92;

                                setDelMenuInfo({
                                  id: schedule.id,
                                  chunkIndex: dayIndex,
                                  subIndex: index,
                                  type: 'scheduleAllDay',
                                  x: menuX - sidebarWidth - 64,
                                  y: menuY,
                                });
                                onDragEnd();
                                e.stopPropagation();
                                e.preventDefault();
                              }}
                              className={`px-4px my-2px rounded-2px border border-1/2 border-backgroundSecondary body2 text-fontPrimary bg-${
                                schedule.bgColor
                                  ? `${schedule.bgColor} flex flex-col items-center`
                                  : 'yellowWeek'
                              } z-50 flex flex-col cursor-pointer shadow-sm`}
                              style={{
                                width: `${width}px`,
                                height: `${CELL_HEIGHT / 2}px`,
                              }}
                              key={`day-${dayIndex}-allday-schedule-item-${schedule.id}`}
                            >
                              <span className="truncate">{schedule.title}</span>
                            </div>
                          ) : (
                            <div
                              className={`my-2px px-4px`}
                              style={{
                                height: `${CELL_HEIGHT / 2}px`,
                              }}
                              key={`day-emptied-${dayIndex}-allday-schedule-render-${index}`}
                            />
                          );
                        },
                      )}
                      <div
                        className={`absolute p-1 rounded-6px border-1/2 border-separator bg-backgroundSecondary text-fontPrimary body2 shadow-md cursor-pointer hover:bg-backgroundPrimary focus:outline-none z-100 ${
                          delMenuInfo?.type === 'scheduleAllDay' &&
                          delMenuInfo?.chunkIndex === dayIndex
                            ? 'visible'
                            : 'invisible'
                        } delMenu`}
                        style={{
                          left: delMenuInfo?.x ?? 0,
                          top: `${
                            (CELL_HEIGHT * ((delMenuInfo?.subIndex ?? 0) + 1)) /
                            60
                          }px`,
                          width: (width * 4) / 5,
                        }}
                        onClick={(e) => {
                          onDelete(delMenuInfo?.id ?? 0, 'schedule');
                          setDelMenuInfo(null);
                          e.stopPropagation();
                          e.preventDefault();
                        }}
                        onBlur={() => {
                          setDelMenuInfo(null);
                        }}
                        tabIndex={-1}
                      >
                        削除
                      </div>
                    </div>
                    <div
                      onMouseOver={(
                        e: React.MouseEvent<HTMLDivElement, MouseEvent>,
                      ) => {
                        e.preventDefault();
                        if (e.target instanceof Element && draggingObject) {
                          const relativeY =
                            e.clientY -
                            e.currentTarget?.getBoundingClientRect().top;
                          const itemHeight = 48;
                          const mins = Math.round(
                            (relativeY * 60) / itemHeight,
                          );

                          onMouseMoveHandler(dayIndex, mins);
                          // setDraggingDayIndex(dayIndex);
                          // setDraggingY(mins);
                        }
                      }}
                      onMouseUp={(e) => {
                        if (e.target instanceof Element && draggingObject) {
                          const relativeY =
                            e.clientY -
                            e.currentTarget?.getBoundingClientRect().top;
                          const itemHeight = 48;
                          const mins =
                            15 *
                            Math.round((relativeY * 60) / (itemHeight * 15));

                          const currentNode = e.target;
                          const parentNode = currentNode.parentElement;
                          if (
                            !currentNode.classList.contains('schedule-item') &&
                            !parentNode?.classList.contains('schedule-item')
                          ) {
                            onMouseUpHandler(
                              dayItem,
                              dayIndex,
                              mins,
                              draggingObject ?? {
                                id: 0,
                                title: '',
                                dayIndex: 0,
                                y: 0,
                                yLength: 0,
                                userId: 0,
                                timeLabel: '',
                              },
                            );
                          }
                          e.preventDefault();
                          e.stopPropagation();
                        }
                      }}
                      className="relative flex flex-col"
                    >
                      {Array.apply(null, Array(24)).map((_, index) => {
                        return (
                          <div
                            onMouseDown={(e) => {
                              if (
                                e.target instanceof Element &&
                                !draggingObject
                              ) {
                                const relativeY =
                                  e.clientY -
                                  e.currentTarget?.getBoundingClientRect().top;
                                const itemHeight = 48;
                                const mins =
                                  60 * index +
                                  15 *
                                    Math.round(
                                      (relativeY * 60) / (itemHeight * 15),
                                    );

                                onMouseDownCalendar(dayItem, dayIndex, mins);
                              }
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                            }}
                            className={`relative h-48px z-50 select-none ${
                              index === 6 ? 'scrollStartPos' : ''
                            }`}
                            key={`${dayIndex}-${index}th-hour-render-for-a-day-${dayItem.format(
                              'YYYYMMDD',
                            )}`}
                          >
                            <div className="w-full h-full border-l border-1/4 border-separator absolute z-0" />
                            {dayIndex === 0 ? (
                              <div className="absolute -left-55px -bottom-12px text-fontSecondary body2-en">
                                {index === 23 ? '' : `${index + 1}:00`}
                                {/* {index === 23
                                  ? ''
                                  : timeMode24
                                  ? index + 1
                                  : `${index > 11 ? index - 11 : index + 1} ${
                                      index > 10 ? 'PM' : 'AM'
                                    }`} */}
                              </div>
                            ) : null}
                          </div>
                        );
                      })}
                      {draggingObject != undefined && hasDraggingObject && (
                        <div
                          onMouseMove={(e) => {
                            if (e.target instanceof Element && draggingObject) {
                              const relativeY =
                                e.clientY -
                                e.currentTarget?.getBoundingClientRect().top;
                              const itemHeight = 48;
                              const minsDelta = Math.round(
                                (relativeY * 60) / itemHeight,
                              );

                              onMouseMoveOnSelf(minsDelta);
                            }
                          }}
                          className="absolute px-4px rounded-6px border border-1/2 border-backgroundSecondary body2 text-backgroundSecondary bg-yellowWeek flex flex-col flex flex-col z-50"
                          style={{
                            left: `0px`,
                            width: `${width + PADDING * 2}px`,
                            top: `${(CELL_HEIGHT * draggingObject.y) / 60}px`,
                            height: `${
                              (CELL_HEIGHT * draggingObject.yLength) / 60
                            }px`,
                          }}
                        >
                          <span className="">{draggingObject.title}</span>
                          <span className="truncate">
                            {draggingObject.timeLabel}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0">
                        {currentDaySchedules &&
                          currentDaySchedules.map((schedule, index) => {
                            const scheduleWidth = schedule.xLength
                              ? Math.min(schedule.xLength, 100 - schedule.x)
                              : 100 - schedule.x;
                            const scheduleHeight = Math.max(
                              schedule.yLength,
                              60,
                            );
                            const scheduleTop =
                              schedule.y + scheduleHeight > 24 * 60
                                ? 24 * 60 - scheduleHeight
                                : schedule.y;

                            return (
                              <div
                                onMouseDown={(e) => {
                                  if (e.button === 0) {
                                    onMouseDownScheduleBody(
                                      {
                                        id: schedule.id,
                                        title: schedule.title,
                                        y: schedule.y,
                                        yLength: schedule.yLength,
                                        bgColor: schedule.bgColor,
                                        userId: schedule.userId,
                                        timeLabel: schedule.timeLabel,
                                        allDay: schedule.allDay,
                                        startDate: schedule.startDate,
                                        endDate: schedule.endDate,
                                      },
                                      dayIndex,
                                    );
                                  }
                                  e.stopPropagation();
                                }}
                                onClick={(e) => {
                                  onScheduleClick(schedule.id, schedule.userId);
                                  onDragEnd();
                                  e.stopPropagation();
                                  e.preventDefault();
                                }}
                                onContextMenu={(e) => {
                                  const menuY =
                                    e.currentTarget?.getBoundingClientRect()
                                      .bottom;
                                  const sidebarWidth = isSidebarOpen ? 300 : 92;
                                  const subIndex = Math.ceil(schedule.y / 60);
                                  setDelMenuInfo({
                                    id: schedule.id,
                                    chunkIndex: dayIndex,
                                    subIndex,
                                    type: 'schedule',
                                    x: dayIndex * width - sidebarWidth - 64,
                                    y: schedule.y,
                                  });
                                  onDragEnd();
                                  e.stopPropagation();
                                  e.preventDefault();
                                }}
                                className={`absolute px-4px rounded-6px border border-1/2 border-backgroundSecondary body2 text-fontPrimary bg-${
                                  schedule.bgColor
                                    ? `${schedule.bgColor} flex flex-col items-center`
                                    : 'yellowWeek'
                                } z-50 flex flex-col cursor-pointer select-none schedule-item shadow-sm`}
                                style={{
                                  left: `${(width * schedule.x) / 100}px`,
                                  width: `${(width * scheduleWidth) / 100}px`,
                                  top: `${(CELL_HEIGHT * scheduleTop) / 60}px`,
                                  height: `${
                                    (CELL_HEIGHT * scheduleHeight) / 60
                                  }px`,
                                }}
                                key={`day-${dayIndex}-schedule-item-${schedule.id}-${index}`}
                              >
                                <span className="truncate">
                                  {schedule.title}
                                </span>
                                <span className="truncate">
                                  {schedule.timeLabel}
                                </span>
                                <span
                                  onMouseDown={(e) => {
                                    onMouseDownScheduleFooter(
                                      {
                                        id: schedule.id,
                                        title: schedule.title,
                                        y: schedule.y,
                                        yLength: schedule.yLength,
                                        bgColor: schedule?.bgColor,
                                        userId: schedule.userId,
                                        startDate: schedule.startDate,
                                        endDate: schedule.endDate,
                                      },
                                      dayIndex,
                                    );
                                    e.stopPropagation();
                                  }}
                                  className="absolute -mx-1 bottom-0 h-1 w-full cursor-ns-resize"
                                />
                              </div>
                            );
                          })}
                        <div
                          className={`absolute p-1 rounded-6px border-1/2 border-separator bg-backgroundSecondary text-fontPrimary body2 shadow-md cursor-pointer hover:bg-backgroundPrimary focus:outline-none z-50 ${
                            delMenuInfo?.type === 'schedule' &&
                            delMenuInfo?.chunkIndex === dayIndex
                              ? 'visible'
                              : 'invisible'
                          } delMenu`}
                          style={{
                            left: 0,
                            top:
                              (CELL_HEIGHT * (delMenuInfo?.y ?? 0)) / 60 +
                              CELL_HEIGHT / 3,
                            width: (width * 4) / 5,
                          }}
                          onClick={(e) => {
                            onDelete(delMenuInfo?.id ?? 0, 'schedule');
                            setDelMenuInfo(null);
                            e.stopPropagation();
                            e.preventDefault();
                          }}
                          onBlur={() => {
                            setDelMenuInfo(null);
                          }}
                          tabIndex={-1}
                        >
                          削除
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
      {detailBarStatus ? (
        <div
          className={
            'fixed bottom-3 right-2 select-none cursor-pointerz z-9999'
          }
        >
          <div
            onClick={onShowStatusBar}
            className={`ml-1 mb-2 w-32px h-32px ${'show'} rounded-full bg-separator flex flex-col justify-center items-center cursor-pointer hover:bg-primarySelected`}
          >
            <ArrowLeftIcon width={8} height={8} />
          </div>
        </div>
      ) : (
        <div
          className={`fixed bottom-24px right-${
            expanded ? '80px' : '24px'
          } select-none cursor-pointer z-90`}
        >
          <div
            className={
              'flex items-center justify-center h-44px w-44px bg-backgroundPrimary rounded-8px'
            }
            onClick={() => {
              onExpand();
            }}
          >
            {expanded ? (
              <CollapseIcon width={20} height={20} />
            ) : (
              <ExpandIcon width={20} height={20} />
            )}
          </div>
        </div>
      )}
      <div className="hidden">
        <div className="right-80px" />
      </div>
    </div>
  );
};

export default PanelWeek;

const FixedHeader = ({
  width,
  height,
  dayArr,
  currentDate,
  today,
  holidayDict,
  holidayDisplay,
  tasksPerDay,
  isSidebarOpen,
  delMenuInfo,
  tasksBarExtended,
  tzOffsetMins,
  onDragEnd,
  onDayLabelClick,
  onTaskClick,
  onTaskNew,
  setDelMenuInfo,
  onDelete,
  setTasksBarExtended,
}: {
  width: number;
  height: number;
  dayArr: Dayjs[];
  currentDate: Dayjs;
  today: Dayjs;
  tasksPerDay: Array<TaskDayRenderItem[]>;
  holidayDict: {
    [key: string]: string;
  };
  holidayDisplay: boolean;
  isSidebarOpen: boolean;
  delMenuInfo: null | {
    id: number;
    type: 'task' | 'schedule' | 'scheduleAllDay';
    chunkIndex: number;
    subIndex?: number;
    x: number;
    y: number;
  };
  tasksBarExtended: boolean;
  tzOffsetMins: number;
  onDragEnd: () => void;
  onDayLabelClick: (date: Dayjs) => void;
  onTaskClick: (id: number, userId: number) => void;
  onTaskNew: (newDate: Dayjs) => void;
  setDelMenuInfo: (
    props: null | {
      id: number;
      type: 'task' | 'schedule' | 'scheduleAllDay';
      chunkIndex: number;
      subIndex?: number;
      x: number;
      y: number;
    },
  ) => void;
  onDelete: (id: number, type: 'task' | 'schedule') => void;
  setTasksBarExtended: (newValue: boolean) => void;
}) => {
  const tzHourLabel = useMemo(() => {
    const tzHour = Math.round(tzOffsetMins / 60);
    return `GMT+${tzHour > -10 && tzHour < 10 ? `0${tzHour}` : tzHour}`;
  }, [tzOffsetMins]);
  return (
    <div
      id="week-header"
      onMouseUp={() => {
        onDragEnd();
      }}
      className="grid grid-cols-7 justify-items-center py-2px bg-backgroundSecondary body2 border-b border-backgroundSecondary z-90 relative"
      style={{
        width: `${(width + 2 * PADDING + 0.5) * 7}px`,
      }}
    >
      <div className="absolute -left-64px w-62px h-full bg-backgroundSecondary flex flex-col justify-end">
        <span className="ml-2 mb-3 text-fontSecondary body2-en">
          {tzHourLabel}
        </span>
      </div>
      {dayArr.length === 0
        ? null
        : dayArr.map((dayItem, dayIndex) => {
            const currentDayTasks = tasksPerDay[dayIndex] ?? [];
            return (
              <div
                className={`flex-1 flex flex-col items-center justify-center select-none border-l border-1/4 border-separator`}
                key={`date-header-item-${dayItem.format('YYYYMMDD')}`}
                style={{ width: `${width + 2 * PADDING}px` }}
              >
                <div
                  key={`weekday-label-${dayItem.day()}`}
                  className={`${
                    dayItem.day() === 0
                      ? 'text-secondary'
                      : dayItem.day() === 6
                      ? 'text-primary'
                      : 'opacity-40'
                  } flex items-center justify-center select-none`}
                >
                  {WEEKDAYS_JP[dayItem.day()]}
                </div>
                <div
                  className="py-2px flex justify-center z-20"
                  key={`calendar-date-label-${dayItem.format('YYYYMMDD')}`}
                  onMouseUp={() => {
                    onDragEnd();
                  }}
                  onClick={(e) => {
                    // setNewItemDate(dayItem);
                  }}
                >
                  <div
                    className={`flex flex-col items-center justify-center h-40px w-40px rounded-full select-none cursor-pointer`}
                    onClick={(e) => {
                      onDayLabelClick(dayItem);
                      e.stopPropagation();
                    }}
                  >
                    <div
                      className={`flex-none w-6 h-6 rounded-full body1 opacity-90 ${
                        dayItem.format('YYYYMMDD') ===
                        currentDate.format('YYYYMMDD')
                          ? 'bg-primary text-backgroundSecondary'
                          : dayItem.format('YYYYMMDD') ===
                            today.format('YYYYMMDD')
                          ? 'bg-primarySelected text-fontPrimary'
                          : dayItem.day() === 0
                          ? 'hover:bg-primaryHovered text-secondary'
                          : dayItem.day() === 6
                          ? 'hover:bg-primaryHovered text-primary'
                          : 'hover:bg-primaryHovered'
                      } flex flex-row items-center justify-center`}
                    >
                      <span>{dayItem.format('D')}</span>
                    </div>
                    {holidayDict[dayItem.format('M-D')] != undefined ? (
                      <div
                        className={`line-clamp-1 caption3 text-secondary truncate ${
                          holidayDisplay ? '' : 'invisible'
                        }`}
                      >
                        {holidayDict[dayItem.format('M-D')]}
                      </div>
                    ) : (
                      <div className="h-24px" />
                    )}
                  </div>
                </div>
                <div
                  className={`relative flex-none ${
                    dayIndex === 6 ? '' : 'border-r-0'
                  }`}
                  onClick={() => {
                    onTaskNew(dayItem);
                  }}
                  style={
                    tasksBarExtended
                      ? {
                          height: `${(height * 7) / 10}px`,
                        }
                      : {}
                  }
                >
                  {currentDayTasks.map((task, taskIndex) => (
                    <div
                      onClick={(e) => {
                        onTaskClick(task.id, task.userId);
                        e.stopPropagation();
                        e.preventDefault();
                      }}
                      onContextMenu={(e) => {
                        const menuY =
                          e.currentTarget?.getBoundingClientRect().bottom;
                        const menuX = e.clientX;
                        const sidebarWidth = isSidebarOpen ? 300 : 92;

                        setDelMenuInfo({
                          id: task.id,
                          chunkIndex: dayIndex,
                          subIndex: taskIndex,
                          type: 'task',
                          x:
                            menuX -
                            sidebarWidth -
                            64 -
                            (width + 2 * PADDING) * dayIndex,
                          y: menuY,
                        });
                        onDragEnd();
                        e.stopPropagation();
                        e.preventDefault();
                      }}
                      className={`px-4px my-2px rounded-2px border border-1/2 border-backgroundSecondary body2 text-fontPrimary bg-${
                        task.bgColor
                          ? `${task.bgColor} flex flex-col items-center`
                          : 'blueOp3'
                      } z-50 flex flex-col cursor-pointer`}
                      style={{
                        width: `${(width * 356) / 355}px`,
                        height: `${CELL_HEIGHT / 2}px`,
                      }}
                      key={`day-${dayIndex}-task-item-${task.id}`}
                    >
                      <span className="truncate">{task.title}</span>
                    </div>
                  ))}
                  {tasksPerDay.length === 0
                    ? null
                    : Array.apply(null, Array(4 - currentDayTasks.length)).map(
                        (_, index) => {
                          return (
                            <div
                              className={`px-4px my-2px rounded-2px border border-1/2 border-backgroundSecondary body2 text-backgroundSecondary flex flex-col items-center flex flex-col`}
                              style={{
                                width: `${(width * 356) / 355}px`,
                                height: `${CELL_HEIGHT / 2}px`,
                              }}
                              key={`empty-task-${dayIndex}-task-empty-virtual-${index}`}
                            />
                          );
                        },
                      )}
                  <div
                    className={`absolute p-1 rounded-6px border border-separator bg-backgroundSecondary text-fontPrimary body2 shadow-md cursor-pointer hover:bg-backgroundPrimary focus:outline-none z-100 ${
                      delMenuInfo?.type === 'task' &&
                      delMenuInfo?.chunkIndex === dayIndex
                        ? 'visible'
                        : 'invisible'
                    } delMenu`}
                    style={{
                      left: delMenuInfo?.x ?? 0,
                      top: 24 * ((delMenuInfo?.subIndex ?? 0) + 1),
                      width: (width * 4) / 5,
                    }}
                    onClick={(e) => {
                      onDelete(delMenuInfo?.id ?? 0, 'task');
                      setDelMenuInfo(null);
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                    onBlur={() => {
                      setDelMenuInfo(null);
                    }}
                    tabIndex={-1}
                  >
                    削除
                  </div>
                  {dayIndex === 6 ? (
                    <>
                      <div
                        className={
                          'absolute bottom-1 right-1 flex items-center justify-center h-24px w-24px bg-backgroundPrimary rounded-8px cursor-pointer'
                        }
                        onClick={(e) => {
                          setTasksBarExtended(!tasksBarExtended);
                          e.stopPropagation();
                          e.preventDefault();
                        }}
                      >
                        {tasksBarExtended ? (
                          <CollapseIcon width={14} height={14} />
                        ) : (
                          <ExpandIcon width={14} height={14} />
                        )}
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            );
          })}
    </div>
  );
};
