import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  Avatar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Badge,
} from '@mui/material';
import {
  CheckCircleOutline,
  Today,
  Star,
  CalendarMonth,
  Person,
  Add,
  List as ListIcon,
} from '@mui/icons-material';
import { setActiveList, addList } from '../../features/tasks/tasksSlice';
import { toggleSidebar } from '../../features/ui/uiSlice';

const Sidebar = () => {
  const dispatch = useDispatch();
  const { sidebarOpen } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);
  const { tasks, activeList, lists } = useSelector((state) => state.tasks);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [newListName, setNewListName] = useState('');
  
  // Calculate task statistics
  const getTaskStats = (listId) => {
    let filteredTasks = [];
    
    switch (listId) {
      case 'today':
        filteredTasks = tasks.filter(task => {
          if (task.dueDate) {
            const today = new Date();
            const dueDate = new Date(task.dueDate);
            return (
              dueDate.getDate() === today.getDate() &&
              dueDate.getMonth() === today.getMonth() &&
              dueDate.getFullYear() === today.getFullYear()
            );
          }
          return false;
        });
        break;
      case 'important':
        filteredTasks = tasks.filter(task => task.important);
        break;
      case 'planned':
        filteredTasks = tasks.filter(task => task.dueDate !== null);
        break;
      case 'assigned':
        filteredTasks = tasks.filter(task => task.assigned === true);
        break;
      default:
        if (listId === 'all') {
          filteredTasks = [...tasks];
        } else {
          // Custom lists
          filteredTasks = tasks.filter(task => task.listId === listId);
        }
    }
    
    const total = filteredTasks.length;
    const completed = filteredTasks.filter(task => task.completed).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { total, completed, percentage };
  };
  
  // Get stats for active list
  const activeListStats = getTaskStats(activeList);
  
  const handleListClick = (listId) => {
    dispatch(setActiveList(listId));
    if (window.innerWidth < 768) {
      dispatch(toggleSidebar());
    }
  };
  
  const handleAddList = () => {
    if (newListName.trim()) {
      dispatch(addList({ name: newListName, icon: 'ListIcon' }));
      setNewListName('');
      setOpenDialog(false);
    }
  };
  
  const getIconComponent = (iconName) => {
    switch (iconName) {
      case 'CheckCircleOutline': return <CheckCircleOutline />;
      case 'Today': return <Today />;
      case 'Star': return <Star />;
      case 'CalendarMonth': return <CalendarMonth />;
      case 'Person': return <Person />;
      default: return <ListIcon />;
    }
  };

  const drawerContent = (
    <Box className="h-full flex flex-col">
      <Box className="p-4 flex flex-col items-center">
        <Avatar 
          src={user?.avatar} 
          alt={user?.username} 
          className="mb-3"
          sx={{ width: { xs: 64, sm: 80 }, height: { xs: 64, sm: 80 } }}
        />
        <Typography variant="subtitle1" className="font-medium text-center">
          Hey, {user?.username}
        </Typography>
      </Box>
      
      <Divider />
      
      <List className="flex-grow overflow-auto">
        {lists.map((item) => {
          const stats = getTaskStats(item.id);
          return (
            <ListItem
              button
              key={item.id}
              selected={activeList === item.id}
              onClick={() => handleListClick(item.id)}
              className={`cursor-pointer ${activeList === item.id ? 'bg-green-50 dark:bg-green-900/20' : ''}`}
            >
              <ListItemIcon className={activeList === item.id ? 'text-green-600' : ''}>
                {getIconComponent(item.icon)}
              </ListItemIcon>
              <ListItemText primary={item.name} />
              {stats.total > 0 && (
                <Badge 
                  badgeContent={stats.total} 
                  color="primary"
                  className="mr-2"
                />
              )}
            </ListItem>
          );
        })}
      </List>
      
      <Divider />
      
      <List>
        <ListItem button onClick={() => setOpenDialog(true)} className="cursor-pointer">
          <ListItemIcon>
            <Add />
          </ListItemIcon>
          <ListItemText primary="Add list" />
        </ListItem>
      </List>
      
      <Box className="p-4 flex flex-col items-center">
        <Box className="relative inline-flex mb-2">
          <CircularProgress
            variant="determinate"
            value={activeListStats.percentage}
            size={80}
            thickness={4}
            color="primary"
          />
          <Box
            className="absolute inset-0 flex items-center justify-center"
          >
            <Typography variant="caption" component="div" color="textSecondary">
              {`${activeListStats.percentage}%`}
            </Typography>
          </Box>
        </Box>
        <Typography variant="body2" color="textSecondary" className="text-center">
          {lists.find(list => list.id === activeList)?.name || 'All Tasks'}
          <br />
          {activeListStats.completed} of {activeListStats.total} completed
        </Typography>
      </Box>
      
      {/* Add List Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New List</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="List Name"
            type="text"
            fullWidth
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} className="cursor-pointer">Cancel</Button>
          <Button onClick={handleAddList} color="primary" disabled={!newListName.trim()} className="cursor-pointer">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );

  return (
    <>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={sidebarOpen}
        onClose={() => dispatch(toggleSidebar())}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', sm: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            width: { xs: '70%', sm: 240 }, 
            boxSizing: 'border-box' 
          },
        }}
      >
        {drawerContent}
      </Drawer>
      
      {/* Desktop drawer */}
      <Drawer
        variant="persistent"
        open={sidebarOpen}
        sx={{
          display: { xs: 'none', sm: 'none', md: 'block' },
          '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box' },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;