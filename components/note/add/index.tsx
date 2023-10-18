import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-responsive-modal';
import { toast } from 'react-toastify';
import Draggable from 'react-draggable';
// * hooks
import { useNoteAddMutation, useNoteListsForUser } from '@service/noteQueries';
import { setNoteLists } from '@store/modules/list';
import { userProfileSelector } from '@store/selectors/user';
import { noteListsSelector } from '@store/selectors/list';
// * components
import ListSelect from './ListSelect';

const AddModal = ({
  isOpen,
  close,
}: {
  isOpen: boolean;
  close: () => void;
}) => {
  const currentUserProfile = useSelector(userProfileSelector);
  const noteLists = useSelector(noteListsSelector);

  const [titleValue, setTitleValue] = useState('');
  const [noteValue, setNoteValue] = useState('');
  const [listId, setListId] = useState(0);
  useEffect(() => {
    if (isOpen) {
      setListId(currentUserProfile?.note_inbox_id ?? 0);
      setTitleValue('');
      setNoteValue('');
    }
  }, [isOpen, currentUserProfile]);

  // * fetch results
  const dispatch = useDispatch();
  const noteListsResult = useNoteListsForUser({
    user_id: currentUserProfile?.id ?? 0,
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

  const onAddNoteSuccess = useCallback(
    (_) => {
      close();
      setIsLoaded(false);
      toast.success('成功', {
        hideProgressBar: true,
        progress: undefined,
        onOpen: () => {},
      });
    },
    [close],
  );
  const { mutate: addNoteMutate, status: addNoteStatus } =
    useNoteAddMutation(onAddNoteSuccess);
  // * event handler
  const onAddNote = useCallback(
    (listId, title, note) => {
      if (addNoteStatus === 'loading') {
        return false;
      }
      if (title === '') {
        toast.error('タイトルを入力してください', {
          hideProgressBar: false,
          progress: undefined,
        });
      } else {
        const data = {
          list_id: listId,
          title,
          memo: note,
        };
        addNoteMutate(data);
      }
    },
    [addNoteMutate, addNoteStatus],
  );

  const [isLoaded, setIsLoaded] = useState(false);
  const noteRef = useRef<HTMLTextAreaElement>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const onClose = useCallback(() => {
    close();
    setIsLoaded(false);
  }, [close]);

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      showCloseIcon={false}
      center
      classNames={{
        modal: 'modal-md-size-draggable',
      }}
    >
      <div onClick={onClose} className="absolute inset-0" />
      <Draggable
        positionOffset={{ x: '-50%', y: '10%' }}
        nodeRef={modalRef}
        handle={'.dragbar'}
        cancel={`.cancel, .react-responsive-modal-overlay`}
      >
        <div className="pt-36px w-full h-full bg-backgroundSecondary">
          <div
            className="absolute top-0 left-0 right-0 h-36px w-full rounded-t-6px bg-separator dragbar cursor-move"
            onClick={() => {
              setIsLoaded(true);
            }}
          />
          <div className="pt-8px px-36px pb-18px draggable-modal-md-custom overflow-y-auto">
            <ListSelect
              value={listId}
              options={noteLists}
              onChange={setListId}
              inboxId={currentUserProfile?.note_inbox_id ?? 0}
            />
            <div className="mt-8px py-4px w-full border-t border-separator flex flex-col">
              <input
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
                onKeyUp={(e) => {
                  if (
                    (e.key === 'Enter' || e.keyCode === 13) &&
                    noteRef.current
                  ) {
                    noteRef.current.focus();
                  }
                }}
                disabled={false}
                placeholder="新規ノート"
                className="focus:outline-none placeholder:text-fontSecondary text-fontPrimary med-title font-semibold"
              />
              <textarea
                ref={noteRef}
                value={noteValue}
                onChange={(e) => setNoteValue(e.target.value)}
                disabled={false}
                className="mt-2px max-h-200px min-h-120px focus:outline-none placeholder:text-fontSecondary text-fontPrimary body1 font-light"
              />
            </div>
            <div className="flex-none pt-8px w-full border-t border-separator body1 flex justify-end items-center">
              <span
                className="text-fontSecondary cursor-pointer"
                onClick={onClose}
              >
                キャンセル
              </span>
              <button
                className="ml-24px py-12px px-24px rounded-8px text-backgroundSecondary bg-primary hover:bg-primaryPressed disabled:opacity-40"
                onClick={() => onAddNote(listId, titleValue, noteValue)}
                disabled={false}
              >
                完了
              </button>
            </div>
          </div>
        </div>
      </Draggable>
    </Modal>
  );
};

export default AddModal;
