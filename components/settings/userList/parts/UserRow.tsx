// * import user defined
// view
import AvatarImage, {
  AvatarImageClosable,
  AvatarImageSelectable,
} from '@component/general/avatar';
import EqualIcon from '@svg/equal-small.svg';
import RightArrowIcon from '@svg/chevron-right.svg';
import CheckedIcon from '@svg/checkmark-square-fill.svg';
import AllUsersIcon from '@svg/person-2.svg';
// import UncheckedIcon from "@svg/square.svg";
// constants & types
import { UserAddRequestType, UserType, UserWithApproveType } from '@model/user';
import { DEFAULT_AVATAR_URL } from '@util/urls';

const UserRow = (prop: UserType) => {
  return <UserRowDefault {...prop} approved={true} />;
};

const UserRowApproval = (prop: UserType) => {
  return <UserRowDefault {...prop} approved={false} />;
};

const UserRowDefault = (prop: UserWithApproveType) => {
  return (
    <div className="px-24px h-68px w-full flex flex-row justify-between items-center">
      <div
        className="flex-1 flex flex-row items-center cursor-pointer"
        onClick={() => {
          if (prop.onClickLeft) {
            prop.onClickLeft();
          }
        }}
      >
        {prop.approved ? (
          <EqualIcon
            width="20px"
            height="20px"
            className="mr-16px text-fontSecondary"
          />
        ) : null}
        <AvatarImage
          styleClass="mr-16px"
          imgSrc={
            prop.avatar && prop.avatar !== '' ? prop.avatar : DEFAULT_AVATAR_URL
          }
          color={prop.color ?? 'pink'}
        />
        <span className="body1 text-fontPrimary">{prop.name}</span>
      </div>
      <RightArrowIcon
        width={20}
        height={20}
        className="flex-none text-fontSecondary cursor-pointer"
        onClick={() => {
          if (prop.onClickRight) {
            prop.onClickRight();
          }
        }}
      />
    </div>
  );
};

const UserAddRequestRow = (prop: UserAddRequestType) => {
  return (
    <div className="px-24px h-68px w-full flex flex-row justify-between items-center">
      <div className="flex flex-row items-center">
        <AvatarImage
          styleClass="mr-16px"
          imgSrc={prop.avatar ?? ''}
          color={prop.color ?? 'pink'}
        />
        <span className="ml-16px body1 text-fontPrimary">{prop.name}</span>
      </div>
      <div className="flex flex-row items-center">
        <span
          className="body1 text-fontPrimary cursor-pointer"
          onClick={() => {
            if (prop.onReject) {
              prop.onReject();
            }
          }}
        >
          拒否
        </span>
        <span
          className="ml-24px body1 text-primary cursor-pointer"
          onClick={prop.onAccept}
        >
          追加
        </span>
      </div>
    </div>
  );
};

interface UserIconRemovableType extends UserType {
  additionalPositionClass?: string;
  onDelete: any;
}

const UserIconRemovable = (prop: UserIconRemovableType) => {
  return (
    <div
      className={`flex flex-col items-center ${prop.additionalPositionClass}`}
    >
      <AvatarImageClosable
        styleClass=""
        imgSrc={prop.avatar ?? ''}
        color={prop.color ?? 'pink'}
        onClick={prop.onDelete}
      />
      <span className="mt-4px w-40px caption2 text-center text-fontPrimary truncate">
        {prop.name}
      </span>
    </div>
  );
};

interface UserIconSelectableProps extends UserType {
  additionalPositionClass?: string;
  selected: boolean;
  onSelect: any;
}

const UserIconSelectable = (prop: UserIconSelectableProps) => {
  return (
    <div
      className={`flex flex-col items-center ${prop.additionalPositionClass}`}
    >
      <AvatarImageSelectable
        styleClass=""
        imgSrc={prop.avatar ?? ''}
        onClick={prop.onSelect}
        selected={prop.selected}
        color={prop.color ?? 'pink'}
      />
      <span className="mt-2px w-40px caption2 text-center text-fontPrimary truncate">
        {prop.name}
      </span>
    </div>
  );
};

interface UserAllSelectableProp {
  additionalPositionClass?: string;
  selected: boolean;
  onSelect: any;
}

const UserAllSelectable = (prop: UserAllSelectableProp) => {
  return (
    <div
      className={`flex flex-col items-center ${prop.additionalPositionClass}`}
    >
      <div
        className="relative w-44px h-44px rounded-full bg-backgroundPrimary flex-xy-center"
        onClick={prop.onSelect}
      >
        <AllUsersIcon className="w-20px h-20px text-fontPrimary" />
        <div className="absolute -right-1 -bottom-1 h-20px w-20px rounded-sm bg-backgroundSecondary flex-xy-center">
          {prop.selected ? (
            <CheckedIcon
              width={20}
              height={20}
              className="text-fontSecondary"
            />
          ) : (
            <div className="w-15px h-15px border-2 border-fontSecondary rounded-sm" />
          )}
        </div>
      </div>
      <span className="mt-4px w-40px caption2 text-center text-fontPrimary">
        全員
      </span>
    </div>
  );
};

export {
  UserRow,
  UserRowApproval,
  UserIconRemovable,
  UserIconSelectable,
  UserAllSelectable,
  UserAddRequestRow,
};
