import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './features/tasks/tasksSlice';
import authReducer from './features/auth/authSlice';
import themeReducer from './features/theme/themeSlice';
import weatherReducer from './features/weather/weatherSlice';
import uiReducer from './features/ui/uiSlice';

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    auth: authReducer,
    theme: themeReducer,
    weather: weatherReducer,
    ui: uiReducer,
  },
});