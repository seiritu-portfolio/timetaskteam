import { useSelector } from 'react-redux';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dayjs from 'dayjs';
import Switch from 'react-switch';
import { useForm } from 'react-hook-form';
// * hooks
import {
  tzOffsetBrowserSelector,
  tzOffsetSelector,
  userInfoSelector,
} from '@store/selectors/user';
import { taskListsSelector } from '@store/selectors/list';
import { useTaskUpdateMutation } from '@service/taskMutation';
import {
  currentTaskIDSelector,
  currentTaskSelector,
} from '@store/selectors/tasks';
import { taskModalStatusSelector } from '@store/selectors/home';
// * custom components
import ListResultForTask from '@component/home/ListForTaskSelect';
import { MoreMenuForTask } from './MoreMenuForTask';
import {
  ImportanceSelect,
  ReminderSelect,
  RepetitionSelect,
  RequiredTimeSelect,
} from '../Selects';
import CustomDateRange from './CustomDateRange';
import FileSelect from './FileSelector';
import RequestTask from './requestTask/RequestTask';
import DatePicker from '../schedule/DatePicker';
import { TextInput } from '@component/general/input';
import { IconWrap01, IconWrap02 } from '@component/general/wrap';
import FlameIcon from '@svg/flame.svg';
import CalendarIcon from '@svg/calendar.svg';
import StopwatchIcon from '@svg/stopwatch.svg';
import ClipIcon from '@svg/clip.svg';
import BellIcon from '@svg/bell.svg';
import CirclepathIcon from '@svg/circlepath.svg';
import MultiplyIcon from '@svg/multiply.svg';
// * constants & utilities
import { getDateMDFormat, getHourMinFormat } from '@util/calendar';
import { reminderToString, rruleToDates, rruleToString } from '@util/helpers';
import { REMINDER_OPTIONS } from '@util/selectOptions';

