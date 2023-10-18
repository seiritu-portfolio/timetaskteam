import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import Switch from 'react-switch';
import dayjs from 'dayjs';
// * hooks
import {
  useTaskAddMutation,
  useTaskUpdateMutation,
} from '@service/taskMutation';
import { setTaskID } from '@store/modules/tasks';
import {
  taskInboxIDSelector,
  tzOffsetBrowserSelector,
  tzOffsetSelector,
  userInfoSelector,
} from '@store/selectors/user';
import {
  currentTaskIDSelector,
  currentTaskSelector,
} from '@store/selectors/tasks';
import {
  taskListsSelector,
  currentListIDSelector,
} from '@store/selectors/list';
import useHotkeys from '@service/hooks/useHotkeys';
import { taskModalStatusSelector } from '@store/selectors/home';
// * components
import {
  ImportanceSelect,
  ReminderSelect,
  RepetitionSelect,
  RequiredTimeSelect,
} from '@component/home/Selects';
import { IconWrap01 } from '@component/general/wrap';
import FileSelect from './FileSelector';
import ListResultForTask from '../ListForTaskSelect';
import RequestTask from './requestTask/RequestTask';
import DatePicker from '../schedule/DatePicker';
// * constants & utils
import { REMINDER_OPTIONS } from '@util/selectOptions';
import { reminderToString } from '@util/helpers';
// * assets
import MultiplyIcon from '@svg/multiply.svg';
import BellIcon from '@svg/bell.svg';
import CirclepathIcon from '@svg/circlepath.svg';
import FlameIcon from '@svg/flame.svg';
import CalendarIcon from '@svg/calendar.svg';
import StopwatchIcon from '@svg/stopwatch.svg';
import ClipIcon from '@svg/clip.svg';
import { SHORTCUT_LIST } from '@util/shortcutMap';

