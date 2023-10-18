import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import authReducer from '@store/modules/auth';
import userReducer from '@store/modules/user';
import calendarReducer from '@store/modules/calendar';
import homeReducer from '@store/modules/home';
import subscriptionReducer from '@store/modules/subscription';
import collabosReducer from '@store/modules/collabos';
import listsReducer from '@store/modules/list';
import tasksReducer from '@store/modules/tasks';
import scheduleReducer from '@store/modules/schedules';
import sortReducer from '@store/modules/sort';

const reducer = {
  auth: authReducer,
  user: userReducer,
  calendar: calendarReducer,
  home: homeReducer,
  subscription: subscriptionReducer,
  collabos: collabosReducer,
  lists: listsReducer,
  tasks: tasksReducer,
  schedules: scheduleReducer,
  sort: sortReducer,
};

export const makeStore = () =>
  configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
    devTools: true,
  });

export const wrapper = createWrapper(makeStore);
