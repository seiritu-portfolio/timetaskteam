import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserState, UserType } from '@model/state';

const initialState: UserState = {
  user: null,
  token: '',
  tzOffsetMins: 0,
  tzOffsetMinsBrowser: 0,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state: UserState, action: PayloadAction<UserType>) => {
      state.user = { ...action.payload };
    },
    updateUser: (state: UserState, action: PayloadAction<any>) => {
      state.user = {
        ...state.user,
        ...action.payload,
      };
    },
    setToken: (state: UserState, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    resetUser: (state: UserState) => {
      state.user = null;
    },
    setTzOffsetMins: (state: UserState, action: PayloadAction<number>) => {
      state.tzOffsetMins = action.payload;
    },
    setTzOffsetMinsBrowser: (
      state: UserState,
      action: PayloadAction<number>,
    ) => {
      state.tzOffsetMinsBrowser = action.payload;
    },
  },
});

export const {
  setUser,
  updateUser,
  setToken,
  resetUser,
  setTzOffsetMins,
  setTzOffsetMinsBrowser,
} = userSlice.actions;
export default userSlice.reducer;
