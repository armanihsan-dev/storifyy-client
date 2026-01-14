import { Navigate, useLocation } from 'react-router-dom';
import { useCurrentUser } from '@/hooks/otherHooks';
import FullPageLoader from './FullPageLoader';

const ProtectedRoute = ({ children }) => {
  const { data: user, isLoading } = useCurrentUser();
  const location = useLocation();

  if (isLoading) return <FullPageLoader />;

  // If not logged in, redirect to login, but save where they were trying to go
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
