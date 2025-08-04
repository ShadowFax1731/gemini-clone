import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Simulate API calls
export const sendOTP = createAsyncThunk(
  'auth/sendOTP',
  async (phoneNumber, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate OTP sent successfully
      return { phoneNumber, success: true };
    } catch (error) {
      return rejectWithValue('Failed to send OTP');
    }
  }
);

export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async (otp, { rejectWithValue }) => {
    try {
      // Simulate API delay for validation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful OTP validation (accept any 6-digit OTP)
      if (otp && otp.length === 6 && /^\d+$/.test(otp)) {
        return { success: true };
      } else {
        return rejectWithValue('Please enter a valid 6-digit OTP');
      }
    } catch (error) {
      return rejectWithValue('Failed to verify OTP. Please try again.');
    }
  }
);

// Check for existing user data
const getInitialUser = () => {
  try {
    const savedUser = localStorage.getItem('gemini_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      return user;
    }
  } catch (error) {
    console.error('Error parsing saved user:', error);
  }
  return null;
};



const initialState = {
  user: getInitialUser(),
  isAuthenticated: !!getInitialUser(),
  phoneNumber: '',
  isLoading: false,
  error: null,
  otpSent: false,
  countries: [],
  selectedCountry: {
    name: 'United States',
    dialCode: '+1',
    flag: '🇺🇸'
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setPhoneNumber: (state, action) => {
      state.phoneNumber = action.payload;
    },
    setSelectedCountry: (state, action) => {
      state.selectedCountry = action.payload;
    },
    setCountries: (state, action) => {
      state.countries = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.phoneNumber = '';
      state.otpSent = false;
      localStorage.removeItem('gemini_user');
      // Clear all chat-related data for this user
      localStorage.removeItem('gemini_chatrooms');
      // Clear all message data
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('gemini_messages_')) {
          localStorage.removeItem(key);
        }
      });
    },
    clearError: (state) => {
      state.error = null;
    },
    resetOTPState: (state) => {
      state.otpSent = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Send OTP
      .addCase(sendOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendOTP.fulfilled, (state, action) => {
        state.isLoading = false;
        state.otpSent = true;
        state.phoneNumber = action.payload.phoneNumber;
      })
      .addCase(sendOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Verify OTP
      .addCase(verifyOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        const userId = Date.now();
        state.user = {
          id: userId,
          phoneNumber: state.phoneNumber,
          name: `User ${state.phoneNumber.slice(-4)}`,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${state.phoneNumber}`
        };
        // Save user to localStorage
        localStorage.setItem('gemini_user', JSON.stringify({
          id: userId,
          phoneNumber: state.phoneNumber,
          name: `User ${state.phoneNumber.slice(-4)}`,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${state.phoneNumber}`
        }));
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setPhoneNumber,
  setSelectedCountry,
  setCountries,
  logout,
  clearError,
  resetOTPState
} = authSlice.actions;

export default authSlice.reducer; 