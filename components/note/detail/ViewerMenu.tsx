import { Menu, Transition } from '@headlessui/react';
import Image from 'next/image';

import DefaultAvatarIcon from '@image/default_avatar.png';
import { UserType } from '@model/state';

const ViewerMenu = ({
  currentNoteID,
  viewers,
}: {
  currentNoteID: number;
  viewers: UserType[];
}) => {
  return (
    <Menu as="div" className="relative flex flex-col">
      <Menu.Button className="flex justify-end z-50">
        {viewers
          ? viewers.map((_, index) =>
              index < 5 ? (
                <div
                  className="mr-6px h-24px w-24px flex-xy-center"
                  key={`note-${currentNoteID}-viewer-${_.id}`}
                >
                  <Image
                    src={
                      _.avatar && _.avatar != '' ? _.avatar : DefaultAvatarIcon
                    }
                    width={22}
                    height={22}
                    alt=""
                    className="h-24px w-24px border-1px-white rounded-full bg-backgroundSecondary object-cover"
                  />
                </div>
              ) : index === 0 ? (
                <div
                  className="-mr-8px h-22px w-22px rounded-full bg-backgroundSecondary flex-xy-center z-50"
                  key={`group-${currentNoteID}-user-${_.id}-avatar`}
                >
                  <div className="h-20px w-20px rounded-full bg-backgroundPrimary caption3-en text-fontPrimary flex-xy-center">
                    <span>{`+${viewers.length - 3}`}</span>
                  </div>
                </div>
              ) : null,
            )
          : null}
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
        <Menu.Items className="absolute -mt-4 right-0 top-44px w-40 rounded-md border-1/2 border-separator bg-white body1 text-fontPrimary divide divide-y divide-gray-100 focus:outline-none cursor-pointer z-9999">
          <div className="pt-12px pb-2 px-12px font-extrabold">既読</div>
          <div className="py-1 px-12px">
            {viewers ? (
              <>
                {viewers.map((user) => (
                  <Menu.Item key={`note-${currentNoteID}-view-user-${user.id}`}>
                    <div className="py-1 truncate">{user.name ?? ''}</div>
                  </Menu.Item>
                ))}
              </>
            ) : null}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default ViewerMenu;
