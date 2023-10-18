import { useSelector } from 'react-redux';
import Image from 'next/image';

import { userInfoSelector } from '@store/selectors/user';
import { IconWrap01 } from '@component/general/wrap';
import TriangleSmallIcon from '@svg/triangle-small.svg';
import RerequestIcon from '@svg/arrow-forward-square.svg';
import PersonRequestIcon from '@svg/person-and-arrow-left-and-arrow-right.svg';
import DefaultAvatarIcon from '@image/default_avatar.png';

const NoUsers = ({
  onSelect,
  role,
}: {
  onSelect: (newValue: boolean) => void;
  role: number;
}) => {
  const { user } = useSelector(userInfoSelector);

  return role === 1 ? (
    <div className="w-full flex flex-row items-center">
      <IconWrap01
        Icon={PersonRequestIcon}
        className="flex-none mr-2px"
        onClick={() => {}}
      />
      <div
        className="pl-18px pr-16px h-44px w-full rounded-r-8px bg-backgroundPrimary text-fontSecondary flex-row--between cursor-pointer focus:bg-overlayWeb2"
        tabIndex={11}
        onClick={() => onSelect(true)}
        onBlur={() => onSelect(false)}
      >
        <span className="body1">依頼なし</span>
        <TriangleSmallIcon width={20} height={20} />
      </div>
    </div>
  ) : role === 2 ? (
    <div className="w-full flex flex-row">
      <IconWrap01
        Icon={PersonRequestIcon}
        className="flex-none mr-2px"
        onClick={() => {}}
      />
      <div className="flex-1 pl-16px h-44px bg-backgroundPrimary body1 text-fontPrimary flex items-center">
        <Image
          src={
            user?.avatar && user?.avatar !== ''
              ? user.avatar
              : DefaultAvatarIcon
          }
          width={20}
          height={20}
          alt=""
          className="rounded-full object-cover"
        />
        <span className="ml-8px">{user?.name ?? ''}</span>
      </div>
      <div
        className="flex-none ml-2px w-44px h-44px rounded-r-8px bg-backgroundPrimary text-fontSecondary flex-xy-center focus:bg-overlayWeb2 focus:text-fontPrimary cursor-pointer"
        tabIndex={11}
        onClick={() => onSelect(true)}
        onBlur={() => onSelect(false)}
      >
        <RerequestIcon width={20} height={20} />
      </div>
    </div>
  ) : (
    <div className="w-full flex flex-row">
      <IconWrap01
        Icon={PersonRequestIcon}
        className="flex-none mr-2px"
        onClick={() => {}}
      />
      <div className="pl-16px pr-16px h-44px w-full rounded-r-8px bg-backgroundPrimary text-fontPrimary flex items-center">
        <Image
          src={
            user?.avatar && user?.avatar !== ''
              ? user.avatar
              : DefaultAvatarIcon
          }
          width={20}
          height={20}
          alt=""
          className="rounded-full object-cover"
        />
        <span className="ml-8px">{user?.name ?? ''}</span>
      </div>
    </div>
  );
};

export default NoUsers;
