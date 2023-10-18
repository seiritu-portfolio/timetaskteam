import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';
// import Pusher from 'pusher-js';
// * hooks
import {
  useAllNotifyLists,
  useNotifyStatuses,
} from '@service/notificationQueries';
import { setNofityReadList, setNotifyUnreadList } from '@store/modules/home';
import {
  nofityReadListSelector,
  notifyUnreadListSelector,
} from '@store/selectors/home';
// * components
import { NotifyReadItem, NotifyUnreadItem } from './Notifications';
import { IconWrapForCalendar } from '@component/general/wrap';
// * assets
import BellIcon from '@svg/bell-big.svg';

const NotificationMenu = () => {
  const dispatch = useDispatch();

  const { mutate: readNotifyMutate, status: readNotifyStatus } =
    useNotifyStatuses(() => {
      setReadNotifies([]);
    });
  // * get data
  const notificationsListAllResult = useAllNotifyLists();
  useEffect(() => {
    if (notificationsListAllResult.isSuccess) {
      const {
        read,
        unread,
      }: {
        read: any[];
        unread: any[];
      } = notificationsListAllResult.data.reduce(
        (
          ctx: {
            [id: string]: any[];
          },
          el: any,
        ) => {
          const newEl: any = { ...el };
          try {
            newEl.content = JSON.parse(newEl.content);
          } catch (e) {
            newEl.content = {};
          }
          if (el.status === 0) {
            ctx.unread.push(newEl);
          } else ctx.read.push(newEl);
          return ctx;
        },
        {
          read: [],
          unread: [],
        },
      );
      dispatch(setNotifyUnreadList(unread));
      dispatch(setNofityReadList(read));
    }
  }, [
    notificationsListAllResult.isSuccess,
    notificationsListAllResult.data,
    dispatch,
  ]);
  const notifyUnreadList = useSelector(notifyUnreadListSelector);
  const notifyReadList = useSelector(nofityReadListSelector);

  const [readNotifies, setReadNotifies] = useState<number[]>([]);

  // * event handlers
  const onRead = useCallback(
    (readList: number[], currentId: number) => (isRead: boolean) => {
      if (isRead && !readList.includes(currentId)) {
        setReadNotifies([...readList, currentId]);
        if (readNotifyStatus === 'loading') {
        } else {
          readNotifyMutate([currentId]);
        }
      }
    },
    [readNotifyMutate, readNotifyStatus],
  );

  const hasUnread = useMemo(() => {
    if (notifyUnreadList.length == 0) {
      return false;
    }
    const unreadList = notifyUnreadList.filter(
      (_) => !readNotifies.includes(_.id),
    );
    return unreadList.length > 0;
  }, [notifyUnreadList, readNotifies]);

  return (
    <Menu as="div" className="flex flex-col z-9999">
      <Menu.Button>
        <IconWrapForCalendar additionalClass="ml-24px bg-backgroundPrimary text-fontPrimary tooltip hover:bg-primarySelected hover:text-primary">
          <BellIcon width={20} height={20} />
          <span
            className={`absolute -top-1 -right-1 mt-1 w-3 h-3 flex ${
              hasUnread ? '' : 'hidden'
            }`}
          >
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
          </span>
          <span className="absolute top-full mt-1 px-2 py-1 w-16 rounded-2px bg-fontSecondary body3 text-backgroundSecondary text-center z-50 tooltiptext">
            通知
          </span>
        </IconWrapForCalendar>
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute mt-4px right-0 top-44px w-356px max-h-500px overflow-y-auto bg-white divide-y divide-gray-100 rounded-md shadow-lg border-1/2 border-separator focus:outline-none z-50">
          <div className="py-8px">
            <div className="px-24px pt-4px pb-12px med-title text-fontPrimary">
              通知
            </div>
            {notifyUnreadList.map((_: any) =>
              readNotifies.includes(_.id) ? (
                <Menu.Item key={`notify-read-menu-item-${_.id}`}>
                  <NotifyReadItem
                    {..._}
                    key={`notify-unread-menu-item-${_.id}`}
                    isRead={true}
                  />
                </Menu.Item>
              ) : (
                <Menu.Item key={`notify-read-menu-item-${_.id}`}>
                  <NotifyUnreadItem
                    {..._}
                    isRead={false}
                    onRead={onRead(readNotifies, _.id)}
                  />
                </Menu.Item>
              ),
            )}
            {notifyReadList.map((_: any) => (
              <Menu.Item key={`notify-read-menu-item-${_.id}`}>
                <NotifyReadItem
                  {..._}
                  key={`notify-unread-menu-item-${_.id}`}
                  isRead={true}
                />
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default NotificationMenu;

// useEffect(() => {}, [readNotifies, readNotifyMutate, readNotifyStatus]);

// useEffect(() => {
//   const pusher = new Pusher(process.env.key ?? '', {
//     cluster: process.env.cluster ?? '',
//   });

//   const channel = pusher.subscribe('notification');

//   channel.bind('chat-event', function (data: any) {
//     console.log('new notification arrived');
//     console.log(data);
//   });

//   return () => {
//     pusher.unsubscribe('notification');
//   };
// }, []);
