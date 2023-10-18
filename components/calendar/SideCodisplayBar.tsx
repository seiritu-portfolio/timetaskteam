import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { useQueryClient } from 'react-query';
// * hooks
import { membersSelector } from '@store/selectors/collabos';
import { userInfoSelector } from '@store/selectors/user';
import {
  codisplayUsersSelector,
  currentCodisplayUserSelector,
  isSidebarOpenSelector,
} from '@store/selectors/home';
import { setGroups, setGuests, setMembers } from '@store/modules/collabos';
import { useGroups } from '@service/groupQueries';
import {
  setCodisplayFetching,
  setCodisplayUsers,
  setCurrentCodisplayUser,
  toggleSidebar,
} from '@store/modules/home';
import { useCooperatorList } from '@service/userQueries';
import { setShowTaskDetail } from '@store/modules/tasks';
// * components
import ModalAddUser from '@component/settings/userList/addUser/ModalAddUser';
import {
  AvatarImageClickable,
  AvatarImageSelectable,
} from '@component/general/avatar';
import CodisplayRow, { CodisplayRowNoSelect } from './CodisplayRow';
// * assets & constants
import { IconWrap } from '@component/general/wrap';
import HamburgerMenuIcon from '@svg/hamburger-menu-big.svg';
import { COLOR_VALUES } from '@util/constants';
import CoDisplayIcon from '@svg/person-crop-circle-badge-checkmark.svg';
import { CooperateType } from '@model/constants';
import { NOTES_ALL_URL } from '@util/urls';

