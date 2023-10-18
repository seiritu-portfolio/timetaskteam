import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Select, { components } from 'react-select';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import Modal from 'react-responsive-modal';
import { useDispatch, useSelector } from 'react-redux';
// * hooks
import { userInfoSelector } from '@store/selectors/user';
import { useUserByUUID } from '@service/userQueries';
import { setGroupUserSelectModal } from '@store/modules/home';
import {
  groupsSelector,
  guestsSelector,
  membersSelector,
} from '@store/selectors/collabos';
import { useNotifyCreate } from '@service/notificationQueries';
import { useUserAdd } from '@service/userMutation';
// * components
import { DefaultInputWrap } from '@component/general/input';
import GroupUsersIconList from '@component/settings/userList/parts/GroupUsersIconList';
import { CollaboAvatar, ColorSelect, RoleSelect } from './parts';
import { Loading01 } from '@component/general/loading';
import ModalLimitCount from '@component/list/ModalLimitCount';
// * assets & constants
import CircledCloseIcon from '@svg/multiply-circle-fill-small.svg';
import DownTriangleIcon from '@svg/triangle-small.svg';
import { GROUP_MENULIST } from '@util/selectComponents';
import {
  COLLABOS_LIMIT_COUNT,
  COLOR_VALUES,
  NOTIFY_TYPES,
} from '@util/constants';
import ModalDefaultProps from '@model/modal';
import { groupsSelectStyle } from '@util/selectConfig';
import {
  MEMBER_TYPE_OPTIONS,
  GROUP_DEFAULT_OPTIONS,
} from '@util/selectOptions';

