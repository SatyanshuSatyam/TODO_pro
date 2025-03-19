
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Paper,
  InputBase,
  IconButton,
  Collapse,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  Add,
  Star,
  StarBorder,
  Flag,
  CalendarToday,
  KeyboardArrowDown,
  KeyboardArrowUp,
  LocationOn,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { addTask } from '../../features/tasks/tasksSlice';

const TaskInput = () => {
  const dispatch = useDispatch();
  
  const [taskTitle, setTaskTitle] = useState('');
  const [isImportant, setIsImportant] = useState(false);
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [isOutdoor, setIsOutdoor] = useState(false);
  const [location, setLocation] = useState('');
  
  const handleAddTask = () => {
    if (taskTitle.trim()) {
      dispatch(addTask({
        title: taskTitle,
        important: isImportant,
        priority,
        dueDate,
        isOutdoor,
        location: isOutdoor ? location : '',
      }));
      
      // Reset form
      setTaskTitle('');
      setIsImportant(false);
      setPriority('medium');
      setDueDate(null);
      setIsOutdoor(false);
      setLocation('');
      setShowOptions(false);
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddTask();
    }
  };

  return (
    <Paper className="p-3">
      <Box className="flex items-center">
        <IconButton
          color={isImportant ? 'secondary' : 'default'}
          onClick={() => setIsImportant(!isImportant)}
        >
          {isImportant ? <Star /> : <StarBorder />}
        </IconButton>
        
        <InputBase
          placeholder="Add a task..."
          fullWidth
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          className="mx-2"
        />
        
        <IconButton
          color="primary"
          onClick={handleAddTask}
          disabled={!taskTitle.trim()}
        >
          <Add />
        </IconButton>
        
        <IconButton onClick={() => setShowOptions(!showOptions)}>
          {showOptions ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        </IconButton>
      </Box>
      
      <Collapse in={showOptions}>
        <Box className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormControl fullWidth size="small">
            <InputLabel id="priority-select-label">Priority</InputLabel>
            <Select
              labelId="priority-select-label"
              value={priority}
              label="Priority"
              onChange={(e) => setPriority(e.target.value)}
            >
              <MenuItem value="low">
                <Box className="flex items-center">
                  <Flag className="mr-2 text-blue-500" />
                  Low
                </Box>
              </MenuItem>
              <MenuItem value="medium">
                <Box className="flex items-center">
                  <Flag className="mr-2 text-yellow-500" />
                  Medium
                </Box>
              </MenuItem>
              <MenuItem value="high">
                <Box className="flex items-center">
                  <Flag className="mr-2 text-red-500" />
                  High
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
          
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Due Date"
              value={dueDate}
              onChange={(newDate) => setDueDate(newDate)}
              slotProps={{ textField: { size: "small", fullWidth: true } }}
            />
          </LocalizationProvider>
          
          <Box className="md:col-span-2">
            <FormControlLabel
              control={
                <Switch
                  checked={isOutdoor}
                  onChange={() => setIsOutdoor(!isOutdoor)}
                  color="primary"
                />
              }
              label="Outdoor Task"
            />
            
            {isOutdoor && (
              <TextField
                size="small"
                placeholder="Enter location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                fullWidth
                className="mt-2"
                InputProps={{
                  startAdornment: <LocationOn fontSize="small" className="mr-1 text-gray-500" />,
                }}
              />
            )}
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default TaskInput;