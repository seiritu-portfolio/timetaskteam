import { Fragment, useRef, useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { Menu, Transition } from '@headlessui/react';
// * hooks
import { userInfoSelector } from '@store/selectors/user';
import {
  setContactusModalStatus,
  setModalUrl,
  setSettingsModalStatus,
  setTaskModalStatus,
  setScheduleModalStatus,
  setActiveSettingsTab,
  setSearch,
  setNoteModalStatus,
  setIsOnSearch,
} from '@store/modules/home';
import { resetUser } from '@store/modules/user';
import { useListArrayAllForUser } from '@service/listQueries';
import {
  setCurrentNoteID,
  setScheduleArchivedLists,
  setScheduleLists,
  setTaskArchivedLists,
  setTaskLists,
} from '@store/modules/list';
import { replaceState } from '@util/replaceUrl';
import { setSortInfoForType } from '@store/modules/sort';
import {
  currentCodisplayUserSelector,
  isOnSearchSelector,
} from '@store/selectors/home';
import { setCurrentTask, setTaskID } from '@store/modules/tasks';
import { setCurrentSchedule, setScheduleID } from '@store/modules/schedules';
import { setSyncInfo } from '@store/modules/calendar';
// * components
import {
  IconWrapForCalendar,
  IconWrapForCalendar02,
} from '@component/general/wrap';
import { DefaultInputWrap } from '@component/general/input';
import NotificationMenu from './NotificationMenu';
import { SyncItemInfo } from '@model/state';
// * assets
import CalendarIcon from '@svg/calendar-feed-big.svg';
import CheckmarkIcon from '@svg/checkmark-square-big.svg';
import MagnifyGlassIcon from '@svg/magnifyingglass-big.svg';
import AddIcon from '@svg/add-big.svg';
import NoteIcon from '@svg/note.svg';
import DefaultAvatarIcon from '@image/default_avatar.png';
import {
  CALENDAR_URL,
  CONTACTUS_URL,
  NOTES_ALL_URL,
  NOTE_ADD_URL,
  POLICIES_URL,
  SCHEDULE_ADD_URL,
  SEARCH_URL,
  SETTINGS_URL,
  SUBSCRIPTION_URL,
  TASKS_ALL_URL,
  TASK_ADD_URL,
} from '@util/urls';
import useHotkeys from '@service/hooks/useHotkeys';
import { SHORTCUT_LIST } from '@util/shortcutMap';

const HeadingMenu = () => {
  const user = useSelector(userInfoSelector);
  const router = useRouter();
  const dispatch = useDispatch();
  const isOnSearch = useSelector(isOnSearchSelector);

  const [inputReset, setInputReset] = useState(false);
  const searchRef = useRef<HTMLInputElement | null>(null);

  const currentCodisplayUserID = useSelector(currentCodisplayUserSelector);
  const listResultAll = useListArrayAllForUser(currentCodisplayUserID);
  useEffect(() => {
    if (listResultAll.isSuccess) {
      let sortData: {
        [id: number]: number;
      } = {};

      const data = listResultAll.data;
      for (var key in data) {
        if (key == 'task_lists') {
          dispatch(setTaskLists(data[key]));
        } else if (key == 'archived_task_lists') {
          dispatch(setTaskArchivedLists(data[key]));
        } else if (key == 'schedule_lists') {
          const scheduleLists = data[key];
          dispatch(setScheduleLists(scheduleLists));
          // ! here we also set calendar sync info for the schedule lists
          const newSyncInfo: SyncItemInfo[] = [];
          const filtered = scheduleLists.filter(
            (list: any) => list.pivot?.role === 1,
          );
          if (filtered.length > 0) {
            filtered.forEach((list: any) => {
              if (list?.calendar_id) {
                newSyncInfo.push({
                  list_id: list.id,
                  calendar_id: list?.calendar_id,
                  calendar_summary: list?.calendar_summary ?? '',
                });
              }
            });
          }
          dispatch(setSyncInfo(newSyncInfo));
        } else if (key == 'archived_schedule_lists') {
          dispatch(setScheduleArchivedLists(data[key]));
        }
        if (data[key].length > 0) {
          data[key].map((_: any) => {
            sortData[_.id] = _.pivot.sort != 0 ? _.pivot.sort : _.pivot.list_id;
          });
        }
      }
      dispatch(
        setSortInfoForType({
          type: 'lists',
          data: sortData,
        }),
      );
    }
  }, [listResultAll.isSuccess, listResultAll.data, dispatch]);
  // * event handler
  const onFocusSearch = useCallback(() => {
    dispatch(setIsOnSearch(true));
  }, [dispatch]);
  useEffect(() => {
    if (isOnSearch) {
      setTimeout(() => {
        if (searchRef.current) searchRef.current.focus();
      }, 200);
    }
  }, [isOnSearch]);

  const onKeyHandler = useHotkeys();
  const onKeyDownSearch = useCallback(
    (e: any) => {
      if (e.key === 'Enter') {
        dispatch(setSearch(searchRef.current?.value ?? ''));
        if (!router.asPath.includes(SEARCH_URL)) {
          router.push(SEARCH_URL);
        }
      } else {
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
      }
    },
    [router, dispatch, onKeyHandler],
  );
  const onBlurSearch = useCallback(() => {
    dispatch(setIsOnSearch(false));
  }, [dispatch]);

  const onCalendar = useCallback(() => {
    router.push(CALENDAR_URL);
  }, [router]);
  const onTask = useCallback(() => {
    router.push(TASKS_ALL_URL);
  }, [router]);
  const onNote = useCallback(() => {
    router.push(NOTES_ALL_URL);
  }, [router]);
  const onNewSchedule = useCallback(() => {
    const currentUrl = router.asPath;
    localStorage.setItem('task3_background_url', currentUrl);
    replaceState(SCHEDULE_ADD_URL);
    dispatch(setScheduleID(-1));
    dispatch(setCurrentSchedule(null));
    dispatch(setScheduleModalStatus(true));
  }, [dispatch, router]);
  const onNewTask = useCallback(() => {
    const currentUrl = router.asPath;
    localStorage.setItem('task3_background_url', currentUrl);
    // dispatch(setBackgroundUrl(currentUrl));
    // * change window url only and show the settings modal
    replaceState(TASK_ADD_URL);
    dispatch(setTaskID(-1));
    dispatch(setCurrentTask(null));
    dispatch(setTaskModalStatus(true));
  }, [dispatch, router]);
  const onNewNote = useCallback(() => {
    const currentUrl = router.asPath;
    localStorage.setItem('task3_background_url', currentUrl);
    // * change window url only and show the settings modal
    replaceState(NOTE_ADD_URL);
    dispatch(setCurrentNoteID(-1));
    dispatch(setNoteModalStatus(true));
  }, [dispatch, router]);
  const onSettings = useCallback(() => {
    /**
     * * save currentUrl to localStorage and redux global var
     */
    dispatch(setModalUrl(SETTINGS_URL));
    const currentUrl = router.asPath;
    localStorage.setItem('task3_background_url', currentUrl);
    // dispatch(setBackgroundUrl(currentUrl));
    // * change window url only and show the settings modal
    replaceState(SETTINGS_URL);
    dispatch(setSettingsModalStatus(true));
  }, [dispatch, router]);
  const onSubscription = useCallback(() => {
    dispatch(setModalUrl(SUBSCRIPTION_URL));
    const currentUrl = router.asPath;
    localStorage.setItem('task3_background_url', currentUrl);
    replaceState(SUBSCRIPTION_URL);
    dispatch(setSettingsModalStatus(true));
    dispatch(setActiveSettingsTab(4));
  }, [dispatch, router]);
  const onContact = useCallback(() => {
    const currentUrl = router.asPath;
    localStorage.setItem('task3_background_url', currentUrl);
    replaceState(CONTACTUS_URL);
    dispatch(setContactusModalStatus(true));
  }, [dispatch, router]);
  const onPolicy = useCallback(() => {
    dispatch(setModalUrl(POLICIES_URL));
    const currentUrl = router.asPath;
    localStorage.setItem('task3_background_url', currentUrl);
    replaceState(POLICIES_URL);
    dispatch(setSettingsModalStatus(true));
    dispatch(setActiveSettingsTab(6));
  }, [dispatch, router]);
  const signOut = useCallback(() => {
    localStorage.setItem('task3_token', JSON.stringify(null));
    dispatch(resetUser);
    router.reload();
  }, [dispatch, router]);

  return (
    <div className="flex-none px-24px py-12px border-b-1/2 border-separator flex flex-row justify-between items-center">
      <div className={`flex`}>
        <IconWrapForCalendar02
          Icon={CalendarIcon}
          iconSize={20}
          tooltiptext={'カレンダー'}
          additionalClass={`flex-1 hover:bg-primarySelected hover:text-primary cursor-pointer z-9999 ${
            router.asPath.split('/')[1] === 'calendar'
              ? 'text-primary bg-primarySelected'
              : 'text-fontPrimary'
          }`}
          tooltipClass={'w-88px'}
          onClick={onCalendar}
        />
        <IconWrapForCalendar02
          Icon={CheckmarkIcon}
          iconSize={20}
          tooltiptext={'タスク'}
          additionalClass={`ml-24px hover:bg-primarySelected hover:text-primary cursor-pointer z-9999 ${
            router.asPath.split('/')[1] === 'tasks'
              ? 'text-primary bg-primarySelected'
              : 'text-fontPrimary'
          }`}
          tooltipClass={'w-16'}
          onClick={onTask}
        />
        <IconWrapForCalendar02
          Icon={NoteIcon}
          iconSize={20}
          tooltiptext={'ノート'}
          additionalClass={`ml-24px hover:bg-primarySelected hover:text-primary cursor-pointer z-9999 ${
            router.asPath.split('/')[1] === 'notes'
              ? 'text-primary bg-primarySelected'
              : 'text-fontPrimary'
          }`}
          tooltipClass={'w-16'}
          onClick={onNote}
        />
      </div>
      <div
        className={`flex-1 flex flex-row justify-start items-center ${
          isOnSearch ? '' : 'hidden'
        }`}
      >
        <div className={`w-9/12 flex`}>
          <DefaultInputWrap
            height={36}
            onClick={(e?: any) => {}}
            additionalPositionClass="flex-1 ml-24px relative"
          >
            <input
              ref={searchRef}
              type="text"
              onChange={(e) => {
                if (e.target.value !== '') {
                  setInputReset(true);
                } else {
                  setInputReset(false);
                }
              }}
              onKeyDown={onKeyDownSearch}
              onBlur={onBlurSearch}
              className="flex-1 bg-backgroundPrimary focus:outline-none"
            />
          </DefaultInputWrap>
        </div>
      </div>
      <div className="relative flex flex-row items-center">
        <IconWrapForCalendar
          additionalClass={`bg-backgroundPrimary text-fontPrimary hover:bg-primarySelected hover:text-primary cursor-pointer tooltip ${
            isOnSearch ? 'hidden' : ''
          }`}
          onClick={onFocusSearch}
        >
          <MagnifyGlassIcon width={20} height={20} />
          <span className="absolute top-full mt-1 px-2 py-1 w-16 rounded-2px bg-fontSecondary body3 text-backgroundSecondary text-center z-50 tooltiptext">
            検索
          </span>
        </IconWrapForCalendar>
        <Menu
          as="div"
          className={`relative flex flex-col z-9999 ${
            isOnSearch ? 'hidden' : ''
          }`}
        >
          <Menu.Button>
            <IconWrapForCalendar
              additionalClass="ml-24px bg-backgroundPrimary text-fontPrimary tooltip hover:bg-primarySelected hover:text-primary"
              onClick={() => {}}
            >
              <AddIcon width={20} height={20} />
              <span className="absolute top-full mt-1 px-2 py-1 w-16 rounded-2px bg-fontSecondary body3 text-backgroundSecondary text-center z-60 tooltiptext">
                作成
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
            <Menu.Items className="absolute mt-4px right-0 top-44px p-12px w-200px bg-white rounded-8px border-1/2 border-separator shadow-menu z-50">
              <Menu.Item>
                <div
                  className="p-12px w-full h-44px rounded-8px body1 text-fontPrimary hover:bg-primarySelected hover:text-primary cursor-pointer"
                  onClick={onNewSchedule}
                >
                  スケジュール
                </div>
              </Menu.Item>
              <Menu.Item>
                <div
                  className="p-12px w-full h-44px rounded-8px body1 text-fontPrimary hover:bg-primarySelected hover:text-primary cursor-pointer"
                  onClick={onNewTask}
                >
                  タスク
                </div>
              </Menu.Item>
              <Menu.Item>
                <div
                  className="p-12px w-full h-44px rounded-8px body1 text-fontPrimary hover:bg-primarySelected hover:text-primary cursor-pointer"
                  onClick={onNewNote}
                >
                  ノート
                </div>
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
        <NotificationMenu />
        <Menu as="div" className="flex flex-col z-9999">
          <Menu.Button>
            <div className="ml-24px h-36px w-36px hover:opacity-80">
              <Image
                src={
                  user?.user?.avatar && user?.user?.avatar != ''
                    ? user?.user?.avatar
                    : DefaultAvatarIcon
                }
                width={36}
                height={36}
                alt=""
                className="h-36px w-36px rounded-full object-cover"
              />
            </div>
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
            <Menu.Items className="absolute mt-4px right-0 top-44px w-200px bg-white divide-y divide-gray-100 rounded-md shadow-lg border-1/2 border-separator focus:outline-none z-90">
              <div className="p-12px">
                <Menu.Item>
                  <div className="p-12px border-b border-separator flex flex-col">
                    <div className="flex flex-row">
                      <span
                        className={`flex-1 truncate body1 text-fontPrimary`}
                      >
                        {user?.user?.name ?? ''}
                      </span>
                      {(user?.user?.premium_method != null ||
                        user?.user?.premium_code != null) && (
                        <span
                          className="flex-1 ml-8px px-8px rounded-tl-xl rounded-br-xl caption2-light text-backgroundSecondary flex justify-center items-center"
                          style={{
                            backgroundImage:
                              'linear-gradient(104deg, #007aff, #3a65df 49%, #575acf)',
                          }}
                        >
                          プレミアム
                        </span>
                      )}
                    </div>
                    <div className="truncate body1 text-fontSecondary">
                      {user?.user?.email}
                    </div>
                  </div>
                </Menu.Item>
                <Menu.Item>
                  <div
                    className="p-12px body1 text-fontPrimary cursor-pointer"
                    onClick={onSettings}
                  >
                    <span>設定</span>
                  </div>
                </Menu.Item>
                <Menu.Item>
                  <div
                    className="p-12px body1 text-fontPrimary cursor-pointer"
                    onClick={onSubscription}
                  >
                    サブスクリプション
                  </div>
                </Menu.Item>
                <Menu.Item>
                  <div
                    className="p-12px body1 text-fontPrimary cursor-pointer"
                    onClick={onContact}
                  >
                    お問い合わせ
                  </div>
                </Menu.Item>
                <Menu.Item>
                  <div
                    className="p-12px body1 text-fontPrimary cursor-pointer"
                    onClick={onPolicy}
                  >
                    利用規約・ポリシー
                  </div>
                </Menu.Item>
                <Menu.Item>
                  <div
                    className="p-12px body1 text-fontPrimary cursor-pointer"
                    onClick={signOut}
                  >
                    サインアウト
                  </div>
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  );
};

export default HeadingMenu;
