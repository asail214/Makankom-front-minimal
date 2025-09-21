import { HomeView } from 'src/sections/home/view';

// ----------------------------------------------------------------------

const metadata = {
  title: 'Makankom - Your Premier Event Platform in Oman',
  description:
    'Discover, book, and manage events in Oman with Makankom. From concerts to conferences, find your perfect event and secure your tickets with ease.',
};

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>
      <meta name="description" content={metadata.description} />

      <HomeView />
    </>
  );
}
