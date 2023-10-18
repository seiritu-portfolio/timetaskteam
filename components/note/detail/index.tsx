import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
// * hooks
import {
  currentNoteIDSelector,
  listNotesSelector,
} from '@store/selectors/list';
import {
  useNoteAddMutation,
  useNoteUpdateMutation,
} from '@service/noteQueries';
import { setCurrentNoteID } from '@store/modules/list';
import { userProfileSelector } from '@store/selectors/user';
// * components
import Header from './Header';
import Body from './Body';
// * assets & constants
import { NoteType, UserType } from '@model/state';

const Detail = () => {
  const currentNoteID = useSelector(currentNoteIDSelector);
  const currentUserProfile = useSelector(userProfileSelector);
  const listNotes = useSelector(listNotesSelector);
  const currentNote: NoteType | undefined = useMemo(() => {
    if (currentNoteID > 0) {
      const filtered = listNotes.filter((item) => item.id === currentNoteID);
      return filtered.length > 0 ? filtered[0] : undefined;
    }
    return undefined;
  }, [listNotes, currentNoteID]);
  const router = useRouter();
  const currentListId = parseInt(router.query.id?.toString() ?? '0');
  const [viewers, setViewers] = useState<UserType[]>([]);
  useEffect(() => {
    if (currentNote && currentNote.viewers) {
      const filtered = currentNote.viewers.filter(
        (_) => _.id !== currentUserProfile?.id,
      );
      const result: UserType[] = [];
      if (currentUserProfile) {
        result.push(currentUserProfile);
      }
      setViewers([...result, ...filtered]);
    } else if (currentUserProfile) {
      setViewers([currentUserProfile]);
    } else setViewers([]);
  }, [currentNote, currentUserProfile]);

  // * event handler
  const dispatch = useDispatch();
  const onAddNoteSuccess = useCallback(
    (_) => {
      dispatch(setCurrentNoteID(_.id ?? 0));
      setIsUpdating(undefined);
    },
    [dispatch],
  );
  const { mutate: addNoteMutate, status: addNoteStatus } =
    useNoteAddMutation(onAddNoteSuccess);
  const { mutate: updateNoteMutate, status: updateNoteStatus } =
    useNoteUpdateMutation(currentNoteID, (_) => {});
  const [isUpdating, setIsUpdating] = useState<number>();
  const onUpdateOrAddNote = useCallback(
    (title, note) => {
      if (
        addNoteStatus === 'loading' ||
        updateNoteStatus === 'loading' ||
        title === ''
      ) {
        return false;
      }
      const data = {
        list_id:
          currentListId > 0 ? currentListId : currentUserProfile?.note_inbox_id,
        title,
        memo: note,
      };
      if (currentNoteID) {
        updateNoteMutate(data);
      } else if (title) {
        addNoteMutate(data);
      } else {
        toast.error('タイトルを入力してください', {
          hideProgressBar: false,
          progress: undefined,
        });
      }
    },
    [
      addNoteMutate,
      addNoteStatus,
      updateNoteMutate,
      updateNoteStatus,
      currentListId,
      currentNoteID,
      currentUserProfile,
    ],
  );
  const onAddNote = useCallback(
    (newTitle, newNote) => {
      if (isUpdating) {
        clearTimeout(isUpdating);
      }
      const timer: number = window.setTimeout(() => {
        setIsUpdating(undefined);
        onUpdateOrAddNote(newTitle, newNote);
      }, 650);
      setIsUpdating(timer);
    },
    [isUpdating, onUpdateOrAddNote],
  );

  const onNewNote = useCallback(() => {
    if (isUpdating) {
      clearTimeout(isUpdating);
    }

    const timer: number = window.setTimeout(() => {
      setIsUpdating(undefined);
      if (addNoteStatus === 'loading' || updateNoteStatus === 'loading') {
        return false;
      }
      addNoteMutate({
        list_id:
          currentListId > 0 ? currentListId : currentUserProfile?.note_inbox_id,
        title: '',
        memo: '',
      });
    }, 550);
    setIsUpdating(timer);
  }, [
    addNoteStatus,
    updateNoteStatus,
    addNoteMutate,
    isUpdating,
    currentListId,
    currentUserProfile?.note_inbox_id,
  ]);

  return (
    <>
      <Header
        viewers={viewers}
        isRemovable={
          currentNote && currentNote.user_id === currentUserProfile?.id
            ? true
            : false
        }
        onNewNote={onNewNote}
      />
      <Body
        id={currentNoteID}
        isCreate={currentNote ? false : true}
        isEditable={
          true
          // currentNote
          //   ? // currentNote && currentNote.user_id !== currentUserProfile?.id
          //     false
          //   : true
        }
        title={currentNote?.title ?? ''}
        note={currentNote?.memo ?? ''}
        onAddNote={onAddNote}
      />
    </>
  );
};

export default Detail;
