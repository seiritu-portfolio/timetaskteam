import { useSelector } from 'react-redux';
// * user defined
// view
import GroupRow from '@component/settings/userList/parts/GroupRow';
import { groupsSelector } from '@store/selectors/collabos';

const GroupsList = ({ search }: { search?: string }) => {
  const groups = useSelector(groupsSelector);

  return (
    <div className="mt-12px mx-24px">
      {(() => {
        const searchedGroups =
          search === undefined || search === ''
            ? groups
            : groups.length === 0
            ? groups
            : groups.filter((_) => _.name.includes(search));

        return searchedGroups.length === 0
          ? null
          : searchedGroups.map((_: any) => (
              <GroupRow
                key={`group-row-${_.id}`}
                {..._}
                id={_.id}
                name={_.name}
                users={_.users}
              />
            ));
      })()}
    </div>
  );
};

export default GroupsList;
