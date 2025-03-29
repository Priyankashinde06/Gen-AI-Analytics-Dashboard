import { configureStore } from '@reduxjs/toolkit';
import queryReducer from '../query/querySlice';

export const store = configureStore({
  reducer: {
    query: queryReducer,
  },
});