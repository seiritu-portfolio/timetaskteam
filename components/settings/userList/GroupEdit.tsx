import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
// api
import { userlistSettingGroupIDSelector } from '@store/selectors/home';
// view
import SettingsHeader from '@component/settings/SettingsHeader';
import ModalGroupMemberSelect from '@component/settings/userList/group/ModalGroupMemberSelect';
import { DefaultInputWrap } from '@component/general/input';
import {
  GroupAddUser,
  GroupUserRemovable,
} from '@component/settings/userList/parts/GroupUserAddRemove';
import { setUserlistSettingMode } from '@store/modules/home';
import { FooterSaveCancel } from '@component/settings/SettingsFooter';
import CircledCloseIcon from '@svg/multiply-circle-fill-small.svg';
// constants and others
import {
  COLOR_VALUES,
  configBearerToken,
  USERLIST_STATES,
} from '@util/constants';
import { URL_GROUP } from '@util/urls';
import axiosConfig from '@util/axiosConfig';
import {
  groupsSelector,
  guestsSelector,
  membersSelector,
} from '@store/selectors/collabos';

/**
 * * should fetch all cooperators
 * * only use current group cooperators info as initial state
 */

const GroupEdit = () => {
  const dispatch = useDispatch();

  const id = useSelector(userlistSettingGroupIDSelector);
  const [userIdArray, setUserIdArray] = useState<number[]>([]);

  const members = useSelector(membersSelector);
  const guests = useSelector(guestsSelector);
  const groups = useSelector(groupsSelector);
  const allCooperators = useMemo(
    () => [...members, ...guests],
    [members, guests],
  );

  const [inputReset, setInputReset] = useState(false);
  const {
    register,
    reset,
    setValue,
    getValues,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: { name: '' },
  });
  const { ref, name, onChange, onBlur } = register('name', { required: true });
  const currentGroupDetail: any = useMemo(() => {
    if (groups.length > 0) {
      const groupID = parseInt(Array.isArray(id) ? id[0] : id ? id : '-1');
      const groupsFiltered = groups.filter((_) => _.id == groupID);
      if (groupsFiltered.length > 0) {
        const currentGroup = groupsFiltered[0];
        setValue('name', currentGroup.name);
        setInputReset(currentGroup.name !== '');
        setUserIdArray(
          currentGroup.users.length > 0
            ? currentGroup.users.map((_) => _.id)
            : [],
        );
        return currentGroup;
      }
    }
    setUserIdArray([]);
    return null;
  }, [groups, id, setValue]);
  const [isGroupAddSelectModal, setIsGroupAddSelectModal] = useState(false);

  const onRemove = (id: number) => {
    if (userIdArray.includes(id)) {
      setUserIdArray(userIdArray.filter((_: number) => _ !== id));
    }
  };

  const queryClient = useQueryClient();
  const mutation = useMutation(
    (data: any) => {
      const token = localStorage.getItem('task3_token');
      const config = configBearerToken(token ?? '');

      return axiosConfig.put(URL_GROUP + '/' + id, data, config);
    },
    {
      onSuccess: async () => {
        toast.success('更新に成功しました', {
          hideProgressBar: true,
          progress: undefined,
          onOpen: () => {
            queryClient.invalidateQueries('');
            // ! should handle refresh react queries related group fetching
          },
        });
      },
      onError: async (error: any) => {
        // @ts-ignore
        toast.error('更新失敗', {
          hideProgressBar: true,
          progress: undefined,
        });
      },
    },
  );

  const onSubmit = handleSubmit((_) => {
    if (mutation.isLoading) {
      return false;
    }

    const submitData = {
      id: parseInt(Array.isArray(id) ? id[0] : id ? id : '-1'),
      name: _.name,
      coop_user_ids: userIdArray,
    };

    return mutation.mutate(submitData);
  });

  return (
    <div className="relative h-screen flex flex-col">
      <SettingsHeader
        title={
          currentGroupDetail
            ? currentGroupDetail.name
            : '選択したものには名前がありません｡'
        }
        hasSearch={false}
        onBack={() => {
          dispatch(setUserlistSettingMode(USERLIST_STATES.GENERAL_MODE));
        }}
      />
      <div className="pt-12px px-24px flex-1 flex flex-col justify-between">
        <div className="">
          <div className="py-12px w-full">
            <span className="body1 text-fontPrimary">グループ名</span>
            <DefaultInputWrap additionalPositionClass="my-12px">
              <input
                name={name}
                ref={(e) => ref(e)}
                onChange={(e) => {
                  onChange(e);
                  if (e.target.value !== '') {
                    setInputReset(true);
                  } else {
                    setInputReset(false);
                  }
                }}
                onBlur={onBlur}
                type="text"
                className="w-full button text-fontPrimary focus:outline-none bg-backgroundPrimary"
              />
              {inputReset ? (
                <CircledCloseIcon
                  width="20"
                  height="20"
                  className="text-fontSecondary"
                  onClick={() => {
                    reset();
                    setInputReset(false);
                  }}
                />
              ) : null}
            </DefaultInputWrap>
            {errors.name && (
              <p className="mt-8px body1 text-secondary">
                グループ名を入力してください
              </p>
            )}
          </div>
          <div className="py-12px flex flex-row">
            <GroupAddUser
              styleClass=""
              onClick={() => {
                setIsGroupAddSelectModal(true);
              }}
            />
            {allCooperators.length > 0
              ? allCooperators
                  .filter((_: any) => userIdArray.includes(_.id))
                  .map((_: any, index: number) => (
                    <GroupUserRemovable
                      name={_.name}
                      color={COLOR_VALUES[_.pivot.color].label}
                      styleClass="ml-24px"
                      imgSrc={_.avatar}
                      onClick={() => onRemove(_.id)}
                      key={`group-cooperator-candidator-${index}`}
                    />
                  ))
              : null}
          </div>
        </div>
      </div>
      <FooterSaveCancel
        onSave={onSubmit}
        onCancel={() => {}}
        disabled={(() => {
          if (mutation.isLoading) return false;
          const currentUserIDArray =
            currentGroupDetail.users.length > 0
              ? currentGroupDetail.users.map((_: any) => _.id)
              : [];
          return (
            currentGroupDetail.name == getValues('name') &&
            currentUserIDArray.toString() == userIdArray.toString()
          );
        })()}
      />
      <ModalGroupMemberSelect
        isOpen={isGroupAddSelectModal}
        close={() => setIsGroupAddSelectModal(false)}
        selectedUsersIDs={userIdArray}
        confirmBtnText="完了"
        onConfirm={(idsToAdd: number[]) => {
          setUserIdArray([...userIdArray, ...idsToAdd]);
          setIsGroupAddSelectModal(false);
        }}
      />
    </div>
  );
};

export default GroupEdit;
