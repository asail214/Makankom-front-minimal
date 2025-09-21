import { CONFIG } from 'src/global-config';

import { OrganizerDashboardView } from 'src/sections/organizer/dashboard/view/organizer-dashboard-view';

// ----------------------------------------------------------------------

const metadata = { title: `Organizer Dashboard - ${CONFIG.appName}` };

export default function OrganizerDashboardPage() {
  return (
    <>
      <title>{metadata.title}</title>

      <OrganizerDashboardView />
    </>
  );
}
