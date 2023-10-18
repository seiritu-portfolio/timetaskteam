import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
// * hooks
import { setAddListType, setNoteLists } from '@store/modules/list';
import { setListAddModal, toggleNoteSidebar } from '@store/modules/home';
import { useNoteListsForUser } from '@service/noteQueries';
import { noteListsSelector } from '@store/selectors/list';
import {
  currentCodisplayUserSelector,
  isNoteSidebarOpenSelector,
} from '@store/selectors/home';
import { userProfileSelector } from '@store/selectors/user';
// * components
import ListAllMenu from './ListAllMenu';
import ListInboxMenu from './ListInboxMenu';
import ListItem from './ListItem';
import { IconWrap } from '@component/general/wrap';
// * assets
import ExpandIcon from '@svg/arrow-up-left-and-arrow-down-right.svg';
import CollapseIcon from '@svg/arrow-down-forward-and-arrow-up-backward.svg';
import AddIcon from '@svg/add.svg';
import { NOTES_URL } from '@util/urls';

const ListSideMenu = () => {
  const currentCodisplayUserID = useSelector(currentCodisplayUserSelector);
  const userInfo = useSelector(userProfileSelector);
  const noteLists = useSelector(noteListsSelector);
  const isSideMenuOpen = useSelector(isNoteSidebarOpenSelector);

  const router = useRouter();
  const currentListId = parseInt(router.query.id?.toString() ?? '0');
  // * fetch results
  const dispatch = useDispatch();
  const noteListsResult = useNoteListsForUser({
    user_id: currentCodisplayUserID,
  });
  useEffect(() => {
    if (
      noteListsResult.isSuccess &&
      noteListsResult.data &&
      Array.isArray(noteListsResult.data)
    ) {
      dispatch(setNoteLists(noteListsResult.data));
    }
  }, [noteListsResult.isSuccess, noteListsResult.data, dispatch]);
  // * event handlers
  const onListItemClick = useCallback(
    (listId: number) => {
      router.push(`${NOTES_URL}/list/${listId}`);
    },
    [router],
  );
  const onToggleSidemenu = useCallback(() => {
    dispatch(toggleNoteSidebar());
  }, [dispatch]);

  return isSideMenuOpen ? (
    <div className="relative pb-36px flex-none w-1/5 border-r-1/2 border-separator flex flex-col">
      <div className="p-12px border-b border-separator">
        <ListAllMenu />
        <ListInboxMenu />
      </div>
      <div className="flex-1 mb-72px p-8px">
        {noteLists
          ? noteLists
              .filter((item: any) => item.id !== userInfo?.note_inbox_id)
              .map((listItem) => (
                <ListItem
                  {...listItem}
                  isActive={currentListId === listItem.id}
                  onItemClick={onListItemClick}
                  key={`note-list-item-${listItem.id}`}
                />
              ))
          : null}
      </div>
      <div className="absolute mb-48px bottom-0 px-24px h-44px w-full bg-backgroundSecondary flex justify-between items-center z-100">
        <IconWrap
          onClick={onToggleSidemenu}
          additionalClass="flex-none bg-backgroundPrimary text-fontPrimary cursor-pointer hover:bg-primarySelected hover:text-primary"
        >
          <CollapseIcon width={20} height={20} className="" />
        </IconWrap>
        <span
          onClick={() => {
            dispatch(setAddListType(3));
            dispatch(setListAddModal(true));
          }}
          className="ml-24px body1 bg-backgroundSecondary text-primary cursor-pointer"
        >
          フォルダ追加
        </span>
      </div>
    </div>
  ) : (
    <div className="relative flex-none w-62px border-r-1/2 border-separator flex flex-col items-center">
      <div className="p-12px border-b border-separator">
        <ListAllMenu folded={true} />
        <ListInboxMenu folded={true} />
      </div>
      <div className="flex-1 mb-72px p-8px">
        {noteLists
          ? noteLists
              .filter((item: any) => item.id !== userInfo?.note_inbox_id)
              .map((listItem) => (
                <ListItem
                  {...listItem}
                  folded={true}
                  isActive={currentListId === listItem.id}
                  onItemClick={onListItemClick}
                  key={`note-list-item-${listItem.id}`}
                />
              ))
          : null}
      </div>
      <IconWrap
        onClick={() => {
          dispatch(setAddListType(3));
          dispatch(setListAddModal(true));
        }}
        additionalClass="flex-none bg-backgroundPrimary text-fontPrimary cursor-pointer hover:bg-primarySelected hover:text-primary"
      >
        <AddIcon width={20} height={20} className="" />
      </IconWrap>
      <IconWrap
        onClick={onToggleSidemenu}
        additionalClass="mt-4px mb-12px flex-none bg-backgroundPrimary text-fontPrimary cursor-pointer hover:bg-primarySelected hover:text-primary"
      >
        {isSideMenuOpen ? (
          <CollapseIcon width={20} height={20} className="" />
        ) : (
          <ExpandIcon width={20} height={20} className="" />
        )}
      </IconWrap>
    </div>
  );
};

export default ListSideMenu;
