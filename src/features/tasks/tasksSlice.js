

import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  tasks: JSON.parse(localStorage.getItem('tasks')) || [],
  activeList: 'all',
  lists: JSON.parse(localStorage.getItem('lists')) || [
    { id: 'all', name: 'All Tasks', icon: 'CheckCircleOutline' },
    { id: 'today', name: 'Today', icon: 'Today' },
    { id: 'important', name: 'Important', icon: 'Star' },
    { id: 'planned', name: 'Planned', icon: 'CalendarMonth' },
    { id: 'assigned', name: 'Assigned to me', icon: 'Person' },
    { id: 'outdoor', name: 'Outdoor Tasks', icon: 'WbSunny' },
  ],
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: {
      reducer: (state, action) => {
        state.tasks.push(action.payload);
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
      },
      prepare: (taskData) => {
        return {
          payload: {
            id: nanoid(),
            title: taskData.title,
            completed: false,
            important: taskData.important || false,
            priority: taskData.priority || 'medium',
            dueDate: taskData.dueDate || null,
            reminder: taskData.reminder || null,
            repeat: taskData.repeat || null,
            notes: taskData.notes || '',
            steps: taskData.steps || [],
            isOutdoor: taskData.isOutdoor || false,
            location: taskData.location || '',
            createdAt: new Date().toISOString(),
            position: taskData.position || 0,
          },
        };
      },
    },
    updateTask: (state, action) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
      }
    },
    toggleTaskComplete: (state, action) => {
      const task = state.tasks.find((task) => task.id === action.payload);
      if (task) {
        task.completed = !task.completed;
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
      }
    },
    toggleTaskImportant: (state, action) => {
      const task = state.tasks.find((task) => task.id === action.payload);
      if (task) {
        task.important = !task.important;
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
      }
    },
    updateTaskPriority: (state, action) => {
      const { id, priority } = action.payload;
      const task = state.tasks.find((task) => task.id === id);
      if (task) {
        task.priority = priority;
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
      }
    },
    updateTaskDueDate: (state, action) => {
      const { id, dueDate } = action.payload;
      const task = state.tasks.find((task) => task.id === id);
      if (task) {
        task.dueDate = dueDate;
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
      }
    },
    updateTaskReminder: (state, action) => {
      const { id, reminder } = action.payload;
      const task = state.tasks.find((task) => task.id === id);
      if (task) {
        task.reminder = reminder;
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
      }
    },
    updateTaskRepeat: (state, action) => {
      const { id, repeat } = action.payload;
      const task = state.tasks.find((task) => task.id === id);
      if (task) {
        task.repeat = repeat;
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
      }
    },
    updateTaskNotes: (state, action) => {
      const { id, notes } = action.payload;
      const task = state.tasks.find((task) => task.id === id);
      if (task) {
        task.notes = notes;
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
      }
    },
    updateTaskLocation: (state, action) => {
      const { id, isOutdoor, location } = action.payload;
      const task = state.tasks.find((task) => task.id === id);
      if (task) {
        task.isOutdoor = isOutdoor;
        task.location = location;
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
      }
    },
    addTaskStep: (state, action) => {
      const { taskId, stepText } = action.payload;
      const task = state.tasks.find((task) => task.id === taskId);
      if (task) {
        if (!task.steps) task.steps = [];
        task.steps.push({
          id: nanoid(),
          text: stepText,
          completed: false
        });
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
      }
    },
    toggleTaskStep: (state, action) => {
      const { taskId, stepId } = action.payload;
      const task = state.tasks.find((task) => task.id === taskId);
      if (task && task.steps) {
        const step = task.steps.find(step => step.id === stepId);
        if (step) {
          step.completed = !step.completed;
          localStorage.setItem('tasks', JSON.stringify(state.tasks));
        }
      }
    },
    deleteTaskStep: (state, action) => {
      const { taskId, stepId } = action.payload;
      const task = state.tasks.find((task) => task.id === taskId);
      if (task && task.steps) {
        task.steps = task.steps.filter(step => step.id !== stepId);
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
      }
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      localStorage.setItem('tasks', JSON.stringify(state.tasks));
    },
    reorderTasks: (state, action) => {
      const { sourceIndex, destinationIndex } = action.payload;
      const [removed] = state.tasks.splice(sourceIndex, 1);
      state.tasks.splice(destinationIndex, 0, removed);
      
      // Update positions
      state.tasks.forEach((task, index) => {
        task.position = index;
      });
      
      localStorage.setItem('tasks', JSON.stringify(state.tasks));
    },
    setActiveList: (state, action) => {
      state.activeList = action.payload;
    },
    addList: (state, action) => {
      const newList = {
        id: nanoid(),
        name: action.payload.name,
        icon: action.payload.icon || 'List',
      };
      state.lists.push(newList);
      localStorage.setItem('lists', JSON.stringify(state.lists));
      return state;
    },
  },
});

export const {
  addTask,
  updateTask,
  toggleTaskComplete,
  toggleTaskImportant,
  updateTaskPriority,
  updateTaskDueDate,
  updateTaskReminder,
  updateTaskRepeat,
  updateTaskNotes,
  updateTaskLocation,
  addTaskStep,
  toggleTaskStep,
  deleteTaskStep,
  deleteTask,
  reorderTasks,
  setActiveList,
  addList,
} = tasksSlice.actions;

export default tasksSlice.reducer;