import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { loadPersistedToken } from '@/store/slices/authSlice';
import { RootNavigator } from './navigation/RootNavigator';

export default function App() {
  useEffect(() => {
    // Load persisted token on app startup
    store.dispatch(loadPersistedToken());
  }, []);

  return (
    <Provider store={store}>
      <RootNavigator />
    </Provider>
  );
} 