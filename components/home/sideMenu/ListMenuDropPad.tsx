import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Droppable } from 'react-beautiful-dnd';

import {
  dragItemEndDateSelector,
  tasksCountDictSelector,
} from '@store/selectors/tasks';

import { ICON_VALUES } from '@util/constants';
import { MenuItemDraggable } from './MenuItem';
import ShieldIcon from '@svg/lock-shield.svg';
import { listsSortDictSelector } from '@store/selectors/sort';
import { setDropPadsDict } from '@store/modules/sort';
import ListRow from '@component/list/ListRow';
import { setCurrentListID } from '@store/modules/list';

export const ListMenuDropPad = ({
  droppableId,
  listArray,
  currentListId,
  hideTasksNumber,
}: {
  droppableId: string;
  listArray: any[];
  currentListId: number;
  hideTasksNumber?: boolean;
}) => {
  const listsSortDict = useSelector(listsSortDictSelector);
  const dispatch = useDispatch();
  const countDict = useSelector(tasksCountDictSelector);

  const dragItemEndDate = useSelector(dragItemEndDateSelector);

  useEffect(() => {
    if (droppableId && droppableId != '' && listArray.length > 0) {
      const idsList = listArray.map((_) => _.id);
      dispatch(
        setDropPadsDict({
          droppadID: droppableId,
          data: idsList,
        }),
      );
    }
  }, [listArray, droppableId, dispatch]);
  const listSorted = useMemo(() => {
    const newListsArray = [...listArray];
    newListsArray.sort((a, b) => {
      return (
        (listsSortDict[a.id] ?? a.pivot.sort) -
        (listsSortDict[b.id] ?? b.pivot.sort)
      );
    });
    return newListsArray;
  }, [listsSortDict, listArray]);

  return (
    <div className="relative">
      <div className="z-20 relative">
        <Droppable
          droppableId={droppableId}
          isDropDisabled={dragItemEndDate != undefined}
        >
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {listSorted.map((item: any, index: number) => {
                const iconData = ICON_VALUES.filter(
                  (_: any) => parseInt(_.value) === item.icon,
                );
                const Icon =
                  iconData.length > 0 ? iconData[0].icon : ICON_VALUES[0].icon;

                return (
                  <MenuItemDraggable
                    id={item.id}
                    index={index}
                    text={item.name}
                    link={`/tasks/list/${item.id}`}
                    icon={Icon}
                    subicon={item.status === 0 ? ShieldIcon : null}
                    isActive={item.id === currentListId}
                    count={countDict[item.id] ? countDict[item.id] : ''}
                    // count={item.tasks_count ? item.tasks_count : ''}
                    key={`${item.id}-list-sidemenu`}
                    hideTasksNumber={hideTasksNumber}
                  />
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
      <div className="absolute w-full top-0 bg-backgroundSecondary z-0">
        {
          // ! This is for the drag effect ( turn the left area gray when draging the item )
          listArray.map((_, index) => (
            <div
              className="h-44px rounded-8px bg-separator"
              key={`shadow-for-the-listmenu-items-${droppableId}-${index}`}
            />
          ))
        }
      </div>
    </div>
  );
};

export const ListSideMenuDropPad = ({
  droppableId,
  listArray,
  currentListId,
  hideTasksNumber,
}: {
  droppableId: string;
  listArray: any[];
  currentListId: number;
  hideTasksNumber?: boolean;
}) => {
  const listsSortDict = useSelector(listsSortDictSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    if (droppableId && droppableId != '' && listArray.length > 0) {
      const idsList = listArray.map((_) => _.id);
      dispatch(
        setDropPadsDict({
          droppadID: droppableId,
          data: idsList,
        }),
      );
    }
  }, [listArray, droppableId, dispatch]);
  const listSorted = useMemo(() => {
    const newListsArray = [...listArray];
    newListsArray.sort((a, b) => {
      return (
        (listsSortDict[a.id] ?? a.pivot.sort) -
        (listsSortDict[b.id] ?? b.pivot.sort)
      );
    });
    return newListsArray;
  }, [listsSortDict, listArray]);

  return (
    <div className="relative">
      <div className="z-20 relative">
        {listSorted.map((item: any, index: number) => {
          const iconData = ICON_VALUES.filter(
            (_: any) => parseInt(_.value) === item.icon,
          );
          const Icon =
            iconData.length > 0 ? iconData[0].icon : ICON_VALUES[0].icon;

          return (
            <ListRow
              data={item}
              Icon={Icon}
              onClick={() => {
                dispatch(setCurrentListID(item.id));
              }}
              isActive={item.id === currentListId}
              showPrivate={item.status == 0}
              key={`list-droppad-${droppableId}-list-${item.id}`}
            />
          );
        })}
        {/* <Droppable droppableId={droppableId}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="overflow-y-hidden"
            >
              {listSorted.map((item: any, index: number) => {
                const iconData = ICON_VALUES.filter(
                  (_: any) => parseInt(_.value) === item.icon,
                );
                const Icon =
                  iconData.length > 0 ? iconData[0].icon : ICON_VALUES[0].icon;

                return (
                  <ListRowDraggable
                    id={item.id}
                    index={index}
                    data={item}
                    Icon={Icon}
                    onClick={() => {
                      dispatch(setCurrentListID(item.id));
                    }}
                    isActive={item.id === currentListId}
                    showPrivate={item.status == 0}
                    key={`list-droppad-${droppableId}-list-${item.id}`}
                  />
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable> */}
      </div>
      <div className="absolute w-full top-0 bg-backgroundSecondary z-0">
        {
          // ! This is for the drag effect ( turn the left area gray when draging the item )
          listArray.map((_, index) => (
            <div
              className="h-44px rounded-8px bg-separator"
              key={`shadow-for-the-listmenu-items-${droppableId}-${index}`}
            />
          ))
        }
      </div>
    </div>
  );
};
