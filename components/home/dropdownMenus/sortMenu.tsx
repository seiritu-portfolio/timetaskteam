import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';

import ArrowUpdownIcon from '@svg/arrow-up-arrow-down-square.svg';
import {
  TASK_SORT_TYPE,
  TASK_SORT_TYPE_ARRAY,
  TASK_SORT_TYPE_TODAY_ARRAY,
} from '@util/constants';

export const SortMenu = ({
  idToHide,
  sortBy,
}: {
  idToHide?: number;
  sortBy?: (sortType: TASK_SORT_TYPE) => void;
}) => {
  return (
    <Menu as="div" className="relative ml-16px flex flex-row items-center">
      <div className="flex flex-col">
        <Menu.Button>
          <div className="tooltip">
            <ArrowUpdownIcon width={20} height={20} />
            <span className="absolute top-full mt-4 -ml-12 px-2 py-1 w-20 rounded-2px bg-fontSecondary body3 text-backgroundSecondary text-center z-50 tooltiptext">
              並び替え
            </span>
          </div>
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
          <Menu.Items className="absolute mt-4px right-0 top-24px w-220px rounded-md border-1/2 border-separator bg-white divide divide-y divide-gray-100 focus:outline-none cursor-pointer z-50">
            <div className="p-12px body1">
              {TASK_SORT_TYPE_ARRAY.map((item: any) => {
                return item.value === idToHide ? null : (
                  <Menu.Item key={`task-sort-type-select-${item.value}`}>
                    <div
                      className="p-12px rounded-6px truncate hover:bg-primarySelected hover:text-primary"
                      onClick={(e) => {
                        if (sortBy) sortBy(item.desc as TASK_SORT_TYPE);
                        e.stopPropagation();
                      }}
                    >
                      {item.text}
                    </div>
                  </Menu.Item>
                );
              })}
            </div>
          </Menu.Items>
        </Transition>
      </div>
    </Menu>
  );
};

export const SortTodayMenu = ({
  idToHide,
  sortBy,
}: {
  idToHide?: number;
  sortBy?: (sortType: TASK_SORT_TYPE) => void;
}) => {
  return (
    <Menu as="div" className="relative ml-16px flex flex-row items-center">
      <div className="flex flex-col">
        <Menu.Button>
          <div className="tooltip">
            <ArrowUpdownIcon width={20} height={20} />
            <span className="absolute top-full mt-4 -ml-12 px-2 py-1 w-20 rounded-2px bg-fontSecondary body3 text-backgroundSecondary text-center z-50 tooltiptext">
              並び替え
            </span>
          </div>
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
          <Menu.Items className="absolute mt-4px right-0 top-24px w-220px rounded-md border-1/2 border-separator bg-white divide divide-y divide-gray-100 focus:outline-none cursor-pointer z-50">
            <div className="p-12px body1">
              {TASK_SORT_TYPE_TODAY_ARRAY.map((item: any) => {
                return item.value === idToHide ? null : (
                  <Menu.Item key={`task-sort-type-select-${item.value}`}>
                    <div
                      className="p-12px rounded-6px truncate hover:bg-primarySelected hover:text-primary"
                      onClick={(e) => {
                        if (sortBy) sortBy(item.desc as TASK_SORT_TYPE);
                        e.stopPropagation();
                      }}
                    >
                      {item.text}
                    </div>
                  </Menu.Item>
                );
              })}
            </div>
          </Menu.Items>
        </Transition>
      </div>
    </Menu>
  );
};
