import { useState, useEffect } from 'react';
import { useSearchParams } from 'src/routes/hooks';
import { useNavigate } from 'src/routes/hooks';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Skeleton,
  Alert
} from '@mui/material';
import { Grid } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

import { paths } from 'src/routes/paths';
import { eventsApi } from 'src/lib/api/events';
import type { Event, EventCategory, EventFilters } from 'src/types/event';

// ----------------------------------------------------------------------

export default function EventsListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filters
  const [filters, setFilters] = useState<EventFilters>({
    q: searchParams[0]?.get('q') || '',
    category_id: searchParams[0]?.get('category_id') ? parseInt(searchParams[0].get('category_id')!) : undefined,
    from: searchParams[0]?.get('from') || '',
    to: searchParams[0]?.get('to') || '',
    page: parseInt(searchParams[0]?.get('page') || '1'),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [eventsResponse, categoriesResponse] = await Promise.all([
          eventsApi.getEvents(filters),
          eventsApi.getCategories(),
        ]);
        
        setEvents(eventsResponse.data.data || []);
        setCategories(categoriesResponse.data.data || []);
        setTotalPages(eventsResponse.data.last_page || 1);
      } catch (err: any) {
        setError(err.message || 'Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  const handleFilterChange = (key: keyof EventFilters, value: any) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
    
    // Update URL params
    const newSearchParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v !== undefined && v !== '' && v !== null) {
        newSearchParams.set(k, v.toString());
      }
    });
    setSearchParams[1](newSearchParams);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    handleFilterChange('page', page);
  };

  const clearFilters = () => {
    setFilters({
      q: '',
      category_id: undefined,
      from: '',
      to: '',
      page: 1,
    });
    setSearchParams[1]({});
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" sx={{ mb: 4 }}>
        Discover Events
      </Typography>

      {/* Filters */}
      <Box sx={{ mb: 4, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
        <Grid container spacing={3}>
          <Grid xs={12} md={4}>
            <TextField
              fullWidth
              label="Search events"
              value={filters.q}
              onChange={(e) => handleFilterChange('q', e.target.value)}
              placeholder="Search by title or description..."
            />
          </Grid>
          
          <Grid xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category_id || ''}
                label="Category"
                onChange={(e) => handleFilterChange('category_id', e.target.value || undefined)}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid xs={12} md={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="From Date"
                value={filters.from ? dayjs(filters.from) : null}
                onChange={(date) => handleFilterChange('from', date?.format('YYYY-MM-DD') || '')}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>
          
          <Grid xs={12} md={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="To Date"
                value={filters.to ? dayjs(filters.to) : null}
                onChange={(date) => handleFilterChange('to', date?.format('YYYY-MM-DD') || '')}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>
          
          <Grid xs={12} md={1}>
            <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
              <Chip
                label="Clear"
                onClick={clearFilters}
                variant="outlined"
                sx={{ width: '100%' }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Events Grid */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Grid container spacing={3}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
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
      ) : (
        <>
          <Grid container spacing={3}>
            {events.map((event) => (
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

          {events.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                No events found matching your criteria
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Try adjusting your search filters
              </Typography>
            </Box>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={filters.page || 1}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
}