const SideCodisplayBar = () => {
  const isOpen = useSelector(isSidebarOpenSelector);

  const members = useSelector(membersSelector);
  const myInfo = useSelector(userInfoSelector);

  const membersWithMe = useMemo(() => {
    if (myInfo.user)
      return [
        {
          id: myInfo.user.id,
          name: myInfo.user.name,
          avatar: myInfo.user.avatar,
          pivot: {
            color: 4,
          },
        },
        ...members,
      ];
    else return [];
  }, [members, myInfo.user]);

  const dispatch = useDispatch();
  const router = useRouter();
  const setIsOpen = useCallback(() => dispatch(toggleSidebar()), [dispatch]);

  const allCollabosResult = useCooperatorList('all' as CooperateType);
  useEffect(() => {
    if (allCollabosResult.isSuccess) {
      const data = allCollabosResult.data;
      dispatch(setMembers(data.members ? data.members : []));
      dispatch(setGuests(data.guests ? data.guests : []));
    }
  }, [allCollabosResult.isSuccess, allCollabosResult.data, dispatch]);
  const groupsResult = useGroups();
  useEffect(() => {
    if (groupsResult.isSuccess) {
      dispatch(
        setGroups(
          groupsResult.data.length > 0
            ? groupsResult.data.map((_: any) => ({
                ..._,
                users: _.cooperators,
              }))
            : [],
        ),
      );
    }
  }, [groupsResult.isSuccess, groupsResult.data, dispatch]);

  const [isUserAddModal, setIsUserAddModal] = useState(false);
  const onCodisplayMode = true;
  const codisplayUsers = useSelector(codisplayUsersSelector);
  const currentCodisplayUserID = useSelector(currentCodisplayUserSelector);

  const toggleCodisplay = useCallback(() => {
    if (codisplayUsers.length === membersWithMe.length) {
      if (myInfo.user?.id) dispatch(setCodisplayUsers([myInfo.user.id]));
    } else {
      dispatch(setCodisplayUsers(membersWithMe.map((item) => item.id)));
    }
  }, [dispatch, membersWithMe, codisplayUsers, myInfo]);
  const allSelected = useMemo(() => {
    return codisplayUsers.length === membersWithMe.length;
  }, [codisplayUsers, membersWithMe]);

  const onRowClick = useCallback(
    (id) => () => {
      const newUsersIDs = codisplayUsers.includes(id)
        ? codisplayUsers.filter((userID) => userID !== id)
        : [...codisplayUsers, id];
      if (newUsersIDs.length > 0) dispatch(setCodisplayUsers([...newUsersIDs]));
    },
    [codisplayUsers, dispatch],
  );

  const queryClient = useQueryClient();
  return (
    <div
      className={`relative transition-all ease-in-out delay-400 ${
        isOpen ? 'w-300px px-24px flex-0' : 'w-92px items-center'
      } shrink-0 h-full bg-backgroundPrimary flex flex-col`}
    >
      <div
        onClick={setIsOpen}
        className="mt-24px w-44px h-44px flex-none border-1/2 border-separator rounded-8px bg-backgroundSecondary text-fontPrimary flex-xy-center cursor-pointer hover:bg-primaryHovered hover:text-primary"
      >
        <HamburgerMenuIcon width={24} height={24} className="z-20" />
      </div>
      {isOpen && (
        <>
          <div className="mt-24px py-12px px-30px bg-backgroundSecondary caption2-light text-fontSecondary text-center flex-xy-center">
            同時表示機能はカレンダーでのみ利用可能です。
            既存カラーはユーザーカラーに切り替わります。
          </div>
          <div className="mt-24px flex-1 flex flex-col overflow-y-auto">
            {myInfo.user &&
              myInfo.user.id > 0 &&
              (onCodisplayMode ? (
                <CodisplayRow
                  id={myInfo.user.id}
                  src={myInfo.user?.avatar ?? ''}
                  name={myInfo.user.name}
                  selected={codisplayUsers.includes(myInfo.user.id)}
                  color="primary"
                  onClick={onRowClick(myInfo.user.id)}
                />
              ) : (
                <CodisplayRowNoSelect
                  id={myInfo.user.id}
                  src={myInfo.user?.avatar ?? ''}
                  name={myInfo.user.name}
                  color="primary"
                />
              ))}
            {members.length > 0 &&
              members.map((_: any) =>
                onCodisplayMode ? (
                  <CodisplayRow
                    id={_.id}
                    src={_.avatar ?? ''}
                    name={_.name}
                    selected={codisplayUsers.includes(_.id)}
                    key={`calendar-codisplay-user-${_.id}-row`}
                    color={COLOR_VALUES[_.pivot.color].label}
                    onClick={onRowClick(_.id)}
                  />
                ) : (
                  <CodisplayRowNoSelect
                    id={_.id}
                    src={_.avatar ?? ''}
                    name={_.name}
                    key={`calendar-user-normal-row-${_.id}`}
                    color={COLOR_VALUES[_.pivot.color].label}
                  />
                ),
              )}
          </div>
        </>
      )}
      {!isOpen && (
        <div className="my-24px h-full w-full flex flex-col justify-start overflow-y-auto overflow-x-hidden items-center">
          {membersWithMe &&
            membersWithMe.map((_: any, index) => {
              return onCodisplayMode ? (
                <AvatarImageSelectable
                  selected={codisplayUsers.includes(_.id)}
                  styleClass="my-12px"
                  imgSrc={_.avatar ?? ''}
                  color={COLOR_VALUES[_.pivot.color].label}
                  tooltip={_.name}
                  disabled={myInfo.user?.id == _.id}
                  onClick={() => {
                    const newUsersIDs = codisplayUsers.includes(_.id)
                      ? codisplayUsers.filter((userID) => userID !== _.id)
                      : [...codisplayUsers, _.id];
                    dispatch(setCodisplayUsers([...newUsersIDs]));
                  }}
                  key={`codisplay-member-collabo-${_.id}-${index}`}
                />
              ) : (
                <AvatarImageClickable
                  styleClass="my-12px"
                  imgSrc={_.avatar ?? ''}
                  color={
                    currentCodisplayUserID == _.id
                      ? 'primary'
                      : COLOR_VALUES[_.pivot.color].label
                  }
                  tooltip={_.name}
                  onClick={() => {
                    dispatch(setCurrentCodisplayUser(_.id));
                    dispatch(setCodisplayFetching(true));
                    dispatch(setShowTaskDetail(false));
                    queryClient.invalidateQueries('tasks');
                    queryClient.invalidateQueries('list');
                    if (router.asPath.split('/')[1] === 'notes') {
                      router.push(NOTES_ALL_URL);
                    }
                  }}
                  hideBorder={currentCodisplayUserID == _.id ? false : true}
                  key={`accepted-member-avatars-collaborate-${_.id}-${index}`}
                />
              );
            })}
        </div>
      )}
      {!isOpen && (
        <IconWrap
          additionalClass={`flex-none mb-8 bottom-0 hover:bg-primaryHovered hover:text-primary ${
            allSelected
              ? 'bg-primary text-backgroundSecondary'
              : 'bg-separator text-fontPrimary'
          } ${router.asPath.split('/')[1] === 'tasks' ? 'hidden' : ''} tooltip`}
          onClick={toggleCodisplay}
        >
          <CoDisplayIcon width={20} height={20} />
          <span className="absolute top-full mt-1 px-2 py-1 w-20 rounded-2px bg-fontSecondary body3 text-backgroundSecondary text-center z-50 tooltiptext">
            同時表示
          </span>
        </IconWrap>
      )}
      {isOpen && (
        <div className="my-24px w-auto py-12px bottom-0 bg-backgroundPrimary body1 text-primary flex-row--between cursor-pointer">
          <div
            className=""
            onClick={() => {
              setIsUserAddModal(true);
            }}
          >
            ユーザー追加
          </div>
          <div
            className={`flex-none bottom-0 hover:bg-primaryHovered hover:text-primary ${
              allSelected
                ? 'bg-primary text-backgroundSecondary'
                : 'bg-separator text-fontPrimary'
            } ${
              router.asPath.split('/')[1] === 'tasks' ? 'hidden' : ''
            } tooltip h-44px w-44px rounded-8px flex-xy-center`}
            onClick={toggleCodisplay}
          >
            <CoDisplayIcon width={20} height={20} />
            <span className="absolute top-full mt-1 px-2 py-1 w-20 rounded-2px bg-fontSecondary body3 text-backgroundSecondary text-center z-50 tooltiptext">
              同時表示
            </span>
          </div>
        </div>
      )}
      <ModalAddUser
        isOpen={isUserAddModal}
        close={() => setIsUserAddModal(false)}
      />
    </div>
  );
};

