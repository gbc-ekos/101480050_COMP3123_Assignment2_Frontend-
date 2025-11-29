import {configureStore} from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import employeeReducer from './slices/employeeSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        employees: employeeReducer
    },
});