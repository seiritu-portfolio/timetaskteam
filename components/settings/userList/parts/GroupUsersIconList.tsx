import Image from 'next/image';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

import DefaultAvatarIcon from '@image/default_avatar.png';
import { UserType } from '@model/user';

const GroupUsersIconList = ({
  users,
  groupId,
}: {
  users: UserType[];
  groupId: number;
}) => {
  return users && users.length > 0 ? (
    <div className="mr-8px flex flex-row">
      {users.map((_, index) => {
        return index < 3 ? (
          <div
            className="-mr-8px h-22px w-22px flex-xy-center"
            key={`group-${groupId}-user-${_.id}-avatar`}
          >
            <Image
              src={_.avatar && _.avatar != '' ? _.avatar : DefaultAvatarIcon}
              width={22}
              height={22}
              alt=""
              className="h-22px w-22px border-1px-white rounded-full bg-backgroundSecondary object-cover"
            />
          </div>
        ) : index === 3 ? (
          <div
            className="-mr-8px h-22px w-22px rounded-full bg-backgroundSecondary flex-xy-center z-50"
            key={`group-${groupId}-user-${_.id}-avatar`}
          >
            <div className="h-20px w-20px rounded-full bg-backgroundPrimary caption3-en text-fontPrimary flex-xy-center">
              <span>{`+${users.length - 3}`}</span>
            </div>
          </div>
        ) : null;
      })}
    </div>
  ) : null;
};

export default GroupUsersIconList;

export const GroupUsersIconListMenu = ({
  users,
  groupId,
  userClicked,
}: {
  users: UserType[];
  groupId: number;
  userClicked?: (userId: number) => void;
}) => {
  return (
    <Menu as="div" className="relative flex flex-row items-center">
      <div className="flex flex-col">
        <Menu.Button>
          <GroupUsersIconList users={users} groupId={groupId} />
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
          <Menu.Items className="absolute mt-4px right-0 top-24px w-248px rounded-md border-1/2 border-separator bg-white divide divide-y divide-gray-100 focus:outline-none cursor-pointer z-50">
            <div className="p-12px body3-en">
              {users
                ? users.map((user: any) => (
                    <Menu.Item
                      key={`group-user-menu-item-${user.id}`}
                      onClick={() => {
                        if (userClicked) {
                          userClicked(user.id);
                        }
                      }}
                    >
                      <div className="p-12px rounded-6px flex flex-row hover:bg-primarySelected hover:text-primary">
                        <Image
                          src={
                            user.avatar && user.avatar != ''
                              ? user.avatar
                              : DefaultAvatarIcon
                          }
                          width={22}
                          height={22}
                          alt=""
                          className="h-22px w-22px border-1px-white rounded-full object-cover"
                        />
                        <span className="ml-16px body3-en truncate">
                          {user.name}
                        </span>
                      </div>
                    </Menu.Item>
                  ))
                : null}
            </div>
          </Menu.Items>
        </Transition>
      </div>
    </Menu>
  );
};
