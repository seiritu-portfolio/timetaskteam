import Image from 'next/image';
import { useMemo } from 'react';
import VisibilitySensor from 'react-visibility-sensor';
import dayjs from 'dayjs';

import AvatarImage from '@component/general/avatar';
import UncheckedIcon from '@svg/square.svg';
import CheckedIcon from '@svg/checkmark-square-fill.svg';
import DefaultAvatarIcon from '@image/default_avatar.png';
import TextJustifySmallIcon from '@svg/text-justifyleft-small.svg';
import AlarmSmallIcon from '@svg/ball-small.svg';
import ClipSmallIcon from '@svg/clip-small.svg';
// import CirclePathIcon from '@svg/arrow-triangle-2-circlepath.svg';

import { NOTIFY_TYPES } from '@util/constants';
import { DEFAULT_AVATAR_URL } from '@util/urls';
import { getHourMinFormat } from '@util/calendar';

const NotifyReadItem = (props: any) => {
  const requiredTime = getHourMinFormat(props?.content?.requiredTime ?? 0);
  const time = useMemo(() => {
    const notifyDate = dayjs(props.created_at);
    const now = dayjs();

    const year = now.diff(notifyDate, 'year');
    const month = now.diff(notifyDate, 'month');
    const day = now.diff(notifyDate, 'day');
    const hour = now.diff(notifyDate, 'hour');
    const minute = now.diff(notifyDate, 'minute');

    return year > 0
      ? `残り${year}年`
      : month > 0
      ? `残り${month}ヶ月`
      : day === 1
      ? '昨日'
      : day > 0
      ? `残り${day}日`
      : hour > 0
      ? `残り${hour}時間`
      : minute > 0
      ? `残り${minute}`
      : 'たった今';
  }, [props.created_at]);
  // const [leftDaysLabel, urgencyColor] = useLeftDaysTask({
  //   end_date: props.endDate,
  //   importance: props.
  // })

  const leftDaysLabel = useMemo(() => {
    const currentDate = dayjs();
    const endDate = props?.content?.endDate
      ? dayjs(props.content.endDate)
      : dayjs();

    const year = endDate.diff(currentDate, 'year');
    const month = endDate.diff(currentDate, 'month');
    const diffDays = endDate.diff(currentDate, 'day');
    const currentDateDay = currentDate.date();
    const endDateDay = endDate.date();
    return currentDate.year() !== endDate.year() ||
      currentDate.month() !== endDate.month() ||
      currentDateDay < endDateDay - 2 ||
      currentDateDay > endDateDay + 1 ? (
      <span
        className={
          currentDate > endDate ? 'text-secondary' : 'text-fontSecondary'
        }
      >
        {`${currentDate < endDate ? '残り' : ''}${
          year > 0 ? `${year}年` : month > 0 ? `${month}ヶ月` : `${diffDays}日`
        }`}
        {`${currentDate > endDate ? '前' : ''}`}
      </span>
    ) : currentDateDay == endDateDay ? (
      '今日'
    ) : currentDateDay == endDateDay + 1 ? (
      '昨日'
    ) : currentDateDay == endDateDay - 1 ? (
      '明日'
    ) : (
      '明後日'
    );
  }, [props?.content?.endDate]);

  return (
    <div className={`py-12px px-24px bg-backgroundSecondary`}>
      {props.type === NOTIFY_TYPES.TASK_REQUESTED ? (
        <NotifyItemTaskRequest
          avatar={props?.content?.avatar ?? ''}
          taskName={props?.content?.title ?? 'test'}
          name={props.title ?? 'test'}
          color={props.color ?? 'test'}
          listName={props?.content?.listName ?? 'test'}
          time={time}
          requiredTime={requiredTime}
          // leftDaysLabel={leftDaysLabel}
        />
      ) : props.type === NOTIFY_TYPES.ADD_USER_REQUEST ? (
        <NotifyItemUserAdd
          avatar={props?.content?.avatar ?? null}
          name={props.title ?? 'best'}
          time={time}
        />
      ) : props.type === NOTIFY_TYPES.REQUEST_TASK_COMPLETED ? (
        <NotifyItemCompleted
          avatar={props?.content?.avatar}
          name={props.title ?? ''}
          taskName={props?.content?.title ?? ''}
          color={props.color ?? ''}
          listName={props?.content?.listName ?? ''}
          time={time}
          requiredTime={requiredTime}
          // leftDaysLabel={leftDaysLabel}
        />
      ) : props.type === NOTIFY_TYPES.TASK_REMINDER ? (
        <NotifyItemTaskReminder
          taskName={props?.content?.avatar}
          listName={props?.content?.listName ?? 're'}
          color={props.color ?? 're'}
          hasMemo={props.hasMemo ?? true}
          hasReminder={props.hasReminder ?? true}
          hasAttachments={props.hasAttachments ?? true}
          time={time}
          requiredTime={requiredTime}
          // leftDaysLabel={leftDaysLabel}
        />
      ) : null}
    </div>
  );
};

