import { CONFIG } from 'src/global-config';

import { EventCreateView } from 'src/sections/organizer/events/view/event-create-view';

// ----------------------------------------------------------------------

const metadata = { title: `Create Event - ${CONFIG.appName}` };

export default function EventCreatePage() {
  return (
    <>
      <title>{metadata.title}</title>

      <EventCreateView />
    </>
  );
}
