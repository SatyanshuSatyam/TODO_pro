
import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Box,
  Badge,
  Menu,
  MenuItem,
  Tooltip,
  Slide,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  GridView,
  ViewList,
  Notifications,
  AccountCircle,
  Brightness4,
  Brightness7,
  Close,
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { toggleSidebar, toggleGridView, setSearchQuery } from '../../features/ui/uiSlice';
import { toggleTheme } from '../../features/theme/themeSlice';
import { logout } from '../../features/auth/authSlice';

// Enhanced Search component with better transitions and responsiveness
const Search = styled('div')(({ theme, open }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: open ? '100%' : '0%',
    minWidth: open ? '300px' : '0px',
  },
  [theme.breakpoints.up('md')]: {
    minWidth: open ? '400px' : '0px',
  },
  transition: theme.transitions.create(['width', 'min-width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.standard,
  }),
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1,
}));

const CloseIconWrapper = styled('div')(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(1),
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 1,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.5, 5, 1.5, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}));

const Header = () => {
  const dispatch = useDispatch();
  const { mode } = useSelector((state) => state.theme);
  const { isGridView, searchQuery } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);
  const { data: weather } = useSelector((state) => state.weather);
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const searchInputRef = useRef(null);
  
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    dispatch(logout());
    handleMenuClose();
  };
  
  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      dispatch(setSearchQuery(''));
    }
  };
  
  // Focus search input when search is shown
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  return (
    <AppBar position="static" color="default" elevation={0} className="border-b">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={() => dispatch(toggleSidebar())}
          className="mr-2"
          sx={{ display: showSearch ? 'none' : 'flex' }}
        >
          <MenuIcon />
        </IconButton>
        
        {!showSearch ? (
          <>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: 'none', sm: 'block' } }}
              className="flex items-center"
            >
              <span className="text-green-500 font-bold">Do</span>
              <span className="font-bold">It</span>
            </Typography>
            
            <Box sx={{ flexGrow: 1 }} />
            
            {weather && (
              <Box className="hidden md:flex items-center mr-4">
                <img 
                  src={`https://openweathermap.org/img/wn/${weather.icon}.png`} 
                  alt={weather.condition}
                  width="30"
                  height="30"
                />
                <Typography variant="body2" className="ml-1">
                  {weather.temperature}°F | {weather.location}
                </Typography>
              </Box>
            )}
            
            <IconButton color="inherit" onClick={toggleSearch}>
              <SearchIcon />
            </IconButton>
            
            <Tooltip title={isGridView ? "List View" : "Grid View"}>
              <IconButton 
                color="inherit" 
                onClick={() => dispatch(toggleGridView())}
                className="ml-1"
              >
                {isGridView ? <ViewList /> : <GridView />}
              </IconButton>
            </Tooltip>
            
            <IconButton
              color="inherit"
              onClick={() => dispatch(toggleTheme())}
              className="ml-1"
            >
              {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
            
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
              className="ml-1"
            >
              <AccountCircle />
            </IconButton>
          </>
        ) : (
          <Slide direction="right" in={showSearch} mountOnEnter unmountOnExit>
            <Search open={showSearch} className="flex-grow">
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search tasks..."
                inputProps={{ 'aria-label': 'search' }}
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                inputRef={searchInputRef}
                autoFocus
                fullWidth
              />
              <CloseIconWrapper>
                <IconButton 
                  color="inherit" 
                  onClick={toggleSearch} 
                  size="small"
                >
                  <Close fontSize="small" />
                </IconButton>
              </CloseIconWrapper>
            </Search>
          </Slide>
        )}
        
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem disabled>
            <Typography variant="body2">
              Signed in as <strong>{user?.username}</strong>
            </Typography>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
          <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;





