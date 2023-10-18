import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import {
  setCurrentOpenModal,
  setCurrentSettingState,
} from '@store/modules/subscription';
import { useInvitedList } from '@service/subscriptionQueries';
import {
  premiumCodeSelector,
  userCountSelector,
} from '@store/selectors/subscription';
import {
  configBearerToken,
  SUBSCRIPTION_USERCOUNT_MESSAGES,
} from '@util/constants';
import { URL_INVITED_DELETE } from '@util/urls';

import SettingsHeader from '../SettingsHeader';
import InvitedUserRow from './InvitedUserRow';
import ModalDelInvited from './modals/ModalDelInvited';
// * utils
import axiosConfig from '@util/axiosConfig';

const InvitedManageSetting = () => {
  const dispatch = useDispatch();
  const [showPremiumCode, setShowPremiumCode] = useState(false);
  const [usernameDelete, setUsernameDelete] = useState('');
  const [userIDDelete, setUserIDDelete] = useState(0);

  const totalCount = useSelector(userCountSelector);
  const [invitedUsers, setInvitedUsers] = useState<any[]>([]);
  const invitedListResult = useInvitedList();
  const premiumCode = useSelector(premiumCodeSelector);
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (data: any) => {
      const token = localStorage.getItem('task3_token');
      const config = configBearerToken(token ?? '');

      return axiosConfig.delete(
        URL_INVITED_DELETE.replace(/\%s/g, data.toString()),
        { ...config },
      );
    },
    {
      onSuccess: async () => {
        queryClient.invalidateQueries('invited_list');
        toast.success('成功', {
          hideProgressBar: false,
          progress: undefined,
        });
      },
      onError: async () => {
        toast.error('失敗', {
          hideProgressBar: false,
          progress: undefined,
        });
      },
    },
  );

  useEffect(() => {
    if (invitedListResult.isSuccess) {
      setInvitedUsers([...invitedListResult.data]);
    }
  }, [invitedListResult.isSuccess, invitedListResult.data]);

  return (
    <div className="relative h-full flex flex-col">
      <SettingsHeader
        title="ユーザー管理"
        hasSearch={true}
        onBack={() => {
          dispatch(setCurrentSettingState(0));
        }}
      />
      <div className="flex flex-col h-full justify-between overflow-y-auto">
        <div className="p-24px">
          <div className="py-12px px-24px w-full rounded-8px bg-backgroundPrimary flex-row--between">
            <div className="body2 text-fontSecondary">
              {invitedUsers.length > 0 &&
                totalCount &&
                (invitedUsers.length < totalCount
                  ? `プレミアムコードは残り${
                      totalCount - invitedUsers.length
                    }ユーザーの登録が可能です`
                  : SUBSCRIPTION_USERCOUNT_MESSAGES.NO_SPACE_LEFT)}
            </div>
            <div
              className={`body2 text-primary cursor-pointer ${
                totalCount && invitedUsers.length < totalCount
                  ? ''
                  : 'invisible'
              }`}
              onClick={() => {
                if (totalCount && invitedUsers.length < totalCount) {
                  setShowPremiumCode((old) => !old);
                } else {
                  // purchase more
                }
              }}
            >
              {showPremiumCode ? premiumCode : 'プレミアムコードを表示'}
            </div>
          </div>
          <div className="mt-24px mb-12px body2 text-fontSecondary">
            プレミアムコード登録ユーザー
          </div>
          {invitedUsers.length > 0 &&
            invitedUsers.map((user: any) => {
              if (user.premium_method && user.premium_method !== '') {
                return null;
              }
              return (
                <InvitedUserRow
                  name={user.name}
                  avatar={user.avatar}
                  color={user.pivot?.color ?? null}
                  onDelete={() => {
                    setUsernameDelete(user.name);
                    setUserIDDelete(user.id);
                  }}
                  key={`invited-user-id-${user.id}`}
                />
              );
            })}
        </div>
        <div className="flex-none p-24px w-full border-t border-separator flex-row--end">
          <div
            className="body3 text-primary cursor-pointer"
            onClick={() => {
              dispatch(setCurrentOpenModal(4));
            }}
          >
            追加購入
          </div>
        </div>
      </div>
      <ModalDelInvited
        username={usernameDelete}
        isOpen={usernameDelete !== ''}
        close={() => {
          setUsernameDelete('');
        }}
        onSuccess={() => {
          if (mutation.isLoading) {
            return false;
          }
          mutation.mutate(userIDDelete);
          setUsernameDelete('');
        }}
      />
    </div>
  );
};

export default InvitedManageSetting;
