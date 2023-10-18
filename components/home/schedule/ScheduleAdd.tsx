import { useState, useEffect, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
// * hooks
import {
  scheduleInboxIDSelector,
  tzOffsetBrowserSelector,
  tzOffsetSelector,
  userInfoSelector,
} from '@store/selectors/user';
import { scheduleListsSelector } from '@store/selectors/list';
import {
  useScheduleAdd,
  useScheduleUpdateMutation,
} from '@service/scheduleMutation';
import { setScheduleID } from '@store/modules/schedules';
import {
  currentScheduleIDSelector,
  currentScheduleSelector,
} from '@store/selectors/schedules';
// * components
import {
  ColorSelect,
  ReminderSelect,
  RepetitionSelect,
  ScheduleShareSelect,
} from '../Selects';
import PeriodInputs from './PeriodInputs';
import { IconWrap01 } from '@component/general/wrap';
import ListScheduleSelect from './ListScheduleSelect';
// * assets
import PaintIcon from '@svg/paintbrush.svg';
import BellIcon from '@svg/bell.svg';
import CirclepathIcon from '@svg/circlepath.svg';
import PersonsIcon from '@svg/person-2.svg';
import { reminderToString } from '@util/helpers';
import { REMINDER_OPTIONS } from '@util/selectOptions';

const ScheduleAdd = ({
  close,
  className,
}: {
  close?: () => void;
  className?: string;
}) => {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm();

  const dispatch = useDispatch();

  const mutation = useScheduleAdd((data: any) => {
    if (close) {
      close();
    } else {
      dispatch(setScheduleID(data.id));
    }
  });
  const scheduleID = useSelector(currentScheduleIDSelector);

  const onClose = useCallback(() => {
    if (close) {
      close();
    }
  }, [close]);
  const { mutate: scheduleUpdate, status: scheduleUpdateStatus } =
    useScheduleUpdateMutation(scheduleID ?? -1, (_) => {
      setTimeout(() => {
        onClose();
      }, 2500);
    });
  const { user } = useSelector(userInfoSelector);
  const tzOffset = useSelector(tzOffsetSelector);
  const tzOffsetBrowser = useSelector(tzOffsetBrowserSelector);

  const onSubmit = handleSubmit((_: any) => {
    if (mutation.isLoading || scheduleUpdateStatus == 'loading') {
      return false;
    }

    let reminder = '';
    const currentReminderValue = reminderValue.value;
    let endDate = dayjs(endDatetime);
    endDate = endDate.hour(12).minute(0).second(0).millisecond(0);

    if (currentReminderValue.includes('m')) {
      const amount = parseInt(currentReminderValue);
      endDate = endDate.subtract(amount, 'month');
    } else if (currentReminderValue.includes('d')) {
      const amount = parseInt(currentReminderValue);
      endDate = endDate.subtract(amount, 'day');
    } else if (currentReminderValue != '-1') {
      endDate = dayjs(new Date(currentReminderValue));
    }
    endDate = endDate.subtract(tzOffset, 'minute');

    if (currentReminderValue == '-1') {
    } else {
      reminder = endDate.format('YYYY-MM-DD HH:mm:ss');
    }
    const meShareUser = {
      [user?.id ?? -1]: 1,
    };

    const newStartDate = dayjs(startDatetime)
      .subtract(tzOffset, 'minute')
      .format('YYYY-MM-DD HH:mm:ss');
    const newEndDate = dayjs(endDatetime)
      .subtract(tzOffset, 'minute')
      .format('YYYY-MM-DD HH:mm:ss');

    const data = {
      ..._,
      list_id: listId,
      start_date: newStartDate,
      end_date: newEndDate,
      color,
      attachments: [],
      cooperator_ids:
        shareUsers.length > 0
          ? [
              meShareUser,
              ...shareUsers.map((user: number) => {
                const returnValue: any = {};
                returnValue[user] = 2;
                return returnValue;
              }),
            ]
          : // .push(meShareUser)
            [meShareUser],
      all_day: allDay ? 1 : 0,
    };
    if (reminder !== '') {
      data.reminder = reminder;
    }
    if (rrule && rrule !== '' && rrule !== '-1') {
      data.repetition = '1';
      data.repetition_rule = rrule === '-1' ? null : rrule;
    } else {
      data.repetition = '0';
      data.repetition_rule = '';
    }

    if (scheduleID && scheduleID > 0) {
      scheduleUpdate(data);
    } else {
      return mutation.mutate(data);
    }
  });

  const scheduleInboxID = useSelector(scheduleInboxIDSelector);
  const [listId, setListId] = useState<number>(scheduleInboxID);

  const scheduleLists = useSelector(scheduleListsSelector);
  useEffect(() => {
    const filteredForInbox: any[] = scheduleLists.filter(
      (_) => _.id === scheduleInboxID,
    );
    if (filteredForInbox.length === 0) {
    } else {
      setColor(filteredForInbox[0].color ?? 0);
    }
  }, [scheduleInboxID, scheduleLists]);

  const [allDay, setAllDay] = useState(false);
  const [shareUsers, setShareUsers] = useState<number[]>([]);
  const [color, setColor] = useState(0);
  const [rrule, setRrule] = useState('');
  const currentDate = useMemo(() => {
    const newDate = new Date();
    const mins = Math.round(newDate.getMinutes() / 15) * 15;
    newDate.setMinutes(mins);
    return newDate;
  }, []);
  const [startDatetime, setStartDateTime] = useState<Date>(currentDate);
  const [endDatetime, setEndDateTime] = useState<Date>(currentDate);
  const [reminderValue, setReminderValue] = useState(REMINDER_OPTIONS[0]);

  const currentSchedule = useSelector(currentScheduleSelector);
  useEffect(() => {
    if (scheduleID && scheduleID > 0 && currentSchedule) {
      setListId(currentSchedule.list_id);
      setValue('title', currentSchedule.title);
      setValue('memo', currentSchedule.memo);
      setColor(currentSchedule.color);
      setAllDay(currentSchedule.all_day == 1);

      let startDate = dayjs(currentSchedule.start_date);
      let endDate = dayjs(currentSchedule.end_date);
      startDate = startDate.add(tzOffset - tzOffsetBrowser, 'minutes');
      endDate = endDate.add(tzOffset - tzOffsetBrowser, 'minutes');
      setStartDateTime(startDate.toDate());

      if (
        endDate.hour() == 0 &&
        endDate.minute() == 0 &&
        startDate.isBefore(endDate)
      )
        endDate = endDate.subtract(1, 'minute').second(59);
      setEndDateTime(endDate.toDate());

      setReminderValue(
        reminderToString(
          currentSchedule.reminder,
          tzOffset,
          tzOffsetBrowser,
          user?.time_display == 2,
        ),
      );
      if (currentSchedule.repetition == 1) {
        const currentRrule = currentSchedule.repetition_rule;
        setRrule(
          currentRrule == '' || currentRrule == undefined ? '-1' : currentRrule,
        );
      } else {
        setRrule('');
      }

      if (currentSchedule.cooperators.length > 0) {
        setShareUsers(
          currentSchedule.cooperators.map((couser: any) => couser.id),
        );
      }
    } else if (scheduleID == -1 && currentSchedule?.hour != undefined) {
      const tempDate = dayjs(currentSchedule.date);
      setStartDateTime(tempDate.hour(currentSchedule.hour).minute(0).toDate());
      setEndDateTime(tempDate.hour(currentSchedule.hour + 1).toDate());
    } else if (scheduleID == -1 && currentSchedule?.date) {
      const tempDate = dayjs(currentSchedule.date);
      setStartDateTime(tempDate.toDate());
      setEndDateTime(tempDate.add(1, 'hour').toDate());
    } else if (scheduleID == -1 && currentSchedule?.start_date) {
      let startDate = dayjs(currentSchedule.start_date).add(tzOffset, 'minute');
      let endDate = dayjs(currentSchedule.end_date).add(tzOffset, 'minute');
      setStartDateTime(startDate.toDate());
      setEndDateTime(endDate.toDate());
    } else {
      let startDate = dayjs();
      const minutes =
        Math.round((startDate.hour() * 60 + startDate.minute()) / 15) * 15;
      const hour = Math.ceil(minutes / 60);
      startDate = startDate.hour(hour === 24 ? 0 : hour).minute(minutes % 60);

      const endDate = startDate.add(1, 'hour');
      setStartDateTime(startDate.toDate());
      setEndDateTime(endDate.toDate());
    }
  }, [
    scheduleID,
    currentSchedule,
    setValue,
    tzOffset,
    tzOffsetBrowser,
    user?.time_display,
  ]);

  // * auto focusing to title input
  useEffect(() => {
    setTimeout(() => {
      setFocus('title');
    }, 200);
  }, [setFocus]);

  const [isUpdated, setIsUpdated] = useState(false);
  useEffect(() => {
    if (scheduleUpdateStatus === 'success') {
      setIsUpdated(true);
      setTimeout(() => {
        setIsUpdated(false);
      }, 4500);
    } else {
      setIsUpdated(false);
    }
  }, [scheduleUpdateStatus]);

  const availableUserIDs: number[] = useMemo(() => {
    if (!scheduleLists || scheduleLists.length == 0 || listId < 1) return [];
    const lists = scheduleLists.filter((_) => _.id == listId);
    if (lists.length == 0 || lists[0].status != 1) return [];
    else if (lists[0].cooperators.length == 0) return [];
    else {
      return lists[0].cooperators.map((_) => _.id);
    }
  }, [listId, scheduleLists]);

  const onListChange = useCallback((id: number, color: number) => {
    setListId((oldValue) => {
      if (oldValue != id) {
        setShareUsers([]);
      }
      return id;
    });
    setColor(color);
  }, []);

  return (
    <form onSubmit={onSubmit} className={`${className ?? ''} body1`}>
      <ListScheduleSelect listID={listId} select={onListChange} />
      <div className="mt-6px med-title placeholder:text-fontSecondary text-fontPrimary">
        <input
          {...register('title', { required: true })}
          placeholder="スケジュールタイトル"
          className="w-full focus:outline-none"
        />
      </div>
      {errors.title && (
        <p className="mt-2px body1 text-secondary">内容が空です。</p>
      )}
      <div className="mt-2px body2 placeholder:text-fontSecondary text-fontPrimary">
        <input
          {...register('memo')}
          placeholder="詳細メモ"
          className="focus:outline-none"
        />
      </div>
      {errors.memo && (
        <p className="mt-2px body1 text-secondary">内容が空です。</p>
      )}
      <PeriodInputs
        additionalClassname="mt-2px"
        isAllDay={allDay}
        setIsAllday={() => {
          setAllDay((old) => {
            return !old;
          });
        }}
        startDatetime={startDatetime}
        endDatetime={endDatetime}
        setStartDateTime={setStartDateTime}
        setEndDateTime={setEndDateTime}
      />
      <div className="mt-2px flex items-center">
        <IconWrap01 Icon={PaintIcon} className="text-fontPrimary flex-none" />
        <ColorSelect value={color} setValue={setColor} />
      </div>
      <div className="mt-2px flex items-center">
        <IconWrap01 Icon={BellIcon} className="flex-none" />
        <div className="ml-2px flex-1">
          <ReminderSelect
            value={reminderValue}
            setValue={setReminderValue}
            endDatetime={endDatetime}
          />
        </div>
      </div>
      <div className="mt-2px flex items-center">
        <IconWrap01 Icon={CirclepathIcon} className="flex-none" />
        <div className="ml-2px flex-1">
          <RepetitionSelect rrule={rrule} setRrule={setRrule} />
        </div>
      </div>
      <div className="mt-2px pb-4px border-b border-separator flex items-center">
        <IconWrap01 Icon={PersonsIcon} className="flex-none" />
        <div className="ml-2px flex-1">
          <ScheduleShareSelect
            values={shareUsers}
            setValues={setShareUsers}
            availableUserIDs={availableUserIDs}
          />
        </div>
      </div>
      <div className="mt-6px flex-row--end">
        <div
          className="p-12px body1 text-fontSecondary cursor-pointer"
          onClick={onClose}
        >
          キャンセル
        </div>
        <button
          className="ml-12px btn--default disabled:opacity-40"
          disabled={mutation.isLoading || scheduleUpdateStatus == 'loading'}
          type="submit"
        >
          完了
        </button>
      </div>
      <div
        className={`pt-4px pb-8px flex justify-end ${
          isUpdated ? '' : 'hidden'
        }`}
      >
        <span className="body2 text-primary">更新しました</span>
      </div>
    </form>
  );
};

export default ScheduleAdd;
