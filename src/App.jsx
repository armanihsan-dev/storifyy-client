import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import DirectoryView from './DirectoryView';
import RegisterForm from '../components/RegisterForm';
import Login from '../components/Login';
import Users from '../pages/Users';
import { Toaster } from 'react-hot-toast';
import UserData from '../pages/UserData';
import { CurrentUserProvider } from '../Context/CurrentUserContent';
import Profile from '../components/Profile';
import SharedWithMe from '../pages/SharedWithMe';
import SharedDirectoryView from '../pages/SharedDirectoryView';

const router = createBrowserRouter([
  { path: '/*', element: <DirectoryView /> },
  { path: '/directory/:dirId', element: <DirectoryView /> },
  { path: '/users', element: <Users /> },
  { path: '/userData/:userId', element: <UserData /> },
  { path: '/login', element: <Login /> },
  { path: '/profile/:profileid', element: <Profile /> },
  {
    path: '/shared',
    element: <SharedWithMe />,
  },
  {
    path: '/shared/directories/:id',
    element: <SharedDirectoryView />,
  },
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
