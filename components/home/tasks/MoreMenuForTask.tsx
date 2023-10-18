import { Fragment, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, Transition } from '@headlessui/react';

import { useTaskAddMutation, useTaskDelete } from '@service/taskMutation';
import { useScheduleAdd } from '@service/scheduleMutation';
import {
  currentTaskIDSelector,
  currentTaskSelector,
} from '@store/selectors/tasks';
import { setTaskID } from '@store/modules/tasks';
import DefaultMenuItem from '../dropdownMenus/MenuItem';
import EllipsisIcon from '@svg/ellipsis.svg';
import { MORE_MENU_ITEMS_FOR_TASK } from '@util/menuList';
import { scheduleListsSelector } from '@store/selectors/list';
import { scheduleInboxIDSelector } from '@store/selectors/user';
import { setTaskModalStatus } from '@store/modules/home';

export const MoreMenuForTask = ({ upward }: { upward?: boolean }) => {
  const currentTaskID = useSelector(currentTaskIDSelector);
  const currentTask = useSelector(currentTaskSelector);
  const dispatch = useDispatch();

  const { mutate: taskDelete, isLoading: isTaskDeleting } = useTaskDelete(
    currentTaskID ?? -1,
    () => {
      setTimeout(() => {
        dispatch(setTaskID(-1));
      }, 320);
    },
  );
  const { mutate: taskAdd, isLoading: isTaskAdding } = useTaskAddMutation(
    (_: any) => {
      // ! maybe able to set the current task id to the copied one.
    },
  );
  const { mutateAsync: scheduleAddAsync, isLoading: isScheduleAdding } =
    useScheduleAdd((_) => {
      // ! should close the modal, or close the edit screen, and set the current task id to -1
    });

  // * get schedule inbox list color
  const [color, setColor] = useState(0);
  const scheduleInboxID = useSelector(scheduleInboxIDSelector);
  const scheduleLists = useSelector(scheduleListsSelector);
  useEffect(() => {
    const filteredForInbox: any[] = scheduleLists.filter(
      (_) => _.id === scheduleInboxID,
    );
    if (filteredForInbox.length === 0) {
    } else if (filteredForInbox[0].color) {
      setColor(filteredForInbox[0].color);
    }
  }, [scheduleInboxID, scheduleLists]);

  const onItemClick = useCallback(
    (action: string) => () => {
      if (isScheduleAdding || isTaskAdding || isTaskDeleting) {
        return false;
      }
      const rrule = currentTask.repetition_rule;

      if (action == 'toSchedule') {
        scheduleAddAsync({
          ...currentTask,
          id: undefined,
          list_id: scheduleInboxID,
          color: color,
          all_day: 0,
          attachments:
            currentTask.attachments.length > 0
              ? currentTask.attachments.map((_: any) => _.url)
              : [],
          cooperator_ids:
            currentTask.cooperators.length > 0
              ? currentTask.cooperators.map((_: any) => ({
                  [_.id]: _.pivot.role,
                }))
              : [],
          reminder: currentTask.reminder ?? undefined,
          repetition: rrule && rrule !== '' && rrule !== '-1' ? '1' : '0',
          repetition_rule: rrule === '-1' ? '' : rrule,
        }).then(() => {
          taskDelete();
        });
      } else if (action == 'copy') {
        taskAdd({
          ...currentTask,
          id: undefined,
          attachments:
            currentTask.attachments.length > 0
              ? currentTask.attachments.map((_: any) => _.url)
              : [],
          cooperator_ids:
            currentTask.cooperators.length > 0
              ? currentTask.cooperators.map((_: any) => ({
                  [_.id]: _.pivot.role,
                }))
              : [],
          repetition: rrule && rrule !== '' && rrule !== '-1' ? '1' : '0',
          repetition_rule: rrule === '-1' ? '' : rrule,
          reminder: currentTask.reminder ?? undefined,
        });
      } else if (action == 'delete') {
        dispatch(setTaskModalStatus(false));
        taskDelete();
      }
    },
    [
      color,
      currentTask,
      scheduleInboxID,
      taskAdd,
      scheduleAddAsync,
      taskDelete,
      isTaskAdding,
      isScheduleAdding,
      isTaskDeleting,
      dispatch,
    ],
  );

  return (
    <Menu as="div" className="relative ml-16px flex flex-row items-center z-90">
      <div className="flex flex-col">
        <Menu.Button>
          <EllipsisIcon width={20} height={20} className="text-fontPrimary" />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            className={`absolute mt-4px right-0 ${
              upward ? 'bottom-40px' : 'top-24px'
            }  w-200px rounded-md border-1/2 border-separator bg-white divide divide-y divide-gray-100 focus:outline-none cursor-pointer`}
          >
            <div className="p-12px body1">
              {MORE_MENU_ITEMS_FOR_TASK.map((item: any) => (
                <Menu.Item key={`more-menu-item-${item.action}`}>
                  <DefaultMenuItem
                    text={item.text}
                    className={item.className}
                    onClick={onItemClick(item.action)}
                  />
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </div>
    </Menu>
  );
};
