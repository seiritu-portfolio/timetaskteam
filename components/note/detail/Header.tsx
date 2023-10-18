import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// * hooks
import { useNoteDeleteWithID } from '@service/noteQueries';
import { setCurrentNoteID } from '@store/modules/list';
import { currentNoteIDSelector } from '@store/selectors/list';
// * components
import DeleteModal from '../DeleteModal';
import ViewerMenu from './ViewerMenu';
// * assets
import AddIcon from '@svg/add.svg';
import TrashIcon from '@svg/trash.svg';
import { UserType } from '@model/state';

const Header = ({
  viewers,
  isRemovable,
  onNewNote,
}: {
  viewers?: UserType[];
  isRemovable: boolean;
  onNewNote: () => void;
}) => {
  const currentNoteID = useSelector(currentNoteIDSelector);
  const [isDeleteModal, setIsDeleteModal] = useState(false);

  const { mutate: noteDeleteMutate, status: noteDeleteStatus } =
    useNoteDeleteWithID();
  const dispatch = useDispatch();
  // * event handlers
  // const onAddNote = useCallback(() => {
  //   dispatch(setCurrentNoteID(0));
  // }, [dispatch]);
  const onDeleteNote = useCallback(() => {
    if (noteDeleteStatus !== 'loading' && currentNoteID > 0) {
      noteDeleteMutate(currentNoteID);
    }
  }, [currentNoteID, noteDeleteMutate, noteDeleteStatus]);

  return (
    <div className="py-16px pr-16px px-24px w-full border-b border-separator flex-row--between">
      <AddIcon
        onClick={onNewNote}
        width={24}
        height={24}
        className={`text-fontPrimary cursor-pointer`}
      />
      <div className="flex items-center">
        <ViewerMenu currentNoteID={currentNoteID} viewers={viewers ?? []} />
        {isRemovable ? (
          <TrashIcon
            width={24}
            height={24}
            onClick={() => {
              setIsDeleteModal(true);
            }}
            className="text-fontPrimary opacity-90"
          />
        ) : null}
      </div>
      <DeleteModal
        isOpen={isDeleteModal}
        title={'ノートの削除'}
        desc={
          'ノートを削除します。これを行うと、直ちにノートが削除されます。これを元に戻すことはできません。'
        }
        onDelete={onDeleteNote}
        close={() => setIsDeleteModal(false)}
      />
    </div>
  );
};

export default Header;
