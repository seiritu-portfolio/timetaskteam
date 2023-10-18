import { AvatarImageClosable } from '@component/general/avatar';
import PersonIcon from '@svg/person.svg';

interface PropsType {
  styleClass: string;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
}

const GroupAddUser = (props: PropsType) => {
  return (
    <div
      className={`${props.styleClass} flex flex-col items-center`}
      onClick={props.onClick}
    >
      <div
        className={`w-44px h-44px rounded-8px bg-backgroundPrimary flex-xy-center`}
      >
        <PersonIcon width={20} height={20} className="text-fontPrimary" />
      </div>
      <span className="mt-2px caption2-light text-fontPrimary">追加</span>
    </div>
  );
};

interface PropsExtendedType {
  name: string;
  styleClass: string;
  imgSrc: string;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  color?: string;
}

const GroupUserRemovable = (props: PropsExtendedType) => {
  return (
    <div className={`${props.styleClass} flex flex-col items-center`}>
      <AvatarImageClosable
        imgSrc={props.imgSrc}
        styleClass=""
        onClick={props.onClick}
        color={props.color ?? 'pink'}
      />
      <span className="mt-2px max-w-40px caption2-light truncate">
        {props.name}
      </span>
    </div>
  );
};

export { GroupAddUser, GroupUserRemovable };
