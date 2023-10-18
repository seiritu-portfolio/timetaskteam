import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
// * hooks
import { useNoteCheckMutation, useNotesForUsers } from '@service/noteQueries';
import { setCurrentNoteID, setListNotes } from '@store/modules/list';
import { currentCodisplayUserSelector } from '@store/selectors/home';
import {
  currentNoteIDSelector,
  listNotesSelector,
  noteListsSelector,
} from '@store/selectors/list';
import { userProfileSelector } from '@store/selectors/user';
// * components
import NotesLayout from '@component/layout/NotesLayout';
import ListHeader from '@component/note/list/Header';
import NoteItem from '@component/note/list/NoteItem';

const NoteList = () => {
  const currentCodisplayUserID = useSelector(currentCodisplayUserSelector);
  const userInfo = useSelector(userProfileSelector);
  const noteList = useSelector(noteListsSelector);
  const listNotes = useSelector(listNotesSelector);
  const currentNoteID = useSelector(currentNoteIDSelector);
  const [search, setSearch] = useState('');
  const dispatch = useDispatch();

  const router = useRouter();
  const currentListId = parseInt(router.query.id?.toString() ?? '0');
  useEffect(() => {
    dispatch(setCurrentNoteID(0));
  }, [currentListId, dispatch]);
  const currentList = useMemo(() => {
    const filtered = noteList.filter((item) => item.id === currentListId);
    return filtered.length > 0 ? filtered[0] : undefined;
    // return filtered.length > 0 ? filtered[0].name : 'インボックス';
  }, [noteList, currentListId]);
  // * fetch data
  const notesResult = useNotesForUsers({
    list_id: currentListId,
    user_ids: [currentCodisplayUserID],
    search,
  });
  useEffect(() => {
    if (notesResult.isSuccess) {
      dispatch(setListNotes(notesResult.data));
    }
  }, [notesResult.isSuccess, notesResult.data, dispatch]);
  const checkViewed = useCallback(
    (item: any) => {
      if (item.user_id === userInfo?.id) {
        return true;
      }
      let result = false;
      item.viewers.forEach((viewer: any) => {
        if (viewer.id === userInfo?.id) {
          result = true;
        }
      });
      return result;
    },
    [userInfo],
  );
  const { mutate: checkedMutate, status: checkedMutateStatus } =
    useNoteCheckMutation(userInfo?.id ?? 0);

  // * event handler
  const onNoteClick = useCallback(
    (noteId: number) => {
      dispatch(setCurrentNoteID(noteId));
      if (checkedMutateStatus !== 'loading') {
        checkedMutate(noteId);
      }
    },
    [dispatch, checkedMutateStatus, checkedMutate],
  );
  const noMenuMode = useMemo(() => {
    if (userInfo?.note_inbox_id === currentList?.id) {
      return true;
    }
    if (currentList?.cooperators && currentList.cooperators.length > 0) {
      for (let i = 0; i < currentList.cooperators.length; i++) {
        if (currentList.cooperators[i].id === userInfo?.id)
          return currentList.cooperators[i].pivot?.role !== 1;
      }
    }
    return false;
  }, [currentList, userInfo]);

  return (
    <div className="">
      <ListHeader
        title={currentList?.name ?? 'インボックス'}
        noMenu={noMenuMode}
        setSearch={setSearch}
      />
      {listNotes.map((item) => (
        <NoteItem
          {...item}
          viewed={checkViewed(item)}
          isActive={item.id === currentNoteID}
          onClick={() => onNoteClick(item.id)}
          key={`note-item-${item.id}-for-list-${currentListId}`}
        />
      ))}
    </div>
  );
};

export default NoteList;

NoteList.getLayout = function getLayout(page: ReactElement) {
  return <NotesLayout>{page}</NotesLayout>;
};
