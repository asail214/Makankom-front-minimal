import { useState, useEffect } from 'react';

import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Stack,
  Button,
  Grid,
  Chip,
  Alert,
  Skeleton,
  LinearProgress,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { paths } from 'src/routes/paths';
import { useNavigate } from 'src/routes/hooks';
import { useAuthContext } from 'src/auth/hooks';
import { eventsApi } from 'src/lib/api/events';
import type { Event } from 'src/types/event';

// ----------------------------------------------------------------------

export function OrganizerDashboardView() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeEvents: 0,
    totalTicketsSold: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch organizer's events
        const eventsResponse = await eventsApi.getOrganizerEvents();
        const eventsData = eventsResponse.data.data || [];
        setEvents(eventsData);

        // Calculate stats
        const activeEvents = eventsData.filter(event => event.status === 'active').length;
        const totalTicketsSold = eventsData.reduce((total, event) => {
          return total + (event.ticket_types?.reduce((eventTotal, ticketType) => 
            eventTotal + (ticketType.sold_quantity || 0), 0) || 0);
        }, 0);

        const totalRevenue = eventsData.reduce((total, event) => {
          return total + (event.ticket_types?.reduce((eventTotal, ticketType) => 
            eventTotal + (parseFloat(ticketType.price) * (ticketType.sold_quantity || 0)), 0) || 0);
        }, 0);

        setStats({
          totalEvents: eventsData.length,
          activeEvents,
          totalTicketsSold,
          totalRevenue,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getEventStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'draft':
        return 'warning';
      case 'cancelled':
        return 'error';
      case 'completed':
        return 'info';
      default:
        return 'default';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Stack spacing={4}>
          <Box>
            <Skeleton variant="text" height={40} width={300} />
            <Skeleton variant="text" height={20} width={500} />
          </Box>
          
          <Grid container spacing={3}>
            {[...Array(4)].map((_, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card>
                  <CardContent>
                    <Skeleton variant="text" height={32} />
                    <Skeleton variant="text" height={20} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={3}>
            {[...Array(6)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardContent>
                    <Skeleton variant="rectangular" height={200} />
                    <Skeleton variant="text" height={32} />
                    <Skeleton variant="text" height={20} />
                    <Skeleton variant="text" height={20} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack spacing={4}>
        {/* Header */}
        <Box>
          <Typography variant="h4" sx={{ mb: 1 }}>
            Welcome back, {user?.name}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your events and track your performance.
          </Typography>
        </Box>

        {/* Quick Actions */}
        <Card>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Typography variant="h6">Quick Actions</Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  startIcon={<Iconify icon="eva:plus-fill" />}
                  onClick={() => navigate(paths.organizer.events.create)}
                >
                  Create Event
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Iconify icon="eva:bar-chart-2-fill" />}
                  onClick={() => navigate(paths.organizer.analytics)}
                >
                  View Analytics
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 1.5,
                      bgcolor: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Iconify icon="eva:calendar-fill" width={24} sx={{ color: 'white' }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                      {stats.totalEvents}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Events
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 1.5,
                      bgcolor: 'success.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Iconify icon="eva:play-circle-fill" width={24} sx={{ color: 'white' }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                      {stats.activeEvents}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Events
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 1.5,
                      bgcolor: 'info.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Iconify icon="eva:people-fill" width={24} sx={{ color: 'white' }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                      {stats.totalTicketsSold}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tickets Sold
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 1.5,
                      bgcolor: 'warning.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Iconify icon="eva:credit-card-fill" width={24} sx={{ color: 'white' }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                      {formatCurrency(stats.totalRevenue)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Revenue
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Events */}
        <Box>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
            <Typography variant="h5">Recent Events</Typography>
            <Button
              variant="outlined"
              onClick={() => navigate(paths.organizer.events.root)}
            >
              View All Events
            </Button>
          </Stack>

          {events.length === 0 ? (
            <Card>
              <CardContent>
                <Stack alignItems="center" spacing={2} sx={{ py: 4 }}>
                  <Iconify icon="eva:calendar-outline" width={64} sx={{ color: 'text.disabled' }} />
                  <Typography variant="h6" color="text.secondary">
                    No events yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    Create your first event to get started with managing your events.
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Iconify icon="eva:plus-fill" />}
                    onClick={() => navigate(paths.organizer.events.create)}
                  >
                    Create Your First Event
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ) : (
            <Grid container spacing={3}>
              {events.slice(0, 6).map((event) => (
                <Grid item xs={12} sm={6} md={4} key={event.id}>
                  <Card
                    sx={{
                      height: '100%',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 8,
                      },
                    }}
                    onClick={() => navigate(paths.organizer.events.details(event.slug))}
                  >
                    {event.banner_image && (
                      <Box
                        component="img"
                        src={event.banner_image}
                        alt={event.title}
                        sx={{
                          width: '100%',
                          height: 200,
                          objectFit: 'cover',
                        }}
                      />
                    )}
                    <CardContent>
                      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                        <Chip
                          label={event.category.name}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                        <Chip
                          label={event.status}
                          size="small"
                          color={getEventStatusColor(event.status)}
                        />
                      </Stack>

                      <Typography variant="h6" sx={{ mb: 1, lineHeight: 1.3 }}>
                        {event.title}
                      </Typography>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {event.short_description}
                      </Typography>

                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                        <Iconify icon="eva:calendar-outline" width={16} />
                        <Typography variant="body2" color="text.secondary">
                          {new Date(event.start_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </Typography>
                      </Stack>

                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Iconify icon="eva:pin-outline" width={16} />
                        <Typography variant="body2" color="text.secondary">
                          {event.venue_name}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Stack>
    </Container>
  );
}
