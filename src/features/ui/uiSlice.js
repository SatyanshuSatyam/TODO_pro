import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: window.innerWidth > 768,
  isGridView: localStorage.getItem('isGridView') === 'true',
  selectedTask: null,
  searchQuery: '',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    toggleGridView: (state) => {
      state.isGridView = !state.isGridView;
      localStorage.setItem('isGridView', state.isGridView);
    },
    setSelectedTask: (state, action) => {
      state.selectedTask = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleGridView,
  setSelectedTask,
  setSearchQuery,
} = uiSlice.actions;

export default uiSlice.reducer;