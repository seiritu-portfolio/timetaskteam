import { GlobalState } from '@model/state';

const subscriptionSettingStateSelector = (state: GlobalState) =>
  state.subscription.currentSettingState;
const premiumCodeSelector = (state: GlobalState) =>
  state.subscription.premiumCode;
const paymentMethodSelector = (state: GlobalState) =>
  state.subscription.purchasedInfo?.method;
const cardLast4Selector = (state: GlobalState) =>
  state.subscription.purchasedInfo?.last4;
const userCountSelector = (state: GlobalState) =>
  state.subscription.purchasedInfo?.userCount;
const purchasedInfoSelector = (state: GlobalState) =>
  state.subscription.purchasedInfo;
const currentOpenModalSelector = (state: GlobalState) =>
  state.subscription.currentOpenModal;

export {
  subscriptionSettingStateSelector,
  premiumCodeSelector,
  paymentMethodSelector,
  cardLast4Selector,
  userCountSelector,
  purchasedInfoSelector,
  currentOpenModalSelector,
};