export default SideCodisplayBar;
export { SideUserSwitchBar };

const SideUserSwitchBar = () => {
  const isOpen = useSelector(isSidebarOpenSelector);

  const members = useSelector(membersSelector);
  const myInfo = useSelector(userInfoSelector);

  const membersWithMe = useMemo(() => {
    if (myInfo.user)
      return [
        {
          id: myInfo.user.id,
          name: myInfo.user.name,
          avatar: myInfo.user.avatar,
          pivot: {
            color: 4,
          },
        },
        ...members,
      ];
    else return [];
  }, [members, myInfo.user]);

  const dispatch = useDispatch();
  const router = useRouter();
  const setIsOpen = useCallback(() => dispatch(toggleSidebar()), [dispatch]);

  const allCollabosResult = useCooperatorList('all' as CooperateType);
  useEffect(() => {
    if (allCollabosResult.isSuccess) {
      const data = allCollabosResult.data;
      dispatch(setMembers(data.members ? data.members : []));
      dispatch(setGuests(data.guests ? data.guests : []));
    }
  }, [allCollabosResult.isSuccess, allCollabosResult.data, dispatch]);
  const groupsResult = useGroups();
  useEffect(() => {
    if (groupsResult.isSuccess) {
      dispatch(
        setGroups(
          groupsResult.data.length > 0
            ? groupsResult.data.map((_: any) => ({
                ..._,
                users: _.cooperators,
              }))
            : [],
        ),
      );
    }
  }, [groupsResult.isSuccess, groupsResult.data, dispatch]);

  const [isUserAddModal, setIsUserAddModal] = useState(false);
  const onCodisplayMode = false;
  const codisplayUsers = useSelector(codisplayUsersSelector);
  const currentCodisplayUserID = useSelector(currentCodisplayUserSelector);

  const toggleCodisplay = useCallback(() => {
    if (codisplayUsers.length === membersWithMe.length) {
      dispatch(setCodisplayUsers([myInfo.user?.id ?? 0]));
    } else {
      dispatch(setCodisplayUsers(membersWithMe.map((item) => item.id)));
    }
  }, [dispatch, membersWithMe, codisplayUsers, myInfo]);
  const allSelected = useMemo(() => {
    return codisplayUsers.length === membersWithMe.length;
  }, [codisplayUsers, membersWithMe]);

  const onRowClick = useCallback(
    (id) => () => {
      const newUsersIDs = codisplayUsers.includes(id)
        ? codisplayUsers.filter((userID) => userID !== id)
        : [...codisplayUsers, id];
      if (newUsersIDs.length > 0) dispatch(setCodisplayUsers([...newUsersIDs]));
    },
    [codisplayUsers, dispatch],
  );

  const queryClient = useQueryClient();
  return (
    <div
      className={`relative transition-all ease-in-out delay-400 ${
        isOpen ? 'w-300px px-24px flex-0' : 'w-92px items-center'
      } shrink-0 h-full bg-backgroundPrimary flex flex-col`}
    >
      <div
        onClick={setIsOpen}
        className="mt-24px w-44px h-44px flex-none border-1/2 border-separator rounded-8px bg-backgroundSecondary text-fontPrimary flex-xy-center cursor-pointer hover:bg-primaryHovered hover:text-primary"
      >
        <HamburgerMenuIcon width={24} height={24} className="z-20" />
      </div>
      {isOpen && (
        <>
          <div className="mt-24px py-12px px-30px bg-backgroundSecondary caption2-light text-fontSecondary text-center flex-xy-center">
            同時表示機能はカレンダーでのみ利用可能です。
            既存カラーはユーザーカラーに切り替わります。
          </div>
          <div className="mt-24px flex-1 flex flex-col overflow-y-auto">
            {myInfo.user &&
              myInfo.user.id > 0 &&
              (onCodisplayMode ? (
                <CodisplayRow
                  id={myInfo.user.id}
                  src={myInfo.user?.avatar ?? ''}
                  selected={codisplayUsers.includes(myInfo.user.id)}
                  name={myInfo.user.name}
                  color="primary"
                  onClick={onRowClick(myInfo.user.id)}
                />
              ) : (
                <CodisplayRowNoSelect
                  id={myInfo.user.id}
                  src={myInfo.user?.avatar ?? ''}
                  name={myInfo.user.name}
                  color="primary"
                />
              ))}
            {members.length > 0 &&
              members.map((_: any) =>
                onCodisplayMode ? (
                  <CodisplayRow
                    id={_.id}
                    src={_.avatar ?? ''}
                    selected={codisplayUsers.includes(_.id)}
                    name={_.name}
                    key={`calendar-codisplay-user-${_.id}-row`}
                    color={COLOR_VALUES[_.pivot.color].label}
                    onClick={onRowClick(_.id)}
                  />
                ) : (
                  <CodisplayRowNoSelect
                    id={_.id}
                    src={_.avatar ?? ''}
                    name={_.name}
                    key={`calendar-user-normal-row-${_.id}`}
                    color={COLOR_VALUES[_.pivot.color].label}
                  />
                ),
              )}
          </div>
        </>
      )}
      {!isOpen && (
        <div className="my-24px h-full w-full flex flex-col justify-start overflow-y-auto overflow-x-hidden items-center">
          {membersWithMe &&
            membersWithMe.map((_: any, index) => {
              return onCodisplayMode ? (
                <AvatarImageSelectable
                  selected={codisplayUsers.includes(_.id)}
                  styleClass="my-12px"
                  imgSrc={_.avatar ?? ''}
                  color={COLOR_VALUES[_.pivot.color].label}
                  tooltip={_.name}
                  key={`codisplay-member-collabo-${_.id}-${index}`}
                  onClick={() => {
                    const newUsersIDs = codisplayUsers.includes(_.id)
                      ? codisplayUsers.filter((userID) => userID !== _.id)
                      : [...codisplayUsers, _.id];
                    dispatch(setCodisplayUsers([...newUsersIDs]));
                  }}
                />
              ) : (
                <AvatarImageClickable
                  styleClass="my-12px"
                  imgSrc={_.avatar ?? ''}
                  color={
                    currentCodisplayUserID == _.id
                      ? 'primary'
                      : COLOR_VALUES[_.pivot.color].label
                  }
                  tooltip={_.name}
                  onClick={() => {
                    dispatch(setCurrentCodisplayUser(_.id));
                    dispatch(setCodisplayFetching(true));
                    dispatch(setShowTaskDetail(false));
                    queryClient.invalidateQueries('tasks');
                    queryClient.invalidateQueries('list');
                    if (router.asPath.split('/')[1] === 'notes') {
                      router.push(NOTES_ALL_URL);
                    }
                  }}
                  hideBorder={currentCodisplayUserID == _.id ? false : true}
                  key={`accepted-member-avatars-collaborate-${_.id}-${index}`}
                />
              );
            })}
        </div>
      )}
      {!isOpen && (
        <IconWrap
          additionalClass={`flex-none mb-8 bottom-0 hover:bg-primaryHovered hover:text-primary ${
            allSelected
              ? 'bg-primary text-backgroundSecondary'
              : 'bg-separator text-fontPrimary'
          } ${router.asPath.split('/')[1] === 'tasks' ? 'hidden' : ''} tooltip`}
          onClick={toggleCodisplay}
        >
          <CoDisplayIcon width={20} height={20} />
          <span className="absolute top-full mt-1 px-2 py-1 w-20 rounded-2px bg-fontSecondary body3 text-backgroundSecondary text-center z-50 tooltiptext">
            同時表示
          </span>
        </IconWrap>
      )}
      {isOpen && (
        <div className="my-24px w-auto py-12px bottom-0 bg-backgroundPrimary body1 text-primary flex-row--between cursor-pointer">
          <div
            className=""
            onClick={() => {
              setIsUserAddModal(true);
            }}
          >
            ユーザー追加
          </div>
          <div
            className={`flex-none bottom-0 hover:bg-primaryHovered hover:text-primary ${
              allSelected
                ? 'bg-primary text-backgroundSecondary'
                : 'bg-separator text-fontPrimary'
            } ${
              router.asPath.split('/')[1] === 'tasks' ? 'hidden' : ''
            } tooltip h-44px w-44px rounded-8px flex-xy-center`}
            onClick={toggleCodisplay}
          >
            <CoDisplayIcon width={20} height={20} />
            <span className="absolute top-full mt-1 px-2 py-1 w-20 rounded-2px bg-fontSecondary body3 text-backgroundSecondary text-center z-50 tooltiptext">
              同時表示
            </span>
          </div>
        </div>
      )}
      <ModalAddUser
        isOpen={isUserAddModal}
        close={() => setIsUserAddModal(false)}
      />
    </div>
  );
};
