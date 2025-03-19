
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import { 
  Box, 
  Typography, 
  Paper, 
  Checkbox, 
  IconButton, 
  Divider,
  LinearProgress,
} from '@mui/material';
import { Star, StarBorder } from '@mui/icons-material';
import { toggleTaskComplete, toggleTaskImportant, reorderTasks } from '../../features/tasks/tasksSlice';
import { setSelectedTask } from '../../features/ui/uiSlice';
import TaskInput from './TaskInput';

const TaskList = () => {
  const dispatch = useDispatch();
  const { tasks, activeList } = useSelector((state) => state.tasks);
  const { isGridView, searchQuery } = useSelector((state) => state.ui);
  
  // Filter tasks based on active list and search query
  const filteredTasks = tasks.filter(task => {
    // Filter by search query
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by active list
    switch (activeList) {
      case 'today':
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
      case 'important':
        return task.important;
      case 'planned':
        return task.dueDate !== null;
      case 'assigned':
        return task.assigned === true;
      default:
        if (activeList === 'all') {
          return true;
        } else {
          // Custom lists
          return task.listId === activeList;
        }
    }
  });
  
  // Separate active and completed tasks
  const activeTasks = filteredTasks.filter(task => !task.completed);
  const completedTasks = filteredTasks.filter(task => task.completed);
  
  // Sort tasks by position
  activeTasks.sort((a, b) => a.position - b.position);
  completedTasks.sort((a, b) => a.position - b.position);
  
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    dispatch(reorderTasks({
      sourceIndex: result.source.index,
      destinationIndex: result.destination.index
    }));
  };
  
  const handleTaskClick = (task) => {
    dispatch(setSelectedTask(task.id));
  };
  
  // Calculate task completion percentage based on steps
  const getTaskCompletionPercentage = (task) => {
    if (!task.steps || task.steps.length === 0) return 0;
    const completedSteps = task.steps.filter(step => step.completed).length;
    return Math.round((completedSteps / task.steps.length) * 100);
  };

  return (
    <Box className="flex-grow overflow-auto p-4">
      <TaskInput />
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="active-tasks">
          {(provided) => (
            <Box
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`mt-4 ${isGridView ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-2'}`}
            >
              {activeTasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided, snapshot) => (
                    <Paper
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`p-3 ${snapshot.isDragging ? 'dragging' : ''} ${
                        task.priority === 'high' ? 'border-l-4 border-red-500' :
                        task.priority === 'medium' ? 'border-l-4 border-yellow-500' :
                        task.priority === 'low' ? 'border-l-4 border-blue-500' : ''
                      }`}
                      onClick={() => handleTaskClick(task)}
                    >
                      <Box className="flex items-center">
                        <Checkbox
                          checked={task.completed}
                          onChange={() => dispatch(toggleTaskComplete(task.id))}
                          onClick={(e) => e.stopPropagation()}
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
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(toggleTaskImportant(task.id));
                          }}
                        >
                          {task.important ? <Star color="secondary" /> : <StarBorder />}
                        </IconButton>
                      </Box>
                      
                      {/* Show steps progress if task has steps */}
                      {task.steps && task.steps.length > 0 && (
                        <Box className="ml-9 mt-1">
                          <Box className="flex justify-between items-center mb-1">
                            <Typography variant="caption" color="textSecondary">
                              {task.steps.filter(step => step.completed).length} of {task.steps.length} steps
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {getTaskCompletionPercentage(task)}%
                            </Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={getTaskCompletionPercentage(task)} 
                            className="rounded-full"
                          />
                        </Box>
                      )}
                      
                      {task.dueDate && (
                        <Typography variant="caption" color="textSecondary" className="ml-9 block mt-1">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </Typography>
                      )}
                    </Paper>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
      
      {completedTasks.length > 0 && (
        <>
          <Divider className="my-4" />
          <Typography variant="subtitle1" className="mb-2">
            Completed
          </Typography>
          
          <Box className="space-y-2">
            {completedTasks.map((task) => (
              <Paper
                key={task.id}
                className="p-3"
                onClick={() => handleTaskClick(task)}
              >
                <Box className="flex items-center">
                  <Checkbox
                    checked={task.completed}
                    onChange={() => dispatch(toggleTaskComplete(task.id))}
                    onClick={(e) => e.stopPropagation()}
                    color="primary"
                  />
                  <Typography
                    variant="body1"
                    className="flex-grow line-through text-gray-500"
                  >
                    {task.title}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(toggleTaskImportant(task.id));
                    }}
                  >
                    {task.important ? <Star color="secondary" /> : <StarBorder />}
                  </IconButton>
                </Box>
                
                {/* Show steps progress if task has steps */}
                {task.steps && task.steps.length > 0 && (
                  <Box className="ml-9 mt-1">
                    <Box className="flex justify-between items-center mb-1">
                      <Typography variant="caption" color="textSecondary">
                        {task.steps.filter(step => step.completed).length} of {task.steps.length} steps
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {getTaskCompletionPercentage(task)}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={getTaskCompletionPercentage(task)} 
                      className="rounded-full"
                    />
                  </Box>
                )}
              </Paper>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

export default TaskList;