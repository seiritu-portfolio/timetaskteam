import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CollabosState, UserType } from '@model/state';
import { GroupType } from '@model/user';

const initialState: CollabosState = {
  member: [],
  guest: [],
  requesters: [],
  memberToAdd: [],
  guestToAdd: [],
  group: [],
  workRatesMembers: [],
  currentCollaboId: 0,
};

const collabosSlice = createSlice({
  name: 'collabos',
  initialState,
  reducers: {
    setMembers: (state: CollabosState, action: PayloadAction<UserType[]>) => {
      state.member = action.payload;
    },
    setGuests: (state: CollabosState, action: PayloadAction<UserType[]>) => {
      state.guest = action.payload;
    },
    setRequesters: (
      state: CollabosState,
      action: PayloadAction<UserType[]>,
    ) => {
      state.requesters = action.payload;
    },
    setMemberToAdd: (
      state: CollabosState,
      action: PayloadAction<UserType[]>,
    ) => {
      state.memberToAdd = action.payload;
    },
    addMemberToAdd: (state: CollabosState, action: PayloadAction<UserType>) => {
      state.memberToAdd = [...state.memberToAdd, action.payload];
    },
    setGuestToAdd: (
      state: CollabosState,
      action: PayloadAction<UserType[]>,
    ) => {
      state.guestToAdd = action.payload;
    },
    addGuestToAdd: (state: CollabosState, action: PayloadAction<UserType>) => {
      state.guestToAdd = [...state.memberToAdd, action.payload];
    },
    setGroups: (state: CollabosState, action: PayloadAction<GroupType[]>) => {
      state.group = action.payload;
    },
    setWorkRatesMembers: (
      state: CollabosState,
      action: PayloadAction<
        { id: string; rate: number; actualTime: number; requiredTime: number }[]
      >,
    ) => {
      state.workRatesMembers = action.payload;
    },
    setCurrentCollaboId: (
      state: CollabosState,
      action: PayloadAction<number>,
    ) => {
      state.currentCollaboId = action.payload;
    },
  },
});

export const {
  setMembers,
  setGuests,
  setRequesters,
  setMemberToAdd,
  addMemberToAdd,
  setGuestToAdd,
  addGuestToAdd,
  setGroups,
  setWorkRatesMembers,
  setCurrentCollaboId,
} = collabosSlice.actions;

export default collabosSlice.reducer;
