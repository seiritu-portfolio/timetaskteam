import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import Modal from 'react-responsive-modal';

import {
  currentCollaboIdSelector,
  groupsSelector,
  guestsSelector,
  membersSelector,
} from '@store/selectors/collabos';
import { useCollaboUpdate } from '@service/userMutation';

import { COLOR_VALUES } from '@util/constants';
import ModalDefaultProps from '@model/modal';
import { CollaboAvatar, ColorSelect, RoleSelect } from './parts';
import { GroupSelect } from '@component/home/Selects';
import ModalDeleteUser from './ModalDeleteUser';

const ModalEditUser = ({ isOpen, close }: ModalDefaultProps) => {
  const collaboID = useSelector(currentCollaboIdSelector);
  const members = useSelector(membersSelector);
  const guests = useSelector(guestsSelector);
  const groups = useSelector(groupsSelector);

  const collaboUserInfo: any = useMemo(() => {
    const allInfo = [...members, ...guests];
    const filtered = allInfo.filter((_: any) => _.id == collaboID);
    return filtered.length > 0 ? filtered[0] : null;
  }, [members, guests, collaboID]);

  const {
    register,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const [collaboType, setCollaboType] = useState(1);
  const [groupIDs, setGroupIDs] = useState<number[]>([]);
  const [color, setColor] = useState<number>(0);
  const [isModalDelete, setIsModalDelete] = useState(false);

  const currentGroupIDs: number[] = useMemo(() => {
    if (collaboID && groups.length > 0) {
      const ids: number[] = [];
      groups.forEach((_: any) => {
        const userIDsInGroup =
          _.cooperators.length > 0
            ? _.cooperators.map((user: any) => user.id)
            : [];
        if (userIDsInGroup.includes(collaboID)) {
          ids.push(_.id);
        }
      });
      return ids.length > 0 ? ids : [-1];
    } else if (collaboID) {
      return [-1];
    } else {
      return [];
    }
  }, [groups, collaboID]);
  useEffect(() => {
    setGroupIDs(currentGroupIDs);
  }, [currentGroupIDs]);

  const collaboUpdateMutation = useCollaboUpdate((now: Date) => {});

  const onSubmit = handleSubmit((_: any) => {
    if (collaboUpdateMutation.isLoading) {
      return false;
    }
    const groups = groupIDs.length == 1 && groupIDs[0] == -1 ? [] : groupIDs;
    const data = {
      color,
      role: collaboType,
      group_ids: groups,
      coop_user_id: collaboID,
    };
    return collaboUpdateMutation.mutate(data);
  });

  useEffect(() => {
    if (collaboUserInfo) {
      setCollaboType(collaboUserInfo.pivot.role);
      setColor(collaboUserInfo.pivot.color);
      //   setGroupIDs(collaboUserInfo.pivot.)
    }
  }, [collaboUserInfo]);

  const changed = useMemo(() => {
    if (collaboUserInfo) {
      return (
        collaboUserInfo.pivot.color !== color ||
        collaboUserInfo.pivot.role !== collaboType ||
        currentGroupIDs.toString() !== groupIDs.toString()
      );
    } else {
      return false;
    }
  }, [collaboUserInfo, color, collaboType, groupIDs, currentGroupIDs]); //groupIDs

  return (
    <Modal
      open={isOpen && collaboUserInfo != null}
      onClose={() => {
        close();
      }}
      center
      showCloseIcon={false}
      classNames={{
        modal: 'modal-md-size',
      }}
      onOverlayClick={close}
    >
      <div className="p-36px flex flex-col">
        <div className="big-title text-fontPrimary flex-row--between">
          <span>ユーザー編集</span>
          <span
            className="text-secondary body1 cursor-pointer"
            onClick={() => {
              setIsModalDelete(true);
            }}
          >
            ユーザーを削除
          </span>
        </div>
        <form onSubmit={onSubmit}>
          <CollaboAvatar
            imgSrc={collaboUserInfo?.avatar ?? undefined}
            color={color ? COLOR_VALUES[color].label : undefined}
            name={collaboUserInfo?.name ?? ''}
            uuid={undefined}
          />
          <div className="mt-24px w-full">
            <RoleSelect
              value={collaboType}
              disabled={false}
              onChange={(newValue: number) => {
                setCollaboType(newValue);
              }}
            />
          </div>
          <div className="mt-24px w-full">
            <GroupSelect
              groupIDs={groupIDs}
              setGroupIDs={(newValue: number[]) => {
                setGroupIDs(newValue);
                if (newValue.length == 1 && newValue[0] == -1) {
                  setValue('groupsVal', -1);
                } else if (newValue.length == 0) {
                  setValue('groupsVal', undefined);
                } else {
                  setValue('groupsVal', newValue[0]);
                }
              }}
              disabled={false}
            />
            <input
              type="hidden"
              {...register('groupsVal', { required: true })}
            />
            {errors.groupsVal && (
              <p className="mt-8px ml-4px body1 text-secondary">
                内容が空です。
              </p>
            )}
          </div>
          <div className="mt-24px w-full">
            <ColorSelect
              value={color}
              disabled={false}
              onChange={(newValue: number) => {
                setColor(newValue);
              }}
            />
            {errors.colorVal && (
              <p className="mt-8px ml-4px body1 text-secondary">
                内容が空です。
              </p>
            )}
          </div>
          <div className="mt-36px flex flex-row items-center justify-end">
            <span
              onClick={() => {
                close();
              }}
              className="button text-fontSecondary cursor-pointer"
            >
              キャンセル
            </span>
            <button
              className={`ml-24px px-24px h-44px rounded-8px bg-primary button text-backgroundSecondary disabled:opacity-40 ${
                collaboUpdateMutation.isLoading || !changed ? 'opacity-40' : ''
              }`}
              type="submit"
              disabled={collaboUpdateMutation.isLoading || !changed}
            >
              確認
            </button>
          </div>
        </form>
      </div>
      <ModalDeleteUser
        isOpen={isModalDelete}
        close={() => {
          setIsModalDelete(false);
        }}
        onDelete={() => {
          close();
        }}
      />
    </Modal>
  );
};

export default ModalEditUser;
