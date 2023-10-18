import { useCallback, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQueryClient } from 'react-query';
// * hooks
import { updateUser } from '@store/modules/user';
import { userInfoSelector } from '@store/selectors/user';
import { gcalendarSelector, syncInfoSelector } from '@store/selectors/calendar';
import { scheduleListsSelector } from '@store/selectors/list';
import {
  useRemoveEvent,
  useRemoveSyncInfo,
  useResetSync,
  useUpdateSyncInfo,
} from '@service/calendarMutations';
import { setSyncInfo } from '@store/modules/calendar';
// * components
import SettingsHeader from '../SettingsHeader';
import CalendarScheduleSelect from './CalendarScheduleSelect';
// * types
import { SyncItemInfo } from '@model/state';

const EditSync = ({ onBack }: { onBack: () => void }) => {
  const { user } = useSelector(userInfoSelector);
  const dispatch = useDispatch();

  const calendarList = useSelector(gcalendarSelector);
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
    queryClient.invalidateQueries('schedules');
  });
  const { mutate: resetMutate, isLoading: resetLoading } = useResetSync(() => {
    queryClient.invalidateQueries('schedules');
  });
  const { mutate: removeMutate, isLoading: removeLoading } = useRemoveSyncInfo(
    () => {
      dispatch(
        updateUser({
          gc_email: null,
          gc_refresh_token: null,
        }),
      );
      // queryClient.invalidateQueries('my_info');
      onBack();
    },
  );
  const { mutate: removeEventMutate, isLoading: removeEventLoading } =
    useRemoveEvent();

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
  const onRemoveSync = useCallback(() => {
    if (removeLoading) {
    } else {
      removeMutate();
    }
  }, [removeMutate, removeLoading]);

  const resetDate1Ref = useRef<HTMLInputElement | null>(null);
  const resetDate2Ref = useRef<HTMLInputElement | null>(null);
  const eventIDRef = useRef<HTMLInputElement | null>(null);
  const onResetSync = useCallback(() => {
    if (resetLoading) {
    } else {
      resetMutate({
        date1: resetDate1Ref.current?.value ?? '2023-05-02',
        date2: resetDate2Ref.current?.value ?? '2023-05-04',
      });
    }
  }, [resetMutate, resetLoading]);
  const onRemoveEvent = useCallback(() => {
    if (removeEventLoading) {
    } else {
      removeEventMutate({
        eventId: eventIDRef.current?.value ?? '',
      });
    }
  }, [removeEventMutate, removeEventLoading]);

  return (
    <div className="h-full flex flex-col">
      <SettingsHeader
        title={`${user?.gc_email ?? ''}の同期設定`}
        onBack={onBack}
      />
      <div className="flex-1 px-24px flex flex-col overflow-y-auto">
        <div className="flex flex-row hidden">
          <input
            ref={resetDate1Ref}
            placeholder="2023-05-02"
            type="text"
            className="border"
          />
          <input
            ref={resetDate2Ref}
            placeholder="2023-05-04"
            type="text"
            className="ml-2 border"
          />
          <div
            onClick={onResetSync}
            className="ml-2 px-24px py-12px w-36 bg-secondary hover:opacity-50 cursor-pointer flex flex-row items-center justify-center"
          >
            同期初期化
          </div>
        </div>
        <div className="flex flex-row hidden">
          <input
            ref={eventIDRef}
            placeholder="イベント id"
            type="text"
            className="border"
          />
          <div
            onClick={onRemoveEvent}
            className="ml-2 px-24px py-12px w-36 bg-secondary hover:opacity-50 cursor-pointer flex flex-row items-center justify-center"
          >
            イベントを削除
          </div>
        </div>
        {calendarList.map((calendar) => {
          const filtered = syncInfo.filter(
            (info) => info.calendar_id == calendar.id,
          );
          const scheduleListID = filtered.length > 0 ? filtered[0].list_id : -1;
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
      <div
        className={`flex-none px-24px h-68px border-t-1/2 border-separator body1 flex-row--between transition-all duration-500`}
      >
        <span className="text-secondary cursor-pointer" onClick={onRemoveSync}>
          同期解除
        </span>
        <div className="flex items-center">
          <span className="text-fontSecondary cursor-pointer" onClick={onBack}>
            キャンセル
          </span>
          <span
            className="ml-24px text-primary cursor-pointer"
            onClick={() => onComplete(syncInfo)}
          >
            保存
          </span>
        </div>
      </div>
    </div>
  );
};

export default EditSync;
