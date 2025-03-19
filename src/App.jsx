import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import { toggleTheme } from './features/theme/themeSlice';
import { fetchWeatherByCoordinates } from './features/weather/weatherThunks';
import Login from './components/auth/Login';
import Dashboard from './components/Dashboard';


function App() {
  const dispatch = useDispatch();
  const { mode } = useSelector((state) => state.theme);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: '#4CAF50',
      },
      secondary: {
        main: '#FFC107',
      },
      background: {
        default: mode === 'dark' ? '#121212' : '#f5f5f5',
        paper: mode === 'dark' ? '#1E1E1E' : '#ffffff',
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarColor: mode === 'dark' ? '#6b6b6b #2b2b2b' : '#959595 #f5f5f5',
            '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
              borderRadius: 8,
              backgroundColor: mode === 'dark' ? '#6b6b6b' : '#959595',
            },
            '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
              borderRadius: 8,
              backgroundColor: mode === 'dark' ? '#2b2b2b' : '#f5f5f5',
            },
          },
        },
      },
    },
  });

  useEffect(() => {
    // Get theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      dispatch(toggleTheme(savedTheme));
    }

    // Get user's location and fetch weather
    if (isAuthenticated && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          dispatch(fetchWeatherByCoordinates ({ lat: latitude, lon: longitude }));
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, [dispatch, isAuthenticated]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="min-h-screen">
        {isAuthenticated ? <Dashboard /> : <Login />}
      </Box>
    </ThemeProvider>
  );
}

export default App;