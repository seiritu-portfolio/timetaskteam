import { useEffect, useMemo, useRef, useState } from 'react';
import Modal from 'react-responsive-modal';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
// * hooks
import { useListUpdate } from '@service/listMutations';
import {
  groupsSelector,
  guestsSelector,
  membersSelector,
} from '@store/selectors/collabos';
import { noteListsSelector } from '@store/selectors/list';
import { userInfoSelector } from '@store/selectors/user';
// * components
import ModalSelUserForList from '@component/list/ModalSelUserForList';
import ModalDefaultProps from '@model/modal';
import ModalLimitCount from './ModalLimitCount';
import NameInput from './parts/NameInput';
import IconSelect from './parts/IconSelect';
import PublicSelect from './parts/PublicSelect';
import PublicUserSelect from './parts/PublicUserSelect';
// * constants
import { NOTE_LIST_LIMIT_COUNT } from '@util/constants';

const ModalNoteEditList = ({ isOpen, close }: ModalDefaultProps) => {
  const members = useSelector(membersSelector);
  const guests = useSelector(guestsSelector);
  const groups = useSelector(groupsSelector);

  const [isModalSelectUser, setIsModalSelectUser] = useState(false);
  const [publicUsers, setPublicUsers] = useState<Array<any>>([]);

  const [icon, setIcon] = useState<number | null>(null);
  const [isPublic, setIsPublic] = useState<number | null>(null);

  const [groupIDSelected, setGroupIDSelected] = useState<number | undefined>(
    undefined,
  );
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const onRemovePublicUser = (id: number) => {
    const publicUserIDs = publicUsers.map((_) => _.id);

    if (publicUserIDs.includes(id)) {
      setPublicUsers(publicUsers.filter((_: any) => _.id !== id));
      setValue(
        'publicUsers',
        publicUserIDs.filter((_) => _.id !== id).toString(),
      );

      if (publicUserIDs.length === 0) {
        setGroupIDSelected(-1);
      }
    }
  };

  const mutation = useListUpdate(close);
  const onSubmit = handleSubmit((data) => {
    if (mutation.isLoading) {
      return false;
    }

    const submitData = {
      id: currentListId,
      name: data.name,
      type: 3,
      icon,
      color: 0,
      occupancy_rate_visible: 0,
      status: isPublic,
      cooperator_ids: publicUsers.includes(-1)
        ? []
        : publicUsers.map((item: any) => item.id),
      cooperator_group_id:
        groupIDSelected != undefined && groupIDSelected !== -1
          ? groupIDSelected
          : 0,
      // cooperator_type: null,
    };
    return mutation.mutate(submitData);
  });

  const windowRef = useRef<Window | null>();
  useEffect(() => {
    if (windowRef && typeof window !== undefined) {
      windowRef.current = window;
    }
  }, [windowRef]);

  useEffect(() => {
    if (isPublic) {
      setValue('publicUsers', null);
    } else {
      setValue('publicUsers', [-1]);
      setPublicUsers([]);
    }
  }, [isPublic, setValue]);

  const router = useRouter();
  const currentListId = parseInt(router.query.id?.toString() ?? '0');
  const noteList = useSelector(noteListsSelector);
  useEffect(() => {
    const filtered = noteList.filter((item) => item.id === currentListId);
    const currentListInfo = filtered.length > 0 ? filtered[0] : undefined;
    setValue('name', currentListInfo?.name);
    setIcon(currentListInfo?.icon ?? 0);
    setValue('iconValidate', 0);
    setIsPublic(currentListInfo?.status ?? 0);
    setValue('isPublicValidate', 0);

    if (
      currentListInfo?.cooperators &&
      currentListInfo?.cooperators.length > 0
    ) {
      const cooperator_ids =
        currentListInfo?.cooperators.length > 0
          ? currentListInfo.cooperators.map((_) => _.id)
          : [];
      const cooperators = [...members, ...guests].filter((user) =>
        cooperator_ids.includes(user.id),
      );
      setPublicUsers(cooperators);
      setGroupIDSelected(currentListInfo?.cooperator_group_id);
    }

    // setValue('publicUsers', currentListInfo?.)
  }, [noteList, currentListId, setValue, members, guests]);

  // ! check list count limitation
  const { user } = useSelector(userInfoSelector);
  const isCountFull = useMemo(() => {
    if (user?.premium_code && user.premium_code !== '') {
      return false;
    }
    if (noteList.length >= NOTE_LIST_LIMIT_COUNT) {
      return true;
    }
    return false;
  }, [noteList, user]);

  return (
    <>
      <Modal
        open={isOpen && !isCountFull}
        onClose={close}
        showCloseIcon={false}
        center
        classNames={{
          modal: 'modal-md-size',
        }}
      >
        <div className="p-36px w-full h-full">
          <div className="big-title-light text-fontPrimary">フォルダの編集</div>
          <div className="relative">
            <form onSubmit={onSubmit}>
              <NameInput
                register={register}
                changeValue={(newValue) => {
                  setValue('name', newValue);
                }}
                placeholder={'フォルダ名'}
                reset={reset}
                hasError={errors.name != null}
                additionalClass="mt-36px"
              />
              <div className="mt-24px">
                <IconSelect
                  value={icon}
                  setValue={(newValue) => {
                    setIcon(newValue);
                    setValue('iconValidate', newValue);
                  }}
                  changeValue={(newValue: any) => setValue('icon', newValue)}
                  register={register}
                  hasError={errors.iconValidate != null}
                />
              </div>
              <div className="mt-24px w-full">
                <PublicSelect
                  value={isPublic}
                  setValue={(newValue: number | null) => setIsPublic(newValue)}
                  register={register}
                  hasError={errors.isPublicValidate != null}
                  changeValue={(newValue: any) => {
                    setValue('isPublicValidate', newValue);
                  }}
                />
              </div>
              <PublicUserSelect
                register={register}
                additionalClass={isPublic ? 'mt-24px cursor-pointer' : 'hidden'}
                onClick={() => {
                  setIsModalSelectUser(true);
                }}
                hasError={errors.publicUsers != null}
                groupIDSelected={groupIDSelected}
                publicUsers={publicUsers}
                onRemovePublicUser={onRemovePublicUser}
              />
              <div className="mt-36px h-44px w-full flex flex-row items-center justify-end">
                <span
                  onClick={() => {
                    close();
                  }}
                  className="button text-fontSecondary cursor-pointer"
                >
                  キャンセル
                </span>
                <button
                  className="ml-24px px-24px h-44px rounded-8px bg-primary button text-backgroundSecondary"
                  type="submit"
                >
                  完了
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
      <ModalSelUserForList
        isOpen={isModalSelectUser}
        close={() => {
          setIsModalSelectUser(false);
        }}
        memberList={members}
        guestList={guests}
        groupList={groups}
        selectedUserIDs={
          publicUsers.includes(-1)
            ? []
            : publicUsers.map((item: any) => item.id)
        }
        onConfirm={(idsToAdd: number[], groupSelected: number) => {
          const publicMembers =
            members.length > 0
              ? members.filter((_: any) => idsToAdd.includes(_.id))
              : [];
          const publicGuests =
            guests.length > 0
              ? guests.filter((_: any) => idsToAdd.includes(_.id))
              : [];

          setPublicUsers([...publicMembers, ...publicGuests]);
          setValue('publicUsers', idsToAdd.toString());
          setGroupIDSelected(groupSelected);
          setIsModalSelectUser(false);
        }}
      />
      <ModalLimitCount isOpen={isOpen && isCountFull == true} close={close} />
    </>
  );
};

export default ModalNoteEditList;