const TaskEdit = ({
  currentTab,
  setCurrentTab,
  close,
  ...rest
}: {
  currentTab: number;
  setCurrentTab: (newValue: number) => void;
  close: () => void;
}) => {
  const currentTask = useSelector(currentTaskSelector);
  const isModal = useSelector(taskModalStatusSelector);

  const { user } = useSelector(userInfoSelector);
  const tzOffset = useSelector(tzOffsetSelector);
  const tzOffsetBrowser = useSelector(tzOffsetBrowserSelector);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const currentTaskProcessed = useMemo(() => {
    const data: any = {
      id: -1,
      list_id: -1,
      title: '',
      memo: '',
      urgencyLvl: 1,
      urgencyColor: 'fontPrimary',
      importance: 1,
      startDate: undefined,
      endDate: '',
      continuation: '',
      requiredTime: '',
      reminder: '',
      repetition: '',
      attachments: [],
      cooperators: [],
      completed: false,
    };

    if (!currentTask) {
      return data;
    }
    data.id = currentTask.id;
    data.list_id = currentTask.list_id;
    data.title = currentTask.title;
    data.memo = currentTask.memo;

    const currentDate = new Date();
    if (!currentTask || !currentTask.end_date || currentTask.end_date == '') {
      data.urgencyLvl = 1;
      data.endDate = '';
    } else {
      const endDatetime = dayjs(currentTask.end_date).add(
        tzOffset - tzOffsetBrowser,
        'minute',
      );
      const endDate = endDatetime.toDate();
      data.endDate = getDateMDFormat(endDate);
      if (endDate && user?.urgency_switch) {
        const [urgent, still] = user.urgency_switch.split('-');
        const dayDiff: number =
          (endDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24);
        if (dayDiff > parseInt(still)) {
          data.urgencyLvl = 1;
        } else if (dayDiff > parseInt(urgent)) {
          data.urgencyLvl = 2;
        } else data.urgencyLvl = 3;
      } else {
        data.urgencyLvl = 1;
      }
    }
    data.urgencyColor =
      data.urgencyLvl * currentTask.importance < 3
        ? 'deepSkyBlue'
        : data.urgencyLvl * currentTask.importance < 6
        ? 'yellow'
        : data.urgencyLvl * currentTask.importance >= 6
        ? 'carminePink'
        : 'fontPrimary';
    data.importance = currentTask.importance;

    if (currentTask.start_date && currentTask.start_date !== '') {
      const startDate = dayjs(currentTask.start_date)
        .add(tzOffset - tzOffsetBrowser, 'minutes')
        .toDate();
      data.startDate = getDateMDFormat(startDate);
    }
    data.continuation = currentTask?.continuation == 1 ? '継続' : '';
    data.requiredTime = getHourMinFormat(currentTask.required_time);
    const reminderValue = reminderToString(
      currentTask.reminder,
      tzOffset,
      tzOffsetBrowser,
      user?.time_display == 2,
    );
    data.reminder = reminderValue.label;
    data.repetition = rruleToString(
      currentTask.repetition === 0 ? '' : currentTask.repetition_rule,
    );

    data.attachments =
      !currentTask.attachments || currentTask.attachments?.length === 0
        ? []
        : currentTask.attachments.map((item: any) => item.url);

    if (currentTask?.pivot?.completed == 1) {
      data.completed = true;
    }
    return data;
  }, [currentTask, user, tzOffset, tzOffsetBrowser]);
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

  const taskID = useSelector(currentTaskIDSelector);
  const [listId, setListId] = useState<number>(0);
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
  const [reminderValue, setReminderValue] = useState(REMINDER_OPTIONS[0]);
  const [rrule, setRrule] = useState('');
  const [importance, setImportance] = useState<number>(1);
  const [continuation, setContinuation] = useState<number>(0);
  const [requiredTime, setRequiredTime] = useState<number>(30);
  const [shareUsers, setShareUsers] = useState<number[]>([]);
  const [uploadedList, setUploadedList] = useState<string[]>([]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [forStartDate, setForStartDate] = useState(true);
  const toggleOpen = () => setIsPickerOpen((old) => !old);
  const currMonthRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const timeMode24: boolean = useMemo(() => {
    if (user?.time_display) {
      return user?.time_display == 2;
    } else {
      return false;
    }
  }, [user]);
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
        !currentTask.attachments || currentTask.attachments.length === 0
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

  const taskLists = useSelector(taskListsSelector);
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

  // * repetition handler
  const { mutate: taskUpdate, status: taskUpdateStatus } =
    useTaskUpdateMutation(currentTask?.id ?? -1, (data: any) => {
      if (close) {
        setTimeout(() => {
          close();
        }, 3000);
      }
    });
  const isSubmitDisabled = useMemo(() => {
    if (isLoading || taskUpdateStatus == 'loading') return true;
    if (currentRolePos > 1 && listId !== currentTaskProcessed.list_id)
      return true;
    return false;
  }, [
    currentRolePos,
    listId,
    currentTaskProcessed.list_id,
    isLoading,
    taskUpdateStatus,
  ]);

  const onSubmit = handleSubmit((data) => {
    if (isSubmitDisabled) {
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
    if (rrule && rrule !== '') {
      newData.repetiton = '1';
      newData.repetition_rule = rrule;
    } else {
      newData.repetiton = '0';
    }

    taskUpdate(newData);
  });

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

  const [isUpdated, setIsUpdated] = useState(false);
  useEffect(() => {
    if (taskUpdateStatus === 'success') {
      setIsUpdated(true);
      setTimeout(() => {
        setIsUpdated(false);
      }, 4500);
    } else {
      setIsUpdated(false);
    }
  }, [taskUpdateStatus]);

  const onListChange = useCallback((newValue: number) => {
    setListId((oldValue) => {
      if (oldValue != newValue) {
        setShareUsers([]);
      }
      return newValue;
    });
  }, []);

  return currentTaskProcessed ? (
    <form onSubmit={onSubmit} className="body1">
      <div
        className={`pt-${isModal ? 4 : 12}px ${
          isModal ? 'pb-4px' : 'pb-12px border-b border-separator'
        } flex-row--between`}
      >
        <ListResultForTask value={listId} onChange={onListChange} />
        {isModal || <MoreMenuForTask />}
      </div>
      <div className={`py-${isModal ? 4 : 12}px border-b border-separator`}>
        <TextInput
          name={'title'}
          register={register}
          required={true}
          initValue={currentTask?.title}
          placeholder="タスクタイトル"
          className="h-24px w-full title placeholder:text-fontSecondary text-fontPrimary focus:outline-none"
        />
        {errors.title && (
          <p className={`mt-${isModal ? 2 : 12}px body1 text-secondary`}>
            内容が空です。
          </p>
        )}
        <div className={`mt-${isModal ? 2 : 12}px body2 text-fontSecondary`}>
          <TextInput
            name={'memo'}
            register={register}
            required={false}
            initValue={currentTask?.memo}
            // initValue={currentTask?.memo}
            placeholder="詳細メモ"
            className="h-18px w-full focus:outline-none placeholder:text-fontSecondary text-fontPrimary"
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
          onClick={onDatePicker1}
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
        <>
          <div
            className={`fixed inset-0 ${isPickerOpen ? '' : 'hidden'}`}
            onClick={() => setIsPickerOpen(false)}
          />
          <div
            ref={currMonthRef}
            className={`absolute inset-44px z-30 ${
              isPickerOpen ? '' : 'hidden'
            }`}
          ></div>
          <div
            className={`absolute inset-44px task-detail--date-range z-30 ${
              isPickerOpen ? '' : 'hidden'
            }`}
          >
            <CustomDateRange
              state={state}
              setState={(item: any) => {
                setState([item.selection]);
                const currentStartTime = item.selection.startDate.getTime();
                const currentEndTime = item.selection.endDate.getTime();

                if (currentStartTime <= currentEndTime) {
                  setStartDatetime(item.selection.startDate);
                  setEndDatetime(item.selection.endDate);
                  setValue('endDateVal', item.selection.endDate);
                } else if (
                  forStartDate &&
                  (!endDatetime || currentStartTime <= endDatetime.getTime())
                ) {
                  setStartDatetime(item.selection.startDate);
                } else if (
                  !startDatetime ||
                  startDatetime.getTime() <= currentEndTime
                ) {
                  setEndDatetime(item.selection.endDate);
                  setValue('endDateVal', item.selection.endDate);
                }
              }}
            />
          </div>
        </>
      </div>
      <div className={`py-${isModal ? 2 : 12}px flex flex-row items-center`}>
        <IconWrap02
          Icon={FlameIcon}
          className={`text-fontPrimary flex-none`}
          // className={`text-${(() => {
          //   return currentTaskProcessed.completed
          //     ? 'fontSecondary'
          //     : urgencyLvl * importance < 3
          //     ? 'deepSkyBlue'
          //     : urgencyLvl * importance < 6
          //     ? 'yellow'
          //     : urgencyLvl * importance >= 6
          //     ? 'carminePink'
          //     : 'fontPrimary';
          // })()} flex-none`}
        />
        <div className="ml-2px h-44px flex-1">
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
        <div className="ml-12px h-44px rounded-8px bg-backgroundSecondary med-title text-fontSecondary flex-1 flex-row--between">
          <span className="ml-16px">
            {urgencyLvl === 1 ? '低' : urgencyLvl === 2 ? '中' : '高'}
          </span>
          <span className="mr-16px caption2-light">緊急度</span>
        </div>
      </div>
      <input {...register('endDateVal', { required: true })} type="hidden" />
      {errors.endDateVal && (
        <p className="-mt-8px mb-8px body1 text-secondary">
          ［終了日］フィールドは必須です。
        </p>
      )}
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
          className={`flex-none mb-${isModal ? 2 : 12}px ${
            uploadedList.length > 0 ? 'mr-16px' : ''
          }`}
          onClick={() => {}}
        />
        <FileSelect
          additionalClass={`ml-3/2px mb-${isModal ? 2 : 12}px flex-1`}
          uploadedList={uploadedList}
          onSelect={(newValue: string[]) => {
            setUploadedList(newValue);
          }}
          isLoading={isLoading}
          setLoading={setIsLoading}
        />
      </div>
      <div className="mt-0 flex items-center">
        {/* <div className="ml-2px flex-1"> */}
        <RequestTask
          values={shareUsers}
          setValues={setShareUsers}
          additionalClass=""
          role={taskID && taskID > 0 ? currentRolePos : 1}
          availableUserIDs={availableUserIDs}
        />
      </div>
      <div className={`py-${isModal ? 8 : 12}px flex-row--between`}>
        <div className="flex">
          <div
            className={`py-12px px-16px body1 cursor-pointer ${
              currentTab === 0
                ? 'bg-backgroundPrimary text-fontPrimary'
                : 'text-fontSecondary'
            }`}
            onClick={() => {
              setCurrentTab(0);
            }}
          >
            詳細情報
          </div>
          <div
            className={`py-12px px-16px body1 cursor-pointer ${
              currentTab === 1
                ? 'bg-backgroundPrimary text-fontPrimary'
                : 'text-fontSecondary'
            }`}
            onClick={() => {
              if (currentTask && currentTask.continuation == 1) {
                setCurrentTab(1);
              }
            }}
          >
            継続管理
          </div>
          <div
            className={`py-12px px-16px body1 cursor-pointer ${
              currentTab === 2
                ? 'bg-backgroundPrimary text-fontPrimary'
                : 'text-fontSecondary'
            }`}
            onClick={() => {
              setCurrentTab(2);
            }}
          >
            依頼管理
          </div>
        </div>
        <div className="flex">
          {isModal && <MoreMenuForTask upward={true} />}
          <button
            className="ml-24px py-12px px-24px rounded-6px bg-primary body1 text-backgroundSecondary cursor-pointer disabled:bg-primaryDisabled"
            type="submit"
            disabled={isSubmitDisabled}
          >
            完了
          </button>
        </div>
      </div>
      <div className={`pb-8px flex justify-end ${isUpdated ? '' : 'hidden'}`}>
        <span className="body2 text-primary">更新しました</span>
      </div>
    </form>
  ) : null;
};

export default TaskEdit;
