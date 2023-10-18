import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState } from "@model/state";

const initialState: AuthState = {
  email: "",
  username: "",
  password: "",
  userAgent: "",
  authCode: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setEmail: (state: AuthState, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    resetEmail: (state: AuthState) => {
      state.email = "";
    },
    setUsername: (state: AuthState, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setAuthCode: (state: AuthState, action: PayloadAction<string>) => {
      state.authCode = action.payload;
    },
    setUserAgent: (state: AuthState, action: PayloadAction<string>) => {
      state.userAgent = action.payload;
    },
    setPassword: (state: AuthState, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
  },
});

export const {
  setEmail,
  resetEmail,
  setUsername,
  setAuthCode,
  setUserAgent,
  setPassword,
} = authSlice.actions;

export default authSlice.reducer;
