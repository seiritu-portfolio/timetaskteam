import { Menu } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';
// * hooks
import { setShowTaskDetail } from '@store/modules/tasks';
import { showTaskDetailSelector } from '@store/selectors/tasks';
// * components
import {
  SortMenu,
  SortTodayMenu,
} from '@component/home/dropdownMenus/sortMenu';
// * assets
import ExtensionIcon from '@svg/extension.svg';

const TasksHeader = (props: any) => {
  const Icon = props.icon;
  const dispatch = useDispatch();
  const showTaskDetail = useSelector(showTaskDetailSelector);

  return (
    <div className="pb-24px w-full flex-row--between border-b border-separator">
      <div className="flex items-center">
        <div className="h-44px w-44px rounded-8px bg-fontPrimary text-backgroundSecondary flex-xy-center">
          <Icon width={20} height={20} />
        </div>
        <h3 className="ml-24px big-title text-fontPrimary">{props.text}</h3>
      </div>
      <div className="flex">
        <Menu as="div" className="relative flex flex-row items-center">
          <div className="flex flex-col">
            <Menu.Button>
              <ExtensionIcon
                width={20}
                height={20}
                onClick={(e: any) => {
                  dispatch(setShowTaskDetail(!showTaskDetail));
                  e.preventDefault();
                  e.stopPropagation();
                }}
              />
            </Menu.Button>
          </div>
        </Menu>
        {props.showSort && <SortMenu sortBy={props.sortBy} />}
      </div>
    </div>
  );
};

export default TasksHeader;
export { TasksTodayHeader };

const TasksTodayHeader = (props: any) => {
  const Icon = props.icon;
  const dispatch = useDispatch();
  const showTaskDetail = useSelector(showTaskDetailSelector);

  return (
    <div className="pb-24px w-full flex-row--between border-b border-separator">
      <div className="flex items-center">
        <div className="h-44px w-44px rounded-8px bg-fontPrimary text-backgroundSecondary flex-xy-center">
          <Icon width={20} height={20} />
        </div>
        <h3 className="ml-24px big-title text-fontPrimary">{props.text}</h3>
      </div>
      <div className="flex">
        <Menu as="div" className="relative flex flex-row items-center">
          <div className="flex flex-col">
            <Menu.Button>
              <ExtensionIcon
                width={20}
                height={20}
                onClick={(e: any) => {
                  dispatch(setShowTaskDetail(!showTaskDetail));
                  e.preventDefault();
                  e.stopPropagation();
                }}
              />
            </Menu.Button>
          </div>
        </Menu>
        {props.showSort ? <SortTodayMenu sortBy={props.sortBy} /> : null}
      </div>
    </div>
  );
};
