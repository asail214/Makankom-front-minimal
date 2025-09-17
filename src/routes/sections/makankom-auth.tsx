// src/routes/sections/makankom-auth.tsx
import type { RouteObject } from 'react-router';

import { lazy } from 'react';

// Customer
const CustomerSignInPage = lazy(() => import('src/pages/auth/customer/sign-in'));
const CustomerSignUpPage = lazy(() => import('src/pages/auth/customer/sign-up'));

// Organizer
const OrganizerSignInPage = lazy(() => import('src/pages/auth/organizer/sign-in'));
const OrganizerSignUpPage = lazy(() => import('src/pages/auth/organizer/sign-up'));

// Admin
const AdminSignInPage = lazy(() => import('src/pages/auth/admin/sign-in'));

// Scan Point
const ScanPointSignInPage = lazy(() => import('src/pages/auth/scan/sign-in'));

const makankomAuthRoutes: RouteObject[] = [
  {
    path: 'auth',
    children: [
      // Customer
      { path: 'customer/sign-in', element: <CustomerSignInPage /> },
      { path: 'customer/sign-up', element: <CustomerSignUpPage /> },

      // Organizer
      { path: 'organizer/sign-in', element: <OrganizerSignInPage /> },
      { path: 'organizer/sign-up', element: <OrganizerSignUpPage /> },

      // Admin
      { path: 'admin/sign-in', element: <AdminSignInPage /> },

      // Scan Point
      { path: 'scan/sign-in', element: <ScanPointSignInPage /> },
    ],
  },
];

export default makankomAuthRoutes;
