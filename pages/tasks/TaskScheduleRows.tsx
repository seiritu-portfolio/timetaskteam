import React from 'react';
import { useDispatch } from 'react-redux';
import { Draggable } from 'react-beautiful-dnd';
// * hooks
import { useCompleteTask } from '@service/taskMutation';
import useLeftDaysTask from '@service/hooks/useLeftDaysTask';
import { setUserIDSelected } from '@store/modules/calendar';
import dayjs from 'dayjs';
// * assets
import FlameIcon from '@svg/flame.svg';
import UncheckedIcon from '@svg/square.svg';
import CheckedIcon from '@svg/checkmark-square.svg';
import SelectedIcon from '@svg/largecircle-fill-circle.svg';
import UnselectedIcon from '@svg/circle.svg';
import TextJustifySmallIcon from '@svg/text-justifyleft-small.svg';
import AlarmSmallIcon from '@svg/ball-small.svg';
import ClipSmallIcon from '@svg/clip-small.svg';
import CirclePathIcon from '@svg/arrow-triangle-2-circlepath.svg';
import IsDraggingIcon from '@svg/equal-small.svg';
// * constants and utils
import { COLOR_VALUES } from '@util/constants';
import { convertDayjsToTimeFormat, getHourMinFormat } from '@util/calendar';

