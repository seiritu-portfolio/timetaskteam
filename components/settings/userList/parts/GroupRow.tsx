import { useDispatch } from 'react-redux';

import {
  setUserlistCurrentGroup,
  setUserlistSettingMode,
} from '@store/modules/home';

import EqualIcon from '@svg/equal-small.svg';
import RightArrowIcon from '@svg/chevron-right.svg';

import { GroupType } from '@model/user';
import GroupUsersIconList from '@component/settings/userList/parts/GroupUsersIconList';
import { USERLIST_STATES } from '@util/constants';

const GroupRow = (prop: GroupType) => {
  const dispatch = useDispatch();

  return (
    <div
      className="px-24px h-68px w-full rounded-lg flex flex-row justify-between items-center hover:bg-primaryHovered hover:text-primary"
      onClick={() => {
        dispatch(setUserlistSettingMode(USERLIST_STATES.GROUPEDIT_MODE));
        dispatch(setUserlistCurrentGroup(prop.id));
      }}
    >
      <div className="flex flex-row items-center">
        <EqualIcon
          width="20px"
          height="20px"
          className="mr-16px text-fontSecondary"
        />
        <span className="body1 text-fontPrimary">{prop.name}</span>
      </div>
      <div className="flex flex-row items-center">
        <GroupUsersIconList users={prop.users} groupId={prop.id} />
        <RightArrowIcon
          width={20}
          height={20}
          className="ml-24px text-fontSecondary"
        />
      </div>
    </div>
  );
};

export default GroupRow;
