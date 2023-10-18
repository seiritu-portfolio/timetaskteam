import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-responsive-modal';
import { useQueryClient } from 'react-query';
// * hooks
import { gcalendarSelector, syncInfoSelector } from '@store/selectors/calendar';
import { scheduleListsSelector } from '@store/selectors/list';
import { userInfoSelector } from '@store/selectors/user';
import { useUpdateSyncInfo } from '@service/calendarMutations';
import { setSyncInfo } from '@store/modules/calendar';
// * components
import CalendarScheduleSelect from './CalendarScheduleSelect';
import { IconWrap } from '@component/general/wrap';
import GoogleCalendarIcon from '@svg/google-calendar.svg';
// * types
import ModalDefaultProps from '@model/modal';
import { SyncItemInfo } from '@model/state';

const ModalSyncSetting = ({ isOpen, close }: ModalDefaultProps) => {
  const { user } = useSelector(userInfoSelector);
  const dispatch = useDispatch();

  const calendarsList = useSelector(gcalendarSelector);
  const scheduleLists = useSelector(scheduleListsSelector);
  const syncInfo = useSelector(syncInfoSelector);
  const listsToSync = useMemo(() => {
    if (scheduleLists.length > 0) {
      const filtered = scheduleLists.filter((list) => list.pivot?.role === 1);
      return filtered.map((list) => ({
        label: list.name,
        value: list.id,
        color: list.color,
        private: list.status === 1,
      }));
    }
    return [];
  }, [scheduleLists]);

  const queryClient = useQueryClient();
  const storeMutation = useUpdateSyncInfo(() => {
    queryClient.invalidateQueries(['list', { type: 'all' }]);
    close();
  });
  const onComplete = useCallback(
    (newSyncInfo: SyncItemInfo[]) => {
      if (storeMutation.isLoading) return false;
      storeMutation.mutate({
        calendars: newSyncInfo,
      });
    },
    [storeMutation],
  );
  const isOptionDisabled = useCallback(
    (option: any, currentSelectedId: number) => {
      const usedScheduleListIDs = syncInfo.map((info) => info.list_id);
      return (
        option.value !== currentSelectedId &&
        usedScheduleListIDs.includes(option.value)
      );
    },
    [syncInfo],
  );
  const onSelect = useCallback(
    (listID: number, calendar: { id: string; summary: string }) => {
      let newInfo: SyncItemInfo[] = [];
      const filtered = syncInfo.filter(
        (info) => info.calendar_id == calendar.id,
      );
      if (listID > 0 && filtered.length > 0) {
        newInfo = syncInfo.map((info) => {
          if (info.calendar_id == calendar.id)
            return {
              ...info,
              list_id: listID,
            };
          else return { ...info };
        });
      } else if (listID > 0) {
        newInfo = [
          ...syncInfo,
          {
            list_id: listID,
            calendar_id: calendar.id,
            calendar_summary: calendar.summary,
          },
        ];
      } else if (filtered.length > 0) {
        newInfo = syncInfo.filter((info) => info.calendar_id != calendar.id);
      } else return false;
      dispatch(setSyncInfo(newInfo));
    },
    [dispatch, syncInfo],
  );

  return (
    <Modal
      open={isOpen}
      onClose={close}
      center
      showCloseIcon={false}
      classNames={{
        modal: 'modal-md-size',
      }}
    >
      <div className="p-36px w-full overflow-y-auto">
        <div className="big-title-light text-fontPrimary">同期設定</div>
        <div className="mt-24px py-12px">
          <div className="body2 text-fontSecondary">同期アカウント</div>
          <div className="mt-24px flex items-center">
            <IconWrap additionalClass="bg-backgroundPrimary">
              <GoogleCalendarIcon width={20} height={20} />
            </IconWrap>
            <span className="ml-16px title-en text-fontPrimary">
              {user?.gc_email}
            </span>
          </div>
        </div>
        <div className="pb-12px w-full">
          {calendarsList.map((calendar) => {
            const filtered = syncInfo.filter(
              (info) => info.calendar_id == calendar.id,
            );
            const scheduleListID =
              filtered.length > 0 ? filtered[0].list_id : -1;

            return (
              <CalendarScheduleSelect
                calendar={calendar}
                scheduleOptions={listsToSync}
                scheduleID={scheduleListID}
                isOptionDisabled={(option: any) => {
                  return isOptionDisabled(option, scheduleListID);
                }}
                onSelect={(listID: number) => onSelect(listID, calendar)}
                key={`calendar-schedule-select-${calendar.id}`}
              />
            );
          })}
        </div>
        <div className="mt-24px w-full flex justify-end">
          <span
            onClick={close}
            className="p-12px button text-fontSecondary cursor-pointer"
          >
            キャンセル
          </span>
          <button
            className={`ml-12px px-24px h-44px rounded-8px bg-primary text-backgroundSecondary button text-backgroundSecondary`}
            onClick={() => onComplete(syncInfo)}
          >
            完了
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalSyncSetting;
