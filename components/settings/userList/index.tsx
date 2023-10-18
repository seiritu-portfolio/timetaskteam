import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  groupAddModalSelector,
  groupUserSelectModalConfirmText,
  groupUserSelectModalSelector,
  userlistSettingModeSelector,
} from '@store/selectors/home';
import {
  setGroupAddModal,
  setGroupUserSelectModal,
  setIDsForNewGroup,
} from '@store/modules/home';

import GeneralMode from './GeneralMode';
import GroupEdit from './GroupEdit';
import AddUser from './AddUser';
import ModalAddGroup from '@component/settings/userList/group/ModalAddGroup';
import ModalGroupMemberSelect from './group/ModalGroupMemberSelect';

import { USERLIST_STATES } from '@util/constants';
import { usePendingRequestersList } from '@service/userQueries';
import { setRequesters } from '@store/modules/collabos';

const UserList = () => {
  const currentMode = useSelector(userlistSettingModeSelector);
  const isGroupAddModal = useSelector(groupAddModalSelector);
  const isGroupAddSelectModal = useSelector(groupUserSelectModalSelector);
  const groupAddSelectConfirmTxt = useSelector(groupUserSelectModalConfirmText);

  const dispatch = useDispatch();
  const requestersList = usePendingRequestersList();
  useEffect(() => {
    if (requestersList.isSuccess) {
      dispatch(setRequesters(requestersList.data));
    }
  }, [requestersList.isSuccess, requestersList.data, dispatch]);

  return (
    <>
      {currentMode === USERLIST_STATES.GENERAL_MODE ? (
        <GeneralMode />
      ) : currentMode === USERLIST_STATES.GROUPEDIT_MODE ? (
        <GroupEdit />
      ) : currentMode === USERLIST_STATES.ADDREQUEST_MODE ? (
        <AddUser />
      ) : currentMode === USERLIST_STATES.SEARCH_MODE ? null : null}
      <ModalAddGroup
        isOpen={isGroupAddModal}
        close={() => {
          dispatch(setGroupAddModal(false));
        }}
      />
      <ModalGroupMemberSelect
        isOpen={isGroupAddSelectModal}
        close={() => {
          dispatch(setGroupUserSelectModal(false));
        }}
        selectedUsersIDs={[]}
        confirmBtnText={groupAddSelectConfirmTxt}
        onConfirm={(idsToAdd: number[]) => {
          dispatch(setGroupUserSelectModal(false));
          dispatch(setIDsForNewGroup([...idsToAdd]));
          dispatch(setGroupAddModal(true));
        }}
      />
    </>
  );
};

export default UserList;
