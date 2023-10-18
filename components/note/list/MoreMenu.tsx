import { Fragment, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, Transition } from '@headlessui/react';
import { useRouter } from 'next/router';
import { useQueryClient } from 'react-query';
// * hooks
import { useDeleteListByID } from '@service/listMutations';
import { setListEditModal } from '@store/modules/home';
import { setCurrentListID } from '@store/modules/list';
// * components
import DefaultMenuItem from '@component/home/dropdownMenus/MenuItem';
import DeleteModal from '../DeleteModal';
// import DefaultMenuItem from '../dropdownMenus/MenuItem';
import EllipsisIcon from '@svg/ellipsis.svg';

const MoreMenu = ({ upward }: { upward?: boolean }) => {
  const [isDeleteModal, setIsDeleteModal] = useState(false);

  const router = useRouter();
  const currentListId = parseInt(router.query.id?.toString() ?? '0');
  const dispatch = useDispatch();
  // * event handler
  const onEdit = useCallback(() => {
    const currentUrl = router.asPath;
    localStorage.setItem('task3_background_url', currentUrl);
    dispatch(setListEditModal(true));
    dispatch(setCurrentListID(currentListId));
  }, [router.asPath, dispatch, currentListId]);

  const queryClient = useQueryClient();
  const { mutate: deleteMutate, status: deleteStatus } = useDeleteListByID(
    () => {
      queryClient.invalidateQueries([
        'list',
        {
          type: 'note',
        },
      ]);
    },
  );
  const onDelete = useCallback(() => {
    if (deleteStatus !== 'loading') {
      deleteMutate(currentListId);
    }
  }, [deleteMutate, deleteStatus, currentListId]);

  return (
    <>
      <Menu as="div" className="relative ml-16px flex flex-row items-center">
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
              <div className="body1">
                <Menu.Item>
                  <DefaultMenuItem
                    text={'フォルダ編集'}
                    className={''}
                    onClick={onEdit}
                  />
                </Menu.Item>
                <Menu.Item>
                  <DefaultMenuItem
                    text={'消去'}
                    className={'text-secondary'}
                    onClick={() => setIsDeleteModal(true)}
                  />
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </div>
      </Menu>
      <DeleteModal
        isOpen={isDeleteModal}
        title={'フォルダの削除'}
        desc={
          'フォルダを削除します。これを行うと、フォルダ内のノートも全て削除されます。'
        }
        onDelete={onDelete}
        close={() => setIsDeleteModal(false)}
      />
    </>
  );
};

export default MoreMenu;
