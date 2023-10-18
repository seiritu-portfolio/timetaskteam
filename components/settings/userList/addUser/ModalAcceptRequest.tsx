import { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMutation, useQueryClient } from 'react-query';
import Select, { components } from 'react-select';
import Modal from 'react-responsive-modal';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import DownTriangleIcon from '@svg/triangle-small.svg';
import defaultSelectStyles from '@util/selectConfig';
import ModalDefaultProps from '@model/modal';

import { requestersSelector } from '@store/selectors/collabos';
import AvatarImage from '@component/general/avatar';
import { COLOR_VALUES, configBearerToken } from '@util/constants';
import { MEMBER_TYPE_OPTIONS } from '@util/selectOptions';
import axiosConfig from '@util/axiosConfig';
import { URL_REQUESTER_ACCEPT } from '@util/urls';
import { GroupSelect } from '@component/home/Selects';

interface ModalAcceptRequestProps extends ModalDefaultProps {
  userID: number;
}

const ModalAcceptRequest = ({
  isOpen,
  close,
  userID,
}: ModalAcceptRequestProps) => {
  const requesters = useSelector(requestersSelector);
  const currentUser = useMemo(() => {
    if (requesters) {
      const filtered = requesters.filter((_: any) => _.id === userID);

      return filtered.length > 0 ? filtered[0] : null;
    }
    return null;
  }, [requesters, userID]);
  const [role, setRole] = useState(1);
  const [color, setColor] = useState(0);
  const [groupIDs, setGroupIDs] = useState<number[]>([]);

  const {
    register,
    setValue,
    formState: { errors },
  } = useForm();

  const queryClient = useQueryClient();
  const mutation = useMutation(
    () => {
      const token = localStorage.getItem('task3_token');
      const config = configBearerToken(token ?? '');
      const groups =
        groupIDs.length === 1 && groupIDs[0] === -1 ? [] : groupIDs;

      return axiosConfig.put(
        URL_REQUESTER_ACCEPT.replace(/\%s/g, userID.toString()),
        { role, color, group_ids: groups },
        config,
      );
    },
    {
      onSuccess: async () => {
        queryClient.invalidateQueries('requesters');
        queryClient.invalidateQueries('cooperate');
        toast.success('成功', {
          hideProgressBar: false,
          progress: undefined,
          onOpen: () => {
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
  const windowRef = useRef<Window | null>();
  useEffect(() => {
    if (windowRef && typeof window !== undefined) {
      windowRef.current = window;
    }
  }, [windowRef]);
  useEffect(() => {
    if (currentUser?.pivot?.color) {
      setColor(currentUser.pivot.color);
    }
    if (currentUser?.pivot?.role) {
      setRole(currentUser.pivot.role);
    }
  }, [currentUser]);

  return (
    <Modal
      open={isOpen}
      onClose={close}
      center
      showCloseIcon={false}
      classNames={{
        modal: 'modal-md-size',
      }}
      onOverlayClick={close}
    >
      <div className="p-36px flex flex-col">
        <div className="big-title text-fontPrimary">追加</div>
        <div className="w-full flex flex-col items-center justify-center">
          <AvatarImage
            imgSrc={currentUser?.avatar ?? ''}
            styleClass="mt-48px"
            color={
              currentUser?.pivot?.color
                ? COLOR_VALUES[currentUser.pivot.color].label
                : 'pink'
            }
          />
          <span className="mt-8px body1 text-fontPrimary">
            {currentUser?.name ?? ''}
          </span>
          <div className="mt-48px w-full">
            <Select
              isMulti={false}
              value={MEMBER_TYPE_OPTIONS[role - 1]}
              onChange={(newValue: any) => {
                setRole(newValue.value == 'member' ? 1 : 2);
              }}
              styles={{
                ...defaultSelectStyles,
                menuPortal: (base: any) => ({ ...base, zIndex: 10001 }),
              }}
              menuPortalTarget={(() => {
                if (windowRef.current) {
                  return windowRef.current.document.body;
                }
                return undefined;
              })()}
              isSearchable={false}
              options={MEMBER_TYPE_OPTIONS}
              placeholder={
                <span className="body1 text-fontSecondary">ユーザー属性</span>
              }
              components={{
                DropdownIndicator: ({ innerProps, isDisabled }) =>
                  !isDisabled ? (
                    <DownTriangleIcon
                      {...innerProps}
                      width={20}
                      height={20}
                      className="absolute mr-16px top-12px right-0 text-fontSecondary"
                    />
                  ) : null,
                IndicatorSeparator: () => null,
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
            <Select
              styles={{
                ...defaultSelectStyles,
                menuPortal: (base: any) => ({ ...base, zIndex: 10001 }),
              }}
              value={COLOR_VALUES[color]}
              onChange={(newValue: any) => {
                setColor(parseInt(newValue.value));
              }}
              isSearchable={false}
              options={COLOR_VALUES}
              placeholder={
                <span className="body1 text-fontSecondary">カラー</span>
              }
              menuPortalTarget={(() => {
                if (windowRef.current) {
                  return windowRef.current.document.body;
                }
                return undefined;
              })()}
              isMulti={false}
              components={{
                DropdownIndicator: ({ innerProps, isDisabled }) =>
                  !isDisabled ? (
                    <DownTriangleIcon
                      {...innerProps}
                      width={20}
                      height={20}
                      className="absolute mr-16px top-12px right-0 text-fontSecondary"
                    />
                  ) : null,
                IndicatorSeparator: () => null,
                Option: (props) => {
                  const colorName = props.children;

                  return !props.isDisabled ? (
                    <div
                      {...props.innerProps}
                      className="mx-12px px-12px py-8px rounded-sm flex-row--between hover:bg-primarySelected hover:text-primary"
                    >
                      <div
                        className={`h-20px w-20px rounded-full bg-${colorName}`}
                      />
                    </div>
                  ) : null;
                },
                SingleValue: (props) => {
                  return (
                    <components.SingleValue {...props}>
                      <div
                        className={`h-20px w-20px rounded-full bg-${
                          // @ts-ignore
                          props.selectProps.getOptionLabel(props.data)
                        }`}
                      />
                    </components.SingleValue>
                  );
                },
              }}
            />
          </div>
          <div className="mt-36px h-44px w-full flex flex-row justify-end">
            <span
              className="p-12px button1 text-fontSecondary cursor-pointer"
              onClick={close}
            >
              キャンセル
            </span>
            <button
              className="px-24px py-12px rounded-8px bg-primary button1 text-backgroundSecondary disabled:opacity-40"
              disabled={mutation.isLoading || !currentUser}
              onClick={() => {
                mutation.mutate();
              }}
            >
              完了
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalAcceptRequest;
