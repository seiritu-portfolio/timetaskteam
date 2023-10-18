import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// * hooks
import {
  useAllNotesForUsers,
  useNoteCheckMutation,
} from '@service/noteQueries';
import { setCurrentNoteID, setListNotes } from '@store/modules/list';
import { currentCodisplayUserSelector } from '@store/selectors/home';
import {
  currentNoteIDSelector,
  listNotesSelector,
} from '@store/selectors/list';
import { userProfileSelector } from '@store/selectors/user';
// * components
import NotesLayout from '@component/layout/NotesLayout';
import NoteItem from '@component/note/list/NoteItem';
import ListHeader from '@component/note/list/Header';
// * assets

const NotesListAll = () => {
  const currentCodisplayUserID = useSelector(currentCodisplayUserSelector);
  const listNotes = useSelector(listNotesSelector);
  const userInfo = useSelector(userProfileSelector);
  const currentNoteID = useSelector(currentNoteIDSelector);
  const [search, setSearch] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setCurrentNoteID(0));
  }, [dispatch]);
  // * fetch data
  const notesResult = useAllNotesForUsers({
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

  return (
    <div className="">
      <ListHeader title={'全てのノート'} noMenu={true} setSearch={setSearch} />
      {listNotes.map((item) => (
        <NoteItem
          {...item}
          viewed={checkViewed(item)}
          isActive={item.id === currentNoteID}
          onClick={() => onNoteClick(item.id)}
          key={`note-item-${item.id}-for-list-all`}
        />
      ))}
    </div>
  );
};

export default NotesListAll;

NotesListAll.getLayout = function getLayout(page: ReactElement) {
  return <NotesLayout>{page}</NotesLayout>;
};
