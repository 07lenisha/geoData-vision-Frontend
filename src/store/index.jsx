import { configureStore } from '@reduxjs/toolkit';
import authReducer from './userSlice';
import dataInputReducer from './dataInputSlice';
import globalViewReducer from './globalViewSlice';

export const store = configureStore({
  reducer: {
    user: authReducer,
    dataInput: dataInputReducer,
    globalView: globalViewReducer
  }
});