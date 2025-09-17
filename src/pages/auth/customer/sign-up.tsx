import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

const metadata = { title: `Customer Sign Up - ${CONFIG.appName}` };

export default function CustomerSignUpPage() {
  return (
    <>
      <title>{metadata.title}</title>

      <CustomerSignUpPage />
    </>
  );
}
