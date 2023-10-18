import { Menu, Transition } from '@headlessui/react';

import GroupUsersIconList from '@component/settings/userList/parts/GroupUsersIconList';

const UserListMenu = (props: {
  id: number;
  users?: any[];
  className?: string;
}) => {
  const { className = '' } = props;

  return (
    <div className={`${className}`}>
      <div
        className={'select-none cursor-pointer p-2px w-44px rounded-8px body1'}
      >
        <div className={'rounded-8px'}>
          <Menu as="div" className="relative flex flex-col">
            <Menu.Button className="flex justify-end z-50">
              <GroupUsersIconList
                users={props.users ?? []}
                groupId={props.id}
              />
            </Menu.Button>
            <Transition
              as="div"
              className="z-100"
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute -mt-4 right-0 top-44px w-40 rounded-md border-1/2 border-separator bg-white divide divide-y divide-gray-100 focus:outline-none cursor-pointer z-9999">
                <div className="p-12px body1 text-fontPrimary">
                  {props.users ? (
                    <>
                      {props.users.map((user) => (
                        <Menu.Item key={`list-${props.id}-user-${user.id}`}>
                          <div className="py-1 truncate">{user.name ?? ''}</div>
                        </Menu.Item>
                      ))}
                    </>
                  ) : null}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default UserListMenu;