export { NotifyReadItem, NotifyUnreadItem };

const NotifyUnreadItem = (props: any) => {
  const requiredTime = getHourMinFormat(props?.content?.requiredTime ?? 0);
  const time = useMemo(() => {
    const notifyDate = dayjs(props.created_at);
    const now = dayjs();

    const year = now.diff(notifyDate, 'year');
    const month = now.diff(notifyDate, 'month');
    const day = now.diff(notifyDate, 'day');
    const hour = now.diff(notifyDate, 'hour');
    const minute = now.diff(notifyDate, 'minute');

    return year > 0
      ? `${year}年`
      : month > 0
      ? `${month}ヶ月`
      : day === 1
      ? '昨日'
      : day > 0
      ? `${day}日`
      : hour > 0
      ? `${hour}時間`
      : minute > 0
      ? `${minute}`
      : 'たった今';
  }, [props.created_at]);

  return (
    <VisibilitySensor onChange={props.onRead}>
      <div
        className={`py-12px px-24px border-t-1/2 border-separator bg-backgroundPrimary`}
      >
        {props.type === NOTIFY_TYPES.TASK_REQUESTED ? (
          <NotifyItemTaskRequest
            avatar={props.avatar}
            taskName={props?.content?.title ?? 'test'}
            name={props.title ?? 'test'}
            color={props.color ?? 'test'}
            listName={props?.content?.listName ?? 'test'}
            time={time}
            requiredTime={requiredTime}
            // hasMemo={props?.content?.hasMemo ?? true}
            // hasReminder={props?.hasReminder ?? true}
            // hasAttachments={props?.hasAttachments ?? true}
          />
        ) : props.type === NOTIFY_TYPES.ADD_USER_REQUEST ? (
          <NotifyItemUserAdd
            avatar={props.avatar ?? null}
            name={props.title ?? 'best'}
            time={time}
          />
        ) : props.type === NOTIFY_TYPES.REQUEST_TASK_COMPLETED ? (
          <NotifyItemCompleted
            avatar={props.avatar}
            name={props.title ?? ''}
            taskName={props?.content?.title ?? ''}
            color={props.color ?? ''}
            listName={props?.content?.listName ?? ''}
            time={time}
            requiredTime={requiredTime}
          />
        ) : props.type === NOTIFY_TYPES.TASK_REMINDER ? (
          <NotifyItemTaskReminder
            taskName={props?.content?.title ?? 're'}
            listName={props?.content?.listName ?? 're'}
            color={props.color ?? 're'}
            hasMemo={props.hasMemo ?? true}
            hasReminder={props.hasReminder ?? true}
            hasAttachments={props.hasAttachments ?? true}
            time={time}
            requiredTime={requiredTime}
          />
        ) : null}
      </div>
    </VisibilitySensor>
  );
};

const NotifyItemUserAdd = ({
  avatar,
  name,
  time,
}: {
  avatar: string;
  name: string;
  time: string;
}) => {
  return (
    <div className="py-12px flex items-center">
      <AvatarImage
        imgSrc={avatar ?? DEFAULT_AVATAR_URL}
        styleClass=""
        color="primary"
      />
      <div className="ml-16px">
        <span className="subtitle-en">{name}</span>
        <span className="body2">
          さんから追加申請のリクエストを受けました。
        </span>
        <span className="text-fontSecondary caption2-light">{time}</span>
      </div>
    </div>
  );
};

