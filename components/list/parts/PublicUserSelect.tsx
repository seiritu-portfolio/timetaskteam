import { useSelector } from 'react-redux';
import { DefaultInputWrap } from '@component/general/input';
import { GroupUserRemovable } from '@component/settings/userList/parts/GroupUserAddRemove';
import { groupsSelector } from '@store/selectors/collabos';
import { COLOR_VALUES } from '@util/constants';

const PublicUserSelect = ({
  register,
  additionalClass,
  onClick,
  hasError,
  groupIDSelected,
  publicUsers,
  onRemovePublicUser,
}: {
  register: any;
  additionalClass: string;
  onClick: any;
  hasError: boolean;
  groupIDSelected: number | undefined;
  publicUsers: number[];
  onRemovePublicUser: any;
}) => {
  const groups = useSelector(groupsSelector);

  return (
    <>
      <DefaultInputWrap
        additionalPositionClass={additionalClass}
        onClick={onClick}
      >
        <span
          className={`${
            groupIDSelected && groupIDSelected !== -1 && publicUsers.length > 0
              ? 'text-fontPrimary'
              : 'text-fontSecondary'
          } body1`}
        >
          {groupIDSelected &&
          groupIDSelected !== -1 &&
          groups.length > 0 &&
          publicUsers.length > 0
            ? groups.filter((_: any) => _.id === groupIDSelected)[0].name
            : '公開ユーザー'}
        </span>
      </DefaultInputWrap>
      <input {...register('publicUsers')} type="hidden" />
      {publicUsers.length > 0 ? (
        <div className="mt-24px flex flex-row flex-wrap gap-y-2">
          {publicUsers.map((_: any, index: number) => (
            <GroupUserRemovable
              name={_.name}
              color={COLOR_VALUES[_.pivot.color].label}
              styleClass="mr-24px"
              imgSrc={_.avatar}
              onClick={() => onRemovePublicUser(_.id)}
              key={`public-user-${index}`}
            />
          ))}
        </div>
      ) : null}
      {hasError && (
        <p className="mt-8px body1 text-secondary">
          パブリックユーザーを選択してください
        </p>
      )}
    </>
  );
};

export default PublicUserSelect;
