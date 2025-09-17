import { useParams } from 'react-router-dom';

import { Box, Button, Container, Typography } from '@mui/material';

import { useGetEvent } from 'src/actions/events';

export default function EventDetailsPage() {
  const { id } = useParams();
  const { event, isLoading, error } = useGetEvent(id);

  if (isLoading)
    return (
      <Container sx={{ py: 4 }}>
        <Typography>Loading…</Typography>
      </Container>
    );
  if (error || !event)
    return (
      <Container sx={{ py: 4 }}>
        <Typography color="error">Event not found</Typography>
      </Container>
    );

  return (
    <Container sx={{ py: 4, display: 'grid', gap: 3 }}>
      <Typography variant="h3">{event.title}</Typography>

      {/* cover image if you have it */}
      {event.cover && (
        <Box
          component="img"
          src={event.cover}
          alt={event.title}
          sx={{ width: '100%', maxHeight: 360, objectFit: 'cover', borderRadius: 2 }}
        />
      )}

      {/* basic info */}
      <Box>
        {event.date && <Typography>Date: {event.date}</Typography>}
        {event.location && <Typography>Location: {event.location}</Typography>}
        {event.price != null && <Typography>Price: SAR {event.price}</Typography>}
      </Box>

      <Box>
        <Button variant="contained" size="large">
          Buy ticket
        </Button>
      </Box>
    </Container>
  );
}
