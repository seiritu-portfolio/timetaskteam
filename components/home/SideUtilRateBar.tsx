import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useQueryClient } from 'react-query';
import dayjs from 'dayjs';
import { DateRange } from 'react-date-range';
// @ts-ignore
import * as rdrLocales from 'react-date-range/dist/locale';
// * hooks
import { useCooperatorList } from '@service/userQueries';
import { useGroups } from '@service/groupQueries';
import {
  setGroups,
  setGuests,
  setMembers,
  setWorkRatesMembers,
} from '@store/modules/collabos';
import { guestsSelector, membersSelector } from '@store/selectors/collabos';
import { userInfoSelector } from '@store/selectors/user';
import {
  codisplayUsersSelector,
  currentCodisplayUserSelector,
  isSidebarOpenSelector,
  onCodisplaySelector,
} from '@store/selectors/home';
import {
  onOffCodisplayMode,
  setActiveSettingsTab,
  setCodisplayFetching,
  setCodisplayUsers,
  setCurrentCodisplayUser,
  setModalUrl,
  setSettingsModalStatus,
  toggleSidebar,
} from '@store/modules/home';
import { useRatesForCollabs } from '@service/workRateQueries';
import { setShowTaskDetail } from '@store/modules/tasks';
// * custom components
import UserUtilizationRow from './UserUtilizationRow';
import ModalAddUser from '@component/settings/userList/addUser/ModalAddUser';
import {
  AvatarImageClickable,
  AvatarImageSelectable,
} from '@component/general/avatar';
import { UtilRateMenu } from './tasks/UtilRateMenu';
import { useToday } from '@service/hooks/useSchedules';
// * assets and constants
import CoDisplayIcon from '@svg/person-crop-circle-badge-checkmark.svg';
import HamburgerMenuIcon from '@svg/hamburger-menu-big.svg';
import ShowMoreIcon from '@svg/ellipsis.svg';
import { IconWrap } from '@component/general/wrap';

import { replaceState } from '@util/replaceUrl';
import { DEFAULT_AVATAR_URL, PRODUCTIVITY_URL } from '@util/urls';
import { COLOR_VALUES } from '@util/constants';
import { CooperateType } from '@model/constants';
import { UTIL_RATE_TAB_LIST } from '@util/selectOptions';
import { getDateISOFormat } from '@util/calendar';

