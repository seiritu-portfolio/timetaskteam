import Image from 'next/image';
import { Menu, Transition } from '@headlessui/react';

import EllipsisIcon from '@svg/ellipsis.svg';
import TrashIcon from '@svg/trash.svg';
import RequestToIcon from '@svg/person-and-arrow-left-and-arrow-right.svg';
import RequestHandlerRow from './RequestHandlerRow';
import DefaultAvatarIcon from '@image/default_avatar.png';

const RequestHandler = ({
  type,
  onClear,
  onChange,
  onAdd,
  onCancel,
  avatar,
  className,
}: {
  type: number;
  onClear: () => void;
  onChange: () => void;
  onAdd: () => void;
  onCancel: () => void;
  avatar: string;
  className: string;
}) => {
  return (
    <Menu as="div" className="relative mr-16px flex flex-row items-center z-90">
      <div className="flex flex-col">
        <Menu.Button>
          <EllipsisIcon
            width={20}
            height={20}
            className={`text-fontPrimary ${className}`}
          />
        </Menu.Button>
        <Transition
          as="div"
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            className={`absolute mt-4px px-16px py-12px right-0 bottom-0 w-248px rounded-8px border-1/2 border-separator bg-backgroundSecondary shadow-menu z-90`}
          >
            <div className="absolute -top-22px -left-22px h-44px w-44px rounded-full bg-backgroundSecondary">
              <Image
                alt=""
                layout="fill"
                className="rounded-full object-cover"
                src={avatar && avatar != '' ? avatar : DefaultAvatarIcon}
              />
            </div>
            <div className="body1">
              {type === 1 && (
                <Menu.Item>
                  <RequestHandlerRow
                    text={'全ての依頼を取り消す'}
                    icon={TrashIcon}
                    color="carminePink"
                    onClick={() => {
                      onClear();
                    }}
                  />
                </Menu.Item>
              )}
              {type === 4 ? (
                <Menu.Item>
                  <RequestHandlerRow
                    text="再依頼する"
                    icon={RequestToIcon}
                    color="fontPrimary"
                    onClick={() => {
                      onChange();
                    }}
                  />
                </Menu.Item>
              ) : null}
              {type === 2 && (
                <>
                  <Menu.Item>
                    <RequestHandlerRow
                      text="依頼先を変更する"
                      icon={RequestToIcon}
                      color="fontPrimary"
                      onClick={() => {
                        onChange();
                      }}
                    />
                  </Menu.Item>
                  <Menu.Item>
                    <RequestHandlerRow
                      text="依頼を取り消す"
                      icon={TrashIcon}
                      color="carminePink"
                      onClick={() => {
                        onClear();
                      }}
                    />
                  </Menu.Item>
                </>
              )}
              {type === 3 && (
                <Menu.Item>
                  <RequestHandlerRow
                    text="依頼を取り消す"
                    icon={TrashIcon}
                    color="carminePink"
                    onClick={() => {
                      onClear();
                    }}
                  />
                </Menu.Item>
              )}
            </div>
          </Menu.Items>
        </Transition>
      </div>
    </Menu>
  );
};

export default RequestHandler;
