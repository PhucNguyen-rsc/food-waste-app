import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@food-waste/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  user: User | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
      // Persist token to AsyncStorage
      if (action.payload) {
        AsyncStorage.setItem('auth_token', action.payload);
      } else {
        AsyncStorage.removeItem('auth_token');
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      AsyncStorage.removeItem('auth_token');
    },
  },
});

// Load persisted token on startup
export const loadPersistedToken = () => async (dispatch: any) => {
  try {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      dispatch(setToken(token));
    }
  } catch (error) {
    console.error('Error loading persisted token:', error);
  }
};

export const { setUser, setToken, logout } = authSlice.actions;
export default authSlice.reducer;
