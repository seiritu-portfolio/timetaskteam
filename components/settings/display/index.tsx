import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TimezoneSelect, { allTimezones } from 'react-timezone-select';
import Switch from 'react-switch';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import Select from 'react-select';

import { queueSettingSelector } from '@store/selectors/home';
import SettingsHeader from '@component/settings/SettingsHeader';
import DownTriangleIcon from '@svg/triangle-small.svg';

import defaultSelectStyles from '@util/selectConfig';
import {
  TIME_DISPLAY_OPTIONS,
  WEEK_START_DATE_OPTIONS,
} from '@util/selectOptions';
import { configBearerToken } from '@util/constants';
import axiosConfig from '@util/axiosConfig';
import { URL_UPDATE_DISPLAY_SETTING } from '@util/urls';
import { updateQueueSetting } from '@store/modules/home';

const DisplaySetting = () => {
  const queueSetting = useSelector(queueSettingSelector);

  const dispatch = useDispatch();
  const setTz = useCallback(
    (newValue: string) => {
      dispatch(updateQueueSetting({ tz: newValue }));
    },
    [dispatch],
  );
  const setTimeDisplay = useCallback(
    (newValue: number) => {
      dispatch(updateQueueSetting({ timeDisplay: newValue }));
    },
    [dispatch],
  );
  const setWeekStart = useCallback(
    (newValue: number) => {
      dispatch(updateQueueSetting({ weekStart: newValue }));
    },
    [dispatch],
  );
  const setDisplayHoliday = useCallback(
    (newValue: number) => {
      dispatch(
        updateQueueSetting({
          displayHoliday: newValue,
        }),
      );
    },
    [dispatch],
  );

  const queryClient = useQueryClient();
  const mutation = useMutation(
    (data: any) => {
      const token = localStorage.getItem('task3_token');
      const config = configBearerToken(token ?? '');

      return axiosConfig.put(URL_UPDATE_DISPLAY_SETTING, data, config);
    },
    {
      onSuccess: async () => {
        toast.success('成功', {
          hideProgressBar: true,
          progress: undefined,
          onOpen: () => {
            queryClient.invalidateQueries('my_info');
          },
        });
      },
      onError: async (error) => {},
    },
  );

  return (
    <div className="h-full flex flex-col">
      <SettingsHeader title="表示設定" />
      <div className="flex-1 pt-24px w-full flex flex-col overflow-y-auto">
        <div className="px-24px">
          <span className="body2 text-fontSecondary">日付と時間</span>
          <div className="mt-24px body1 text-fontPrimary">タイムゾーン</div>
          <div className="mt-12px w-full">
            <TimezoneSelect
              value={
                queueSetting?.tz ??
                Intl.DateTimeFormat().resolvedOptions().timeZone
              }
              // @ts-ignore
              onChange={(newValue) => {
                setTz(newValue.value);
              }}
              timezones={{ ...allTimezones }}
              styles={defaultSelectStyles as any}
              components={{
                DropdownIndicator: ({ innerProps, isDisabled }) =>
                  !isDisabled ? (
                    <DownTriangleIcon
                      {...innerProps}
                      width={20}
                      height={20}
                      className="absolute mr-16px top-12px right-0 text-fontSecondary"
                    />
                  ) : null,
                IndicatorSeparator: () => null,
              }}
            />
          </div>
          <div className="mt-24px body1 text-fontPrimary">時刻表示</div>
          <div className="mt-12px w-full">
            <Select
              styles={defaultSelectStyles}
              value={
                TIME_DISPLAY_OPTIONS.filter(
                  (_) => parseInt(_.value) == queueSetting?.timeDisplay,
                )[0] ?? TIME_DISPLAY_OPTIONS[0]
              }
              isSearchable={false}
              options={TIME_DISPLAY_OPTIONS}
              onChange={(newValue: any) => {
                setTimeDisplay(parseInt(newValue.value));
              }}
              components={{
                DropdownIndicator: ({ innerProps, isDisabled }) =>
                  !isDisabled ? (
                    <DownTriangleIcon
                      {...innerProps}
                      width={20}
                      height={20}
                      className="absolute mr-16px top-12px right-0 text-fontSecondary"
                    />
                  ) : null,
                IndicatorSeparator: () => null,
              }}
            />
          </div>
          <div className="mt-24px body1 text-fontPrimary">週の開始日</div>
          <div className="mt-12px w-full">
            <Select
              styles={defaultSelectStyles}
              value={
                WEEK_START_DATE_OPTIONS.filter(
                  (_) => parseInt(_.value) == queueSetting?.weekStart,
                )[0] ?? WEEK_START_DATE_OPTIONS[0]
              }
              isSearchable={false}
              options={WEEK_START_DATE_OPTIONS}
              onChange={(newValue: any) => {
                setWeekStart(parseInt(newValue.value));
              }}
              components={{
                DropdownIndicator: ({ innerProps, isDisabled }) =>
                  !isDisabled ? (
                    <DownTriangleIcon
                      {...innerProps}
                      width={20}
                      height={20}
                      className="absolute mr-16px top-12px right-0 text-fontSecondary"
                    />
                  ) : null,
                IndicatorSeparator: () => null,
              }}
            />
          </div>
          <div className="mt-24px body1 text-fontPrimary">祝日の表示</div>
          <div className="mt-12px px-16px py-12px w-full rounded-8px border-1/2 border-separator bg-backgroundSecondary flex-row--between">
            <span className="">
              {queueSetting?.displayHoliday ? 'オン' : 'オフ'}
            </span>
            <Switch
              onChange={() => {
                setDisplayHoliday(1 - (queueSetting?.displayHoliday ?? 1));
              }}
              checked={queueSetting?.displayHoliday == 1}
              offColor="#888"
              onColor="#007aff"
              width={38}
              height={20}
              handleDiameter={18}
              uncheckedIcon={false}
              checkedIcon={false}
            />
          </div>
        </div>
        <div className="mt-24px flex-none px-24px py-12px h-68px flex justify-end transition-all duration-300 border-t border-separator">
          {
            <button
              className={`px-24px rounded-8px body3 text-backgroundSecondary cursor-pointer ${
                mutation.isLoading ? 'bg-primaryDisabled' : 'bg-primary'
              }`}
              onClick={() => {
                if (mutation.isLoading) {
                  return false;
                }
                mutation.mutate({
                  timezone: queueSetting?.tz,
                  time_display: queueSetting?.timeDisplay,
                  week_start: queueSetting?.weekStart,
                  holiday_display: queueSetting?.displayHoliday,
                });
              }}
            >
              保存
            </button>
          }
        </div>
      </div>
    </div>
  );
};

export default DisplaySetting;
