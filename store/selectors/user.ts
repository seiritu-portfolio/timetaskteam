import { GlobalState } from '@model/state';

const userInfoSelector = (state: GlobalState) => state.user;
const tokenSelector = (state: GlobalState) => state.user.token;
const emailSelector = (state: GlobalState) => state.user.user?.email ?? '';
const taskInboxIDSelector = (state: GlobalState) =>
  state.user.user?.task_inbox_id ?? 0;
const scheduleInboxIDSelector = (state: GlobalState) =>
  state.user.user?.schedule_inbox_id ?? 0;
const urgencyCriteriaSelector = (state: GlobalState) =>
  state.user.user?.urgency_switch ?? '3-8';
const tzOffsetSelector = (state: GlobalState) => state.user.tzOffsetMins;
const tzOffsetBrowserSelector = (state: GlobalState) =>
  state.user.tzOffsetMinsBrowser;
const userTimeDisplayFormat = (state: GlobalState) =>
  state.user.user?.time_display;
const userProfileSelector = (state: GlobalState) => state.user.user;

export {
  userInfoSelector,
  tokenSelector,
  emailSelector,
  taskInboxIDSelector,
  scheduleInboxIDSelector,
  urgencyCriteriaSelector,
  tzOffsetSelector,
  tzOffsetBrowserSelector,
  userTimeDisplayFormat,
  userProfileSelector,
};
