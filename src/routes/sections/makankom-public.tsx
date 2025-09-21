import type { RouteObject } from 'react-router';
import { lazy, Suspense } from 'react';

import { MainLayout } from 'src/layouts/main';
import { SplashScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

// Lazy load public pages
const EventsPage = lazy(() => import('src/pages/events/events-list'));
const EventDetailsPage = lazy(() => import('src/pages/events/event-details'));
const EventCategoryPage = lazy(() => import('src/pages/events/event-category'));

// ----------------------------------------------------------------------

export default [
  // Public Events
  {
    path: '/events',
    element: (
      <Suspense fallback={<SplashScreen />}>
        <MainLayout>
          <EventsPage />
        </MainLayout>
      </Suspense>
    ),
  },
  {
    path: '/events/:slug',
    element: (
      <Suspense fallback={<SplashScreen />}>
        <MainLayout>
          <EventDetailsPage />
        </MainLayout>
      </Suspense>
    ),
  },
  {
    path: '/events/category/:categorySlug',
    element: (
      <Suspense fallback={<SplashScreen />}>
        <MainLayout>
          <EventCategoryPage />
        </MainLayout>
      </Suspense>
    ),
  },
] satisfies RouteObject[];