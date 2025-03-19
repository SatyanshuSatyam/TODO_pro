
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Checkbox,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  LinearProgress,
  Switch,
  FormControlLabel,
  Collapse,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Close,
  Delete,
  Star,
  StarBorder,
  CalendarToday,
  Notifications,
  Repeat,
  Add,
  Save,
  LocationOn,
  WbSunny,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  toggleTaskComplete,
  toggleTaskImportant,
  updateTaskDueDate,
  updateTaskReminder,
  updateTaskRepeat,
  updateTaskNotes,
  deleteTask,
  addTaskStep,
  toggleTaskStep,
  deleteTaskStep,
  updateTask,
} from '../../features/tasks/tasksSlice';
import { setSelectedTask } from '../../features/ui/uiSlice';
import { fetchWeatherByLocation } from '../../features/weather/weatherThunks';

const TaskDetail = () => {
  const dispatch = useDispatch();
  const { selectedTask } = useSelector((state) => state.ui);
  const { tasks } = useSelector((state) => state.tasks);
  const { locationWeather, loading: weatherLoading } = useSelector((state) => state.weather);
  
  const task = tasks.find(t => t.id === selectedTask);
  
  const [notes, setNotes] = useState('');
  const [newStep, setNewStep] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const [reminder, setReminder] = useState(null);
  const [repeat, setRepeat] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isOutdoor, setIsOutdoor] = useState(false);
  const [location, setLocation] = useState('');
  const [showLocationInput, setShowLocationInput] = useState(false);

  useEffect(() => {
    if (task) {
      setNotes(task.notes || '');
      setDueDate(task.dueDate ? new Date(task.dueDate) : null);
      setReminder(task.reminder ? new Date(task.reminder) : null);
      setRepeat(task.repeat || '');
      setIsOutdoor(task.isOutdoor || false);
      setLocation(task.location || '');
      setShowLocationInput(task.isOutdoor || false);
    } else {
      setNotes('');
      setDueDate(null);
      setReminder(null);
      setRepeat('');
      setIsOutdoor(false);
      setLocation('');
      setShowLocationInput(false);
    }
  }, [task]);
  
  // Fetch weather data when location changes
  useEffect(() => {
    if (isOutdoor && location && location.trim() !== '') {
      dispatch(fetchWeatherByLocation(location));
    }
  }, [isOutdoor, location, dispatch]);
  
  if (!task) return null;
  
  // Calculate completion percentage based on steps
  const totalSteps = task.steps ? task.steps.length : 0;
  const completedSteps = task.steps ? task.steps.filter(step => step.completed).length : 0;
  const completionPercentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
  
  const handleClose = () => {
    dispatch(setSelectedTask(null));
  };
  
  const handleDelete = () => {
    dispatch(deleteTask(task.id));
    dispatch(setSelectedTask(null));
  };
  
  const handleSave = () => {
    const updatedTask = {
      ...task,
      notes,
      dueDate,
      reminder,
      repeat,
      isOutdoor,
      location: isOutdoor ? location : '',
    };
    
    dispatch(updateTask(updatedTask));
    // Show a success message or notification here
  };
  
  const handleAddStep = () => {
    if (newStep.trim()) {
      dispatch(addTaskStep({ taskId: task.id, stepText: newStep }));
      setNewStep('');
    }
  };
  
  const handleOutdoorToggle = () => {
    const newValue = !isOutdoor;
    setIsOutdoor(newValue);
    setShowLocationInput(newValue);
    if (!newValue) {
      setLocation('');
    }
  };
  
  // Get weather data for the task location
  const weatherData = task.location && locationWeather[task.location];

  return (
    <Paper className="w-full md:w-80 h-full overflow-y-auto flex flex-col border-l">
      <Box className="p-3 flex items-center justify-between border-b">
        <Typography variant="subtitle1">Task Details</Typography>
        <IconButton size="small" onClick={handleClose}>
          <Close />
        </IconButton>
      </Box>
      
      <Box className="p-3 flex items-center">
        <Checkbox
          checked={task.completed}
          onChange={() => dispatch(toggleTaskComplete(task.id))}
          color="primary"
        />
        <Typography
          variant="body1"
          className={`flex-grow ${task.completed ? 'line-through text-gray-500' : ''}`}
        >
          {task.title}
        </Typography>
        <IconButton
          size="small"
          onClick={() => dispatch(toggleTaskImportant(task.id))}
        >
          {task.important ? <Star color="secondary" /> : <StarBorder />}
        </IconButton>
      </Box>
      
      {/* Progress bar for steps */}
      {totalSteps > 0 && (
        <Box className="px-3 pb-2">
          <Box className="flex justify-between items-center mb-1">
            <Typography variant="caption" color="textSecondary">
              Progress
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {completionPercentage}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={completionPercentage} 
            className="rounded-full"
          />
        </Box>
      )}
      
      {/* Weather information for outdoor tasks */}
      {task.isOutdoor && task.location && weatherData && (
        <Box className="p-3 bg-blue-50 dark:bg-blue-900/20 mb-2 mx-3 rounded-md">
          <Box className="flex items-center">
            <WbSunny className="mr-2 text-yellow-500" />
            <Typography variant="subtitle2">
              Weather at {weatherData.location}
            </Typography>
          </Box>
          <Box className="flex items-center mt-1">
            <img 
              src={`https://openweathermap.org/img/wn/${weatherData.icon}.png`} 
              alt={weatherData.condition}
              width="40"
              height="40"
              className="mr-1"
            />
            <Box>
              <Typography variant="body2">
                {weatherData.temperature}°F | {weatherData.condition}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Humidity: {weatherData.humidity}% | Wind: {weatherData.windSpeed} mph
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
      
      <Divider />
      
      {/* Steps Section */}
      <Box className="p-3">
        <Typography variant="subtitle2" className="mb-2">
          Steps
        </Typography>
        
        <Box className="flex mb-2">
          <TextField
            size="small"
            placeholder="Add a step..."
            value={newStep}
            onChange={(e) => setNewStep(e.target.value)}
            fullWidth
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAddStep();
              }
            }}
          />
          <Button 
            variant="contained" 
            color="primary" 
            size="small" 
            onClick={handleAddStep}
            disabled={!newStep.trim()}
            className="ml-2"
          >
            <Add fontSize="small" />
          </Button>
        </Box>
        
        {task.steps && task.steps.length > 0 && (
          <List dense className="max-h-40 overflow-auto">
            {task.steps.map((step) => (
              <ListItem key={step.id} dense>
                <ListItemIcon className="min-w-0">
                  <Checkbox
                    edge="start"
                    checked={step.completed}
                    onChange={() => dispatch(toggleTaskStep({ taskId: task.id, stepId: step.id }))}
                    size="small"
                  />
                </ListItemIcon>
                <ListItemText
                  primary={step.text}
                  className={step.completed ? 'line-through text-gray-500' : ''}
                />
                <ListItemSecondaryAction>
                  <IconButton 
                    edge="end" 
                    size="small"
                    onClick={() => dispatch(deleteTaskStep({ taskId: task.id, stepId: step.id }))}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
      
      <Divider />
      
      <Box className="p-3">
        {/* Due Date */}
        <Box className="mb-3">
          <Typography variant="subtitle2" className="mb-1">
            Due Date
          </Typography>
          {showDatePicker ? (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                value={dueDate}
                onChange={(newDate) => {
                  setDueDate(newDate);
                  setShowDatePicker(false);
                }}
                slotProps={{ 
                  textField: { 
                    size: "small", 
                    fullWidth: true,
                    onBlur: () => setShowDatePicker(false)
                  } 
                }}
              />
            </LocalizationProvider>
          ) : (
            <Button
              startIcon={<CalendarToday />}
              fullWidth
              variant="outlined"
              size="small"
              onClick={() => setShowDatePicker(true)}
              className="justify-start"
            >
              {dueDate ? new Date(dueDate).toLocaleDateString() : 'Add Due Date'}
            </Button>
          )}
        </Box>
        
        {/* Outdoor Task Toggle */}
        <Box className="mb-3">
          <FormControlLabel
            control={
              <Switch
                checked={isOutdoor}
                onChange={handleOutdoorToggle}
                color="primary"
              />
            }
            label="Outdoor Task"
          />
          
          <Collapse in={showLocationInput}>
            <Box className="mt-2 flex items-center">
              <TextField
                size="small"
                placeholder="Enter location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                fullWidth
                InputProps={{
                  startAdornment: <LocationOn fontSize="small" className="mr-1 text-gray-500" />,
                }}
              />
              {weatherLoading && (
                <CircularProgress size={20} className="ml-2" />
              )}
            </Box>
          </Collapse>
        </Box>
        
        {/* Reminder */}
        <Box className="mb-3">
          <Typography variant="subtitle2" className="mb-1">
            Reminder
          </Typography>
          <FormControl fullWidth size="small">
            <InputLabel id="reminder-select-label">Set Reminder</InputLabel>
            <Select
              labelId="reminder-select-label"
              value={reminder ? 'custom' : ''}
              label="Set Reminder"
              onChange={(e) => {
                if (e.target.value === 'tomorrow') {
                  setReminder(new Date(Date.now() + 24 * 60 * 60 * 1000));
                } else if (e.target.value === 'nextWeek') {
                  setReminder(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
                } else if (e.target.value === '') {
                  setReminder(null);
                }
              }}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="tomorrow">Tomorrow</MenuItem>
              <MenuItem value="nextWeek">Next Week</MenuItem>
              {reminder && <MenuItem value="custom">Custom: {new Date(reminder).toLocaleString()}</MenuItem>}
            </Select>
          </FormControl>
        </Box>
        
        {/* Repeat */}
        <Box className="mb-3">
          <Typography variant="subtitle2" className="mb-1">
            Repeat
          </Typography>
          <FormControl fullWidth size="small">
            <InputLabel id="repeat-select-label">Repeat</InputLabel>
            <Select
              labelId="repeat-select-label"
              value={repeat}
              label="Repeat"
              onChange={(e) => setRepeat(e.target.value)}
            >
              <MenuItem value="">Never</MenuItem>
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      
      <Divider />
      
      <Box className="p-3 flex-grow">
        <Typography variant="subtitle2" className="mb-2">
          Notes
        </Typography>
        <TextField
          multiline
          rows={4}
          fullWidth
          placeholder="Add notes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          variant="outlined"
          size="small"
        />
      </Box>
      
      <Box className="p-3 border-t mt-auto flex gap-2">
        <Button
          variant="contained"
          color="primary"
          startIcon={<Save />}
          onClick={handleSave}
          fullWidth
        >
          Save
        </Button>
        <Button
          variant="outlined"
          color="error"
          startIcon={<Delete />}
          onClick={handleDelete}
        >
          Delete
        </Button>
      </Box>
    </Paper>
  );
};

export default TaskDetail;