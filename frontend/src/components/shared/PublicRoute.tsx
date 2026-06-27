import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
};
