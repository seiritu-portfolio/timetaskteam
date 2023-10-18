import { useEffect } from 'react';
import Modal from 'react-responsive-modal';
import { useDispatch, useSelector } from 'react-redux';
import { useQueryClient } from 'react-query';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
var utc = require('dayjs/plugin/utc');

import { useMyInfo } from '@service/userQueries';
import { updateQueueSetting } from '@store/modules/home';
import {
  setTzOffsetMins,
  setTzOffsetMinsBrowser,
  setUser,
} from '@store/modules/user';
import { activeSettingsTabSelector } from '@store/selectors/home';
import { tzOffsetSelector, userInfoSelector } from '@store/selectors/user';

import UserList from '@component/settings/userList';
import AccountSetting from '@component/settings/account';
import SyncSetting from '@component/settings/sync';
import DisplaySetting from '@component/settings/display';
import ProductivitySetting from '@component/settings/productivity';
import SubscriptionSetting from './subscription';
import PolicySetting from './Policy';
import SettingsMenu from './SettingsMenu';

import ModalDefaultProps from '@model/modal';

import CloseIcon from '@svg/multiply.svg';
import { LOGIN_METHODS_OPTIONS } from '@util/selectOptions';

const SettingsModal = ({ isOpen, close }: ModalDefaultProps) => {
  const activeTabIndex = useSelector(activeSettingsTabSelector);

  const userInfo = useMyInfo();
  const dispatch = useDispatch();
  const tzOffsetMins = useSelector(tzOffsetSelector);
  const queryClient = useQueryClient();
  const currentUserInfo = useSelector(userInfoSelector);

  useEffect(() => {
    dayjs.extend(timezone);
    dayjs.extend(utc);
  }, []);
  useEffect(() => {
    if (userInfo.isSuccess) {
      dispatch(setUser(userInfo.data));
      // ! calculate timezone offset minutes, and dispatch it
      const newTzOffsetMins = dayjs()
        .tz(
          userInfo.data.timezone ??
            Intl.DateTimeFormat().resolvedOptions().timeZone,
        )
        .utcOffset();
      const tzOffsetBrowser = dayjs()
        .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
        .utcOffset();
      if (tzOffsetMins !== newTzOffsetMins) {
        dispatch(setTzOffsetMins(newTzOffsetMins));
        queryClient.invalidateQueries('tasks');
      }
      dispatch(setTzOffsetMinsBrowser(tzOffsetBrowser));
    }
  }, [userInfo.isSuccess, userInfo.data, dispatch, tzOffsetMins, queryClient]);

  useEffect(() => {
    const newLoginMethod =
      LOGIN_METHODS_OPTIONS.filter(
        (_) => parseInt(_.value) == currentUserInfo.user?.login_method,
      )[0] ?? LOGIN_METHODS_OPTIONS[0];
    let newGoogleAccount = '';
    if (currentUserInfo.user?.login_method == 2) {
      newGoogleAccount = currentUserInfo.user?.google_email ?? '';
    }
    const currentUrgencySwitch = (
      currentUserInfo.user?.urgency_switch ?? '3-8'
    ).split('-');
    dispatch(
      updateQueueSetting({
        avatar:
          currentUserInfo.user?.avatar && currentUserInfo.user.avatar != ''
            ? currentUserInfo.user.avatar
            : undefined,
        name: currentUserInfo.user?.name ?? '',
        email: currentUserInfo.user?.email ?? '',
        googleAccount: newGoogleAccount,
        loginMethod: parseInt(newLoginMethod.value),
        tz:
          currentUserInfo.user?.timezone ??
          'Intl.DateTimeFormat().resolvedOptions().timeZone,',
        displayHoliday: currentUserInfo.user?.holiday_display ?? 0,
        timeDisplay: currentUserInfo.user?.time_display ?? 1,
        weekStart: currentUserInfo.user?.week_start ?? 0,
        availableTime: currentUserInfo.user?.available_time ?? 210,
        taskDefaultTime: currentUserInfo.user?.task_default_time ?? 210,
        autoRemainDays: currentUserInfo.user?.auto_remain_days ?? 3,
        urgencyStart: parseInt(currentUrgencySwitch[0]),
        urgencyEnd: parseInt(currentUrgencySwitch[1]),
        nonOperatingDays:
          currentUserInfo.user?.non_operating_days?.split(',') ?? [],
        nonOperatingWeekDays:
          currentUserInfo.user?.non_operating_week_days?.split(',') ?? [],
        noInactiveDays:
          currentUserInfo.user?.non_operating_exception_days?.split(',') ?? [],
      }),
    );
  }, [dispatch, currentUserInfo]);

  return (
    <Modal
      open={isOpen}
      onClose={close}
      closeIcon={
        <CloseIcon
          width={20}
          height={20}
          className="mt-8px mr-12px text-fontSecondary"
        />
      }
      center
      classNames={{
        overlay: 'modal-overlay',
        modal: 'settings-modal',
        modalContainer: 'settings-modal-container',
        root: 'settings-modal-root',
      }}
    >
      <div className="flex-1 flex">
        <SettingsMenu />
        <div className="relative w-3/4 flex flex-col">
          {activeTabIndex === 0 ? (
            <AccountSetting userInfo={currentUserInfo.user} />
          ) : activeTabIndex === 1 ? (
            <DisplaySetting />
          ) : activeTabIndex === 2 ? (
            <ProductivitySetting />
          ) : activeTabIndex === 3 ? (
            <UserList />
          ) : activeTabIndex === 4 ? (
            <SubscriptionSetting />
          ) : activeTabIndex === 5 ? (
            <SyncSetting />
          ) : activeTabIndex === 6 ? (
            <PolicySetting />
          ) : null}
        </div>
      </div>
    </Modal>
  );
};

export default SettingsModal;
