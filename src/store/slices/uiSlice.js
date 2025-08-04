import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  darkMode: localStorage.getItem('gemini_darkMode') === 'true' || 
             (!localStorage.getItem('gemini_darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches),
  searchQuery: '',
  sidebarOpen: false,
  showCreateChatroomModal: false,
  showDeleteConfirmModal: false,
  chatroomToDelete: null,
  notifications: []
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('gemini_darkMode', state.darkMode.toString());
      
      // Update document class
      if (state.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    
    setShowCreateChatroomModal: (state, action) => {
      state.showCreateChatroomModal = action.payload;
    },
    
    setShowDeleteConfirmModal: (state, action) => {
      state.showDeleteConfirmModal = action.payload;
    },
    
    setChatroomToDelete: (state, action) => {
      state.chatroomToDelete = action.payload;
    },
    
    addNotification: (state, action) => {
      const notification = {
        id: Date.now(),
        type: action.payload.type || 'info',
        message: action.payload.message,
        duration: action.payload.duration || 3000
      };
      state.notifications.push(notification);
    },
    
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    
    clearNotifications: (state) => {
      state.notifications = [];
    },
    
    initializeDarkMode: (state) => {
      // Set initial dark mode class
      if (state.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  },
});

export const {
  toggleDarkMode,
  setSearchQuery,
  toggleSidebar,
  setSidebarOpen,
  setShowCreateChatroomModal,
  setShowDeleteConfirmModal,
  setChatroomToDelete,
  addNotification,
  removeNotification,
  clearNotifications,
  initializeDarkMode
} = uiSlice.actions;

export default uiSlice.reducer; 