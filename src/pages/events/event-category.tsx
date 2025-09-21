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
  Breadcrumbs,
  Link,
  Alert,
  Skeleton
} from '@mui/material';
import Grid from '@mui/material/Grid2';

import { paths } from 'src/routes/paths';
import { eventsApi } from 'src/lib/api/events';
import type { Event, EventCategory } from 'src/types/event';

// ----------------------------------------------------------------------

export default function EventCategoryPage() {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  
  const [events, setEvents] = useState<Event[]>([]);
  const [category, setCategory] = useState<EventCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryEvents = async () => {
      if (!categorySlug) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch categories to find the one matching the slug
        const categoriesResponse = await eventsApi.getCategories();
        const categories = categoriesResponse.data.data || [];
        const foundCategory = categories.find((c: any) => c.slug === categorySlug);
        
        if (!foundCategory) {
          setError('Category not found');
          return;
        }
        
        setCategory(foundCategory);
        
        // Fetch events for this category
        const eventsResponse = await eventsApi.getEvents({ 
          category_id: foundCategory.id,
          status: 'published'
        });
        
        setEvents(eventsResponse.data.data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load category events');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryEvents();
  }, [categorySlug]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton variant="text" height={40} sx={{ mb: 2 }} />
        <Skeleton variant="text" height={20} sx={{ mb: 4 }} />
        <Grid container spacing={3}>
          {[...Array(6)].map((_, index) => (
            <Grid xs={12} sm={6} md={4} key={index}>
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
      </Container>
    );
  }

  if (error || !category) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Category not found'}
        </Alert>
        <Button onClick={() => navigate(paths.events.root)}>
          Back to Events
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate(paths.events.root)}
          sx={{ textDecoration: 'none' }}
        >
          Events
        </Link>
        <Typography variant="body2" color="text.primary">
          {category.name}
        </Typography>
      </Breadcrumbs>

      {/* Category Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          {category.name} Events
        </Typography>
        {category.description && (
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            {category.description}
          </Typography>
        )}
      </Box>

      {/* Events Grid */}
      {events.length > 0 ? (
        <Grid container spacing={3}>
          {events.map((event) => (
            <Grid xs={12} sm={6} md={4} key={event.id}>
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
                  
                  <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600, mb: 1 }}>
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
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No events found in this category
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Check back later for new events
          </Typography>
          <Button
            variant="outlined"
            sx={{ mt: 2 }}
            onClick={() => navigate(paths.events.root)}
          >
            Browse All Events
          </Button>
        </Box>
      )}
    </Container>
  );
}
