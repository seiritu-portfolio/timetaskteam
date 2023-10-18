import { Fragment, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, Transition } from '@headlessui/react';
// * hooks
import {
  currentScheduleIDSelector,
  currentScheduleSelector,
} from '@store/selectors/schedules';
import { taskInboxIDSelector, userInfoSelector } from '@store/selectors/user';
import { useTaskAddMutation } from '@service/taskMutation';
import { useScheduleAdd, useScheduleDelete } from '@service/scheduleMutation';
import { setScheduleID } from '@store/modules/schedules';
// * custom component
import DefaultMenuItem from '../dropdownMenus/MenuItem';
// * constants
import EllipsisIcon from '@svg/ellipsis.svg';
import { MORE_MENU_ITEMS_FOR_SCHEDULES } from '@util/menuList';
import { setScheduleModalStatus } from '@store/modules/home';

const MoreMenuForSchedule = ({ upward }: { upward?: boolean }) => {
  const currentScheduleID = useSelector(currentScheduleIDSelector);
  const currentSchedule = useSelector(currentScheduleSelector);
  const dispatch = useDispatch();

  const { mutate: scheduleDelete, isLoading: isScheduleDeleting } =
    useScheduleDelete(() => {
      setTimeout(() => {
        dispatch(setScheduleID(-1));
      }, 320);
    });

  const { mutateAsync: taskAddAsync, isLoading: isTaskAdding } =
    useTaskAddMutation((_: any) => {});
  const { mutate: scheduleAdd, isLoading: isScheduleAdding } = useScheduleAdd(
    (_: any) => {},
  );
  const taskInboxID = useSelector(taskInboxIDSelector);
  const userInfo = useSelector(userInfoSelector);

  const onItemClick = useCallback(
    (action: string) => () => {
      if (isScheduleAdding || isTaskAdding || isScheduleDeleting) {
        return false;
      }

      const rrule = currentSchedule.repetition_rule;
      if (action == 'toTask') {
        taskAddAsync({
          ...currentSchedule,
          id: undefined,
          list_id: taskInboxID,
          color: -1,
          importance: 1,
          continuation: 0,
          required_time: userInfo.user?.task_default_time ?? 180,
          reminder: currentSchedule.reminder ?? undefined,
          type: 0,
          attachments: [],
          cooperator_ids: [
            {
              [userInfo?.user?.id ?? 0]: 1,
            },
          ],
          repetition: rrule && rrule !== '' && rrule !== '-1' ? '1' : '0',
          repetition_rule: rrule === '-1' ? '' : rrule,
        }).then(() => {
          scheduleDelete(currentScheduleID ?? 0);
        });
      } else if (action == 'copy') {
        scheduleAdd({
          ...currentSchedule,
          id: undefined,
          attachments: [],
          reminder: currentSchedule.reminder ?? undefined,
          cooperator_ids:
            currentSchedule.cooperators.length > 0
              ? currentSchedule.cooperators.map((_: any) => ({
                  [_.id]: _.pivot.role,
                }))
              : [],
          repetition: rrule && rrule !== '' && rrule !== '-1' ? '1' : '0',
          repetition_rule: rrule === '-1' ? '' : rrule,
        });
      } else if (action == 'delete') {
        dispatch(setScheduleModalStatus(false));
        scheduleDelete(currentScheduleID ?? 0);
      }
    },
    [
      taskAddAsync,
      scheduleAdd,
      scheduleDelete,
      isScheduleAdding,
      isTaskAdding,
      isScheduleDeleting,
      dispatch,
      currentSchedule,
      currentScheduleID,
      taskInboxID,
      userInfo.user,
    ],
  );

  return (
    <Menu as="div" className="relative mx-16px flex flex-row items-center">
      <div className="flex flex-col">
        <Menu.Button>
          <EllipsisIcon width={20} height={20} className="text-fontPrimary" />
        </Menu.Button>
      </div>
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
            upward ? 'bottom-24px' : 'top-24px'
          }  w-200px rounded-md border-1/2 border-separator bg-white divide divide-y divide-gray-100 focus:outline-none cursor-pointer`}
        >
          <div className="p-12px body1">
            {MORE_MENU_ITEMS_FOR_SCHEDULES.map((item: any) => (
              <Menu.Item key={`more-menu-schedule-item-${item.action}`}>
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
    </Menu>
  );
};

export default MoreMenuForSchedule;
