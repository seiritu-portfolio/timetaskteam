import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// * user defined
// api
import {
  setGroupUserSelectModal,
  setUserlistSettingMode,
} from '@store/modules/home';
// view
import SettingsHeader from '@component/settings/SettingsHeader';
import UserTypeTab from '@component/settings/userList/parts/UserTypeTab';
import CooperatorListByType from '@component/settings/userList/parts/CooperatorListByType';
import GroupsList from '@component/settings/userList/parts/GroupsList';
import ModalAddUser from '@component/settings/userList/addUser/ModalAddUser';
import RightArrowIcon from '@svg/chevron-right.svg';
// constants
import { USERLIST_STATES } from '@util/constants';
import { requestersSelector } from '@store/selectors/collabos';
import ModalEditUser from './addUser/ModalEditUser';

const GeneralMode = () => {
  const dispatch = useDispatch();
  const [userType, setUserType] = useState(0);
  const requesters = useSelector(requestersSelector);

  const [isUserAddModal, setIsUserAddModal] = useState(false);
  const [isUserEditModal, setIsUserEditModal] = useState(false);
  const [search, setSearch] = useState('');

  return (
    <div className="h-full flex flex-col">
      <SettingsHeader
        title="ユーザー一覧"
        hasSearch={true}
        setSearch={setSearch}
      />
      <div className="flex-none p-12px border-b border-separator flex-xy-center">
        <div
          className="flex-1 p-12px rounded-8px flex-row--between hover:bg-primaryHovered hover:text-primary cursor-pointer"
          onClick={() => {
            dispatch(setUserlistSettingMode(USERLIST_STATES.ADDREQUEST_MODE));
          }}
        >
          <h3 className="body1 text-fontPrimary">追加リクエスト</h3>
          <div className="text-fontSecondary flex flex-row items-center">
            <span className="body1">{requesters && requesters.length}</span>
            <RightArrowIcon width={20} height={20} className="ml-4px" />
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="py-24px w-full">
          <UserTypeTab
            active={userType}
            setActive={setUserType}
            onAdd={() => {
              if (userType === 2) {
                dispatch(setGroupUserSelectModal(true));
              } else {
                setIsUserAddModal(true);
              }
            }}
          />
          {userType === 0 ? (
            <CooperatorListByType
              type="MEMBER"
              search={search}
              onDetail={() => {
                setIsUserEditModal(true);
              }}
            />
          ) : userType === 1 ? (
            <CooperatorListByType
              type="GUEST"
              search={search}
              onDetail={() => {
                setIsUserEditModal(true);
              }}
            />
          ) : (
            <GroupsList search={search} />
          )}
        </div>
      </div>
      <ModalAddUser
        isOpen={isUserAddModal}
        close={() => setIsUserAddModal(false)}
      />
      <ModalEditUser
        isOpen={isUserEditModal}
        close={() => setIsUserEditModal(false)}
      />
    </div>
  );
};

export default GeneralMode;
