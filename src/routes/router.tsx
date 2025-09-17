// src/routes/router.tsx
import { useRoutes } from 'react-router-dom';

import { routesSection } from './sections';

export default function Router() {
  return useRoutes(routesSection);
}
