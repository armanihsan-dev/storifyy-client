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
import SharedDirectoriesList from '../pages/SharedDirectoriesTable';
import DashboardPage from '../pages/DashboardPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'directory/:dirId', element: <DashboardPage /> },
      { path: 'users', element: <Users /> },
      { path: 'inbox', element: <SharedWithMe /> },
      { path: 'shared', element: <SharedDirectoriesList /> },
    ],
  },
  { path: 'profile/:profileid', element: <Profile /> },

  // Auth routes must be OUTSIDE layout
  { path: '/login', element: <Login /> },
  { path: '/register', element: <RegisterForm /> },
]);

function App() {
  return (
    <CurrentUserProvider>
      <div className="bg-slate-100">
        <Toaster position="top-center" />
        <RouterProvider router={router} />
      </div>
    </CurrentUserProvider>
  );
}

export default App;
