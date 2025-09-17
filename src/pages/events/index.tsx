import { Box, Container, Typography } from '@mui/material';

import { useGetEvents } from 'src/actions/events';

import EventCard from 'src/components/event-card';

export default function EventsListPage() {
  const { events, isLoading, error } = useGetEvents();

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h3" sx={{ mb: 3 }}>
        Events
      </Typography>

      {isLoading && <Typography>Loading events…</Typography>}
      {error && <Typography color="error">Failed to load events</Typography>}

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
        }}
      >
        {events.map((ev) => (
          <EventCard
            key={ev.id}
            id={ev.id}
            title={ev.title}
            cover={ev.cover}
            price={ev.price}
            date={ev.date}
            location={ev.location}
          />
        ))}
      </Box>
    </Container>
  );
}
