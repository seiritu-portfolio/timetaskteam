import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import Image from 'next/image';

import {
  groupsSelector,
  guestsSelector,
  membersSelector,
} from '@store/selectors/collabos';
import { IconWrap01 } from '@component/general/wrap';
import ClearIcon from '@svg/multiply-circle-fill-small.svg';
import { GroupUserRemovable } from '@component/settings/userList/parts/GroupUserAddRemove';
import PersonRequestIcon from '@svg/person-and-arrow-left-and-arrow-right.svg';
import DefaultAvatarIcon from '@image/default_avatar.png';
import { COLOR_VALUES } from '@util/constants';

const Selected = ({
  userIDs,
  onRemove,
  onClear,
}: {
  userIDs: number[];
  onClear: () => void;
  onRemove: (userID: number) => void;
}) => {
  const members = useSelector(membersSelector);
  const guests = useSelector(guestsSelector);
  const groups = useSelector(groupsSelector);

  const users: any[] = useMemo(() => {
    const allUsers = [...members, ...guests];

    return allUsers.length === 0 || userIDs.length === 0
      ? []
      : allUsers.filter((user: any) => userIDs.includes(user.id));
  }, [members, guests, userIDs]);
  const groupsWithIDs = useMemo(() => {
    if (groups.length === 0) return [];
    return groups.map((group) => ({
      name: group.name,
      ids:
        group.users.length === 0
          ? []
          : group.users
              .map((_) => _.id)
              .sort((a, b) => a - b)
              .join('-'),
    }));
  }, [groups]);

  const groupName: string | null = useMemo(() => {
    if (groupsWithIDs.length === 0) {
      return null;
    }
    const strUserIDs = userIDs.sort((a, b) => a - b).join('-');
    const filteredGroups = groupsWithIDs.filter(
      (group) => group.ids === strUserIDs,
    );
    return filteredGroups.length === 0 ? null : filteredGroups[0].name;
  }, [groupsWithIDs, userIDs]);

  return (
    <>
      <div className="w-full flex items-center">
        <IconWrap01
          Icon={PersonRequestIcon}
          className="flex-none mr-2px"
          onClick={() => {}}
        />
        <div className="flex-1 px-16px h-44px w-full rounded-r-8px bg-backgroundPrimary body1 text-fontPrimary flex-row--between">
          {users.length === 1 ? (
            <div className="flex items-center">
              <Image
                src={
                  users[0].avatar != '' ? users[0].avatar : DefaultAvatarIcon
                }
                width={20}
                height={20}
                alt=""
                className="rounded-full object-cover"
              />
              <span className="ml-8px">{users[0].name}</span>
            </div>
          ) : (
            <span className="">まとめて依頼{groupName && `,${groupName}`}</span>
          )}
          <ClearIcon
            width={20}
            height={20}
            className="text-fontSecondary cursor-pointer"
            onClick={onClear}
          />
        </div>
      </div>
      {users.length > 1 && (
        <div className="mt-12px py-12px flex flex-row items-center flex-wrap">
          {users.map((item, index) => (
            <GroupUserRemovable
              name={item.name}
              styleClass="mr-18px"
              onClick={() => onRemove(item.id)}
              imgSrc={
                item.avatar && item.avatar != ''
                  ? item.avatar
                  : DefaultAvatarIcon
              }
              color={COLOR_VALUES[item.pivot.color].label}
              key={`request-bulk-user-id-${item.id}-${index}`}
            />
          ))}
        </div>
      )}
    </>
  );
  //   return users.length === 1;
};

export default Selected;
