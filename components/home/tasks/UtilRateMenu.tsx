import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';

import DownTriangleIcon from '@svg/triangle-small.svg';
import { UTIL_RATE_MENU_LIST } from '@util/selectOptions';

export const UtilRateMenu = ({
  value,
  onChange,
  className,
}: {
  value: 'today' | '3d' | '7d' | '1w' | '1m' | '30d';
  onChange: (newValue: 'today' | '3d' | '7d' | '1w' | '1m' | '30d') => void;
  className?: string;
}) => {
  return (
    <Menu
      as="div"
      className={`relative px-2 w-28 flex flex-row items-center z-50 border-b border-fontSecondary ${className}`}
    >
      <div className="flex flex-col w-full items-start">
        <Menu.Button as={React.Fragment}>
          <div className="w-full flex flex-row justify-between items-center">
            <span className="text-primary">
              {UTIL_RATE_MENU_LIST.filter((option) => option.value === value)[0]
                ?.text ?? '今日'}
            </span>
            <DownTriangleIcon
              width={20}
              height={20}
              className="text-fontSecondary"
            />
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
          <Menu.Items className="absolute mt-4px left-0 top-24px w-200px rounded-md border-1/2 border-separator bg-white divide divide-y divide-gray-100 focus:outline-none cursor-pointer shadow-md">
            <div className="body1">
              {UTIL_RATE_MENU_LIST.map((item: any) => (
                <Menu.Item key={`more-menu-item-${item.value}`}>
                  <div
                    className="py-12px px-24px hover:bg-primaryHovered cursor-pointer truncate"
                    onClick={() => onChange(item.value)}
                  >
                    {item.text}
                  </div>
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </div>
    </Menu>
  );
};
