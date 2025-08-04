import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { loadChatroomsFromStorage } from '../store/slices/chatSlice';
import Login from './auth/Login';
import Dashboard from './dashboard/Dashboard';

const AppRouter = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user) {
      dispatch(loadChatroomsFromStorage(user.id));
    }
  }, [isAuthenticated, user, dispatch]);

  return (
    <div className="min-h-screen">
      {isAuthenticated ? <Dashboard /> : <Login />}
    </div>
  );
};

export default AppRouter; 