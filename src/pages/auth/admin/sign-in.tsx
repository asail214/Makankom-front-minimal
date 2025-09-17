import { CONFIG } from 'src/global-config';

import { AdminSignInView } from 'src/auth/view/admin/admin-sign-in-view';

// ----------------------------------------------------------------------

const metadata = { title: `Admin Sign In - ${CONFIG.appName}` };

export default function AdminSignInPage() {
  return (
    <>
      <title>{metadata.title}</title>

      <AdminSignInView />
    </>
  );
}
