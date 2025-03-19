

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Toolbar } from '@mui/material';
import Header from './layout/Header';
import Sidebar from './layout/Sidebar';
import TaskList from './tasks/TaskList';
import TaskDetail from './tasks/TaskDetail';
import { fetchWeatherByLocation } from '../features/weather/weatherThunks';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { sidebarOpen } = useSelector((state) => state.ui);
  const { selectedTask } = useSelector((state) => state.ui);
  
  // Fetch weather data on component mount
  useEffect(() => {
    // Use geolocation to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          dispatch(fetchWeatherByLocation('New York')); // Default location
        },
        (error) => {
          console.error('Error getting location:', error);
          dispatch(fetchWeatherByLocation('New York')); // Fallback to default location
        }
      );
    } else {
      dispatch(fetchWeatherByLocation('New York')); // Fallback for browsers without geolocation
    }
  }, [dispatch]);

  return (
    <Box className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <Box
        component="main"
        className="flex-1 flex flex-col overflow-hidden"
        sx={{
          marginLeft: { md: sidebarOpen ? '240px' : '0' },
          transition: 'margin 225ms cubic-bezier(0.0, 0, 0.2, 1) 0ms',
        }}
      >
        <Header />
        
        {/* Add Toolbar component to create space below fixed AppBar */}
        {/* <Toolbar /> */}
        
        <Box className="flex flex-1 overflow-hidden">
          <TaskList />
          {selectedTask && <TaskDetail />}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;