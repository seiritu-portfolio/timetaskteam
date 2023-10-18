import React, { useEffect, useMemo, useState } from 'react';
import Modal from 'react-responsive-modal';
import { useSelector } from 'react-redux';

import CollaboListSelectRender from '@component/settings/CollaboListSelect';
import { UserAllSelectable } from '@component/settings/userList/parts/UserRow';
import MagnifyGlassIcon from '@svg/magnifyingglass-big.svg';
import ModalDefaultProps from '@model/modal';
import GroupUsersIconList from '@component/settings/userList/parts/GroupUsersIconList';
import { guestsSelector, membersSelector } from '@store/selectors/collabos';

interface ModalSelUserForListProps extends ModalDefaultProps {
  selectedUserIDs: number[];
  onConfirm: (idsToAdd: number[], groupSelected: number) => void;
  memberList: any[];
  guestList: any[];
  groupList: any[];
}

const ModalSelUserForList = ({
  isOpen,
  close,
  selectedUserIDs,
  onConfirm,
  memberList,
  guestList,
  groupList,
}: ModalSelUserForListProps) => {
  const [userIDList, setUserIDList] = useState<Array<number>>([]);
  useEffect(() => {
    setUserIDList(selectedUserIDs);
  }, [selectedUserIDs]);

  const [userTypeTab, setUserTypeTab] = useState(0);
  const [groupsSelected, setGroupsSelected] = useState<Array<number>>([]);
  const allSelected = React.useMemo(
    () =>
      (userTypeTab === 0 ? memberList : guestList).filter(
        (_: any) => !userIDList.includes(_.id),
      ).length > 0
        ? false
        : true,
    [userTypeTab, userIDList, memberList, guestList],
  );

  const memberIDList = React.useMemo(
    () => (memberList.length > 0 ? memberList.map((_: any) => _.id) : []),
    [memberList],
  );
  const guestIDList = React.useMemo(
    () => (guestList.length > 0 ? guestList.map((_: any) => _.id) : []),
    [guestList],
  );

  return (
    <Modal
      open={isOpen}
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
      <div className="p-24px w-full h-full">
        <div className="px-12px h-48px flex-row--between">
          <h3 className="big-title text-fontPrimary">グループメンバー</h3>
          <div className="h-44px w-44px rounded-8px bg-backgroundTertiary text-fontPrimary flex-xy-center">
            <MagnifyGlassIcon
              className=""
              width={24}
              height={24}
              onClick={() => {}}
            />
          </div>
        </div>
        <div className="mt-12px p-12px h-68px w-full flex-xy-center">
          <div className="rounded-6px w-full h-full bg-backgroundPrimary cursor-pointer flex-xy-center">
            <div
              className={`flex-1 p-12px h-full text-${
                userTypeTab === 0 ? 'fontPrimary' : 'fontSecondary'
              } flex-xy-center`}
              onClick={() => {
                setUserTypeTab(0);
              }}
            >
              メンバー
            </div>
            <div
              className={`flex-1 h-full text-center text-${
                userTypeTab === 1 ? 'fontPrimary' : 'fontSecondary'
              } flex-xy-center`}
              onClick={() => setUserTypeTab(1)}
            >
              ゲスト
            </div>
            <div
              className={`flex-1 h-full text-center text-${
                userTypeTab === 2 ? 'fontPrimary' : 'fontSecondary'
              } flex-xy-center`}
              onClick={() => setUserTypeTab(2)}
            >
              グループ
            </div>
          </div>
        </div>
        <div className="px-12px">
          {userTypeTab === 2 && groupList.length > 0
            ? groupList.map((_, index) => {
                const collaboIDsForGroup = _.cooperators.map(
                  (item: any) => item.id,
                );
                if (collaboIDsForGroup.length === 0) return null;

                return (
                  <GroupRowDefault
                    id={_.id}
                    name={_.name}
                    users={_.cooperators}
                    additionalClass=""
                    isActive={
                      collaboIDsForGroup.filter(
                        (id: number) => !userIDList.includes(id),
                      ).length === 0
                    }
                    onClick={() => {
                      const isActive =
                        collaboIDsForGroup.filter(
                          (id: number) => !userIDList.includes(id),
                        ).length === 0;
                      const filteredOutArray = userIDList.filter(
                        (index: number) => !collaboIDsForGroup.includes(index),
                      );

                      if (isActive) {
                        setUserIDList([...filteredOutArray]);
                        if (groupsSelected.includes(_.id)) {
                          setGroupsSelected([
                            ...groupsSelected.filter(
                              (index: number) => index !== _.id,
                            ),
                          ]);
                        }
                      } else {
                        setUserIDList([
                          ...filteredOutArray,
                          ...collaboIDsForGroup,
                        ]);
                        if (!groupsSelected.includes(_.id)) {
                          setGroupsSelected([...groupsSelected, _.id]);
                        }
                      }
                    }}
                    key={`group-row-${_.id}-user-${index}`}
                  />
                );
              })
            : null}
          <div className="py-12px flex flex-row flex-wrap">
            {userTypeTab !== 2 && (
              <UserAllSelectable
                selected={allSelected}
                onSelect={() => {
                  const currentTypeUserIDsList =
                    userTypeTab === 0 ? memberIDList : guestIDList;

                  const filteredOutArray = userIDList.filter(
                    (_: number) => !currentTypeUserIDsList.includes(_),
                  );

                  if (allSelected) {
                    setUserIDList([...filteredOutArray]);
                  } else {
                    setUserIDList([
                      ...filteredOutArray,
                      ...currentTypeUserIDsList,
                    ]);
                  }
                }}
                additionalPositionClass="mr-24px mb-12px"
              />
            )}
            {userTypeTab !== 2 && (
              <CollaboListSelectRender
                listIndex={userTypeTab}
                usersList={userTypeTab === 0 ? memberList : guestList}
                onToggle={(id) => {
                  userIDList.includes(id)
                    ? setUserIDList(userIDList.filter((_: number) => _ !== id))
                    : setUserIDList([...userIDList, id]);
                }}
                selectedIDsArray={userIDList}
              />
            )}
          </div>
        </div>
        <div className="flex flex-row justify-end items-center">
          <span
            onClick={close}
            className="button text-fontSecondary cursor-pointer"
          >
            キャンセル
          </span>
          <button
            className="ml-24px px-24px h-44px rounded-8px bg-primary button text-backgroundSecondary"
            onClick={() => {
              const firstGroupID =
                groupsSelected.length > 0 ? groupsSelected[0] : -1;
              const groupsArray = groupList.filter(
                (item: any) => item.id === firstGroupID,
              );

              onConfirm(
                userIDList,
                groupsArray.length > 0 ? groupsArray[0].id : -1,
              );
            }}
          >
            完了
          </button>
        </div>
      </div>
    </Modal>
  );
};

