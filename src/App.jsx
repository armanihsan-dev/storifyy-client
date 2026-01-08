import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppLayout from './AppLayout';
import RegisterForm from '../components/RegisterForm';
import Login from '../components/Login';
import Users from '../pages/Users';
import { Toaster } from 'react-hot-toast';
import UserData from '../pages/UserData';
import { CurrentUserProvider } from '../Context/CurrentUserContent';
import Profile from '../components/Profile';
import SharedWithMe from '../pages/SharedWithMe';
import SharedDirectoryView from '../pages/SharedDirectoryView';
import SharedDirectoriesList from '../pages/SharedDirectoriesList';
import DashboardPage from '../pages/DashboardPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import StarredPage from './../pages/StarredPage';
import NotFoundPage from './../pages/NotPageFound';
import Plans from './../pages/SubscriptionPage';
import ManageSubscription from '../components/ManageSubscription';
const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'directory/:dirId', element: <DashboardPage /> },
      { path: '/userData/:userId', element: <UserData /> },
      { path: 'users', element: <Users /> },
      { path: 'inbox', element: <SharedWithMe /> },
      { path: 'shared', element: <SharedDirectoriesList /> },
      { path: '/starred', element: <StarredPage /> },
      {
        path: '/shared/directories/:id',
        element: <SharedDirectoryView />,
      },
    ],
  },
  { path: 'profile/:profileid', element: <Profile /> },

  // Auth routes must be OUTSIDE layout
  { path: '/login', element: <Login /> },
  { path: '/plans', element: <Plans /> },
  { path: '/manage-subscription', element: <ManageSubscription /> },
  { path: '/register', element: <RegisterForm /> },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CurrentUserProvider>
        <div className="bg-slate-100">
          <Toaster position="top-center" />
          <RouterProvider router={router} />
        </div>
      </CurrentUserProvider>
    </QueryClientProvider>
  );
}

export default App;
