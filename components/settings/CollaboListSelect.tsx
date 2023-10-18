import { COLOR_VALUES } from '@util/constants';
import { UserIconSelectable } from './userList/parts/UserRow';

interface CollaboListSelectRenderProps {
  listIndex: number;
  usersList: any[];
  selectedIDsArray: number[];
  onToggle: (id: number) => void;
}

const CollaboListSelectRender = ({
  listIndex,
  usersList,
  selectedIDsArray,
  onToggle,
}: CollaboListSelectRenderProps) => {
  return usersList.length === 0 ? null : (
    <>
      {usersList.map((_: any, index: number) => (
        <UserIconSelectable
          {..._}
          color={COLOR_VALUES[_.pivot.color].label}
          additionalPositionClass="mr-24px mb-12px"
          selected={selectedIDsArray.includes(_.id)}
          onSelect={() => onToggle(_.id)}
          key={`group-type-${listIndex}-cooperator-${index}-candidator-add`}
        />
      ))}
    </>
  );
};

export default CollaboListSelectRender;
