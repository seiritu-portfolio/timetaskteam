import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ScheduleState } from '@model/state';

const initialState: ScheduleState = {
  currentScheduleID: -1,
  currentSchedule: null,
  scheduleAll: [],
  schedulesForCalendar: [],
};

const scheduleSlice = createSlice({
  name: 'schedules',
  initialState,
  reducers: {
    setScheduleID: (
      state: ScheduleState,
      action: PayloadAction<number | null>,
    ) => {
      state.currentScheduleID = action.payload;
    },
    setCurrentSchedule: (
      state: ScheduleState,
      action: PayloadAction<any | null>,
    ) => {
      state.currentSchedule = action.payload;
    },
    setScheduleAll: (state: ScheduleState, action: PayloadAction<any[]>) => {
      state.scheduleAll = action.payload;
    },
    setSchedulesForCalendar: (
      state: ScheduleState,
      action: PayloadAction<any[]>,
    ) => {
      state.schedulesForCalendar = action.payload;
    },
  },
});

export const {
  setScheduleID,
  setCurrentSchedule,
  setScheduleAll,
  setSchedulesForCalendar,
} = scheduleSlice.actions;

export default scheduleSlice.reducer;
