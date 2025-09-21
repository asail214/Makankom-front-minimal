import { useState, useEffect } from 'react';

import { useTheme, alpha } from '@mui/material/styles';
import { Container, Typography, Box, Button, Card, CardContent, CardMedia, Chip, Stack } from '@mui/material';

import type { Event, EventCategory } from 'src/types/event';

import { paths } from 'src/routes/paths';
import { useNavigate } from 'src/routes/hooks';
import { useAuthContext } from 'src/auth/hooks';
import { eventsApi } from 'src/lib/api/events';

// Temporary mock data - replace with actual API calls when ready
const mockEvents: Event[] = [];
const mockCategories: EventCategory[] = [
  { id: 1, name: 'Music', slug: 'music', description: 'Live music events and concerts', icon: '🎵', color: '#6C5CE7', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 2, name: 'Sports', slug: 'sports', description: 'Sports events and competitions', icon: '⚽', color: '#00B894', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 3, name: 'Business', slug: 'business', description: 'Professional and business events', icon: '💼', color: '#0984E3', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 4, name: 'Arts', slug: 'arts', description: 'Art exhibitions and cultural events', icon: '🎨', color: '#E17055', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 5, name: 'Technology', slug: 'technology', description: 'Tech conferences and workshops', icon: '💻', color: '#A29BFE', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 6, name: 'Food', slug: 'food', description: 'Food festivals and culinary events', icon: '🍽️', color: '#FDCB6E', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
];

// ----------------------------------------------------------------------

export function MakankomHomeView() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { authenticated, role } = useAuthContext();
  
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        
        // Fetch real data from API
        const [eventsResponse, categoriesResponse] = await Promise.all([
          eventsApi.getEvents({ is_featured: true, per_page: 6 }),
          eventsApi.getCategories(),
        ]);
        
        setFeaturedEvents(eventsResponse.data.data || []);
        setCategories(categoriesResponse.data.data || []);
      } catch (error) {
        console.error('Error fetching home data:', error);
        // Fallback to mock data if API fails
        setFeaturedEvents(mockEvents);
        setCategories(mockCategories);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const getDashboardPath = () => {
    if (!authenticated) return paths.auth.customer.signIn;
    
    switch (role) {
      case 'customer':
        return paths.customer.root;
      case 'organizer':
        return paths.organizer.root;
      case 'admin':
        return paths.admin.root;
      case 'scan-point':
        return paths.scanPoint.root;
      default:
        return paths.auth.customer.signIn;
    }
  };

  const getDashboardButtonText = () => {
    if (!authenticated) return 'Get Started';
    
    switch (role) {
      case 'customer':
        return 'My Dashboard';
      case 'organizer':
        return 'Organizer Dashboard';
      case 'admin':
        return 'Admin Dashboard';
      case 'scan-point':
        return 'Scan Point';
      default:
        return 'Get Started';
    }
  };

  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
          py: { xs: 10, md: 15 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '4rem' },
              fontWeight: 700,
              mb: 3,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Welcome to Makankom
          </Typography>
          
          <Typography
            variant="h5"
            sx={{
              color: 'text.secondary',
              mb: 5,
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            Your premier destination for discovering and booking amazing events in Oman. 
            From concerts to conferences, find your perfect event experience.
          </Typography>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate(paths.events.root)}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                borderRadius: 2,
              }}
            >
              Explore Events
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate(getDashboardPath())}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                borderRadius: 2,
              }}
            >
              {getDashboardButtonText()}
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Categories Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" sx={{ textAlign: 'center', mb: 6 }}>
          Event Categories
        </Typography>
        
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 3,
          }}
        >
          {categories.slice(0, 6).map((category) => (
            <Box key={category.id}>
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                  },
                }}
                onClick={() => navigate(paths.events.category(category.slug))}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    <Typography variant="h4" sx={{ color: 'primary.main' }}>
                      {category.icon || '🎪'}
                    </Typography>
                  </Box>
                  
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {category.name}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary">
                    {category.description || 'Discover amazing events in this category'}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Container>

      {/* Featured Events Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ textAlign: 'center', mb: 6 }}>
            Featured Events
          </Typography>
          
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              gap: 4,
            }}
          >
            {featuredEvents.map((event) => (
              <Box key={event.id}>
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[8],
                    },
                  }}
                  onClick={() => navigate(paths.events.details(event.slug))}
                >
                  {event.banner_image && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={event.banner_image}
                      alt={event.title}
                    />
                  )}
                  
                  <CardContent>
                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                      <Chip
                        label={event.category.name}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      {event.is_featured && (
                        <Chip
                          label="Featured"
                          size="small"
                          color="secondary"
                        />
                      )}
                    </Stack>
                    
                    <Typography variant="h6" sx={{ mb: 1, lineHeight: 1.3 }}>
                      {event.title}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {event.short_description}
                    </Typography>
                    
                    <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>
                      {new Date(event.start_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary">
                      📍 {event.venue_name}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
          
          {featuredEvents.length === 0 && !loading && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No featured events available at the moment
              </Typography>
            </Box>
          )}
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h3" sx={{ mb: 3 }}>
          Ready to Create Amazing Events?
        </Typography>
        
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
          Join thousands of event organizers who trust Makankom to manage their events and reach their audience.
        </Typography>
        
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate(paths.auth.organizer.signUp)}
          sx={{
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            borderRadius: 2,
          }}
        >
          Become an Organizer
        </Button>
      </Container>
    </>
  );
}
