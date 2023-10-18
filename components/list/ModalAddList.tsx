import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Modal from 'react-responsive-modal';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
// * hooks
import { useAddList } from '@service/listMutations';
import {
  groupsSelector,
  guestsSelector,
  membersSelector,
} from '@store/selectors/collabos';
import {
  addListTypeSelector,
  scheduleListsSelector,
  taskListsSelector,
} from '@store/selectors/list';
import { userInfoSelector } from '@store/selectors/user';
// * custom components
import ModalSelUserForList from '@component/list/ModalSelUserForList';
import ModalDefaultProps from '@model/modal';
import ModalLimitCount from './ModalLimitCount';
import NameInput from './parts/NameInput';
import IconSelect from './parts/IconSelect';
import ColorSelect from './parts/ColorSelect';
import OccupancySelect from './parts/OccupancySelect';
import PublicSelect from './parts/PublicSelect';
import PublicUserSelect from './parts/PublicUserSelect';
// * constants
import {
  SCHEDULE_LIST_LIMIT_COUNT,
  TASK_LIST_LIMIT_COUNT,
} from '@util/constants';

const ModalAddList = ({ isOpen, close }: ModalDefaultProps) => {
  const listType = useSelector(addListTypeSelector);
  const members = useSelector(membersSelector);
  const guests = useSelector(guestsSelector);
  const groups = useSelector(groupsSelector);

  const [isModalSelectUser, setIsModalSelectUser] = useState(false);
  const [publicUsers, setPublicUsers] = useState<Array<any>>([]);

  const [color, setColor] = useState(0);
  const [icon, setIcon] = useState<number | null>(null);
  const [reflectOccupancy, setReflectOccupancy] = useState<number | null>(null);
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

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(false);
  }, [isOpen]);
  const { mutate: addMutate, isLoading: addMutateLoading } = useAddList(() => {
    close();
    setLoading(false);
    initialize();
  });
  const onSubmit = useCallback(
    (data) => {
      if (addMutateLoading || loading) {
        return false;
      }
      setLoading(true);

      const submitData = {
        name: data.name,
        type: listType,
        icon,
        color,
        occupancy_rate_visible: reflectOccupancy,
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
      return addMutate(submitData);
    },
    [
      addMutate,
      addMutateLoading,
      listType,
      icon,
      color,
      reflectOccupancy,
      isPublic,
      publicUsers,
      groupIDSelected,
      loading,
    ],
  );

  const windowRef = useRef<Window | null>();
  useEffect(() => {
    if (windowRef && typeof window !== undefined) {
      windowRef.current = window;
    }
  }, [windowRef]);

  useEffect(() => {
    setValue('name', '');
    if (listType === 1) {
      setIcon(null);
      setValue('iconValidate', null);
      setReflectOccupancy(null);
      setValue('occupancyValidate', null);
    } else {
      setIcon(0);
      setValue('iconValidate', 0);
      setReflectOccupancy(0);
      setValue('occupancyValidate', 0);
    }
  }, [isOpen, listType, setValue]);
  useEffect(() => {
    if (isPublic) {
      setValue('publicUsers', null);
    } else {
      setValue('publicUsers', [-1]);
      setPublicUsers([]);
    }
  }, [isPublic, setValue]);

  const initialize = useCallback(() => {
    reset();
    setIsPublic(null);
    if (listType === 1) {
      setIcon(null);
      setValue('iconValidate', null);
      setColor(0);
      setReflectOccupancy(null);
      setValue('occupancyValidate', null);
    } else {
      setIcon(0);
      setValue('iconValidate', 0);
      setReflectOccupancy(0);
      setValue('occupancyValidate', 0);
    }
  }, [listType, reset, setValue]);

  // ! check list count limitation
  const taskLists = useSelector(taskListsSelector);
  const scheduleLists = useSelector(scheduleListsSelector);
  const { user } = useSelector(userInfoSelector);
  const isCountFull = useMemo(() => {
    if (user?.premium_code && user.premium_code !== '') {
      return false;
    }
    if (listType === 1 && taskLists.length >= TASK_LIST_LIMIT_COUNT) {
      return true;
    } else if (
      listType === 2 &&
      scheduleLists.length >= SCHEDULE_LIST_LIMIT_COUNT
    ) {
      return true;
    } else {
      return false;
    }
  }, [taskLists, scheduleLists, listType, user]);

  return (
    <>
      <Modal
        open={isOpen && !isCountFull}
        onClose={() => {
          initialize();
          close();
        }}
        showCloseIcon={false}
        center
        classNames={{
          modal: 'modal-md-size',
        }}
      >
        <div className="p-36px w-full h-full">
          <div className="big-title-light text-fontPrimary">
            {listType === 1
              ? 'タスクリスト追加'
              : listType === 2
              ? 'スケジュールリスト追加'
              : 'フォルダの追加'}
          </div>
          <div className="relative">
            <form onSubmit={handleSubmit(onSubmit)}>
              <NameInput
                register={register}
                defaultValue={undefined}
                changeValue={(newValue) => {
                  setValue('name', newValue);
                }}
                placeholder={listType === 3 ? 'フォルダ名' : undefined}
                reset={reset}
                hasError={errors.name != null}
                additionalClass="mt-36px"
              />
              <div className={listType !== 2 ? 'mt-24px' : 'hidden'}>
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
              <div className={listType === 2 ? 'mt-24px' : 'hidden'}>
                <ColorSelect color={color} setColor={setColor} />
              </div>
              <div className={listType === 1 ? 'mt-24px w-full' : 'hidden'}>
                <OccupancySelect
                  value={reflectOccupancy}
                  setValue={setReflectOccupancy}
                  register={register}
                  hasError={errors.occupancyValidate != null}
                  changeValue={(newValue: any) => {
                    setValue('occupancyValidate', newValue);
                  }}
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
                    initialize();
                    close();
                  }}
                  className="button text-fontSecondary cursor-pointer"
                >
                  キャンセル
                </span>
                <button
                  className="ml-24px px-24px h-44px rounded-8px bg-primary button text-backgroundSecondary"
                  type="submit"
                  disabled={addMutateLoading}
                >
                  追加
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

export default ModalAddList;
