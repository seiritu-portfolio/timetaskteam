import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
// * hooks
import { updateQueueSetting } from '@store/modules/home';
import { queueSettingSelector } from '@store/selectors/home';
import { holidaysSelector } from '@store/selectors/calendar';
// * components
import MultipleDatePick from './MultipleDatePick';
import { IconWrap } from '@component/general/wrap';
import SettingsHeader from '@component/settings/SettingsHeader';
import { DefaultSelect1, DefaultSelect2 } from '@component/general/select';
// * constants & utils
import { configBearerToken } from '@util/constants';
import axiosConfig from '@util/axiosConfig';
import { URL_UPDATE_PRODUCTIVITY_SETTING } from '@util/urls';
import { getHourMinFormat } from '@util/calendar';
import {
  AVAILABLE_TIME_LIST,
  REMAIN_DAYS_FOR_ENDDATE_OPTIONS,
  REMAIN_DAYS_FOR_STARTDATE_OPTIONS,
  TASK_REQUIRED_DEFAULT,
  WEEKDAY_OPTIONS,
} from '@util/selectOptions';

const ProductivitySetting = () => {
  const queueSetting = useSelector(queueSettingSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    setHolidayOff(localStorage.getItem('task3_holidayoff') == 'true');
  }, []);
  const [holidayOff, setHolidayOff] = useState(false);
  const holidays = useSelector(holidaysSelector);
  const holidayDict: string[] = useMemo(() => {
    if (holidays.length !== 0) {
      const currentYear = dayjs().year();
      const days: string[] = [];
      holidays.forEach((holiday) => {
        const holidayDate = `${currentYear}-${holiday.date}`;
        days.push(dayjs(holidayDate).format('YYYY-MM-DD'));
      });
      return days;
    }
    return [];
  }, [holidays]);
  const queryClient = useQueryClient();
  const mutation = useMutation(
    (data: any) => {
      const token = localStorage.getItem('task3_token');
      const config = configBearerToken(token ?? '');

      return axiosConfig.put(URL_UPDATE_PRODUCTIVITY_SETTING, data, config);
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
      onError: async (error) => {
        console.log(error);
      },
    },
  );
  const [urgencyStart, urgencyEnd] = useMemo(() => {
    return [queueSetting?.urgencyStart ?? 3, queueSetting?.urgencyEnd ?? 8];
  }, [queueSetting]);
  const setUrgencyStart = useCallback(
    (newValue: number) => {
      dispatch(
        updateQueueSetting({
          urgencyStart: newValue,
        }),
      );
    },
    [dispatch],
  );
  const setUrgencyEnd = useCallback(
    (newValue: number) => {
      dispatch(
        updateQueueSetting({
          urgencyEnd: newValue,
        }),
      );
    },
    [dispatch],
  );
  const availableTimeOptions = useMemo(
    () =>
      AVAILABLE_TIME_LIST.map((_: number) => ({
        label: getHourMinFormat(_),
        value: _.toString(),
      })),
    [],
  );
  const taskRequiredTimeOptions = useMemo(() => {
    return TASK_REQUIRED_DEFAULT.map((_: number) => ({
      label: getHourMinFormat(_),
      value: _.toString(),
    }));
  }, []);

  // ! inactive days select part
  const setAvailableTime = useCallback(
    (newValue: number) => {
      dispatch(
        updateQueueSetting({
          availableTime: newValue,
        }),
      );
    },
    [dispatch],
  );
  const setTaskDefaultTime = useCallback(
    (newValue: number) => {
      dispatch(
        updateQueueSetting({
          taskDefaultTime: newValue,
        }),
      );
    },
    [dispatch],
  );
  const monthSpanRef = useRef<HTMLSpanElement | null>(null);
  const onWeekdaySelect = useCallback(
    (
      newValue: string,
      oldWeekdays: string[],
      oldNonOperatingDays?: string[],
      oldInactiveDays?: string[],
    ) => {
      const filtered = oldWeekdays.filter((item) => item !== newValue);
      if (filtered.length === oldWeekdays.length)
        return dispatch(
          updateQueueSetting({
            nonOperatingWeekDays: [...oldWeekdays, newValue],
          }),
        );
      else {
        const isHolidayOn = localStorage.getItem('task3_holidayoff') == 'true';

        const newNonOperatingDays = oldNonOperatingDays?.filter((item) => {
          const day = dayjs(item).day().toString();

          if (isHolidayOn) {
            return day !== newValue || holidayDict.includes(item);
          } else {
            return day !== newValue;
          }
        });
        const newInactiveDays = oldInactiveDays?.filter((item) => {
          const day = dayjs(item).day().toString();
          return day !== newValue;
        });

        return dispatch(
          updateQueueSetting({
            nonOperatingDays: newNonOperatingDays,
            nonOperatingWeekDays: filtered,
            noInactiveDays: newInactiveDays,
          }),
        );
      }
    },
    [dispatch, holidayDict],
  );
  const setAutoRemainDays = useCallback(
    (newValue: number) => {
      dispatch(
        updateQueueSetting({
          autoRemainDays: newValue,
        }),
      );
    },
    [dispatch],
  );
  const onDayClick = useCallback(
    (
      item: any,
      oldNonOperatingDays: string[],
      oldInactiveDays: string[],
      oldWeekdays: string[],
    ) => {
      if (item instanceof Date) {
        const currentItemFormat = dayjs(item).format('YYYY-MM-DD');
        const currentDay = item.getDay();
        if (oldWeekdays.includes(currentDay.toString())) {
          const filtered = oldInactiveDays.filter(
            (_) => dayjs(_).format('YYYY-MM-DD') !== currentItemFormat,
          );
          if (filtered.length === oldInactiveDays.length) {
            dispatch(
              updateQueueSetting({
                noInactiveDays: [...oldInactiveDays, currentItemFormat],
              }),
            );
          } else {
            dispatch(
              updateQueueSetting({
                noInactiveDays: filtered,
              }),
            );
          }
        } else {
          const filtered = oldNonOperatingDays.filter(
            (_) => dayjs(_).format('YYYY-MM-DD') !== currentItemFormat,
          );
          const newNoInactiveDays = oldInactiveDays.filter(
            (_) => dayjs(_).format('YYYY-MM-DD') !== currentItemFormat,
          );
          if (filtered.length === oldNonOperatingDays.length) {
            dispatch(
              updateQueueSetting({
                noInactiveDays: newNoInactiveDays,
                nonOperatingDays: [...oldNonOperatingDays, currentItemFormat],
              }),
            );
          } else {
            dispatch(
              updateQueueSetting({
                noInactiveDays: newNoInactiveDays,
                nonOperatingDays: filtered,
              }),
            );
          }
        }
      }
    },
    [dispatch],
  );
  const toggleHolidays = useCallback(
    (
      oldHolidayOff: boolean,
      oldNonOperatingDays: string[],
      oldInactiveDays: string[],
      oldWeekdays: string[],
    ) => {
      if (oldHolidayOff) {
        // ! now we need to turn off holiday
        const filteredOperatingDays = oldNonOperatingDays.filter(
          (_) => !holidayDict.includes(_),
        );
        dispatch(
          updateQueueSetting({
            nonOperatingDays: filteredOperatingDays,
          }),
        );
      } else {
        // ! now we need to turn on holiday
        const newInactiveDays = oldInactiveDays.filter(
          (_) => !holidayDict.includes(_),
        );
        const filteredOperatingDays = oldNonOperatingDays.filter(
          (_) => !holidayDict.includes(_),
        );
        const toAddHolidays = holidayDict.filter((_) => {
          const day = dayjs(_).day().toString();
          return !oldWeekdays.includes(day);
        });
        dispatch(
          updateQueueSetting({
            nonOperatingDays: [...filteredOperatingDays, ...toAddHolidays],
            noInactiveDays: newInactiveDays,
          }),
        );
      }
    },
    [holidayDict, dispatch],
  );

  return (
    <div className="h-full flex flex-col">
      <SettingsHeader title="生産性" />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="p-24px w-full border-b border-separator">
          <span className="body2 text-fontSecondary">
            稼働率計算に用反映される項目設定
          </span>
          <div className="mt-24px body1 text-fontPrimary">
            1日の稼働可能時間
          </div>
          <div className="mt-12px w-full">
            <DefaultSelect1
              value={{
                label: getHourMinFormat(queueSetting?.availableTime ?? 0),
                value: (queueSetting?.availableTime ?? 0).toString(),
              }}
              options={availableTimeOptions}
              onChange={(newValue: any) => {
                setAvailableTime(parseInt(newValue.value));
              }}
            />
          </div>
          <div className="mt-24px body1 text-fontPrimary">
            タスクの所要時間(デフォルト)
          </div>
          <div className="mt-12px w-full">
            <DefaultSelect1
              value={{
                label: getHourMinFormat(queueSetting?.taskDefaultTime ?? 0),
                value: (queueSetting?.taskDefaultTime ?? 0).toString(),
              }}
              options={taskRequiredTimeOptions}
              onChange={(newValue: any) => {
                setTaskDefaultTime(parseInt(newValue.value));
              }}
            />
          </div>
          <div className="mt-24px w-full">
            <div className="w-full multiple-date-pick">
              <MultipleDatePick
                selectedDates={
                  queueSetting?.nonOperatingDays &&
                  queueSetting?.nonOperatingDays.length > 0
                    ? queueSetting?.nonOperatingDays.map(
                        (_: string) => new Date(_ + ' 00:00:00'),
                      )
                    : []
                }
                noInactiveDays={
                  queueSetting?.noInactiveDays &&
                  queueSetting.noInactiveDays.length > 0
                    ? queueSetting.noInactiveDays.map((item) =>
                        dayjs(item).toDate(),
                      )
                    : []
                }
                selectedWeekdays={queueSetting?.nonOperatingWeekDays ?? []}
                changeActiveMonth={(newValue) => {
                  if (monthSpanRef.current) {
                    monthSpanRef.current.textContent = (
                      newValue + 1
                    ).toString();
                  }
                }}
                onDayClick={(item: any) =>
                  onDayClick(
                    item,
                    queueSetting?.nonOperatingDays ?? [],
                    queueSetting?.noInactiveDays ?? [],
                    queueSetting?.nonOperatingWeekDays ?? [],
                  )
                }
              />
            </div>
            <div className="ml-4 mb-4 body1 text-fontPrimary">
              各月の非稼働日登録
            </div>
            <div className="ml-4">
              <div className="w-7/12 flex items-center">
                {WEEKDAY_OPTIONS.slice(0, 4).map((option) => (
                  <div
                    onClick={() =>
                      onWeekdaySelect(
                        option.value,
                        queueSetting?.nonOperatingWeekDays ?? [],
                        queueSetting?.nonOperatingDays ?? [],
                        queueSetting?.noInactiveDays ?? [],
                      )
                    }
                    className={`mx-1 py-1 w-16 rounded-full ${
                      (queueSetting?.nonOperatingWeekDays ?? []).includes(
                        option.value,
                      )
                        ? 'bg-secondary text-backgroundSecondary'
                        : 'bg-backgroundPrimary text-fontPrimary'
                    } body1 cursor-pointer flex-xy-center`}
                    key={`weekday-select-day-${option.value}`}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
              <div className="my-3 w-7/12 flex items-center">
                {WEEKDAY_OPTIONS.slice(4).map((option) => (
                  <div
                    onClick={() =>
                      onWeekdaySelect(
                        option.value,
                        queueSetting?.nonOperatingWeekDays ?? [],
                        queueSetting?.nonOperatingDays ?? [],
                        queueSetting?.noInactiveDays ?? [],
                      )
                    }
                    className={`mx-1 py-1 w-16 rounded-full ${
                      (queueSetting?.nonOperatingWeekDays ?? []).includes(
                        option.value,
                      )
                        ? 'bg-secondary text-backgroundSecondary'
                        : 'bg-backgroundPrimary text-fontPrimary'
                    } body1 cursor-pointer flex-xy-center`}
                    key={`weekday-select-day-${option.value}`}
                  >
                    {option.label}
                  </div>
                ))}
                <div
                  onClick={() => {
                    setHolidayOff((old: boolean) => {
                      toggleHolidays(
                        old,
                        queueSetting?.nonOperatingDays ?? [],
                        queueSetting?.noInactiveDays ?? [],
                        queueSetting?.nonOperatingWeekDays ?? [],
                      );
                      const newValue = !old;
                      localStorage.setItem(
                        'task3_holidayoff',
                        newValue.toString(),
                      );
                      return newValue;
                    });
                  }}
                  className={`mx-1 py-1 w-16 rounded-full ${
                    holidayOff
                      ? 'bg-secondary text-backgroundSecondary'
                      : 'bg-backgroundPrimary text-fontPrimary'
                  } body1 cursor-pointer flex-xy-center`}
                  key={`holiday-non-operating`}
                >
                  祝日
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-24px w-full">
          <span className="body1 text-fontSecondary">オート機能</span>
          <div className="mt-24px body1 text-fontPrimary">
            開始日オート設定の残日数
          </div>
          <div className="mt-12px w-full">
            <DefaultSelect1
              value={
                REMAIN_DAYS_FOR_STARTDATE_OPTIONS.filter(
                  (_) => parseInt(_.value) == queueSetting?.autoRemainDays,
                )[0] ?? REMAIN_DAYS_FOR_STARTDATE_OPTIONS[0]
              }
              options={REMAIN_DAYS_FOR_STARTDATE_OPTIONS}
              onChange={(newValue: any) => {
                setAutoRemainDays(parseInt(newValue.value));
              }}
            />
          </div>
          <div className="mt-12px w-full body1 text-fontSecondary">
            開始日未設定のタスクは期限切れを防止する為に、開始日がオートで設定される期限日までの残日数を選択できます。※この時、継続としては登録されません。
          </div>
          <div className="mt-24px body1 text-fontPrimary">
            緊急度オート切り替え
          </div>
          <div className="mt-12px w-full flex flex-row items-center">
            <IconWrap>
              <span className="body1 text-fontPrimary">高</span>
            </IconWrap>
            <div className="ml-2px flex-1">
              <DefaultSelect2
                value={
                  REMAIN_DAYS_FOR_STARTDATE_OPTIONS.filter(
                    (_) => parseInt(_.value) === urgencyStart,
                  )[0] ?? REMAIN_DAYS_FOR_STARTDATE_OPTIONS[0]
                }
                options={REMAIN_DAYS_FOR_STARTDATE_OPTIONS}
                onChange={(newValue: any) => {
                  setUrgencyStart(parseInt(newValue.value));
                }}
                isOptionDisabled={(option: any) =>
                  parseInt(option.value) + 1 >= urgencyEnd
                }
              />
            </div>
            <IconWrap additionalClass="ml-12px">
              <span className="body1 text-fontPrimary">中</span>
            </IconWrap>
            <span className="ml-2px flex-1 p-12px rounded-8px bg-backgroundPrimary">
              {urgencyStart + 1 === urgencyEnd - 1
                ? urgencyStart + 1
                : `${urgencyStart + 1} - ${urgencyEnd - 1}`}
              日前
            </span>
            <IconWrap additionalClass="ml-12px">
              <span className="body1 text-fontPrimary">低</span>
            </IconWrap>
            <div className="ml-2px flex-1">
              <DefaultSelect2
                value={
                  REMAIN_DAYS_FOR_ENDDATE_OPTIONS.filter(
                    (_) => parseInt(_.value) === urgencyEnd,
                  )[0] ?? REMAIN_DAYS_FOR_ENDDATE_OPTIONS[1]
                }
                options={REMAIN_DAYS_FOR_ENDDATE_OPTIONS}
                onChange={(newValue: any) => {
                  setUrgencyEnd(parseInt(newValue.value));
                }}
                isOptionDisabled={(option: any) =>
                  parseInt(option.value) <= urgencyStart + 1
                }
              />
            </div>
          </div>
        </div>
        <div className="mt-24px flex-none px-24px py-12px h-68px border-t border-separator flex justify-end">
          {
            <button
              className={`px-24px rounded-8px body3 text-backgroundSecondary cursor-pointer ${
                mutation.isLoading ? 'bg-primaryDisabled' : 'bg-primary'
              }`}
              onClick={() => {
                if (mutation.isLoading) {
                  return false;
                }

                const nonOperatingExceptionDays =
                  queueSetting.noInactiveDays &&
                  queueSetting.noInactiveDays.length === 1 &&
                  queueSetting.noInactiveDays[0] === ''
                    ? ','
                    : queueSetting?.noInactiveDays &&
                      queueSetting.noInactiveDays.length > 0
                    ? queueSetting.noInactiveDays.join(',')
                    : ',';
                mutation.mutate({
                  available_time: queueSetting?.availableTime,
                  task_default_time: queueSetting?.taskDefaultTime,
                  auto_remain_days: queueSetting?.autoRemainDays,
                  urgency_switch:
                    (queueSetting?.urgencyStart?.toString() ?? 3) +
                    '-' +
                    (queueSetting?.urgencyEnd?.toString() ?? 8),
                  non_operating_days:
                    queueSetting?.nonOperatingDays?.join(',') ?? '',
                  non_operating_week_days:
                    queueSetting?.nonOperatingWeekDays?.join(',') ?? '',
                  non_operating_exception_days: nonOperatingExceptionDays,
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

export default ProductivitySetting;
