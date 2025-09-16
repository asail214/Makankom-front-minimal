import type { RouteObject } from 'react-router';

import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';

import { AuthSplitLayout } from 'src/layouts/auth-split';

import { SplashScreen } from 'src/components/loading-screen';

import { GuestGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

// Customer Auth Pages
const CustomerSignInPage = lazy(() => import('../../pages/auth/customer/sign-in'));
const CustomerSignUpPage = lazy(() => import('../../pages/auth/customer/sign-up'));

// Organizer Auth Pages
const OrganizerSignInPage = lazy(() => import('../../pages/auth/organizer/sign-in'));
const OrganizerSignUpPage = lazy(() => import('../../pages/auth/organizer/sign-up'));

// Admin Auth Pages
const AdminSignInPage = lazy(() => import('../../pages/auth/admin/sign-in'));

// Scan Point Auth Pages
const ScanPointSignInPage = lazy(() => import('../../pages/auth/scan/sign-in'));

// ----------------------------------------------------------------------

const customerAuth = {
  path: 'customer',
  children: [
    {
      path: 'sign-in',
      element: (
        <GuestGuard>
          <AuthSplitLayout
            slotProps={{
              section: { title: 'Welcome back, Customer!' },
            }}
          >
            <CustomerSignInPage />
          </AuthSplitLayout>
        </GuestGuard>
      ),
    },
    {
      path: 'sign-up',
      element: (
        <GuestGuard>
          <AuthSplitLayout
            slotProps={{
              section: { title: 'Join Makankom as Customer' },
            }}
          >
            <CustomerSignUpPage />
          </AuthSplitLayout>
        </GuestGuard>
      ),
    },
  ],
};

const organizerAuth = {
  path: 'organizer',
  children: [
    {
      path: 'sign-in',
      element: (
        <GuestGuard>
          <AuthSplitLayout
            slotProps={{
              section: { title: 'Welcome back, Organizer!' },
            }}
          >
            <OrganizerSignInPage />
          </AuthSplitLayout>
        </GuestGuard>
      ),
    },
    {
      path: 'sign-up',
      element: (
        <GuestGuard>
          <AuthSplitLayout
            slotProps={{
              section: { title: 'Join Makankom as Organizer' },
            }}
          >
            <OrganizerSignUpPage />
          </AuthSplitLayout>
        </GuestGuard>
      ),
    },
  ],
};

const adminAuth = {
  path: 'admin',
  children: [
    {
      path: 'sign-in',
      element: (
        <GuestGuard>
          <AuthSplitLayout
            slotProps={{
              section: { title: 'Admin Portal' },
            }}
          >
            <AdminSignInPage />
          </AuthSplitLayout>
        </GuestGuard>
      ),
    },
  ],
};

const scanAuth = {
  path: 'scan',
  children: [
    {
      path: 'sign-in',
      element: (
        <GuestGuard>
          <AuthSplitLayout
            slotProps={{
              section: { title: 'Scan Point Login' },
            }}
          >
            <ScanPointSignInPage />
          </AuthSplitLayout>
        </GuestGuard>
      ),
    },
  ],
};

// ----------------------------------------------------------------------

export const makankomAuthRoutes: RouteObject[] = [
  {
    path: 'auth',
    element: (
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    ),
    children: [customerAuth, organizerAuth, adminAuth, scanAuth],
  },
];
