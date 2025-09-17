import { CONFIG } from 'src/global-config';

import { ScanPointSignInView } from 'src/auth/view/scan/scan-point-sign-in-view';

// ----------------------------------------------------------------------

const metadata = { title: `Scan Point Sign In - ${CONFIG.appName}` };

export default function ScanPointSignInPage() {
  return (
    <>
      <title>{metadata.title}</title>

      <ScanPointSignInView />
    </>
  );
}
