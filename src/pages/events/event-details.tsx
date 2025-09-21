import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'src/routes/hooks';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Button,
  Divider,
  Alert,
  Skeleton
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { Iconify } from 'src/components/iconify';

import { paths } from 'src/routes/paths';
import { eventsApi } from 'src/lib/api/events';
import { useAuthContext } from 'src/auth/hooks';
import type { Event } from 'src/types/event';

// ----------------------------------------------------------------------

export default function EventDetailsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { authenticated, role } = useAuthContext();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // For now, we'll use a mock approach since we need the event ID
        // In a real implementation, you'd have an endpoint to get event by slug
        const response = await eventsApi.getEvents({ q: slug });
        const events = response.data.data || [];
        const foundEvent = events.find((e: any) => e.slug === slug);
        
        if (foundEvent) {
          setEvent(foundEvent);
        } else {
          setError('Event not found');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [slug]);

  const handleBookTickets = () => {
    if (!authenticated) {
      navigate(paths.auth.customer.signIn);
      return;
    }
    
    if (role !== 'customer') {
      navigate(paths.auth.customer.signIn);
      return;
    }
    
    // Navigate to booking page (to be implemented)
    navigate(`/events/${slug}/book`);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid xs={12} md={8}>
            <Skeleton variant="rectangular" height={400} sx={{ mb: 3 }} />
            <Skeleton variant="text" height={40} sx={{ mb: 2 }} />
            <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" height={20} />
          </Grid>
          <Grid xs={12} md={4}>
            <Skeleton variant="rectangular" height={300} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (error || !event) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Event not found'}
        </Alert>
        <Button onClick={() => navigate(paths.events.root)}>
          Back to Events
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Event Image and Details */}
        <Grid item xs={12} md={8}>
          {event.banner_image && (
            <CardMedia
              component="img"
              height="400"
              image={event.banner_image}
              alt={event.title}
              sx={{ borderRadius: 2, mb: 3 }}
            />
          )}
          
          <Box sx={{ mb: 3 }}>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Chip
                label={event.category.name}
                color="primary"
                variant="outlined"
              />
              {event.is_featured && (
                <Chip
                  label="Featured"
                  color="secondary"
                />
              )}
            </Stack>
            
            <Typography variant="h3" sx={{ mb: 2 }}>
              {event.title}
            </Typography>
            
            <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
              {event.short_description}
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Event Description */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              About This Event
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
              {event.description}
            </Typography>
          </Box>

          {/* Event Details */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Event Details
            </Typography>
            
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Iconify icon="solar:calendar-date-bold" width={24} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Start Date & Time
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {new Date(event.start_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Iconify icon="solar:calendar-date-bold" width={24} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    End Date & Time
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {new Date(event.end_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Iconify icon="solar:map-bold" width={24} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Venue
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {event.venue_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {event.venue_address}
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Box>
        </Grid>

        {/* Ticket Booking Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ position: 'sticky', top: 24 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Get Your Tickets
              </Typography>
              
              {event.ticket_types.length > 0 ? (
                <Stack spacing={2}>
                  {event.ticket_types.map((ticketType) => (
                    <Box
                      key={ticketType.id}
                      sx={{
                        p: 2,
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {ticketType.name}
                      </Typography>
                      {ticketType.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {ticketType.description}
                        </Typography>
                      )}
                      <Typography variant="h6" color="primary.main">
                        {ticketType.price} OMR
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {ticketType.quantity_available - ticketType.quantity_sold} tickets available
                      </Typography>
                    </Box>
                  ))}
                  
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={handleBookTickets}
                    sx={{ mt: 2 }}
                  >
                    Book Tickets
                  </Button>
                </Stack>
              ) : (
                <Alert severity="info">
                  No tickets available for this event
                </Alert>
              )}
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Organized by
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {event.brand.name}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
