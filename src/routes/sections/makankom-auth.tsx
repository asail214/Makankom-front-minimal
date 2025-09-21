import type { RouteObject } from 'react-router';
import { lazy, Suspense } from 'react';

import { AuthCenteredLayout } from 'src/layouts/auth';
import { SplashScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

// Lazy load authentication pages
const CustomerSignInPage = lazy(() => import('src/pages/auth/customer-sign-in'));
const CustomerSignUpPage = lazy(() => import('src/pages/auth/customer-sign-up'));
const OrganizerSignInPage = lazy(() => import('src/pages/auth/organizer-sign-in'));
const OrganizerSignUpPage = lazy(() => import('src/pages/auth/organizer-sign-up'));

// ----------------------------------------------------------------------

export default [
  // Customer Authentication
  {
    path: '/login',
    element: (
      <Suspense fallback={<SplashScreen />}>
        <AuthCenteredLayout>
          <CustomerSignInPage />
        </AuthCenteredLayout>
      </Suspense>
    ),
  },
  {
    path: '/register',
    element: (
      <Suspense fallback={<SplashScreen />}>
        <AuthCenteredLayout>
          <CustomerSignUpPage />
        </AuthCenteredLayout>
      </Suspense>
    ),
  },

  // Organizer Authentication
  {
    path: '/organizer/login',
    element: (
      <Suspense fallback={<SplashScreen />}>
        <AuthCenteredLayout>
          <OrganizerSignInPage />
        </AuthCenteredLayout>
      </Suspense>
    ),
  },
  {
    path: '/organizer/register',
    element: (
      <Suspense fallback={<SplashScreen />}>
        <AuthCenteredLayout>
          <OrganizerSignUpPage />
        </AuthCenteredLayout>
      </Suspense>
    ),
  },
] satisfies RouteObject[];