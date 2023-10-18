// * assets
import PrivateIcon from '@svg/lock-shield.svg';
import { CLASSNAME_FOR_TASKMENU, ICON_VALUES } from '@util/constants';
import UserListMenu from './UserListMenu';

const ListItem = (props: any) => {
  const Icon = ICON_VALUES[props.icon ?? 0].icon;
  return (
    <div
      className={`${CLASSNAME_FOR_TASKMENU} p-8px flex flex-row items-center ${
        props.isActive ? 'bg-primarySelected text-primary' : ''
      } ${
        props.notes_count > 0 && props.viewed == false
          ? 'font-bold text-primary'
          : 'font-normal'
      }
      `}
      onClick={() => props.onItemClick(props.id)}
    >
      <Icon width={26} height={26} />
      {props.folded ? null : (
        <>
          <span className="ml-12px flex-1 truncate">{props.name}</span>
          {props.status === 1 ? (
            <UserListMenu id={props.id} users={props.cooperators} />
          ) : (
            <PrivateIcon width={26} height={26} />
          )}
        </>
      )}
    </div>
  );
};

export default ListItem;