const NotifyItemCompleted = ({
  avatar,
  taskName,
  name,
  color,
  listName,
  hasMemo,
  hasReminder,
  hasAttachments,
  time,
  requiredTime,
}: {
  avatar: string;
  taskName: string;
  name: string;
  color: string;
  listName: string;
  time: string;
  hasMemo?: boolean;
  hasReminder?: boolean;
  hasAttachments?: boolean;
  requiredTime: string;
}) => {
  return (
    <>
      <div className="py-12px flex items-center">
        <AvatarImage
          imgSrc={avatar ?? DEFAULT_AVATAR_URL}
          styleClass=""
          color={color}
        />
        <div className="ml-16px text-fontPrimary">
          <span className="body2-en">{name}</span>
          <span className="caption2-light text-fontSecondary">{time}</span>
        </div>
      </div>
      <div className="py-12px flex">
        <CheckedIcon width={20} height={20} className="text-primary" />
        <div className="ml-8px flex-1">
          <div className="flex">
            <Image
              width={20}
              height={20}
              alt=""
              className="ml-8px rounded-full flex-none"
              src={DefaultAvatarIcon}
            />
            <span className="ml-8px body1 flex-1">{taskName}</span>
            <span className="text-primary body2">{time}</span>
          </div>
          <div className="mt-4px text-fontSecondary body2 flex">
            <span className="mr-4px">{listName}</span>
            <div className="flex-1 flex items-center">
              {hasMemo && (
                <TextJustifySmallIcon
                  width={20}
                  height={20}
                  style={{
                    color: 'red',
                  }}
                />
              )}
              <AlarmSmallIcon width={20} height={20} />
              {hasReminder && <AlarmSmallIcon width={20} height={20} />}
              <ClipSmallIcon width={20} height={20} />
              {hasAttachments && <ClipSmallIcon width={20} height={20} />}
            </div>
            <span className="body2">{time}</span>
          </div>
        </div>
      </div>
    </>
  );
};

const NotifyItemTaskRequest = ({
  avatar,
  taskName,
  name,
  color,
  listName,
  time,
  requiredTime,
}: {
  avatar: string;
  taskName: string;
  name: string;
  color: string;
  listName: string;
  time: string;
  requiredTime: string;
}) => {
  return (
    <div className="">
      <div className="py-12px flex items-center">
        <AvatarImage
          imgSrc={avatar ?? DEFAULT_AVATAR_URL}
          styleClass=""
          color={color}
        />
        <div className="ml-16px text-fontPrimary">
          <span className="body1">{name}</span>
          <span className="caption2-light text-fontSecondary">{time}</span>
        </div>
      </div>
      <div className="py-12px flex">
        <UncheckedIcon width={20} height={20} className="text-primary" />
        <div className="ml-8px w-full body1">
          <div className="flex">
            <Image
              width={20}
              height={20}
              alt=""
              className="ml-8px rounded-full flex-none"
              src={DefaultAvatarIcon}
            />
            <span className="ml-8px flex-1">{taskName}</span>
            <span className="text-primary">{requiredTime}</span>
          </div>
          <div className="mt-2px text-fontSecondary flex">
            <span>{listName}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const NotifyItemTaskReminder = ({
  taskName,
  listName,
  color,
  hasMemo,
  hasReminder,
  hasAttachments,
  time,
  requiredTime,
}: {
  taskName: string;
  listName: string;
  color: string;
  hasMemo: boolean;
  hasReminder: boolean;
  hasAttachments: boolean;
  time: string;
  requiredTime: string;
}) => {
  return (
    <>
      <div className="pt-12px body2 flex items-center">
        <UncheckedIcon width={20} height={20} className={`text-${'primary'}`} />
        <div className="ml-8px flex-1 text-fontPrimary body1">{taskName}</div>
        <div className="text-primary body2-en">{requiredTime}</div>
      </div>
      <div className="mt-4px ml-27px body2 text-fontSecondary text flex items-center">
        <span className="mr-4px">{listName}</span>
        <div className="flex items-center ">
          {hasMemo && <TextJustifySmallIcon width={20} height={20} />}
          {hasReminder && <AlarmSmallIcon width={20} height={20} />}
          {hasAttachments && <ClipSmallIcon width={20} height={20} />}
        </div>
        <div className="flex-1 flex flex-row justify-end body2">{time}</div>
      </div>
    </>
  );
};
