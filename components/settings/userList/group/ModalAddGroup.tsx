import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import Modal from 'react-responsive-modal';

import { DefaultInputWrap } from '@component/general/input';
import { UserIconRemovable } from '@component/settings/userList/parts/UserRow';
import CircledCloseIcon from '@svg/multiply-circle-fill-small.svg';

import { COLOR_VALUES, configBearerToken } from '@util/constants';
import ModalDefaultProps from '@model/modal';
import axiosConfig from '@util/axiosConfig';
import { DEFAULT_AVATAR_URL, URL_GROUP } from '@util/urls';
import {
  setGroupUserSelectModal,
  setIDsForNewGroup,
} from '@store/modules/home';
import { idsForNewGroupSelector } from '@store/selectors/home';
import { guestsSelector, membersSelector } from '@store/selectors/collabos';

const ModalAddGroup = ({ isOpen, close }: ModalDefaultProps) => {
  const [inputNameReset, setInputNameReset] = useState(false);
  const { register, handleSubmit, setValue, reset, formState } = useForm({
    defaultValues: {
      name: '',
    },
  });

  const members = useSelector(membersSelector);
  const guests = useSelector(guestsSelector);
  const idsForNewGroup = useSelector(idsForNewGroupSelector);

  const { ref, name, onChange, onBlur } = register('name', { required: true });
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (data: any) => {
      const token = localStorage.getItem('task3_token');
      const config = configBearerToken(token ?? '');

      return axiosConfig.post(URL_GROUP, data, config);
    },
    {
      onSuccess: async () => {
        toast.success('成功', {
          hideProgressBar: false,
          progress: undefined,
          onOpen: () => {
            queryClient.invalidateQueries('group_list');
            close();
          },
        });
      },
      onError: async (error) => {
        // @ts-ignore
        const errorMessage = error.response.data.data
          ? // @ts-ignore
            error.response.data.data
          : // @ts-ignore
            Object.values(error.response.data.errors)[0][0];
        toast.error(errorMessage, {
          hideProgressBar: false,
          progress: undefined,
        });
      },
    },
  );

  const onSubmit = handleSubmit((_: any) => {
    if (mutation.isLoading) {
      return false;
    }
    const data = {
      ..._,
      coop_user_ids: idsForNewGroup,
    };
    return mutation.mutate(data);
  });

  return (
    <Modal
      open={isOpen}
      onClose={close}
      center
      showCloseIcon={false}
      classNames={{
        overlay: 'modal-overlay',
        modal: 'modal-md-size',
        modalContainer: 'group-modal-container',
        root: 'group-modal-root',
      }}
      onOverlayClick={close}
    >
      <div className="p-36px h-full flex flex-col justify-between border border-red">
        <form onSubmit={onSubmit}>
          <h3 className="big-title text-fontPrimary">グループ追加</h3>
          <div className="mt-24px flex flex-col justify-start">
            <DefaultInputWrap additionalPositionClass="my-12px">
              <input
                name={name}
                ref={ref}
                type="text"
                onChange={(e) => {
                  onChange(e);
                  setValue('name', e.target.value);
                  if (e.target.value !== '') {
                    setInputNameReset(true);
                  } else {
                    setInputNameReset(false);
                  }
                }}
                placeholder="グループ名"
                className="w-full button text-fontPrimary focus:outline-none bg-backgroundPrimary"
                onBlur={onBlur}
              />
              {inputNameReset ? (
                <CircledCloseIcon
                  width="20"
                  height="20"
                  className="text-fontSecondary"
                  onClick={() => {
                    reset();
                    setInputNameReset(false);
                  }}
                />
              ) : null}
            </DefaultInputWrap>
            {formState.errors.name && (
              <p className="body1 text-secondary">内容が空です。</p>
            )}
            <div className="mt-14px mb-24px flex flex-row">
              {(() => {
                if (members.length === 0) {
                  return null;
                }
                const selectedMembers = members.filter((member: any) =>
                  idsForNewGroup.includes(member.id),
                );
                return selectedMembers.length === 0
                  ? null
                  : selectedMembers.map((_) => (
                      <UserIconRemovable
                        {..._}
                        key={`user-select-for-added-group-${_.id}`}
                        avatar={_.avatar ?? DEFAULT_AVATAR_URL}
                        color={
                          _.pivot?.color
                            ? COLOR_VALUES[_.pivot.color].label
                            : COLOR_VALUES[0].label
                        }
                        additionalPositionClass="mr-16px"
                        onDelete={() => {
                          dispatch(
                            setIDsForNewGroup(
                              idsForNewGroup.filter((item) => item !== _.id),
                            ),
                          );
                        }}
                      />
                    ));
              })()}
              {(() => {
                if (guests.length === 0) {
                  return null;
                }
                const selectedGuests = guests.filter((member: any) =>
                  idsForNewGroup.includes(member.id),
                );
                return selectedGuests.length === 0
                  ? null
                  : selectedGuests.map((_) => (
                      <UserIconRemovable
                        {..._}
                        key={`user-select-for-added-group-${_.id}`}
                        avatar={_.avatar ?? DEFAULT_AVATAR_URL}
                        color={
                          _.pivot?.color
                            ? COLOR_VALUES[_.pivot.color].label
                            : COLOR_VALUES[0].label
                        }
                        additionalPositionClass="mr-16px"
                        onDelete={() => {
                          dispatch(
                            setIDsForNewGroup(
                              idsForNewGroup.filter((item) => item !== _.id),
                            ),
                          );
                        }}
                      />
                    ));
              })()}
            </div>
          </div>
          <div className="flex flex-row justify-between items-center">
            <span
              className="button text-primary cursor-pointer"
              onClick={() => {
                close();
                dispatch(setGroupUserSelectModal(true));
              }}
            >
              戻る
            </span>
            <div className="py-12px flex flex-row items-center">
              <span
                onClick={close}
                className="button text-fontSecondary cursor-pointer"
              >
                キャンセル
              </span>
              <button
                className="ml-24px px-24px h-44px rounded-8px bg-primary button text-backgroundSecondary disabled:opacity-40"
                type="submit"
                disabled={idsForNewGroup.length === 0 || mutation.isLoading}
              >
                追加
              </button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ModalAddGroup;
