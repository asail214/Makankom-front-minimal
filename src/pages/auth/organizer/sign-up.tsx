import { CONFIG } from 'src/global-config';

import { OrganizerSignUpView } from 'src/auth/view/organizer/organizer-sign-up-view';

// ----------------------------------------------------------------------

const metadata = { title: `Organizer Sign Up - ${CONFIG.appName}` };

export default function OrganizerSignUpPage() {
  return (
    <>
      <title>{metadata.title}</title>

      <OrganizerSignUpView />
    </>
  );
}
