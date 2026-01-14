import { Navigate } from 'react-router-dom';
import FullPageLoader from './FullPageLoader';
import { useCurrentUser } from '@/hooks/otherHooks';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useCurrentUser();

  if (isLoading) return <FullPageLoader />;

  // If user is already logged in, send them to the dashboard
  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  return children;
};

export default PublicRoute;
