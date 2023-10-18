import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import {
  currentListIDSelector,
  scheduleListsSelector,
  taskListsSelector,
} from '@store/selectors/list';
import {
  groupsSelector,
  guestsSelector,
  membersSelector,
} from '@store/selectors/collabos';
import { userInfoSelector } from '@store/selectors/user';
import NameInput from './parts/NameInput';
import IconSelect from './parts/IconSelect';
import ColorSelect from './parts/ColorSelect';
import OccupancySelect from './parts/OccupancySelect';
import PublicSelect from './parts/PublicSelect';
import PublicUserSelect from './parts/PublicUserSelect';
import ModalSelUserForList from './ModalSelUserForList';
import TrayIcon from '@svg/tray.svg';
import FooterBar from './parts/FooterBar';
import FileMenuSelectIcon from '@svg/filemenu-and-cursorarrow.svg';
import axiosConfig from '@util/axiosConfig';
import { COLOR_VALUES, configBearerToken } from '@util/constants';
import { DEFAULT_AVATAR_URL, URL_LIST_OPERATION } from '@util/urls';
import { ListType } from '@model/state';
import AvatarImage from '@component/general/avatar';

const ListEdit = () => {
  const currentListID = useSelector(currentListIDSelector);
  const tasksList = useSelector(taskListsSelector);
  const schedulesList = useSelector(scheduleListsSelector);
  const members = useSelector(membersSelector);
  const guests = useSelector(guestsSelector);
  const groups = useSelector(groupsSelector);
  const myInfo = useSelector(userInfoSelector);

  const [init, setInit] = useState(0);
  const currentListInfo: ListType | null = useMemo(() => {
    const allList = [...tasksList, ...schedulesList];
    if (allList.length === 0) return null;
    const filtered = allList.filter((list: any) => list.id === currentListID);

    return filtered.length > 0 ? filtered[0] : null;
  }, [currentListID, tasksList, schedulesList]);
  const isTaskInbox = useMemo(() => {
    if (currentListID && myInfo.user) {
      return myInfo.user.task_inbox_id === currentListID;
    }
    return false;
  }, [currentListID, myInfo]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [color, setColor] = useState(0);
  const [icon, setIcon] = useState<number | null>(null);
  const [reflectOccupancy, setReflectOccupancy] = useState<number | null>(null);
  const [isPublic, setIsPublic] = useState<number | null>(null);

  const [isModalSelectUser, setIsModalSelectUser] = useState(false);
  const [groupIDSelected, setGroupIDSelected] = useState<number>();
  const [publicUsers, setPublicUsers] = useState<Array<any>>([]);
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

  const queryClient = useQueryClient();
  const mutation = useMutation(
    (data: any) => {
      const token = localStorage.getItem('task3_token');
      const config = configBearerToken(token ?? '');

      return axiosConfig.put(
        URL_LIST_OPERATION.replace(/\%s/g, currentListID.toString()),
        data,
        config,
      );
    },
    {
      onSuccess: async () => {
        queryClient.invalidateQueries('list');
        toast.success('成功', {
          hideProgressBar: false,
          progress: undefined,
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
  const [isOperating, setIsOperating] = useState(false);
  useEffect(() => {
    if (mutation.isLoading) {
      setIsOperating(true);
    } else {
      setIsOperating(false);
    }
  }, [mutation.isLoading]);

  const onSubmit = handleSubmit((data) => {
    if (isOperating) {
      return false;
    }

    const submitData: any = {
      id: currentListInfo?.id ?? 0,
      name: data.name,
      type: currentListInfo?.type ?? 1,
      icon,
      color,
      occupancy_rate_visible: reflectOccupancy,
      status: isPublic,
      cooperator_ids: publicUsers.includes(-1)
        ? []
        : publicUsers.map((item: any) => item.id),
      // cooperator_type: null,
    };
    if (groupIDSelected != undefined && groupIDSelected !== -1) {
      submitData.cooperator_group_id = groupIDSelected;
    }

    return mutation.mutate(submitData);
  });

  useEffect(() => {
    if (currentListInfo && setValue) {
      setValue('name', currentListInfo.name);
      // icon
      setIcon(currentListInfo.icon);
      // color
      setColor(currentListInfo.color);
      // reflect occupancy rate
      setReflectOccupancy(currentListInfo.occupancy_rate_visible ?? null);
      // public state
      setIsPublic(currentListInfo.status);
      // public users
      const cooperator_ids =
        currentListInfo.cooperators.length > 0
          ? currentListInfo.cooperators.map((_) => _.id)
          : [];
      const cooperators = [...members, ...guests].filter((user) =>
        cooperator_ids.includes(user.id),
      );
      setPublicUsers(cooperators);
      setGroupIDSelected(currentListInfo.cooperator_group_id);

      if (currentListInfo.type === 2) {
        setIcon(0);
        setReflectOccupancy(0);
        setValue('occupancyValidate', 0);
      }
    }
  }, [currentListInfo, init, setValue, members, guests]);
  useEffect(() => {
    if (isPublic) {
      setValue('publicUsers', null);
    } else {
      setValue('publicUsers', [-1]);
      setPublicUsers([]);
    }
  }, [isPublic, setValue]);

  const writerInfo = useMemo(() => {
    const cooperators = currentListInfo?.cooperators ?? [];
    const filtered = cooperators.filter((item) => item.pivot?.role === 1);

    return filtered.length > 0 ? filtered[0] : undefined;
  }, [currentListInfo]);

  return currentListInfo ? (
    <div className="h-full w-660px flex flex-col">
      <div className="flex-none h-72px w-full border-b border-separator flex-row--between">
        <h3 className="ml-24px">{currentListInfo?.name ?? ''}</h3>
      </div>
      <div className="flex-1 mt-12px w-full h-full overflow-y-auto">
        <form
          onSubmit={onSubmit}
          className="h-full flex flex-col justify-between"
        >
          <div className="px-24px flex-1">
            {writerInfo ? (
              <div className="body1 text-fontPrimary flex flex-col">
                <span className="w-20">作成者</span>
                <span className="mt-6px flex flex-row items-center">
                  <AvatarImage
                    imgSrc={writerInfo.avatar ?? DEFAULT_AVATAR_URL}
                    color={COLOR_VALUES[writerInfo?.color ?? 0].label}
                    styleClass=""
                  />
                  <span className="ml-2">{writerInfo?.name}</span>
                </span>
              </div>
            ) : null}
            <div className="mt-12px body1 text-fontPrimary">リスト名</div>
            <NameInput
              register={register}
              defaultValue={currentListInfo?.name}
              changeValue={(newValue) => {
                setValue('name', newValue);
              }}
              reset={() => setValue('name', '')}
              hasError={errors.name != null}
              additionalClass="mt-12px"
            />
            <HeaderCustom
              text="アイコン"
              isHidden={currentListInfo?.type === 2}
            />
            <div className={currentListInfo?.type === 1 ? 'mt-12px' : 'hidden'}>
              <IconSelect
                value={icon}
                setValue={(newValue) => {
                  setIcon(newValue);
                }}
                changeValue={(newValue: any) => setValue('icon', newValue)}
                register={register}
                hasError={false}
                disabled={isTaskInbox}
                disabledRenderIcon={TrayIcon}
                noValidate={true}
              />
            </div>
            <HeaderCustom
              text="カラー"
              isHidden={currentListInfo?.type === 1}
            />
            <div className={currentListInfo?.type === 2 ? 'mt-12px' : 'hidden'}>
              <ColorSelect color={color} setColor={setColor} />
            </div>
            <HeaderCustom
              text="稼働率への反映"
              isHidden={currentListInfo?.type === 2}
            />
            <div
              className={
                currentListInfo?.type === 1 ? 'mt-12px w-full' : 'hidden'
              }
            >
              <OccupancySelect
                value={reflectOccupancy}
                setValue={setReflectOccupancy}
                register={register}
                hasError={errors.occupancyValidate != null}
                changeValue={(newValue: any) => {
                  setValue('occupancyValidate', newValue);
                }}
                noValidate={true}
              />
            </div>
            <HeaderCustom text="公開設定" isHidden={false} />
            <div className="mt-12px w-full">
              <PublicSelect
                value={isPublic}
                setValue={(newValue: number | null) => setIsPublic(newValue)}
                register={register}
                hasError={errors.isPublicValidate != null}
                changeValue={(newValue: any) => {
                  setValue('isPublicValidate', newValue);
                }}
                noValidate={true}
              />
            </div>
            <HeaderCustom text="公開ユーザー" isHidden={!isPublic} />
            <PublicUserSelect
              register={register}
              additionalClass={isPublic ? 'mt-12px cursor-pointer' : 'hidden'}
              onClick={() => {
                setIsModalSelectUser(true);
              }}
              hasError={errors.publicUsers != null}
              groupIDSelected={groupIDSelected}
              publicUsers={publicUsers}
              onRemovePublicUser={onRemovePublicUser}
            />
          </div>
          <FooterBar
            type={currentListInfo ? currentListInfo.type : 1}
            onCancel={() => {
              setInit((old) => old + 1);
            }}
            className="mt-24px"
            isLoading={isOperating}
            setLoading={setIsOperating}
            isMyList={writerInfo?.id == myInfo.user?.id}
          />
        </form>
      </div>
      <ModalSelUserForList
        isOpen={isModalSelectUser}
        close={() => {
          setIsModalSelectUser(false);
        }}
        memberList={members}
        guestList={guests}
        groupList={groups}
        selectedUserIDs={
          publicUsers.length > 0 ? publicUsers.map((_) => _.id) : []
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
    </div>
  ) : (
    <div className="h-full w-660px flex flex-col">
      <div className="flex-none h-72px w-full border-b border-separator flex-row--between">
        <h3 className="ml-24px">
          {currentListID > -1
            ? 'アーカイブしたリスト'
            : '一つ選択してください。'}
        </h3>
      </div>
      <div className="flex-1 mt-12px w-full h-full text-fontSecondary flex flex-col overflow-y-auto">
        <div className="flex-1 flex flex-col items-center justify-center">
          <FileMenuSelectIcon width={80} height={80} />
          <div className="mt-24px body1">
            リストを選択したら詳細が表示されます。
          </div>
        </div>
        {currentListID > -1 && (
          <FooterBar
            type={1}
            onCancel={() => {}}
            className="mt-24px"
            isLoading={isOperating}
            setLoading={setIsOperating}
            mode={2}
            isMyList={writerInfo?.id == myInfo.user?.id}
          />
        )}
      </div>
    </div>
  );
};

export default ListEdit;

const HeaderCustom = ({
  text,
  isHidden,
}: {
  text: string;
  isHidden: boolean;
}) => {
  return (
    <div
      className={`mt-24px body1 text-fontPrimary ${isHidden ? 'hidden' : ''}`}
    >
      {text}
    </div>
  );
};
