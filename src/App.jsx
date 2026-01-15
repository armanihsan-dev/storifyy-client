import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CurrentUserProvider } from '../Context/CurrentUserContent';

/* ================= Lazy Imports ================= */
const AppLayout = lazy(() => import('./AppLayout'));
const RegisterForm = lazy(() => import('../components/RegisterForm'));
const Login = lazy(() => import('../components/Login'));
const Users = lazy(() => import('../pages/Users'));
const UserData = lazy(() => import('../pages/UserData'));
const Profile = lazy(() => import('../components/Profile'));
const SharedWithMe = lazy(() => import('../pages/SharedWithMe'));
const SharedDirectoryView = lazy(() => import('../pages/SharedDirectoryView'));
const SharedDirectoriesList = lazy(() =>
  import('../pages/SharedDirectoriesList')
);
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const StarredPage = lazy(() => import('../pages/StarredPage'));
const NotFoundPage = lazy(() => import('../pages/NotPageFound'));
const Plans = lazy(() => import('../pages/SubscriptionPage'));
const ManageSubscription = lazy(() =>
  import('../components/ManageSubscription')
);
const FullPageLoader = lazy(() => import('../components/FullPageLoader'));

/* ================= Router ================= */
const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'directory/:dirId', element: <DashboardPage /> },
      { path: 'userData/:userId', element: <UserData /> },
      { path: 'users', element: <Users /> },
      { path: 'inbox', element: <SharedWithMe /> },
      { path: 'shared', element: <SharedDirectoriesList /> },
      { path: 'starred', element: <StarredPage /> },
      {
        path: 'shared/directories/:id',
        element: <SharedDirectoryView />,
      },
    ],
  },

  /* Outside layout (auth / profile / billing) */
  { path: 'profile/:profileid', element: <Profile /> },
  { path: 'login', element: <Login /> },
  { path: 'register', element: <RegisterForm /> },
  { path: 'plans', element: <Plans /> },
  { path: 'manage-subscription', element: <ManageSubscription /> },

  { path: '*', element: <NotFoundPage /> },
]);

/* ================= App ================= */
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CurrentUserProvider>
        <div className="bg-slate-100">
          <Toaster position="top-center" />

          <Suspense
            fallback={
              <div className="p-4">
                <FullPageLoader />
              </div>
            }
          >
            <RouterProvider router={router} />
          </Suspense>
        </div>
      </CurrentUserProvider>
    </QueryClientProvider>
  );
}

export default App;
