import { configureStore } from '@reduxjs/toolkit';
import accountReducer from './account/accountSlice';

export const store = configureStore({
  reducer: {
    account: accountReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
