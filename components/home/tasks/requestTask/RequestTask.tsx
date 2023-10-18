import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { BulkRequestSelect } from '../../Selects';
import Selected from './Selected';
import NoUsers from './NoUsers';
import ModalSelUserForList from '@component/list/ModalSelUserForList';
import {
  groupsSelector,
  guestsSelector,
  membersSelector,
} from '@store/selectors/collabos';

const RequestTask = ({
  values,
  setValues,
  additionalClass,
  role,
  availableUserIDs,
}: {
  values: number[];
  setValues: (newValue: number[]) => void;
  additionalClass: string;
  role: number;
  availableUserIDs?: number[];
}) => {
  const [openSelect, setOpenSelect] = useState(false);
  const [isModalSelectUser, setIsModalSelectUser] = useState(false);
  const members = useSelector(membersSelector);
  const guests = useSelector(guestsSelector);
  const groups = useSelector(groupsSelector);

  const memberList = useMemo(() => {
    if (availableUserIDs == undefined) {
      return members;
    }
    return members.filter((_) => availableUserIDs.includes(_.id));
  }, [members, availableUserIDs]);
  const guestList = useMemo(() => {
    if (availableUserIDs == undefined) {
      return guests;
    }
    return guests.filter((_) => availableUserIDs.includes(_.id));
  }, [guests, availableUserIDs]);
  const groupList = useMemo(() => {
    if (availableUserIDs == undefined || groups.length == 0) {
      return groups;
    }
    return groups.filter((_) => {
      if (!_.users || _.users.length == 0) {
        return false;
      }
      _.users.forEach((user) => {
        if (!availableUserIDs.includes(user.id)) return false;
      });
      return true;
    });
  }, [groups, availableUserIDs]);

  return (
    <div className={`relative w-full flex flex-col ${additionalClass}`}>
      <BulkRequestSelect
        values={values}
        setValue={(newValue: number | null) => {
          if (newValue) {
            setValues([newValue]);
          } else {
            setValues([]);
          }
        }}
        additionalClass="absolute ml-44px w-full invisible"
        role={role}
        open={openSelect}
        setOpen={setOpenSelect}
        onBulkSelect={() => {
          setIsModalSelectUser(true);
        }}
        availableUserIDs={availableUserIDs}
      />
      {values.length === 0 ? (
        <NoUsers onSelect={() => setOpenSelect((old) => !old)} role={role} />
      ) : (
        <Selected
          userIDs={values}
          onRemove={(userID: number) => {
            if (values.length > 0) {
              setValues(values.filter((_) => _ !== userID));
            }
          }}
          onClear={() => {
            setValues([]);
          }}
        />
      )}
      <ModalSelUserForList
        isOpen={isModalSelectUser}
        close={() => {
          setIsModalSelectUser(false);
        }}
        memberList={memberList}
        guestList={guestList}
        groupList={groupList}
        selectedUserIDs={[]}
        onConfirm={(idsToAdd: number[], _: number) => {
          setValues(idsToAdd);
          setIsModalSelectUser(false);
        }}
      />
    </div>
  );
};

export default RequestTask;
