import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';

import EllipsisIcon from '@svg/ellipsis.svg';
import DefaultMenuItem from './MenuItem';

export const MoreMenuForList = ({
  isInbox,
  isNotMine,
  onEdit,
  onMultiSelect,
  onCopy,
  archiveStatus,
  onArchive,
  onUnarchive,
  onDelete,
}: {
  isInbox?: boolean;
  isNotMine?: boolean;
  onEdit: () => void;
  onMultiSelect: () => void;
  onCopy: () => void;
  archiveStatus: boolean;
  onArchive: () => void;
  onUnarchive: () => void;
  onDelete: () => void;
}) => {
  return (
    <Menu as="div" className="relative ml-16px flex flex-row items-center z-50">
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
          <Menu.Items className="absolute mt-4px right-0 top-24px w-200px rounded-md border-1/2 border-separator bg-white divide divide-y divide-gray-100 focus:outline-none cursor-pointer">
            <div className="p-12px body1">
              {(isNotMine
                ? MORE_MENU_ITEM_TEXTS_FOR_NOT_MINE
                : isInbox
                ? MORE_MENU_ITEM_TEXTS_FOR_INBOX
                : MORE_MENU_ITEM_TEXTS_FOR_LIST
              ).map((item: any) => (
                <Menu.Item key={`more-menu-item-${item.action}`}>
                  <DefaultMenuItem
                    text={
                      item.action == 'archive' && archiveStatus
                        ? item.text2
                        : item.text
                    }
                    className={item.className}
                    onClick={
                      item.action == 'edit'
                        ? onEdit
                        : item.action == 'select'
                        ? onMultiSelect
                        : item.action == 'copy'
                        ? onCopy
                        : item.action == 'archive'
                        ? archiveStatus
                          ? onUnarchive
                          : onArchive
                        : onDelete
                    }
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

const MORE_MENU_ITEM_TEXTS_FOR_INBOX = [
  {
    text: 'リスト編集',
    className: 'text-fontPrimary',
    action: 'edit',
  },
  {
    text: 'まとめて選択',
    className: 'text-fontPrimary',
    action: 'select',
  },
];

const MORE_MENU_ITEM_TEXTS_FOR_LIST = [
  {
    text: 'リスト編集',
    className: 'text-fontPrimary',
    action: 'edit',
  },
  {
    text: 'まとめて選択',
    className: 'text-fontPrimary',
    action: 'select',
  },
  {
    text: '複製',
    className: 'text-fontPrimary',
    action: 'copy',
  },
  {
    text: 'アーカイブ',
    text2: 'アーカイブ解除',
    className: 'text-fontSecondary',
    action: 'archive',
  },
  {
    text: '消去',
    className: 'text-secondary',
    action: 'delete',
  },
];

const MORE_MENU_ITEM_TEXTS_FOR_NOT_MINE = [
  {
    text: 'リスト編集',
    className: 'text-fontPrimary',
    action: 'edit',
  },
  {
    text: 'まとめて選択',
    className: 'text-fontPrimary',
    action: 'select',
  },
  {
    text: '複製',
    className: 'text-fontPrimary',
    action: 'copy',
  },
  {
    text: '退出',
    className: 'text-secondary',
    action: 'exit',
  },
];
