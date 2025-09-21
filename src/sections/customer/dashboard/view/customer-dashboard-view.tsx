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
} from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { useNavigate } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { useAuthContext } from 'src/auth/hooks';
import { eventsApi } from 'src/lib/api/events';
import { ordersApi } from 'src/lib/api/orders';
import type { Event, Order } from 'src/types/event';

// ----------------------------------------------------------------------

export function CustomerDashboardView() {
  const navigate = useNavigate();
  const { user, role } = useAuthContext();
  
  const [recentEvents, setRecentEvents] = useState<Event[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [eventsResponse, ordersResponse] = await Promise.all([
          eventsApi.getEvents({ per_page: 4 }),
          ordersApi.getCustomerOrders(),
        ]);
        
        setRecentEvents(eventsResponse.data.data || []);
        setRecentOrders(ordersResponse.data.data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (role !== 'customer') {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Access denied. This page is only available for customers.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Welcome back, {user?.first_name || 'Customer'}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here&apos;s what&apos;s happening with your events and tickets.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Iconify icon="eva:ticket-outline" width={24} sx={{ color: 'white' }} />
                </Box>
                <Box>
                  <Typography variant="h4">{recentOrders.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Orders
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    bgcolor: 'success.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Iconify icon="eva:calendar-outline" width={24} sx={{ color: 'white' }} />
                </Box>
                <Box>
                  <Typography variant="h4">{recentEvents.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Upcoming Events
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    bgcolor: 'warning.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Iconify icon="eva:heart-outline" width={24} sx={{ color: 'white' }} />
                </Box>
                <Box>
                  <Typography variant="h4">0</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Wishlist Items
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    bgcolor: 'info.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Iconify icon="eva:star-outline" width={24} sx={{ color: 'white' }} />
                </Box>
                <Box>
                  <Typography variant="h4">0</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Reviews Given
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Orders */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
          <Typography variant="h5">Recent Orders</Typography>
          <Button
            variant="outlined"
            onClick={() => navigate(paths.customer.orders)}
          >
            View All Orders
          </Button>
        </Stack>

        {loading ? (
          <Grid container spacing={2}>
            {[...Array(3)].map((_, index) => (
              <Grid xs={12} key={index}>
                <Card>
                  <CardContent>
                    <Skeleton variant="text" height={32} />
                    <Skeleton variant="text" height={20} />
                    <Skeleton variant="text" height={20} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : recentOrders.length > 0 ? (
          <Grid container spacing={2}>
            {recentOrders.slice(0, 3).map((order) => (
              <Grid xs={12} key={order.id}>
                <Card>
                  <CardContent>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Box>
                        <Typography variant="h6">Order #{order.order_number}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(order.created_at).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total: {order.total_amount} OMR
                        </Typography>
                      </Box>
                      <Box>
                        <Chip
                          label={order.status}
                          color={order.status === 'confirmed' ? 'success' : 'default'}
                          size="small"
                        />
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Iconify icon="eva:shopping-bag-outline" width={64} sx={{ color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                No orders yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Start exploring events and book your first tickets!
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate(paths.events.root)}
              >
                Browse Events
              </Button>
            </CardContent>
          </Card>
        )}
      </Box>

      {/* Recommended Events */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
          <Typography variant="h5">Recommended Events</Typography>
          <Button
            variant="outlined"
            onClick={() => navigate(paths.events.root)}
          >
            View All Events
          </Button>
        </Stack>

        {loading ? (
          <Grid container spacing={3}>
            {[...Array(4)].map((_, index) => (
              <Grid xs={12} sm={6} md={3} key={index}>
                <Card>
                  <Skeleton variant="rectangular" height={200} />
                  <CardContent>
                    <Skeleton variant="text" height={32} />
                    <Skeleton variant="text" height={20} />
                    <Skeleton variant="text" height={20} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : recentEvents.length > 0 ? (
          <Grid container spacing={3}>
            {recentEvents.map((event) => (
              <Grid xs={12} sm={6} md={3} key={event.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 8,
                    },
                  }}
                  onClick={() => navigate(paths.events.details(event.slug))}
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
                    <Typography variant="h6" sx={{ mb: 1, lineHeight: 1.3 }}>
                      {event.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {new Date(event.start_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      📍 {event.venue_name}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Iconify icon="eva:calendar-outline" width={64} sx={{ color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                No events available
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Check back later for new events!
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>

      {/* Quick Actions */}
      <Box>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Iconify icon="eva:calendar-outline" />}
              onClick={() => navigate(paths.events.root)}
            >
              Browse Events
            </Button>
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Iconify icon="eva:shopping-bag-outline" />}
              onClick={() => navigate(paths.customer.orders)}
            >
              My Orders
            </Button>
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Iconify icon="eva:ticket-outline" />}
              onClick={() => navigate(paths.customer.tickets)}
            >
              My Tickets
            </Button>
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Iconify icon="eva:person-outline" />}
              onClick={() => navigate(paths.customer.profile)}
            >
              My Profile
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
