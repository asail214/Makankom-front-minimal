import { CONFIG } from 'src/global-config';

import { ScanPointSignInView } from '../../../../src/auth/view/scan';

// ----------------------------------------------------------------------

const metadata = { title: `Scan Point Sign In - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <ScanPointSignInView />
    </>
  );
}
