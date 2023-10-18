import { GlobalState } from '@model/state';

const membersSelector = (state: GlobalState) => state.collabos.member;
const membersPendingSelector = (state: GlobalState) =>
  state.collabos.memberToAdd;
const guestsSelector = (state: GlobalState) => state.collabos.guest;
const guestsPendingSelector = (state: GlobalState) => state.collabos.guestToAdd;
const groupsSelector = (state: GlobalState) => state.collabos.group;
const requestersSelector = (state: GlobalState) => state.collabos.requesters;
const memberRatesSelector = (state: GlobalState) =>
  state.collabos.workRatesMembers;
const currentCollaboIdSelector = (state: GlobalState) =>
  state.collabos.currentCollaboId;

export {
  membersSelector,
  membersPendingSelector,
  guestsSelector,
  guestsPendingSelector,
  groupsSelector,
  requestersSelector,
  memberRatesSelector,
  currentCollaboIdSelector,
};