const ModalSelOneUser = ({
  isOpen,
  close,
  excludedUserIDs,
  onConfirm,
}: {
  isOpen: boolean;
  close: () => void;
  excludedUserIDs: number[];
  onConfirm: (idToAdd: number) => void;
}) => {
  const members = useSelector(membersSelector);
  const guests = useSelector(guestsSelector);

  const memberList = useMemo(() => {
    return members.filter((item) => !excludedUserIDs.includes(item.id));
  }, [members, excludedUserIDs]);
  const guestList = useMemo(() => {
    return guests.filter((item) => !excludedUserIDs.includes(item.id));
  }, [guests, excludedUserIDs]);

  const [userTypeTab, setUserTypeTab] = useState(0);
  const [selectedID, setSelectedID] = useState(0);

  return (
    <Modal
      open={isOpen}
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
      <div className="p-24px w-full h-full">
        <div className="px-12px h-48px flex-row--between">
          <h3 className="big-title text-fontPrimary">グループメンバー</h3>
          <div className="h-44px w-44px rounded-8px bg-backgroundTertiary text-fontPrimary flex-xy-center">
            <MagnifyGlassIcon
              className=""
              width={24}
              height={24}
              onClick={() => {}}
            />
          </div>
        </div>
        <div className="mt-12px p-12px h-68px w-full flex-xy-center">
          <div className="rounded-6px w-full h-full bg-backgroundPrimary cursor-pointer flex-xy-center">
            <div
              className={`flex-1 p-12px h-full text-${
                userTypeTab === 0 ? 'fontPrimary' : 'fontSecondary'
              } flex-xy-center`}
              onClick={() => {
                setUserTypeTab(0);
              }}
            >
              メンバー
            </div>
            <div
              className={`flex-1 h-full text-center text-${
                userTypeTab === 1 ? 'fontPrimary' : 'fontSecondary'
              } flex-xy-center`}
              onClick={() => setUserTypeTab(1)}
            >
              ゲスト
            </div>
          </div>
        </div>
        <div className="px-12px">
          <div className="py-12px flex flex-row flex-wrap">
            <CollaboListSelectRender
              listIndex={userTypeTab}
              usersList={userTypeTab === 0 ? memberList : guestList}
              onToggle={(id) => {
                setSelectedID(id);
                // userIDList.includes(id)
                //   ? setUserIDList(userIDList.filter((_: number) => _ !== id))
                //   : setUserIDList([...userIDList, id]);
              }}
              selectedIDsArray={[selectedID]}
            />
          </div>
        </div>
        <div className="flex flex-row justify-end items-center">
          <span
            onClick={close}
            className="button text-fontSecondary cursor-pointer"
          >
            キャンセル
          </span>
          <button
            className="ml-24px px-24px h-44px rounded-8px bg-primary button text-backgroundSecondary"
            onClick={() => {
              onConfirm(selectedID);
            }}
            disabled={selectedID === 0}
          >
            完了
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalSelUserForList;

export { ModalSelOneUser };

interface GroupRowDefaultProps {
  additionalClass: string;
  id: number;
  name: string;
  users: any[];
  onClick: () => void;
  isActive: boolean;
}

const GroupRowDefault = ({
  additionalClass,
  id,
  name,
  users,
  onClick,
  isActive,
}: GroupRowDefaultProps) => {
  return (
    <div
      className={`${additionalClass} p-12px rounded-sm ${
        isActive && 'bg-primarySelected text-primary'
      } flex-row--between cursor-pointer`}
      onClick={onClick}
    >
      <span className="">{name}</span>
      <GroupUsersIconList users={users} groupId={id} />
    </div>
  );
};
