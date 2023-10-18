import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// * import user defined
// api
import { useCooperatorList } from '@service/userQueries';
// constants & types
import { COLOR_VALUES, COOPERATE_TYPES_LIST } from '@util/constants';
import {
  UserRow,
  UserRowApproval,
} from '@component/settings/userList/parts/UserRow';
import {
  guestsPendingSelector,
  guestsSelector,
  membersPendingSelector,
  membersSelector,
} from '@store/selectors/collabos';
import {
  setCurrentCollaboId,
  setGuestToAdd,
  setMemberToAdd,
} from '@store/modules/collabos';

const CooperatorListByType = ({
  type,
  search,
  onDetail,
}: {
  type: string;
  search?: string;
  onDetail?: () => void;
}) => {
  const members = useSelector(membersSelector);
  const guests = useSelector(guestsSelector);
  const pendingMembers = useSelector(membersPendingSelector);
  const pendingGuests = useSelector(guestsPendingSelector);

  const dispatch = useDispatch();
  const pendingMembersResult = useCooperatorList(
    COOPERATE_TYPES_LIST['MEMBER_PENDING'],
  );
  const pendingGuestsResult = useCooperatorList(
    COOPERATE_TYPES_LIST['GUEST_PENDING'],
  );

  useEffect(() => {
    if (pendingMembersResult.isSuccess) {
      dispatch(setMemberToAdd(pendingMembersResult.data));
    }
  }, [pendingMembersResult.isSuccess, pendingMembersResult.data, dispatch]);
  useEffect(() => {
    if (pendingGuestsResult.isSuccess) {
      dispatch(setGuestToAdd(pendingGuestsResult.data));
    }
  }, [pendingGuestsResult.isSuccess, pendingGuestsResult.data, dispatch]);

  return (
    <>
      <div className="mt-12px">
        {(() => {
          const renderData = type === 'MEMBER' ? members : guests;

          const searchedData =
            search === undefined || search === ''
              ? renderData
              : renderData.length === 0
              ? renderData
              : renderData.filter((_) => _.name.includes(search));

          if (searchedData.length === 0) {
            return <div className="p-8px" />;
          } else {
            return searchedData.map((_: any, index: number) => (
              <UserRow
                {..._}
                color={
                  _.pivot.color
                    ? COLOR_VALUES[_.pivot.color].label
                    : COLOR_VALUES[0].label
                }
                key={`accepted-${type}-user-${_.id}-${index}`}
                onClickLeft={() => {
                  dispatch(setCurrentCollaboId(_.id));
                  if (onDetail) onDetail();
                }}
                onClickRight={() => {
                  dispatch(setCurrentCollaboId(_.id));
                  if (onDetail) onDetail();
                }}
              />
            ));
          }
        })()}
      </div>
      <div className="mt-12px">
        {(() => {
          const renderData = type === 'MEMBER' ? pendingMembers : pendingGuests;
          const searchedData =
            search === undefined || search === ''
              ? renderData
              : renderData.length === 0
              ? renderData
              : renderData.filter((_) => _.name.includes(search));

          return (
            <>
              <h3 className="mt-12px mx-24px body1 text-fontSecondary">
                承認待ち({searchedData.length})
              </h3>
              {searchedData.length === 0 ? null : (
                <>
                  {renderData.map((_: any) => (
                    <UserRowApproval
                      {..._}
                      color={_.pivot.color}
                      key={`pending-${type}-row-${_.id}`}
                    />
                  ))}
                </>
              )}
            </>
          );
        })()}
      </div>
    </>
  );
};

export default CooperatorListByType;
