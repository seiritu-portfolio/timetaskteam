import { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
// * hooks
import { setUserlistSettingMode } from '@store/modules/home';
import { userInfoSelector } from '@store/selectors/user';
import {
  guestsSelector,
  membersSelector,
  requestersSelector,
} from '@store/selectors/collabos';
// * components
import SettingsHeader from '@component/settings/SettingsHeader';
import { UserAddRequestRow } from '@component/settings/userList/parts/UserRow';
import ModalAcceptRequest from '@component/settings/userList/addUser/ModalAcceptRequest';
// *
import {
  COLLABOS_LIMIT_COUNT,
  COLOR_VALUES,
  configBearerToken,
  USERLIST_STATES,
} from '@util/constants';
import axiosConfig from '@util/axiosConfig';
import { URL_REQUESTER_REJECT } from '@util/urls';
import ModalLimitCount from '@component/list/ModalLimitCount';

const AddUser = () => {
  const requesters = useSelector(requestersSelector);

  const dispatch = useDispatch();
  const [isModalAddUser, setIsModalAddUser] = useState(false);
  const [userToAccept, setUserToAccept] = useState(-1);

  const queryClient = useQueryClient();
  const mutation = useMutation(
    (id: number) => {
      const token = localStorage.getItem('task3_token');
      const config = configBearerToken(token ?? '');

      return axiosConfig.put(
        URL_REQUESTER_REJECT.replace(/\%s/g, id.toString()),
        {},
        config,
      );
    },
    {
      onSuccess: async () => {
        queryClient.invalidateQueries('requesters');
        toast.info('あなたはリクエストを拒否しました。', {
          hideProgressBar: true,
          progress: undefined,
        });
      },
    },
  );

  const members = useSelector(membersSelector);
  const guests = useSelector(guestsSelector);
  const { user } = useSelector(userInfoSelector);
  const isCountFull = useMemo(() => {
    if (user?.premium_code && user?.premium_code !== '') {
      return false;
    }
    return members.length + guests.length >= COLLABOS_LIMIT_COUNT;
  }, [user, members, guests]);

  return (
    <div className="h-full flex flex-col">
      <SettingsHeader
        title="追加リクエスト"
        hasSearch={false}
        onBack={() =>
          dispatch(setUserlistSettingMode(USERLIST_STATES.GENERAL_MODE))
        }
      />
      <div className="flex-1 mt-12px flex flex-col overflow-y-auto">
        {requesters &&
          requesters.length > 0 &&
          requesters.map((_, index) => (
            <UserAddRequestRow
              id={_.id}
              avatar={_.avatar ?? ''}
              name={_.name}
              email={_.email}
              color={
                _?.pivot?.color
                  ? COLOR_VALUES[_?.pivot?.color].label
                  : undefined
              }
              key={`user row ${index}`}
              onReject={() => {
                mutation.mutate(_.id);
              }}
              onAccept={() => {
                setUserToAccept(_.id);
                setIsModalAddUser(true);
              }}
            />
          ))}
        {}
      </div>
      <ModalAcceptRequest
        userID={userToAccept}
        isOpen={isModalAddUser && !isCountFull}
        close={() => setIsModalAddUser(false)}
      />
      <ModalLimitCount
        isOpen={isModalAddUser && isCountFull == true}
        close={() => {
          setIsModalAddUser(false);
        }}
        isUserLimited={true}
      />
    </div>
  );
};

export default AddUser;
