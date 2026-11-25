
import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';

const ProtectedRoute = ({ children, role }) => {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  useEffect(() => {
    if (token) {
      // Xác thực phiên đăng nhập hiện tại với server (interceptor tự đẩy về /login nếu 401)
      api.get('/auth/me').catch(() => {});
    }
  }, [token, location.pathname]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const userRole = typeof user?.role === 'object' ? user?.role?.name : user?.role;

  if (role && userRole !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
