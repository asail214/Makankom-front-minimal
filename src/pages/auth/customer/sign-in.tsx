import { CONFIG } from 'src/global-config';

import { CustomerSignInView } from 'src/auth/view/customer/customer-sign-in-view';

// ----------------------------------------------------------------------

const metadata = { title: `Customer Sign In - ${CONFIG.appName}` };

export default function CustomerSignInPage() {
  return <CustomerSignInView />;
}
