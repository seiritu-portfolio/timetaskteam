import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { SubscriptionState } from '@model/state';

const initialState: SubscriptionState = {
  currentSettingState: 0,
  premiumCode: '',
  purchasedInfo: null,
  currentOpenModal: -1,
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    setCurrentSettingState: (
      state: SubscriptionState,
      action: PayloadAction<number>,
    ) => {
      state.currentSettingState = action.payload;
    },
    setPremiumCode: (
      state: SubscriptionState,
      action: PayloadAction<string>,
    ) => {
      state.premiumCode = action.payload;
    },
    setPaymentMethod: (
      state: SubscriptionState,
      action: PayloadAction<string>,
    ) => {
      if (action.payload === '') {
        return;
      }
      if (state.purchasedInfo) {
        state.purchasedInfo.method = action.payload;
      } else {
        state.purchasedInfo = {
          method: action.payload,
        };
      }
    },
    setPaymentLast4: (
      state: SubscriptionState,
      action: PayloadAction<string>,
    ) => {
      if (action.payload === '') {
        return;
      }
      if (state.purchasedInfo) {
        state.purchasedInfo = {
          ...state.purchasedInfo,
          last4: action.payload,
        };
      } else {
        state.purchasedInfo = {
          last4: action.payload,
        };
      }
    },
    setPurchasedUserCount: (
      state: SubscriptionState,
      action: PayloadAction<number>,
    ) => {
      if (action.payload === 0) {
        return;
      }
      if (state.purchasedInfo) {
        state.purchasedInfo = {
          ...state.purchasedInfo,
          userCount: action.payload,
        };
      } else {
        state.purchasedInfo = {
          userCount: action.payload,
        };
      }
    },
    setCurrentOpenModal: (
      state: SubscriptionState,
      action: PayloadAction<number>,
    ) => {
      state.currentOpenModal = action.payload;
    },
    resetSubscription: (state: SubscriptionState) => {
      state.purchasedInfo = null;
      state.currentSettingState = 0;
      state.premiumCode = '';
      state.currentOpenModal = -1;
    },
  },
});

export const {
  setCurrentSettingState,
  setPaymentMethod,
  setPremiumCode,
  setPaymentLast4,
  setPurchasedUserCount,
  setCurrentOpenModal,
  resetSubscription,
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
