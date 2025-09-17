// src/routes/sections/makankom-public.tsx
import type { RouteObject } from 'react-router';

import { lazy } from 'react';

import { MainLayout } from 'src/layouts/main';

const EventsListPage = lazy(() => import('src/pages/events'));
const EventDetailsPage = lazy(() => import('src/pages/events/details'));

const makankomPublicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'events', element: <EventsListPage /> },
      { path: 'events/:id', element: <EventDetailsPage /> },
    ],
  },
];

export default makankomPublicRoutes;
