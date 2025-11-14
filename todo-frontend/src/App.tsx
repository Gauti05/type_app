import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import TodoList from './pages/TodoList'; 
import useAuthStore from './store/authStore';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';


const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const token = useAuthStore((state) => state.token);
  return token ? children : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/todos" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      
      <Route
        path="/todos"
        element={
          <PrivateRoute>
            <TodoList />
          </PrivateRoute>
        }
      />
 <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
    </Routes>
  );
};

export default App;
