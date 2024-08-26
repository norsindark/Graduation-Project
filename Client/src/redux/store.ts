import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../redux/counter/counterSlice';
import accountSlice from "./account/accountSlice.tsx";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    account: accountSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