const TaskCheckRow = (props: any) => {
  const dispatch = useDispatch();
  const completeMutation = useCompleteTask();

  const [leftDaysLabel, urgencyColor] = useLeftDaysTask(props);
  return (
    <div
      className={`relative pl-32px pr-12px py-12px rounded-8px hover:bg-primaryHovered cursor-pointer ${
        props.selected ? 'bg-primarySelected text-primary' : ''
      }`}
      onClick={() => {
        if (props?.pivot?.user_id) {
          dispatch(setUserIDSelected(props?.pivot?.user_id));
        }
        if (props.onClick) props.onClick();
        else if (props.onTaskClick) props.onTaskClick(props.id);
      }}
    >
      {props.isCodisplayMode ? (
        <div
          className={`absolute left-12px top-0 w-4px h-full bg-${
            (COLOR_VALUES[props.color ?? 4] ?? COLOR_VALUES[0]).label ??
            'primary'
          }`}
        />
      ) : null}
      <div className="flex flex-row">
        <div className="flex-1 mr-3 flex truncate">
          {(() => {
            const completed = props.pivot?.completed ?? 0;
            const Icon = completed == 1 ? CheckedIcon : UncheckedIcon;

            return (
              <Icon
                width={20}
                height={20}
                className={`flex-none cursor-pointer z-50 text-${
                  props.isCodisplayMode
                    ? `${
                        (COLOR_VALUES[props.color ?? 4] ?? COLOR_VALUES[0])
                          .label ?? 'primary'
                      }`
                    : 'fontPrimary'
                }`}
                onClick={(e: any) => {
                  e.stopPropagation();
                  if (completeMutation.isLoading) {
                  } else {
                    completeMutation.mutate({
                      id: props.id,
                      completed: 1 - completed,
                    });
                  }
                }}
              />
            );
          })()}
          <div className="ml-8px flex flex-col">
            <span className="body1 text-fontPrimary">{props.title}</span>
            <div className="body2 text-fontSecondary flex items-center">
              <FlameIcon
                width={14}
                height={14}
                className={`text-${urgencyColor}`}
              />
              <span className={`${props?.showListName ? '' : 'hidden'} mx-4px`}>
                {props?.list?.name ?? ''}
              </span>
              <div className={`${props.showListName ? '' : ''} flex`}>
                {props?.memo ? (
                  <TextJustifySmallIcon width={20} height={20} />
                ) : null}
                {props.reminder ? (
                  <AlarmSmallIcon width={20} height={20} />
                ) : null}
                {props.repetition ? (
                  <CirclePathIcon width={20} height={20} />
                ) : null}
                {props.attachments != null && props.attachments.length > 0 ? (
                  <ClipSmallIcon width={20} height={20} />
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <div className="flex-none text-right flex flex-col">
          <div className="body2-en text-fontPrimary">
            {getHourMinFormat(props.required_time)}
          </div>
          <div className="body2">{leftDaysLabel}</div>
        </div>
      </div>
    </div>
  );
};

export default TaskCheckRow;

export const TaskRowOrdered = (props: any) => {
  const [leftDaysLabel, urgencyColor] = useLeftDaysTask(props);

  return (
    <Draggable draggableId={props.id.toString()} index={props.index}>
      {(
        provided,
        snapshot, // snapshot.isDragging
      ) => (
        <div onMouseDown={props.onTaskDragStart} className="relative">
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            className={`pl-32px pr-12px py-12px h-66px rounded-8px z-20
          ${
            snapshot.isDragging
              ? 'shadow-menu border-1/2 border-separator z-90 absolute'
              : 'hover:bg-primaryHoveredPure'
          }
           cursor-pointer ${
             props.selected && !snapshot.isDragging
               ? 'bg-primaryHoveredPure text-primary'
               : 'bg-backgroundSecondary'
           } relative`}
            onClick={props.onTaskClick}
            onContextMenu={props.onContextMenu}
          >
            <div
              className={`absolute p-2 rounded-6px border-1/2 border-separator bg-backgroundSecondary text-fontPrimary body2 shadow-md cursor-pointer
                      hover:bg-backgroundPrimary 
                      focus:outline-none z-50 ${
                        props.delMenuInfo?.id === props.id
                          ? 'visible'
                          : 'invisible'
                      } delMenu`}
              style={{
                left: props.delMenuInfo?.x ?? 0,
                bottom: 0,
                // bottom: props.delMenuInfo?.y ?? 0,
                width: 120,
              }}
              onClick={props.onDelete}
              onBlur={props.onDeleteBlur}
              tabIndex={-1}
            >
              削除
            </div>
            <div className="flex flex-row items-center justify-between">
              {snapshot.isDragging && (
                <IsDraggingIcon
                  width={20}
                  height={20}
                  className="absolute left-0 ml-8px text-fontPrimary"
                />
              )}
              <div className="flex truncate">
                {(() => {
                  const completed = props.pivot?.completed ?? 0;
                  const Icon = completed == 1 ? CheckedIcon : UncheckedIcon;

                  return (
                    <Icon
                      width={20}
                      height={20}
                      className={`flex-none text-fontPrimary cursor-pointer`}
                      onClick={props.onComplete}
                    />
                  );
                })()}
                <div className="flex-1 ml-8px mr-8px flex flex-col">
                  <span className="body1 text-fontPrimary">{props.title}</span>
                  <div className="body2 text-fontSecondary flex items-center">
                    <FlameIcon
                      width={14}
                      height={14}
                      className={`text-${urgencyColor}`}
                    />
                    <span
                      className={`${
                        props?.showListName ? '' : 'hidden'
                      } mx-4px`}
                    >
                      {props?.list?.name ?? ''}
                    </span>
                    <div className={`${props.showListName ? '' : ''} flex`}>
                      {props?.memo ? (
                        <TextJustifySmallIcon width={20} height={20} />
                      ) : null}
                      {props.reminder ? (
                        <AlarmSmallIcon width={20} height={20} />
                      ) : null}
                      {props.repetition ? (
                        <CirclePathIcon width={20} height={20} />
                      ) : null}
                      {props.attachments != null &&
                      props.attachments.length > 0 ? (
                        <ClipSmallIcon width={20} height={20} />
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
              <div className="ml-3 flex-none text-right flex flex-col">
                <div className="body2-en text-fontPrimary">
                  {getHourMinFormat(props.required_time)}
                </div>
                <div className="body2">{leftDaysLabel}</div>
              </div>
            </div>
          </div>
          <div
            className={`h-66px rounded-8px bg-separator absolute left-0 top-0 right-0 bottom-0`}
          />
        </div>
      )}
    </Draggable>
  );
};

export const ScheduleRow = (props: any) => {
  const startDate = dayjs(props.start_date).add(
    props.tzOffsetMins - props.tzOffsetBrowser,
    'minute',
  );
  const endDate = dayjs(props.end_date).add(
    props.tzOffsetMins - props.tzOffsetBrowser,
    'minute',
  );

  // const endDate = useTzAddedTimeFormat(new Date(props.end_date));
  const dispatch = useDispatch();
  return (
    <div
      className="relative pl-32px pr-12px py-12px rounded-8px hover:bg-primaryHovered cursor-pointer"
      onClick={() => {
        if (props?.pivot?.user_id) {
          dispatch(setUserIDSelected(props?.pivot?.user_id));
        }
        if (props.onClick) props.onClick();
        else if (props.onScheduleClick) props.onScheduleClick(props.id);
      }}
    >
      {props.isCodisplayMode ? (
        <div
          className={`absolute left-12px top-0 w-4px h-full bg-${
            COLOR_VALUES[props.color ?? 4].label ?? 'primary'
          }`}
        />
      ) : null}
      <div className="flex-row--between">
        <div className="flex flex-1">
          <div className="flex-1 flex">
            <div className="w-20px h-20px flex-xy-center">
              <span
                className={`w-14px h-14px rounded-full bg-${
                  COLOR_VALUES[props.color ?? 7].label
                }`}
              />
            </div>
            <div className="ml-8px flex flex-col">
              <div className="body1 text-fontPrimary">{props.title}</div>
              <div className="body2 text-fontSecondary flex items-center">
                <span className={`${props.showListName ? '' : 'hidden'}`}>
                  {props.list?.name ?? ''}
                </span>
                <div className={`${props.showListName ? 'ml-4px' : ''} flex`}>
                  {props.memo ? (
                    <TextJustifySmallIcon width={20} height={20} />
                  ) : null}
                  {props.reminder ? (
                    <AlarmSmallIcon width={20} height={20} />
                  ) : null}
                  {props.repetition ? (
                    <CirclePathIcon width={20} height={20} />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          <div className="flex-none body2-en text-right flex flex-col">
            {props.all_day === 1 ? null : (
              <React.Fragment>
                <div className="text-primary">
                  {convertDayjsToTimeFormat(startDate, props.timeMode24)}
                </div>
                <div className="text-fontSecondary">
                  {convertDayjsToTimeFormat(
                    endDate.hour() == 23 &&
                      endDate.minute() == 59 &&
                      endDate.second() == 59
                      ? endDate.add(1, 'second')
                      : endDate,
                    props.timeMode24,
                  )}
                </div>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const TaskSelectableRow = (props: any) => {
  const [leftDaysLabel, urgencyColor] = useLeftDaysTask(props);

  return (
    <div
      className={`pl-32px pr-12px py-12px rounded-8px ${
        props.isSelected ? 'bg-primarySelected' : ''
      } cursor-pointer`}
      onClick={() => {
        props.setIsSelected(!props.isSelected);
      }}
    >
      <div className="flex flex-row">
        <div className="flex flex-1 mr-3 truncate">
          {(() => {
            return props.isSelected ? (
              <SelectedIcon
                width={20}
                height={20}
                className={`flex-none text-primary`}
              />
            ) : (
              <UnselectedIcon
                width={20}
                height={20}
                className={`flex-none text-primary`}
              />
            );
          })()}
          <div className="flex-1 ml-8px flex flex-col">
            <span className="body1 text-fontPrimary">{props.title}</span>
            <span className="body2 text-fontSecondary flex items-center">
              <FlameIcon
                width={14}
                height={14}
                className={`text-${urgencyColor}`}
              />
              <span className={`${props?.showListName ? '' : 'hidden'} mr-4px`}>
                {props?.list?.name ?? ''}
              </span>
              <div className={`${props.showListName ? '' : ''} flex`}>
                {props?.memo ? (
                  <TextJustifySmallIcon width={20} height={20} />
                ) : null}
                {props.reminder ? (
                  <AlarmSmallIcon width={20} height={20} />
                ) : null}
                {props.repetition ? (
                  <CirclePathIcon width={20} height={20} />
                ) : null}
                {props.attachments != null && props.attachments.length > 0 ? (
                  <ClipSmallIcon width={20} height={20} />
                ) : null}
              </div>
            </span>
          </div>
        </div>
        <div className="flex-none text-right flex flex-col">
          <div className="body2-en text-fontPrimary">
            {getHourMinFormat(parseInt(props.required_time))}
          </div>
          <div className="body2">{leftDaysLabel}</div>
        </div>
      </div>
    </div>
  );
};
