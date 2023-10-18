import { useCallback, useEffect, useState } from 'react';
// import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useQueryClient } from 'react-query';
// * hooks
import { useCalendarAuthMutation } from '@service/calendarHooks';
import { useCalendarsList } from '@service/calendarQueries';
import { userInfoSelector } from '@store/selectors/user';
import { setGCalendarList } from '@store/modules/calendar';
import { gcalendarSelector } from '@store/selectors/calendar';
import { updateUser } from '@store/modules/user';
// * components
import SettingsHeader from '../SettingsHeader';
import ModalSyncSetting from './ModalSyncSetting';
import CalendarSettingRow from './CalendarSettingRow';
import EditSync from './EditSync';
import { useRemoveSyncInfo } from '@service/calendarMutations';

const SyncSetting = () => {
  const { user } = useSelector(userInfoSelector);
  const [isGsiLoaded, setIsGsiLoaded] = useState(false);

  const [isModalSyncSetting, setIsModalSyncSetting] = useState(false);
  const { isLoading: authLoading, mutate: authMutate } =
    useCalendarAuthMutation();

  const [isTokenExpired, setIsTokenExpired] = useState(false);
  const calendarsListResult = useCalendarsList(user?.gc_refresh_token != null);
  const dispatch = useDispatch();
  useEffect(() => {
    if (calendarsListResult.status == 'success') {
      setIsTokenExpired(false);
      const tempList = calendarsListResult.data
        .filter((item: any) => item.accessRole == 'owner')
        .map((item: any) => ({
          id: item.id,
          summary: item.summary,
        }));
      dispatch(setGCalendarList(tempList));
    } else if (calendarsListResult.status === 'error') {
      setIsTokenExpired(true);
    }
  }, [calendarsListResult.status, dispatch, calendarsListResult.data]);
  const calendarsList = useSelector(gcalendarSelector);

  const { mutate: removeMutate, isLoading: removeLoading } = useRemoveSyncInfo(
    () => {
      dispatch(
        updateUser({
          gc_email: null,
          gc_refresh_token: null,
        }),
      );
      // queryClient.invalidateQueries('my_info');
    },
  );
  const onRemoveSync = useCallback(() => {
    if (removeLoading) {
    } else {
      removeMutate();
    }
  }, [removeMutate, removeLoading]);

  const queryClient = useQueryClient();
  const openSignInPopup = useCallback(() => {
    if (isGsiLoaded) {
      const client = google.accounts.oauth2.initCodeClient({
        client_id:
          '498542936471-viaf2tpel9hdmifsr3ruocg7395b6ker.apps.googleusercontent.com',
        scope: 'https://www.googleapis.com/auth/calendar',
        select_account: true,
        // redirect_uri: 'http://localhost:3000/settings/sync',
        callback: (handleCredentialResponse: any) => {
          const authCode = handleCredentialResponse.code;

          fetch('https://www.googleapis.com/oauth2/v3/token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              code: authCode,
              client_id:
                '498542936471-viaf2tpel9hdmifsr3ruocg7395b6ker.apps.googleusercontent.com',
              client_secret: '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',
              // redirect_uri: 'http://localhost:3000',
              redirect_uri: 'https://tasksclear-test.com',
              grant_type: 'authorization_code',
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              const accessToken = data.access_token;
              const idToken = data.id_token;
              const refreshToken = data.refresh_token;

              const jwtPayload = parseJwt(idToken);
              const currentGmail = jwtPayload.email;

              if (authLoading) {
              } else {
                authMutate({
                  gmail: currentGmail,
                  auth_code: '',
                  refresh_token: refreshToken,
                });
              }

              fetch(
                'https://www.googleapis.com/calendar/v3/users/me/calendarList',
                {
                  method: 'GET',
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                  },
                },
              )
                .then((response) => response.json())
                .then((data) => {
                  const calendarItems = data.items
                    .filter(
                      (calendarItem: any) => calendarItem.accessRole == 'owner',
                    )
                    .map((calendarItem: any) => ({
                      id: calendarItem.id,
                      summary: calendarItem.summary,
                    }));
                  dispatch(setGCalendarList(calendarItems));
                  dispatch(
                    updateUser({
                      gc_email: currentGmail,
                    }),
                  );
                  queryClient.invalidateQueries('my_info');
                  setIsModalSyncSetting(true);
                });
            });
        },
      });

      client.requestCode();
    } else {
      console.log('準備できていません。');
    }
  }, [dispatch, isGsiLoaded, queryClient, authLoading, authMutate]);

  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const handleGsiLoad = () => {
      setIsGsiLoaded(true);
    };

    const scriptGsi = document.createElement('script');
    scriptGsi.src = 'https://accounts.google.com/gsi/client';
    scriptGsi.onload = handleGsiLoad;
    scriptGsi.setAttribute('defer', '');
    scriptGsi.setAttribute('async', '');

    document.body.appendChild(scriptGsi);
  }, []);

  return !isEditMode ? (
    <>
      <SettingsHeader title="機能連携" />
      <div className="p-24px w-full">
        <span className="body2 text-fontSecondary">Googleカレンダーと同期</span>
        {!user?.gc_refresh_token && (
          <CalendarSettingRow
            title="Googleカレンダー"
            linkText="同期"
            isGoogleLogin={true}
            onLink={openSignInPopup}
            disabled={!isGsiLoaded}
          />
        )}
        {user?.gc_refresh_token && (
          <>
            <CalendarSettingRow
              title={user?.gc_email ?? user?.google_email ?? 'Googleカレンダー'}
              linkText="編集"
              onLink={() => {
                if (calendarsList && calendarsList.length > 0) {
                  // ! goto calendar sync setting
                  setIsEditMode(true);
                }
              }}
              onTokenExpired={onRemoveSync}
              isTokenExpired={isTokenExpired}
              isCheckingToken={calendarsListResult.isLoading}
              disabled={!isGsiLoaded}
            />
            <CalendarSettingRow
              title="Googleカレンダー"
              linkText="別のアカウントを同期"
              isGoogleLogin={true}
              onLink={openSignInPopup}
              disabled={!isGsiLoaded}
            />
          </>
        )}
        <div className="mt-12px body2 text-fontSecondary">
          インポートやエクスポートは、〇〇の起動時に自動で実行されます。
          <br />
          起動するまでは反映されません。
          <br />
          タスクは同期することができません。
        </div>
      </div>
      <ModalSyncSetting
        isOpen={isModalSyncSetting}
        close={() => {
          setIsModalSyncSetting(false);
        }}
      />
    </>
  ) : (
    <EditSync onBack={() => setIsEditMode(false)} />
  );
};

export default SyncSetting;

function parseJwt(token: string) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(''),
  );

  return JSON.parse(jsonPayload);
}
