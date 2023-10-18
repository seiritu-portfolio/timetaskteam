import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';

import EllipsisIcon from '@svg/ellipsis-big.svg';
import RadioSelectedIcon from '@svg/largecircle-fill-circle.svg';
import RadioUnselectedIcon from '@svg/circle.svg';
import {
  setActiveSettingsTab,
  setListModal,
  setModalUrl,
  setSettingsModalStatus,
} from '@store/modules/home';
import { setCurrentListID } from '@store/modules/list';
import { scheduleInboxIDSelector } from '@store/selectors/user';
import { calendarFilterSelector } from '@store/selectors/calendar';
import { setFilter } from '@store/modules/calendar';
import { replaceState } from '@util/replaceUrl';
import { SETTINGS_DISPLAY_URL } from '@util/urls';
interface MenuBtnProps {
  className?: string;
}

const MenuBtn = (props: MenuBtnProps) => {
  const { className = '' } = props;
  const router = useRouter();
  const dispatch = useDispatch();
  const scheduleInboxID = useSelector(scheduleInboxIDSelector);
  const calendarFilter = useSelector(calendarFilterSelector);

  return (
    <div className={`${className} z-90`}>
      <div
        className={
          'bg-backgroundPrimary select-none cursor-pointer p-2px w-44px rounded-8px body1'
        }
      >
        <div className={'rounded-8px active:bg-white active:shadow'}>
          <Menu as="div" className="relative flex flex-col z-20">
            <Menu.Button>
              <div className="h-40px flex-xy-center tooltip">
                <EllipsisIcon
                  width={24}
                  height={24}
                  className="opacity-40 active:opacity-90"
                />
                <span className="absolute top-full mt-1 px-2 py-1 w-20 rounded-2px bg-fontSecondary body3 text-backgroundSecondary text-center z-50 tooltiptext">
                  表示設定
                </span>
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
              <Menu.Items className="absolute mt-4px right-0 top-44px w-248px rounded-md border-1/2 border-separator bg-white divide divide-y divide-gray-100 focus:outline-none cursor-pointer">
                <div className="p-12px body1 text-fontPrimary">
                  <Menu.Item>
                    <div
                      className="p-12px rounded-6px truncate hover:bg-primarySelected hover:text-primary"
                      onClick={() => {
                        const currentUrl = router.asPath;
                        localStorage.setItem(
                          'task3_background_url',
                          currentUrl,
                        );
                        dispatch(setListModal(true));
                        dispatch(setCurrentListID(scheduleInboxID));
                      }}
                    >
                      スケジュールリスト編集
                    </div>
                  </Menu.Item>
                  <Menu.Item>
                    <div
                      className={`p-12px rounded-6px truncate ${
                        calendarFilter == 'start_date'
                          ? 'text-primary'
                          : 'text-fontPrimary'
                      } flex justify-between`}
                      onClick={() => {
                        dispatch(setFilter('start_date'));
                      }}
                    >
                      <span>開始日を起点に表示</span>
                      {calendarFilter == 'start_date' ? (
                        <RadioSelectedIcon width={20} height={20} />
                      ) : (
                        <RadioUnselectedIcon
                          width={20}
                          height={20}
                          className="text-separator"
                        />
                      )}
                    </div>
                  </Menu.Item>
                  <Menu.Item>
                    <div
                      className={`p-12px rounded-6px truncate ${
                        calendarFilter == 'end_date'
                          ? 'text-primary'
                          : 'text-fontPrimary'
                      } flex justify-between`}
                      onClick={() => {
                        dispatch(setFilter('end_date'));
                      }}
                    >
                      <span>タスクの期限日のみ表示</span>
                      {calendarFilter == 'end_date' ? (
                        <RadioSelectedIcon width={20} height={20} />
                      ) : (
                        <RadioUnselectedIcon
                          width={20}
                          height={20}
                          className="text-separator"
                        />
                      )}
                    </div>
                  </Menu.Item>
                  <Menu.Item>
                    <div
                      className="p-12px rounded-6px truncate hover:bg-primarySelected hover:text-primary"
                      onClick={() => {
                        dispatch(setModalUrl(SETTINGS_DISPLAY_URL));
                        const currentUrl = router.asPath;
                        localStorage.setItem(
                          'task3_background_url',
                          currentUrl,
                        );
                        replaceState(SETTINGS_DISPLAY_URL);
                        dispatch(setSettingsModalStatus(true));
                        dispatch(setActiveSettingsTab(1));
                      }}
                    >
                      表示設定
                    </div>
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default MenuBtn;