const TaskAdd = ({ close }: { close?: () => void }) => {
  const { user } = useSelector(userInfoSelector);
  const tzOffset = useSelector(tzOffsetSelector);
  const tzOffsetBrowser = useSelector(tzOffsetBrowserSelector);
  const currentTask = useSelector(currentTaskSelector);
  const isModal = useSelector(taskModalStatusSelector);

  const currentDate: Date = useMemo(() => {
    const currentDateWithTz = new Date();
    currentDateWithTz.setMinutes(
      currentDateWithTz.getMinutes() + tzOffset - tzOffsetBrowser,
    );
    return currentDateWithTz;
  }, [tzOffset, tzOffsetBrowser]);
  const [state, setState] = useState<
    {
      startDate: Date | null;
      endDate: Date | null;
      key: string;
    }[]
  >([
    {
      startDate: currentDate,
      endDate: currentDate,
      key: 'selection',
    },
  ]);

  const [startDatetime, setStartDatetime] = useState<Date | null>(null);
  const [endDatetime, setEndDatetime] = useState<Date | null>(null);
  const urgencyLvl = useMemo(() => {
    if (endDatetime && user?.urgency_switch) {
      const [urgent, still] = user.urgency_switch.split('-');

      const dayDiff: number =
        (endDatetime.getTime() - currentDate.getTime()) / (1000 * 3600 * 24);

      if (dayDiff > parseInt(still)) {
        return 1;
      } else if (dayDiff > parseInt(urgent)) {
        return 2;
      } else return 3;
    } else {
      // end date not set
      return 1;
    }
  }, [endDatetime, user, currentDate]);

  // const [forStartDate, setForStartDate] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    setFocus,
  } = useForm();
  const [reminderValue, setReminderValue] = useState(REMINDER_OPTIONS[0]);
  const [rrule, setRrule] = useState('');
  const taskInboxId: number = useSelector(taskInboxIDSelector);
  const [listId, setListId] = useState<number>(taskInboxId);
  const currentListID = useSelector(currentListIDSelector);
  useEffect(() => {
    if (currentListID) {
      setListId(currentListID);
    }
  }, [setListId, currentListID]);
  const [importance, setImportance] = useState<number>(1);
  const [continuation, setContinuation] = useState<number>(0);
  const [requiredTime, setRequiredTime] = useState<number>(30);
  const [shareUsers, setShareUsers] = useState<number[]>([]);
  const [uploadedList, setUploadedList] = useState<string[]>([]);
  const {
    currentRolePos,
    lowerCooperators,
    upperCooperators,
  }: {
    currentRolePos: number;
    lowerCooperators: any[];
    upperCooperators: any[];
  } = useMemo(() => {
    if (currentTask?.id) {
      const cooperators = currentTask.cooperators;
      if (cooperators.length === 0) {
        return {
          currentRolePos: 1,
          lowerCooperators: [],
          upperCooperators: [
            {
              [user?.id ?? 0]: 1,
            },
          ],
        };
      }
      const currentRole = currentTask.pivot.role;
      let currentRolePos;
      if (currentRole === 1) {
        currentRolePos = 1;
      }
      const coopCollection = cooperators.reduce(
        (
          ctx: {
            [id: string]: any;
          },
          el: any,
        ) => {
          if (el.pivot.role === 1) {
            ctx.top.push(el);
          } else if (el.pivot.role === 2) {
            ctx.mid.push(el);
          } else if (el.pivot.role === 3) {
            ctx.bottom.push(el);
          } else if (el.pivot.role === 4) {
            ctx.bulk.push(el);
          } else {
            ctx.rest.push(el);
          }
          return ctx;
        },
        {
          top: [],
          mid: [],
          bottom: [],
          bulk: [],
          rest: [],
        },
      );
      const midCount = coopCollection.mid.length;
      const bulkCount = coopCollection.bulk.length;

      if (currentRole === 1) {
        currentRolePos = 1;
        return {
          currentRolePos,
          lowerCooperators:
            midCount === 0
              ? bulkCount === 0
                ? coopCollection.bottom
                : coopCollection.bulk
              : coopCollection.mid,
          upperCooperators: coopCollection.top.map((item: any) => ({
            [item.id]: 1,
          })),
        };
      }
      if (midCount === 0) {
        currentRolePos = bulkCount > 0 ? 4 : 2;
        return {
          currentRolePos,
          lowerCooperators: [],
          upperCooperators:
            currentRolePos === 2
              ? [
                  ...coopCollection.top.map((item: any) => ({
                    [item.id]: 1,
                  })),
                  ...coopCollection.bottom.map((item: any) => ({
                    [item.id]: 2,
                  })),
                ]
              : coopCollection.top.map((item: any) => ({
                  [item.id]: 1,
                })),
        };
      } else {
        currentRolePos = coopCollection.mid[0].id === user?.id ? 2 : 3;
        return {
          currentRolePos,
          lowerCooperators: currentRolePos === 2 ? coopCollection.bottom : [],
          upperCooperators: [
            ...coopCollection.top.map((item: any) => ({
              [item.id]: 1,
            })),
            ...coopCollection.mid.map((item: any) => ({
              [item.id]: 2,
            })),
          ],
        };
      }
    } else {
      return {
        currentRolePos: 1,
        lowerCooperators: [],
        upperCooperators: [
          {
            [user?.id ?? 0]: 1,
          },
        ],
      };
    }
  }, [currentTask, user]);

  const dispatch = useDispatch();
  const taskLists = useSelector(taskListsSelector);

  const mutation = useTaskAddMutation((data: any) => {
    if (close) {
      close();
    } else {
      dispatch(setTaskID(data.id));
    }
  });
  const taskID = useSelector(currentTaskIDSelector);
  const updateMutation = useTaskUpdateMutation(taskID ?? -1, (data: any) => {
    if (close) {
      close();
    }
  });

  const onSubmit = handleSubmit((data) => {
    if (mutation.isLoading || updateMutation.isLoading) {
      return false;
    }

    let reminder = null;
    const currentReminderValue = reminderValue.value;
    let endDate = endDatetime ? dayjs(endDatetime) : dayjs();
    endDate = endDate.hour(12).minute(0).second(0).millisecond(0);
    if (currentReminderValue == '-1') {
    } else if (currentReminderValue.includes('m')) {
      const amount = parseInt(currentReminderValue);
      endDate = endDate.subtract(amount, 'months');
    } else if (currentReminderValue.includes('d')) {
      const amount = parseInt(currentReminderValue);
      endDate = endDate.subtract(amount, 'days');
    } else {
      endDate = dayjs(new Date(currentReminderValue));
    }
    endDate = endDate.subtract(tzOffset, 'minutes');
    if (currentReminderValue == '-1') {
    } else {
      reminder = endDate.format('YYYY-MM-DD HH:mm:ss');
    }
    const cooperatorIDs =
      currentRolePos > 3
        ? []
        : shareUsers.length > 0
        ? currentRolePos === 1
          ? shareUsers.length > 1
            ? shareUsers.map((user: number) => {
                const returnValue: any = {};
                returnValue[user] = 4;
                return returnValue;
              })
            : [
                {
                  [shareUsers[0]]: 3,
                },
              ]
          : [
              {
                [shareUsers[0]]: 3,
              },
            ]
        : [];
    const newStartDate = startDatetime
      ? dayjs(startDatetime)
          .subtract(tzOffset, 'minutes')
          .format('YYYY-MM-DD HH:mm:ss')
      : undefined;
    const newEndDate = endDatetime
      ? dayjs(endDatetime)
          .hour(23)
          .minute(59)
          .second(59)
          .millisecond(0)
          .subtract(tzOffset, 'minutes')
          .format('YYYY-MM-DD HH:mm:ss')
      : '';

    const newData: any = {
      title: data.title,
      memo: data.memo,
      list_id: listId,
      color: -1,
      importance,
      continuation,
      start_date: newStartDate,
      end_date: newEndDate,
      required_time: requiredTime,
      reminder,
      repetition: rrule && rrule !== '' && rrule !== '-1' ? '1' : '0',
      repetition_rule: rrule === '-1' ? '' : rrule,
      type: 0,
      cooperator_ids:
        taskID && taskID > 0
          ? [...upperCooperators, ...cooperatorIDs]
          : [
              {
                [user?.id ?? 0]: 1,
              },
              ...cooperatorIDs,
            ],
      attachments: uploadedList,
    };
    /**
     * check the repetition rule
     * here, if
     */
    if (rrule && rrule !== '') {
      newData.repetiton = '1';
      newData.repetition_rule = rrule;
    } else {
      newData.repetiton = '0';
    }

    if (taskID && taskID > 0) {
      updateMutation.mutate(newData);
    } else {
      mutation.mutate(newData);
    }
  });

  const timeMode24: boolean = useMemo(() => {
    if (user?.time_display) {
      return user?.time_display == 2;
    } else {
      return false;
    }
  }, [user]);
  useEffect(() => {
    if (taskID && taskID > 0 && currentTask) {
      setListId(currentTask.list_id);
      setValue('title', currentTask.title);
      setValue('memo', currentTask.memo);
      setImportance(currentTask.importance);
      let startDate, endDate;
      if (currentTask.start_date && currentTask.start_date !== '') {
        startDate = dayjs(currentTask.start_date);
        // ! dayjs already added tzOffsetBrowser to the date, so we need to add just a little
        startDate = startDate.add(tzOffset - tzOffsetBrowser, 'minutes');
      } else {
        startDate = null;
      }
      // ! endDate cannot be null
      endDate = dayjs(currentTask.end_date);
      endDate = endDate.add(tzOffset - tzOffsetBrowser, 'minutes');
      setState([
        {
          startDate: startDate ? startDate.toDate() : endDate.toDate(),
          endDate: endDate.toDate(),
          key: 'selection',
        },
      ]);
      setStartDatetime(startDate ? startDate.toDate() : null);
      setEndDatetime(endDate ? endDate.toDate() : null);
      setValue('endDateVal', endDate ? endDate.toDate() : undefined);
      setContinuation(currentTask.continuation);
      setRequiredTime(currentTask.required_time);
      // setReminderValue(currentTask.reminder);
      setReminderValue(
        reminderToString(
          currentTask.reminder,
          tzOffset,
          tzOffsetBrowser,
          user?.time_display == 2,
        ),
      );
      if (currentTask.repetition == 1) {
        const currentRrule = currentTask.repetition_rule;
        setRrule(
          currentRrule == '' || currentRrule == undefined ? '-1' : currentRrule,
        );
      } else {
        setRrule('');
      }
      setUploadedList(
        currentTask.attachments.length === 0
          ? []
          : currentTask.attachments.map((item: any) => item.url),
      );

      setShareUsers(
        lowerCooperators.length === 0
          ? []
          : lowerCooperators.map((item: any) => item.id),
      );
    } else if (taskID == -1 && currentTask?.date) {
      const tempDate = currentTask.date;
      setState([
        {
          startDate: tempDate.toDate(),
          endDate: tempDate.toDate(),
          key: 'selection',
        },
      ]);
      setStartDatetime(tempDate.toDate());
      setEndDatetime(tempDate.toDate());
      setValue('endDateVal', tempDate.toDate());
      setRequiredTime(user?.task_default_time ?? 270);
    } else {
      setRequiredTime(user?.task_default_time ?? 270);
    }
  }, [
    currentTask,
    setValue,
    taskID,
    lowerCooperators,
    user,
    timeMode24,
    tzOffset,
    tzOffsetBrowser,
  ]);
  useEffect(() => {
    if (listId) {
      setValue('listIdVal', listId);
    }
  }, [listId, setValue]);

  const availableUserIDs: number[] | undefined = useMemo(() => {
    if (!taskLists || taskLists.length == 0 || listId < 1) {
      return [];
    }
    const lists = taskLists.filter((_) => _.id == listId);
    if (lists.length == 0 || lists[0].status != 1) {
      return [];
    } else if (lists[0].cooperators.length == 0) {
      return [];
    } else {
      return lists[0].cooperators.map((_) => _.id);
    }
  }, [listId, taskLists]);

  // * auto focusing to title input
  useEffect(() => {
    setTimeout(() => {
      setFocus('title');
    }, 200);
  }, [setFocus]);
  const onKeyHandler = useHotkeys();
  const onKeyDownInput = useCallback(
    (e) => {
      const key = `${
        e.ctrlKey ? 'ctrl+' : e.shiftKey ? 'shift+' : e.altKey ? 'alt+' : ''
      }${e.key.toLowerCase()}`;
      const filtered = SHORTCUT_LIST.filter(
        (item) => item.disabledForInput !== true && item.key.includes(key),
      );
      if (filtered.length > 0) {
        const currentAction = filtered[0].action;
        const currentSubaction = filtered[0].subaction;
        onKeyHandler(currentAction, currentSubaction);
        e.preventDefault();
      }
    },
    [onKeyHandler],
  );

  const [isPicker1, setIsPicker1] = useState(false);
  const [isPicker2, setIsPicker2] = useState(false);
  const onDatePicker1 = () => {
    if (isPicker2) {
      setIsPicker2(false);
    }
    setIsPicker1((old) => !old);
  };
  const onDatePicker2 = () => {
    if (isPicker1) {
      setIsPicker1(false);
    }
    setIsPicker2((old) => !old);
  };
  const [startDateWidth, setStartDateWidth] = useState<number>();

  const onListChange = useCallback((newValue: number) => {
    setListId((oldValue) => {
      if (oldValue != newValue) {
        setShareUsers([]);
      }
      return newValue;
    });
  }, []);

  return (
    <form onSubmit={onSubmit} className="body1">
      <div className={`py-${isModal ? 8 : 12}px border-b border-separator`}>
        <div className="flex-row--between">
          <ListResultForTask value={listId} onChange={onListChange} />
        </div>
        <input {...register('listIdVal', { required: true })} type="hidden" />
        {errors.listIdVal && listId < 1 && (
          <p className="mt-8px text-secondary">リストを選択してください。</p>
        )}
      </div>
      <div className={`py-${isModal ? 4 : 12}px border-b border-separator`}>
        <input
          {...register('title', { required: true })}
          onKeyUp={onKeyDownInput}
          placeholder="タスクタイトル"
          className="w-full title placeholder:text-fontSecondary text-fontPrimary focus:outline-none"
        />
        {errors.title && (
          <p className={`mt-${isModal ? 2 : 12}px body1 text-secondary`}>
            内容が空です。
          </p>
        )}
        <div className={`mt-${isModal ? 2 : 12}px body2 text-fontSecondary`}>
          <input
            {...register('memo')}
            onKeyDown={onKeyDownInput}
            placeholder="詳細メモ"
            className="w-full focus:outline-none placeholder:text-fontSecondary text-fontPrimary"
          />
        </div>
        {errors.memo && (
          <p className={`mt-${isModal ? 2 : 12}px body2 text-secondary`}>
            内容が空です。
          </p>
        )}
      </div>
      <div
        className={`relative pt-${
          isModal ? 4 : 12
        }px flex flex-row items-center period-input`}
      >
        <IconWrap01
          Icon={CalendarIcon}
          className="flex-none"
          onClick={() => {}}
        />
        <DatePicker
          isOpen={isPicker1}
          className={`flex-1 ml-2px h-44px bg-backgroundPrimary flex-xy-center cursor-pointer focus:bg-overlayWeb2`}
          index={0}
          date={startDatetime ?? undefined}
          placeholder="開始日"
          onChange={(newValue: Date) => {
            const newStartTime = newValue.getTime();
            const currentStartTime = startDatetime?.getTime();
            const currentEndTime = endDatetime?.getTime() ?? 0;

            if (startDatetime && currentStartTime == newStartTime) {
              console.log('step1');
              setStartDatetime(null);
            } else if (!endDatetime || newStartTime <= currentEndTime) {
              console.log('step2');
              setStartDatetime(newValue);
            }
          }}
          setWidth={setStartDateWidth}
          onClick={onDatePicker1}
        />
        <DatePicker
          isOpen={isPicker2}
          onClick={onDatePicker2}
          className="flex-1 ml-2px h-44px bg-backgroundPrimary flex-xy-center cursor-pointer focus:bg-overlayweb2"
          index={1}
          date={endDatetime ?? undefined}
          placeholder="終了日"
          onChange={(newValue: Date) => {
            const newEndTime = newValue.getTime();
            const currentStartTime = startDatetime?.getTime() ?? 0;

            if (!startDatetime || currentStartTime <= newEndTime) {
              setEndDatetime(newValue);
              setValue('endDateVal', newValue);
            }
          }}
          classNameCalendar="-ml-40"
        />
        <div className="ml-16px body1 text-fontSecondary flex items-center">
          <span className="mr-8px">継続</span>
          <Switch
            onChange={() => setContinuation((oldValue) => 1 - oldValue)}
            checked={continuation === 1}
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
      <input {...register('endDateVal', { required: true })} type="hidden" />
      {errors.endDateVal && (
        <p className="mt-4px body1 text-secondary">
          ［終了日］フィールドは必須です。
        </p>
      )}
      <div className={`py-${isModal ? 2 : 12}px flex flex-row items-center`}>
        <IconWrap01
          Icon={FlameIcon}
          className={`text-fontPrimary flex-none`}
          // className={`text-${(() => {
          //   return urgencyLvl * importance < 3
          //     ? 'deepSkyBlue'
          //     : urgencyLvl * importance < 6
          //     ? 'yellow'
          //     : urgencyLvl * importance >= 6
          //     ? 'carminePink'
          //     : 'text-fontPrimary';
          // })()} flex-none`}
        />
        <div
          className="ml-2px h-44px flex-0"
          style={{
            width: `${startDateWidth}px`,
          }}
        >
          <ImportanceSelect
            className=""
            value={importance}
            onChange={setImportance}
          />
        </div>
        <MultiplyIcon
          width={20}
          height={20}
          className="ml-12px text-fontSecondary flex-none"
        />
        <div className="ml-12px h-44px rounded-8px bg-backgroundSecondary text-fontSecondary flex-1 flex-row--between">
          <span className="ml-16px body1">
            {urgencyLvl === 1 ? '低' : urgencyLvl === 2 ? '中' : '高'}
          </span>
          <span className="mr-16px caption2-light">緊急度</span>
        </div>
      </div>
      <div className="flex items-center">
        <IconWrap01
          Icon={StopwatchIcon}
          className="flex-none"
          onClick={() => {}}
        />
        <div className="ml-3/2px flex-1">
          <RequiredTimeSelect
            className="ml-3/2px"
            value={requiredTime}
            onChange={setRequiredTime}
            label={continuation === 1 ? '総所要時間' : undefined}
          />
        </div>
      </div>
      <div className={`mt-${isModal ? 2 : 12}px flex items-center`}>
        <IconWrap01 Icon={BellIcon} className="flex-none" onClick={() => {}} />
        <div className="ml-3/2px flex-1">
          <ReminderSelect
            value={reminderValue}
            setValue={setReminderValue}
            endDatetime={endDatetime ? endDatetime : undefined}
          />
        </div>
      </div>
      <div className={`mt-${isModal ? 2 : 12}px flex items-center`}>
        <IconWrap01
          Icon={CirclepathIcon}
          className="flex-none"
          onClick={() => {}}
        />
        <div className="ml-3/2px flex-1">
          <RepetitionSelect rrule={rrule} setRrule={setRrule} />
        </div>
      </div>
      <div className={`mt-${isModal ? 2 : 12}px flex items-center flex-wrap`}>
        <IconWrap01
          Icon={ClipIcon}
          className={`flex-none ${uploadedList.length > 0 ? 'mr-16px' : ''}`}
          onClick={() => {}}
        />
        <FileSelect
          additionalClass="ml-3/2px flex-1"
          uploadedList={uploadedList}
          onSelect={(newValue: string[]) => {
            setUploadedList(newValue);
          }}
          isLoading={isLoading}
          setLoading={setIsLoading}
        />
      </div>
      <div className={`mt-${isModal ? 2 : 12}px flex items-center`}>
        {/* <div className="ml-2px flex-1"> */}
        <RequestTask
          values={shareUsers}
          setValues={setShareUsers}
          additionalClass=""
          role={taskID && taskID > 0 ? currentRolePos : 1}
          availableUserIDs={availableUserIDs}
        />
      </div>
      <div
        className={`flex-none mt-${
          isModal ? 2 : 12
        }px pt-4px pb-8px border-t border-separator flex-row--between`}
      >
        <span className="flex-1 py-2px caption2 text-fontSecondary truncate">
          依頼先ごとに同じタスクが一括で作成/複製されます。
        </span>
        <div className="flex-none ml-16px body1 flex items-center">
          <span
            className="text-fontSecondary cursor-pointer"
            onClick={() => {
              reset();
              if (close) {
                close();
              }
            }}
          >
            キャンセル
          </span>
          <button
            className="ml-24px py-12px px-24px rounded-8px text-backgroundSecondary bg-primary hover:bg-primaryPressed disabled:opacity-40"
            type="submit"
            disabled={isLoading || mutation.isLoading}
          >
            {false ? 'まとめて作成' : '完了'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default TaskAdd;