const ModalAddUser = ({ isOpen, close }: ModalDefaultProps) => {
  const [inputNameReset, setInputNameReset] = useState(false);
  const [uuid, setUuid] = useState('');
  const myInfo = useSelector(userInfoSelector);
  const groups = useSelector(groupsSelector);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  const userToAdd = useUserByUUID(uuid);
  const [groupIDs, setGroupIDs] = useState<number[]>([]);
  const [role, setRole] = useState<number>();
  const [color, setColor] = useState<number>(0);
  const [avatar, setAvatar] = useState<string>();

  useEffect(() => {
    if (userToAdd.isSuccess) {
      setAvatar(userToAdd.data.data.avatar);
      setValue('coop_user_id', userToAdd.data.data.id);
      const newRole = userToAdd.data?.data.pivot
        ? MEMBER_TYPE_OPTIONS[userToAdd.data.data.pivot.role - 1].value ==
          'member'
          ? 1
          : 2
        : undefined;
      setRole(newRole);
      setValue('roleVal', newRole);
      setColor(userToAdd.data?.data.pivot?.color ?? 0);
      setGroupIDs([]);
    } else {
      setValue('coop_user_id', undefined);
      setAvatar(undefined);
    }
  }, [userToAdd.isSuccess, userToAdd.data, setValue]);

  const queryClient = useQueryClient();
  const mutation = useUserAdd((now: Date) => {
    queryClient.invalidateQueries('cooperate');
    notifyFunction(now);
    close();
  });
  const notifyMutation = useNotifyCreate();
  const notifyFunction = useCallback(
    (now: Date) => {
      if (
        !mutation.isLoading &&
        !notifyMutation.isLoading &&
        userToAdd.isSuccess
      ) {
        const receiver_id = userToAdd.data?.data.id;

        notifyMutation.mutate({
          receiver_id: receiver_id,
          sender_id: myInfo?.user?.id,
          target_id: receiver_id,
          title: userToAdd.data?.data.name,
          content: JSON.stringify({
            avatar: myInfo?.user?.avatar ?? '',
            name: myInfo?.user?.name ?? '',
            time: now.toISOString(),
          }),
          type: NOTIFY_TYPES.ADD_USER_REQUEST,
        });
      }
    },
    [
      mutation.isLoading,
      notifyMutation,
      myInfo?.user,
      userToAdd.data,
      userToAdd.isSuccess,
    ],
  );

  const onSubmit = handleSubmit((_: any) => {
    if (mutation.isLoading) {
      return false;
    }
    const groups = groupIDs.length === 1 && groupIDs[0] === -1 ? [] : groupIDs;
    const data = { ..._, role, color, group_ids: groups };

    return mutation.mutate(data);
  });

  const dispatch = useDispatch();
  const [isGroupsMenuOpen, setIsGroupsMenuOpen] = useState(false);
  const uuidInputRef = useRef<HTMLInputElement | null>(null);
  const windowRef = useRef<Window | null>();
  useEffect(() => {
    if (windowRef && typeof window !== undefined) {
      windowRef.current = window;
    }
  }, [windowRef]);

  const members = useSelector(membersSelector);
  const guests = useSelector(guestsSelector);
  const isCountFull = useMemo(() => {
    if (myInfo?.user?.premium_code && myInfo?.user?.premium_code !== '') {
      return false;
    }
    return members.length + guests.length >= COLLABOS_LIMIT_COUNT;
  }, [myInfo, members, guests]);

  return (
    <>
      <Modal
        open={isOpen && !isCountFull}
        onClose={() => {
          reset();
          close();
        }}
        center
        showCloseIcon={false}
        classNames={{
          modal: 'modal-md-size',
        }}
        onOverlayClick={close}
      >
        <div className="relative p-36px flex flex-col">
          <form onSubmit={onSubmit}>
            <Loading01
              loading={userToAdd.isLoading || mutation.isLoading}
              additionalClass="z-50"
            />
            <div className="big-title text-fontPrimary">ユーザー追加</div>
            <DefaultInputWrap additionalPositionClass="mt-24px">
              <input
                ref={uuidInputRef}
                type="text"
                onChange={(e) => {
                  if (e.target.value !== '') {
                    setInputNameReset(true);
                  } else {
                    setInputNameReset(false);
                  }
                  // setErrors({ ...initUserAdd });
                }}
                onKeyPress={(event) => {
                  const curElem = event.target as HTMLInputElement;
                  const curVal = curElem.value;
                  if (
                    event.key === 'Enter' &&
                    // curVal !== '' &&
                    curVal !== myInfo?.user?.uuid
                  ) {
                    setUuid(curVal);
                  }
                }}
                onBlur={(event) => {
                  const curElem = event.target as HTMLInputElement;
                  const curVal = curElem.value;
                  if (curVal !== myInfo?.user?.uuid) setUuid(curVal);
                }}
                placeholder="追加するユーザーIDまたはメールアドレス"
                className="w-full button text-fontPrimary focus:outline-none bg-backgroundPrimary"
              />
              {inputNameReset ? (
                <CircledCloseIcon
                  width="20"
                  height="20"
                  className="text-fontSecondary"
                  onClick={() => {
                    if (uuidInputRef.current) {
                      uuidInputRef.current.value = '';
                    }
                    setUuid('');
                    setInputNameReset(false);
                  }}
                />
              ) : null}
            </DefaultInputWrap>
            {userToAdd.status === 'error' && (
              <p className="mt-8px body1 text-secondary">
                {
                  // @ts-ignore
                  userToAdd?.error.response
                    ? 'ユーザが存在しません。'
                    : '接続エラー'
                }
              </p>
            )}
            {userToAdd.status === 'success' && userToAdd.data.data.pivot && (
              <p
                className={`mt-8px body1 ${
                  userToAdd.data.data.pivot.status === 1
                    ? 'text-green'
                    : userToAdd.data.data.pivot.status === 3
                    ? 'text-tertiary'
                    : 'text-secondary'
                }`}
              >
                {userToAdd.data.data.pivot.status === 1
                  ? 'リクエストが承諾されました。'
                  : userToAdd.data.data.pivot.status === 3
                  ? 'リクエストが承認待ちです。'
                  : 'リクエストが拒否された。'}
              </p>
            )}
            <CollaboAvatar
              imgSrc={avatar ?? myInfo.user?.avatar}
              color={
                color
                  ? COLOR_VALUES[color].label
                  : userToAdd?.data?.data?.pivot?.color
                  ? COLOR_VALUES[userToAdd.data.data.pivot.color].label
                  : undefined
              }
              name={
                userToAdd.status === 'success'
                  ? userToAdd.data?.data.name
                  : myInfo.user?.name
              }
              uuid={
                userToAdd.status !== 'success' || uuid === ''
                  ? myInfo.user?.uuid
                  : undefined
              }
            />
            {uuid !== '' && userToAdd.status === 'success' && (
              <>
                <input
                  type="hidden"
                  {...register('coop_user_id', { required: true })}
                />
                <div className="mt-48px w-full">
                  <RoleSelect
                    value={role}
                    disabled={
                      userToAdd.status === 'success' &&
                      userToAdd.data.data.pivot &&
                      userToAdd.data.data.pivot.status !== 2
                    }
                    onChange={(newValue: number) => {
                      setRole(newValue);
                      setValue('roleVal', newValue);
                    }}
                  />
                  <input
                    type="hidden"
                    {...register('roleVal', { required: true })}
                    defaultValue={
                      userToAdd.status === 'success' &&
                      userToAdd.data.data.pivot
                        ? userToAdd.data.data.pivot.role
                        : undefined
                    }
                  />
                  {errors.roleVal && (
                    <p className="mt-8px ml-4px body1 text-secondary">
                      内容が空です。
                    </p>
                  )}
                </div>
                <div className="mt-24px w-full">
                  <Select
                    menuIsOpen={isGroupsMenuOpen}
                    onMenuOpen={() => setIsGroupsMenuOpen(true)}
                    onMenuClose={() => setIsGroupsMenuOpen(false)}
                    openMenuOnClick={true}
                    isMulti={true}
                    isSearchable={false}
                    styles={{
                      ...groupsSelectStyle,
                      clearIndicator: (provided) => ({
                        ...provided,
                        marginRight: '8px',
                      }),
                      menuList: (provided) => ({
                        ...provided,
                        maxHeight: '300px',
                      }),
                      menuPortal: (base: any) => ({ ...base, zIndex: 10001 }),
                      multiValue: (provided) => ({
                        ...provided,
                        background: 'none',
                      }),
                    }}
                    value={(() => {
                      if (groupIDs.length === 0) {
                        return [];
                      } else if (groupIDs.length === 1 && groupIDs[0] === -1) {
                        return GROUP_DEFAULT_OPTIONS;
                      } else {
                        const selectedGroups = groups.filter((group: any) =>
                          groupIDs.includes(group.id),
                        );
                        return selectedGroups.length === 0
                          ? []
                          : selectedGroups.map((_) => ({
                              label: _.name,
                              value: _.id.toString(),
                              collabUsers: _.users,
                            }));
                      }
                    })()}
                    menuPortalTarget={(() => {
                      if (windowRef.current) {
                        return windowRef.current.document.body;
                      }
                      return undefined;
                    })()}
                    isDisabled={
                      userToAdd.status === 'success' &&
                      userToAdd.data.data.pivot &&
                      userToAdd.data.data.pivot.status !== 2
                    }
                    onChange={(e) => {
                      if (e && Array.isArray(e) && e.length > 0) {
                        const values = e.map((_) => parseInt(_.value));
                        if (values.includes(-1)) {
                          setIsGroupsMenuOpen(false);
                          setGroupIDs([-1]);
                          setValue('groups', -1);
                        } else {
                          setGroupIDs(values);
                          setValue('groups', values[0]);
                        }
                      } else {
                        setGroupIDs([]);
                        setValue('groups', undefined);
                      }
                    }}
                    options={(() => {
                      const groupOptions =
                        groups.length > 0
                          ? groups.map((_) => ({
                              label: _.name,
                              value: _.id.toString(),
                              collabUsers: _.users,
                            }))
                          : [];

                      return [...GROUP_DEFAULT_OPTIONS, ...groupOptions];
                    })()}
                    placeholder={
                      <span className="body1 text-fontSecondary">
                        所属グループ
                      </span>
                    }
                    components={{
                      NoOptionsMessage: () => (
                        <div className="px-24px py-12px">
                          オプションはありません
                        </div>
                      ),
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
                      MenuList: (props) => (
                        <GROUP_MENULIST
                          {...props}
                          onClose={() => {
                            setIsGroupsMenuOpen(false);
                          }}
                          onAddGroup={() => {
                            setIsGroupsMenuOpen(false);
                            dispatch(setGroupUserSelectModal(true));
                          }}
                        />
                      ),
                      MultiValueContainer: (props) => {
                        return (
                          <div className={props.innerProps.className}>
                            {props.data.label}
                          </div>
                        );
                      },
                      Option: (props) => {
                        const selectedGroups = getValues('group_ids');
                        let disabled = selectedGroups
                          ? selectedGroups.length === 0
                          : false;
                        if (props.data.value === '-1') {
                          disabled =
                            !disabled &&
                            selectedGroups &&
                            selectedGroups.length > 0;
                        }
                        // @ts-ignore
                        const groupUsers = props.data.collabUsers;
                        // @ts-ignore
                        return !props.isDisabled ? (
                          <div
                            {...props.innerProps}
                            onClick={(e) => {
                              if (disabled) {
                              } else if (props.innerProps.onClick) {
                                props.innerProps.onClick(e);
                              }
                            }}
                            className={`mx-12px p-12px rounded-8px flex-row--between cursor-pointer ${
                              disabled
                                ? 'text-fontSecondary hover:bg-backgroundPrimary'
                                : 'text-fontPrimary hover:bg-primarySelected hover:text-primary'
                            }`}
                          >
                            <span className="">{props.data.label}</span>
                            <div className="flex flex-row">
                              <GroupUsersIconList
                                users={groupUsers}
                                groupId={parseInt(props.data.value)}
                              />
                            </div>
                          </div>
                        ) : null;
                      },
                      Control: (props) => {
                        return (
                          <components.Control {...props}>
                            <div
                              className="w-full h-full flex-xy-center"
                              onClick={() => {
                                setIsGroupsMenuOpen(!isGroupsMenuOpen);
                              }}
                            >
                              {props.children}
                            </div>
                          </components.Control>
                        );
                      },
                    }}
                  />
                  <input
                    type="hidden"
                    {...register('groups', { required: true })}
                  />
                  {errors.groups && (
                    <p className="mt-8px ml-4px body1 text-secondary">
                      内容が空です。
                    </p>
                  )}
                </div>
                <div className="mt-24px w-full">
                  <ColorSelect
                    value={color}
                    disabled={
                      userToAdd.status === 'success' &&
                      userToAdd.data.data.pivot &&
                      userToAdd.data.data.pivot.status !== 2
                    }
                    onChange={(newValue: number) => {
                      setColor(newValue);
                    }}
                  />
                </div>
              </>
            )}
            <div className="mt-36px flex flex-row items-center justify-end">
              <span
                onClick={() => {
                  close();
                  setUuid('');
                }}
                className="button text-fontSecondary cursor-pointer"
              >
                キャンセル
              </span>
              <button
                className="ml-24px px-24px h-44px rounded-8px bg-primary button text-backgroundSecondary disabled:opacity-40"
                type="submit"
                disabled={
                  uuid === '' ||
                  userToAdd.status !== 'success' ||
                  (userToAdd.data.data.pivot &&
                    userToAdd.data.data.pivot.status !== 2) ||
                  mutation.isLoading
                }
              >
                追加申請
              </button>
            </div>
          </form>
        </div>
      </Modal>
      <ModalLimitCount
        isOpen={isOpen && isCountFull == true}
        close={close}
        isUserLimited={true}
      />
    </>
  );
};

export default ModalAddUser;
