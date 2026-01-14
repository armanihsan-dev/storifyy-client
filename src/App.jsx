import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CurrentUserProvider } from '../Context/CurrentUserContent';

// Guards
import ProtectedRoute from './../components/ProtectedRoute';
import PublicRoute from './../components/PublicRoute'; // Create this file as shown above

// --- 1. Public Pages (Lazy Load these too) ---
// MAKE SURE THIS PATH MATCHES WHERE YOU SAVED THE LANDING PAGE FILE
const LandingPage = lazy(() =>
  import('./../components/Application/LandingPage')
);
const TermsOfService = lazy(() =>
  import('../components/Application/TermsOfService')
);
const PrivacyPolicy = lazy(() =>
  import('../components/Application/PrivacyPolicy')
);
const RegisterForm = lazy(() => import('../components/RegisterForm'));
const Login = lazy(() => import('../components/Login'));
const NotFoundPage = lazy(() => import('../pages/NotPageFound'));

// --- 2. Application Pages (Protected) ---
const AppLayout = lazy(() => import('./AppLayout'));
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
const Plans = lazy(() => import('../pages/SubscriptionPage'));
const ManageSubscription = lazy(() =>
  import('../components/ManageSubscription')
);
import FullPageLoader from '../components/FullPageLoader';

const router = createBrowserRouter([
  /* --- PUBLIC ROUTES --- */
  {
    path: '/',
    element: (
      // Optional: Wrap in PublicRoute if you want logged-in users
      // to auto-redirect to /app. Remove wrapper if you always want to show Landing Page.
      <PublicRoute>
        <LandingPage />
      </PublicRoute>
    ),
  },
  {
    path: 'login',
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: 'register',
    element: (
      <PublicRoute>
        <RegisterForm />
      </PublicRoute>
    ),
  },

  // Legal Pages (Accessible by everyone)
  { path: 'privacy-policy', element: <PrivacyPolicy /> },
  { path: 'terms-of-service', element: <TermsOfService /> },

  /* --- PROTECTED APP ROUTES --- */
  {
    path: '/app',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'directory/:dirId', element: <DashboardPage /> },
      { path: 'userData/:userId', element: <UserData /> },
      { path: 'users', element: <Users /> },
      { path: 'inbox', element: <SharedWithMe /> },
      { path: 'shared', element: <SharedDirectoriesList /> },
      { path: 'starred', element: <StarredPage /> },
      { path: 'shared/directories/:id', element: <SharedDirectoryView /> },
    ],
  },

  /* --- OTHER PROTECTED PAGES --- */
  {
    path: 'profile/:profileid',
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: 'plans',
    element: (
      <ProtectedRoute>
        <Plans />
      </ProtectedRoute>
    ),
  },
  {
    path: 'manage-subscription',
    element: (
      <ProtectedRoute>
        <ManageSubscription />
      </ProtectedRoute>
    ),
  },

  /* --- CATCH ALL --- */
  { path: '*', element: <NotFoundPage /> },
]);

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CurrentUserProvider>
        {/* Removed bg-slate-100 from here so it doesn't conflict with Landing Page CSS */}
        <div className="min-h-screen">
          <Toaster position="top-center" />
          <Suspense
            fallback={
              <div className="h-screen w-full flex items-center justify-center bg-white">
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