const SideUtilRateBar = () => {
  const isOpen = useSelector(isSidebarOpenSelector);
  // const [isOpen, setIsOpen] = useState(false);
  const [collaboType, setCollaboType] = useState(0);
  const members = useSelector(membersSelector);
  const guests = useSelector(guestsSelector);
  const myInfo = useSelector(userInfoSelector);

  const membersWithMe = useMemo(() => {
    if (myInfo.user) {
      return [
        {
          id: myInfo.user.id,
          avatar: myInfo.user.avatar,
          pivot: {
            color: 4,
          },
        },
        ...members,
      ];
    }
  }, [members, myInfo.user]);
  const dispatch = useDispatch();
  const setIsOpen = useCallback(() => {
    dispatch(toggleSidebar());
  }, [dispatch]);
  const allCollabosResult = useCooperatorList('all' as CooperateType);
  useEffect(() => {
    if (allCollabosResult.isSuccess) {
      const data = allCollabosResult.data;
      dispatch(setMembers(data.members ? data.members : []));
      dispatch(setGuests(data.guests ? data.guests : []));
    }
  }, [allCollabosResult.isSuccess, allCollabosResult.data, dispatch]);
  const groupsResult = useGroups();
  useEffect(() => {
    if (groupsResult.isSuccess) {
      dispatch(
        setGroups(
          groupsResult.data.length > 0
            ? groupsResult.data.map((_: any) => ({
                ..._,
                users: _.cooperators,
              }))
            : [],
        ),
      );
    }
  }, [groupsResult.isSuccess, groupsResult.data, dispatch]);
  const [isUserAddModal, setIsUserAddModal] = useState(false);

  const onCodisplayMode = useSelector(onCodisplaySelector);
  const codisplayUsers = useSelector(codisplayUsersSelector);

  const collabIDs = useMemo(() => {
    let idList: number[] = [];
    if (myInfo.user?.id) {
      idList.push(myInfo.user.id);
    }
    if (members.length > 0) {
      idList = [...idList, ...members.map((_) => _.id)];
    }
    return idList;
  }, [members, myInfo]);

  const [period, setPeriod] = useState<
    { startDate: Date; endDate: Date; key: string }[]
  >([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);
  const ratesForCollabsResult = useRatesForCollabs(
    getDateISOFormat(period[0].startDate),
    getDateISOFormat(period[0].endDate),
    collabIDs,
  );
  const [utilTermValue, setUtilTermValue] = useState<
    'today' | '3d' | '7d' | '1w' | '1m' | '30d'
  >('today');
  useEffect(() => {
    let start = dayjs();
    let end = dayjs();
    if (utilTermValue === 'today') {
    } else if (utilTermValue === '3d') {
      start = start.subtract(2, 'day');
    } else if (utilTermValue === '7d') {
      start = start.subtract(6, 'day');
    } else if (utilTermValue === '1w') {
      // start = start.subtract(1, 'day').startOf('week').add(1, 'day');
      if (myInfo.user?.week_start == 1) {
        end = start.endOf('week').add(1, 'day');
        if (start.day() === 0) {
          end = end.add(7, 'day');
        }
      } else {
        end = start.endOf('week');
      }
    } else if (utilTermValue === '1m') {
      // start = start.startOf('month');
      end = start.add(1, 'month').date(1).subtract(1, 'day');
    } else if (utilTermValue === '30d') {
      start = start.subtract(29, 'day');
    }
    setPeriod([
      {
        startDate: start.toDate(),
        endDate: end.toDate(),
        key: 'selection',
      },
    ]);
  }, [utilTermValue, myInfo.user]);

  useEffect(() => {
    if (
      ratesForCollabsResult.isSuccess &&
      Array.isArray(ratesForCollabsResult.data) &&
      ratesForCollabsResult.data.length > 0
    ) {
      dispatch(
        setWorkRatesMembers(
          ratesForCollabsResult.data.map((_: any) => ({
            id: _.id,
            rate: _.rate,
            actualTime: _.actual_time_sum,
            requiredTime: _.total_time_sum,
          })),
        ),
      );
    }
  }, [ratesForCollabsResult.isSuccess, ratesForCollabsResult.data, dispatch]);
  const router = useRouter();
  const currentCodisplayUserID = useSelector(currentCodisplayUserSelector);
  const queryClient = useQueryClient();

  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const toggleOpen = () =>
    setIsPickerOpen((old) => {
      if (!old) {
        const pickerElem: HTMLElement | null =
          document.querySelector('.rangepicker');
        if (pickerElem) {
          pickerElem.focus();
        }
      }

      return !old;
    });

  // ! get current time based on my timezone
  const currentDate = useToday();

  return (
    <div
      className={`relative transition-all ease-in-out delay-400 ${
        isOpen ? 'w-300px px-24px' : 'w-92px items-center'
      } shrink-0 h-full bg-backgroundPrimary flex flex-col`}
    >
      <div
        onClick={setIsOpen}
        className="mt-24px w-44px h-44px flex-none border-1/2 border-separator rounded-8px bg-backgroundSecondary text-fontPrimary flex-xy-center cursor-pointer hover:bg-primaryHovered hover:text-primary"
      >
        <HamburgerMenuIcon width={24} height={24} className="z-20" />
      </div>
      {isOpen && (
        <>
          <div className="mt-24px py-12px h-44px flex-row--between z-100">
            <div
              className="body1 text-fontPrimary cursor-pointer flex flex-row"
              tabIndex={-1}
            >
              <span
                className="text-primary z-50"
                onClick={() => {
                  toggleOpen();
                }}
              >
                {(() => {
                  const startDate = period[0].startDate;
                  const endDate = period[0].endDate;
                  const startMonth = startDate.getMonth() + 1;
                  const endMonth = endDate.getMonth() + 1;

                  if (startDate.getTime() != endDate.getTime()) {
                    return `${startMonth}月${startDate.getDate()}日 - ${
                      startMonth !== endMonth ? `${endMonth}月` : ''
                    }${endDate.getDate()}日`;
                  } else if (currentDate.month() + 1 === startMonth) {
                    return `${startDate.getDate()}日`;
                  } else {
                    return `${startMonth}月${startDate.getDate()}日`;
                  }
                })()}
              </span>
              の稼働率
              <>
                <div
                  className={`fixed inset-0 ${
                    isPickerOpen ? '' : 'hidden'
                  } rangepicker`}
                  onClick={() => {
                    setIsPickerOpen(false);
                  }}
                  tabIndex={-1}
                />
                <div
                  className={`absolute ml-16px task-detail--date-range z-30 ${
                    isPickerOpen ? '' : 'hidden'
                  }`}
                >
                  <UtilRateMenu
                    value={utilTermValue}
                    onChange={(newValue) => {
                      setUtilTermValue(newValue);
                    }}
                    className={'absolute top-40px left-2'}
                  />
                  <DateRange
                    locale={rdrLocales.ja}
                    showPreview
                    rangeColors={['#007aff']}
                    showDateDisplay={false}
                    // @ts-ignore
                    showMonthDropdown={false}
                    showYearDropdown={false}
                    showMonthAndYearPickers={false}
                    onChange={(item) => {
                      // @ts-ignore
                      setPeriod([item.selection]);
                      setIsPickerOpen(false);
                    }}
                    moveRangeOnFirstSelection={false}
                    monthDisplayFormat="MMM---yyyy"
                    // @ts-ignore
                    ranges={period}
                    className="absolute -ml-24px"
                  />
                </div>
              </>
            </div>
            <ShowMoreIcon
              width={20}
              height={20}
              className="cursor-pointer"
              onClick={() => {
                dispatch(setModalUrl(PRODUCTIVITY_URL));
                const currentUrl = router.asPath;
                localStorage.setItem('task3_background_url', currentUrl);
                replaceState(PRODUCTIVITY_URL);
                dispatch(setSettingsModalStatus(true));
                dispatch(setActiveSettingsTab(2));
              }}
            />
          </div>
          <div className="mt-12px flex-none h-44px rounded-6px bg-backgroundSecondary flex flex-row z-90">
            {UTIL_RATE_TAB_LIST.map((tabItem) => (
              <div
                onClick={() => {
                  setCollaboType(tabItem.value);
                }}
                className={`flex-1 body1 ${
                  collaboType === tabItem.value
                    ? 'text-fontPrimary'
                    : 'text-fontSecondary'
                } text-fontPrimary flex justify-center items-center cursor-pointer`}
                key={`util-rate-tab-${tabItem.value}`}
              >
                <span>{tabItem.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-24px flex-1 flex flex-col overflow-y-auto">
            <div className={collaboType !== 1 ? '' : 'hidden'}>
              {myInfo.user && myInfo.user.id > 0 && (
                <UserUtilizationRow
                  id={myInfo.user.id}
                  src={myInfo.user.avatar ?? DEFAULT_AVATAR_URL}
                  name={myInfo.user.name}
                  key={`my-utilization-row`}
                  color="primary"
                />
              )}
              {members.length > 0 &&
                members.map((_: any, index: number) => (
                  <UserUtilizationRow
                    id={_.id}
                    src={_.avatar}
                    name={_.name}
                    key={`user-${_.id}-utilization-row-${index}`}
                    color={COLOR_VALUES[_.pivot.color].label}
                  />
                ))}
            </div>
            <div className={collaboType !== 0 ? '' : 'hidden'}>
              {guests.length > 0 &&
                guests.map((_: any) => (
                  <UserUtilizationRow
                    id={_.id}
                    src={_.avatar}
                    name={_.name}
                    color={COLOR_VALUES[_.pivot.color].label}
                    key={`guest-user-${_.id}-utilization-row`}
                    hiddenMode={true}
                  />
                ))}
            </div>
          </div>
        </>
      )}
      {!isOpen && (
        <div className="my-24px h-full w-full flex flex-col justify-start overflow-y-auto overflow-x-hidden items-center">
          {membersWithMe &&
            membersWithMe.map((_: any, index) => {
              return onCodisplayMode ? (
                <AvatarImageSelectable
                  selected={codisplayUsers.includes(_.id)}
                  styleClass="my-12px"
                  imgSrc={_.avatar}
                  color={COLOR_VALUES[_.pivot.color].label}
                  key={`codisplay-member-${_.id}-${index}`}
                  onClick={() => {
                    const newUsersIDs = codisplayUsers.includes(_.id)
                      ? codisplayUsers.filter((userID) => userID !== _.id)
                      : [...codisplayUsers, _.id];
                    dispatch(setCodisplayUsers([...newUsersIDs]));
                  }}
                />
              ) : (
                <AvatarImageClickable
                  styleClass="my-12px"
                  imgSrc={_.avatar}
                  color={
                    currentCodisplayUserID == _.id
                      ? 'primary'
                      : COLOR_VALUES[_.pivot.color].label
                  }
                  onClick={() => {
                    dispatch(setCurrentCodisplayUser(_.id));
                    dispatch(setCodisplayFetching(true));
                    dispatch(setShowTaskDetail(false));
                    queryClient.invalidateQueries('tasks');
                    queryClient.invalidateQueries('list');
                  }}
                  hideBorder={currentCodisplayUserID == _.id ? false : true}
                  key={`accepted-member-avatars-${_.id}-${index}`}
                />
              );
            })}
        </div>
      )}
      {!isOpen && (
        <IconWrap
          additionalClass={`flex-none mb-24px bottom-0 hover:bg-primaryHovered hover:text-primary ${
            onCodisplayMode
              ? 'bg-primaryHovered text-primary'
              : 'bg-separator text-fontPrimary'
          } ${router.asPath.split('/')[1] === 'tasks' ? 'hidden' : ''}`}
          onClick={() => {
            dispatch(onOffCodisplayMode(!onCodisplayMode));
          }}
        >
          <CoDisplayIcon width={20} height={20} />
        </IconWrap>
      )}
      {isOpen && (
        <div
          className="my-24px w-auto py-12px bottom-0 bg-backgroundPrimary body1 text-primary cursor-pointer"
          onClick={() => {
            setIsUserAddModal(true);
          }}
        >
          ユーザー追加
        </div>
      )}
      <ModalAddUser
        isOpen={isUserAddModal}
        close={() => setIsUserAddModal(false)}
      />
    </div>
  );
};

export default SideUtilRateBar;
