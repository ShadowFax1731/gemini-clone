import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Simulate AI response
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ chatroomId, message, imageUrl = null }, { getState, dispatch }) => {
    try {
      const { user } = getState().auth;
      const userId = user?.id || 'default';
      
      // Add user message immediately
      const userMessage = {
        id: Date.now(),
        content: message,
        sender: 'user',
        timestamp: new Date().toISOString(),
        imageUrl
      };
      
      dispatch(addMessage({ chatroomId, message: userMessage, userId }));
      
      // Simulate AI thinking delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      // Generate AI response
      const aiResponses = [
        "That's an interesting question! Let me think about that...",
        "I understand what you're asking. Here's what I can tell you...",
        "Great question! Based on my knowledge, I'd say...",
        "I'm processing your request. Here's my analysis...",
        "Thanks for sharing that with me. My thoughts on this are...",
        "I appreciate you asking that. Let me break this down for you...",
        "That's a fascinating topic! Here's my perspective...",
        "I'm glad you brought this up. Here's what I think...",
        "Interesting point! Let me share my thoughts on this...",
        "I see what you're getting at. Here's my take on it..."
      ];
      
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      const aiMessage = {
        id: Date.now() + 1,
        content: randomResponse,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        imageUrl: null
      };
      
      return { chatroomId, message: aiMessage, userId };
    } catch (error) {
      throw new Error('Failed to send message');
    }
  }
);

// Simulate loading older messages
export const loadOlderMessages = createAsyncThunk(
  'chat/loadOlderMessages',
  async ({ chatroomId, page }, { getState }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate dummy older messages
      const olderMessages = Array.from({ length: 10 }, (_, index) => ({
        id: Date.now() - (page * 10 + index) * 1000,
        content: `This is an older message ${page * 10 + index + 1} in chatroom ${chatroomId}`,
        sender: Math.random() > 0.5 ? 'user' : 'ai',
        timestamp: new Date(Date.now() - (page * 10 + index) * 60000).toISOString(),
        imageUrl: null
      }));
      
      return { chatroomId, messages: olderMessages, page };
    } catch (error) {
      throw new Error('Failed to load older messages');
    }
  }
);

const initialState = {
  chatrooms: [],
  currentChatroom: null,
  messages: {},
  isLoading: false,
  isTyping: false,
  error: null
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    createChatroom: (state, action) => {
      const newChatroom = {
        id: Date.now(),
        title: action.payload.title,
        createdAt: new Date().toISOString(),
        lastMessage: null,
        messageCount: 0
      };
      state.chatrooms.unshift(newChatroom);
      state.messages[newChatroom.id] = [];
      
      // Save to localStorage with user-specific key
      const userId = action.payload.userId || 'default';
      const storageKey = `gemini_chatrooms_${userId}`;
      const savedChatrooms = JSON.parse(localStorage.getItem(storageKey) || '[]');
      savedChatrooms.unshift(newChatroom);
      localStorage.setItem(storageKey, JSON.stringify(savedChatrooms));
    },
    
    deleteChatroom: (state, action) => {
      const { chatroomId, userId } = action.payload;
      state.chatrooms = state.chatrooms.filter(room => room.id !== chatroomId);
      delete state.messages[chatroomId];
      
      if (state.currentChatroom?.id === chatroomId) {
        state.currentChatroom = state.chatrooms[0] || null;
      }
      
      // Update localStorage with user-specific key
      const storageKey = `gemini_chatrooms_${userId || 'default'}`;
      const savedChatrooms = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const updatedChatrooms = savedChatrooms.filter(room => room.id !== chatroomId);
      localStorage.setItem(storageKey, JSON.stringify(updatedChatrooms));
    },
    
    setCurrentChatroom: (state, action) => {
      state.currentChatroom = action.payload;
    },
    
    addMessage: (state, action) => {
      const { chatroomId, message, userId } = action.payload;
      
      if (!state.messages[chatroomId]) {
        state.messages[chatroomId] = [];
      }
      
      state.messages[chatroomId].push(message);
      
      // Update chatroom last message
      const chatroom = state.chatrooms.find(room => room.id === chatroomId);
      if (chatroom) {
        chatroom.lastMessage = message.content;
        chatroom.messageCount = (chatroom.messageCount || 0) + 1;
      }
      
      // Save to localStorage with user-specific key
      const storageKey = `gemini_messages_${chatroomId}_${userId || 'default'}`;
      const savedMessages = JSON.parse(localStorage.getItem(storageKey) || '[]');
      savedMessages.push(message);
      localStorage.setItem(storageKey, JSON.stringify(savedMessages));
    },
    
    setTyping: (state, action) => {
      state.isTyping = action.payload;
    },
    
    loadChatroomsFromStorage: (state, action) => {
      const userId = action.payload || 'default';
      const storageKey = `gemini_chatrooms_${userId}`;
      const savedChatrooms = JSON.parse(localStorage.getItem(storageKey) || '[]');
      state.chatrooms = savedChatrooms;
      
      // Load messages for each chatroom with user-specific keys
      savedChatrooms.forEach(chatroom => {
        const messageStorageKey = `gemini_messages_${chatroom.id}_${userId}`;
        const savedMessages = JSON.parse(localStorage.getItem(messageStorageKey) || '[]');
        state.messages[chatroom.id] = savedMessages;
      });
    },
    
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Send Message
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
        state.isTyping = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isTyping = false;
        const { chatroomId, message, userId } = action.payload;
        
        if (!state.messages[chatroomId]) {
          state.messages[chatroomId] = [];
        }
        
        state.messages[chatroomId].push(message);
        
        // Update chatroom last message
        const chatroom = state.chatrooms.find(room => room.id === chatroomId);
        if (chatroom) {
          chatroom.lastMessage = message.content;
          chatroom.messageCount = (chatroom.messageCount || 0) + 1;
        }
        
        // Save AI message to localStorage with user-specific key
        const storageKey = `gemini_messages_${chatroomId}_${userId || 'default'}`;
        const savedMessages = JSON.parse(localStorage.getItem(storageKey) || '[]');
        savedMessages.push(message);
        localStorage.setItem(storageKey, JSON.stringify(savedMessages));
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.isTyping = false;
        state.error = action.error.message;
      })
      // Load Older Messages
      .addCase(loadOlderMessages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadOlderMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        const { chatroomId, messages, page } = action.payload;
        
        if (!state.messages[chatroomId]) {
          state.messages[chatroomId] = [];
        }
        
        // Add older messages at the beginning
        state.messages[chatroomId].unshift(...messages);
      })
      .addCase(loadOlderMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  createChatroom,
  deleteChatroom,
  setCurrentChatroom,
  addMessage,
  setTyping,
  loadChatroomsFromStorage,
  clearError
} = chatSlice.actions;

export default chatSlice.reducer; 