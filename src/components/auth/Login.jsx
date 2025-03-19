

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Link,
  Container,
  Avatar,
  IconButton,
} from '@mui/material';
import { LockOutlined, Brightness4, Brightness7 } from '@mui/icons-material';
import { login } from '../../features/auth/authSlice';
import { toggleTheme } from '../../features/theme/themeSlice';

const Login = () => {
  const dispatch = useDispatch();
  const { mode } = useSelector((state) => state.theme);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  
  const handleLogin = (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    
    // Mock authentication - in a real app, this would call an API
    // if (username === 'demo' && password === 'password') {
    //   dispatch(login({
    //     id: '1',
    //     username: 'demo',
    //     email: 'demo@example.com',
    //     avatar: 'https://i.pravatar.cc/150?img=1',
    //   }));
    // } else {
    //   setError('Invalid credentials. Try demo/password');
    // }

    dispatch(login({
      id: '1',
      username,
      avatar: 'https://i.pravatar.cc/150?img=1',
    }));
  };

  return (
    <Container component="main" maxWidth="xs" className="h-screen flex items-center justify-center">
      <Paper elevation={3} className="p-6 relative">
        {/* Theme Toggle Button */}
        <IconButton 
          onClick={() => dispatch(toggleTheme())}
          className="absolute top-2 right-2"
          color="inherit"
        >
          {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
        
        <Box className="flex flex-col items-center">
          <Avatar className="bg-green-500 mb-2">
            <LockOutlined />
          </Avatar>
          <Typography component="h1" variant="h5" className="mb-4">
            Sign in to DoIt
          </Typography>
          
          {error && (
            <Typography color="error" className="mb-4 text-center">
              {error}
            </Typography>
          )}
          
          <Box component="form" onSubmit={handleLogin} className="w-full">
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormControlLabel
              control={
                <Checkbox
                  value="remember"
                  color="primary"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
              }
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className="mt-3 mb-2"
            >
              Sign In
            </Button>
            <Box className="flex justify-between mt-2">
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Box>
          </Box>
        </Box>
        
        <Box className="mt-4 text-center">
          <Typography variant="body2" color="textSecondary">
            dummy login:enter any detail for now
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;