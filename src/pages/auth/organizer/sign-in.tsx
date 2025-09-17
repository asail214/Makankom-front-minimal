import { CONFIG } from 'src/global-config';

import { OrganizerSignInView } from 'src/auth/view/organizer/organizer-sign-in-view';

// ----------------------------------------------------------------------

const metadata = { title: `Organizer Sign In - ${CONFIG.appName}` };

export default function OrganizerSignInPage() {
  return (
    <>
      <title>{metadata.title}</title>

      <OrganizerSignInView />
    </>
  );
}
