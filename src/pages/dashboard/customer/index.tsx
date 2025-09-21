import { CONFIG } from 'src/global-config';

import { CustomerDashboardView } from 'src/sections/customer/dashboard/view/customer-dashboard-view';

// ----------------------------------------------------------------------

const metadata = { title: `Customer Dashboard - ${CONFIG.appName}` };

export default function CustomerDashboardPage() {
  return (
    <>
      <title>{metadata.title}</title>

      <CustomerDashboardView />
    </>
  );
}
