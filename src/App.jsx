import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import store from './store';
import { initializeDarkMode } from './store/slices/uiSlice';
import { loadChatroomsFromStorage } from './store/slices/chatSlice';
import AppRouter from './components/AppRouter';
import './index.css';

function App() {
  useEffect(() => {
    // Initialize dark mode
    store.dispatch(initializeDarkMode());
    
    // Load chatrooms from localStorage for current user
    const savedUser = localStorage.getItem('gemini_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      store.dispatch(loadChatroomsFromStorage(user.id));
    }
  }, []);

  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <AppRouter />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </Provider>
  );
}

export default App;
