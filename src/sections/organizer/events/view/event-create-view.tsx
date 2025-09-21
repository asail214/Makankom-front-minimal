import { useState, useEffect } from 'react';

import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Stack,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Chip,
  IconButton,
  Divider,
} from '@mui/material';

import type { Event, EventCategory, TicketType } from 'src/types/event';

import { Iconify } from 'src/components/iconify';
import { paths } from 'src/routes/paths';
import { useNavigate } from 'src/routes/hooks';
import { useAuthContext } from 'src/auth/hooks';
import { eventsApi } from 'src/lib/api/events';

// ----------------------------------------------------------------------

const steps = ['Basic Information', 'Event Details', 'Ticket Types', 'Review & Submit'];

export function EventCreateView() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Form data
  const [formData, setFormData] = useState({
    title: '',
    short_description: '',
    description: '',
    category_id: '',
    venue_name: '',
    venue_address: '',
    start_date: '',
    end_date: '',
    is_featured: false,
    is_public: true,
    max_attendees: '',
    ticket_types: [] as Partial<TicketType>[],
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await eventsApi.getCategories();
        setCategories(response.data.data || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddTicketType = () => {
    setFormData(prev => ({
      ...prev,
      ticket_types: [
        ...prev.ticket_types,
        {
          name: '',
          description: '',
          price: '',
          quantity: '',
          sales_start_date: '',
          sales_end_date: '',
        },
      ],
    }));
  };

  const handleTicketTypeChange = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      ticket_types: prev.ticket_types.map((ticket, i) =>
        i === index ? { ...ticket, [field]: value } : ticket
      ),
    }));
  };

  const handleRemoveTicketType = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ticket_types: prev.ticket_types.filter((_, i) => i !== index),
    }));
  };

  const handleNext = () => {
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate form data
      if (!formData.title || !formData.description || !formData.category_id) {
        setError('Please fill in all required fields');
        return;
      }

      // Prepare ticket types data
      const ticketTypesData = formData.ticket_types.map(ticket => ({
        name: ticket.name || '',
        description: ticket.description || '',
        price: parseFloat(ticket.price as string) || 0,
        quantity: parseInt(ticket.quantity as string) || 0,
        sales_start_date: ticket.sales_start_date || formData.start_date,
        sales_end_date: ticket.sales_end_date || formData.end_date,
      }));

      const eventData = {
        title: formData.title,
        short_description: formData.short_description,
        description: formData.description,
        category_id: parseInt(formData.category_id),
        venue_name: formData.venue_name,
        venue_address: formData.venue_address,
        start_date: formData.start_date,
        end_date: formData.end_date,
        is_featured: formData.is_featured,
        is_public: formData.is_public,
        max_attendees: formData.max_attendees ? parseInt(formData.max_attendees) : null,
        ticket_types: ticketTypesData,
      };

      const response = await eventsApi.createEvent(eventData);
      
      // Navigate to event details or dashboard
      navigate(paths.organizer.events.details(response.data.data.slug));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Event Title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
            />

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Short Description"
              value={formData.short_description}
              onChange={(e) => handleInputChange('short_description', e.target.value)}
              placeholder="Brief description that will appear on event cards"
            />

            <TextField
              fullWidth
              multiline
              rows={6}
              label="Full Description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              required
              placeholder="Detailed description of your event"
            />

            <FormControl fullWidth required>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category_id}
                onChange={(e) => handleInputChange('category_id', e.target.value)}
                label="Category"
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Stack direction="row" spacing={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_featured}
                    onChange={(e) => handleInputChange('is_featured', e.target.checked)}
                  />
                }
                label="Featured Event"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_public}
                    onChange={(e) => handleInputChange('is_public', e.target.checked)}
                  />
                }
                label="Public Event"
              />
            </Stack>
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Venue Name"
              value={formData.venue_name}
              onChange={(e) => handleInputChange('venue_name', e.target.value)}
              required
            />

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Venue Address"
              value={formData.venue_address}
              onChange={(e) => handleInputChange('venue_address', e.target.value)}
              required
            />

            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                label="Start Date & Time"
                type="datetime-local"
                value={formData.start_date}
                onChange={(e) => handleInputChange('start_date', e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
              <TextField
                fullWidth
                label="End Date & Time"
                type="datetime-local"
                value={formData.end_date}
                onChange={(e) => handleInputChange('end_date', e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Stack>

            <TextField
              fullWidth
              label="Maximum Attendees"
              type="number"
              value={formData.max_attendees}
              onChange={(e) => handleInputChange('max_attendees', e.target.value)}
              placeholder="Leave empty for unlimited"
            />
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={3}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="h6">Ticket Types</Typography>
              <Button
                variant="outlined"
                startIcon={<Iconify icon="eva:plus-fill" />}
                onClick={handleAddTicketType}
              >
                Add Ticket Type
              </Button>
            </Stack>

            {formData.ticket_types.length === 0 ? (
              <Card>
                <CardContent>
                  <Stack alignItems="center" spacing={2} sx={{ py: 4 }}>
                    <Iconify icon="eva:ticket-outline" width={64} sx={{ color: 'text.disabled' }} />
                    <Typography variant="h6" color="text.secondary">
                      No ticket types added
                    </Typography>
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                      Add ticket types to allow people to purchase tickets for your event.
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            ) : (
              <Stack spacing={3}>
                {formData.ticket_types.map((ticket, index) => (
                  <Card key={index}>
                    <CardContent>
                      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                        <Typography variant="h6">Ticket Type {index + 1}</Typography>
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveTicketType(index)}
                        >
                          <Iconify icon="eva:trash-2-outline" />
                        </IconButton>
                      </Stack>

                      <Stack spacing={2}>
                        <TextField
                          fullWidth
                          label="Ticket Name"
                          value={ticket.name}
                          onChange={(e) => handleTicketTypeChange(index, 'name', e.target.value)}
                          required
                        />

                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          label="Description"
                          value={ticket.description}
                          onChange={(e) => handleTicketTypeChange(index, 'description', e.target.value)}
                        />

                        <Stack direction="row" spacing={2}>
                          <TextField
                            fullWidth
                            label="Price"
                            type="number"
                            value={ticket.price}
                            onChange={(e) => handleTicketTypeChange(index, 'price', e.target.value)}
                            required
                            inputProps={{ min: 0, step: 0.01 }}
                          />
                          <TextField
                            fullWidth
                            label="Quantity"
                            type="number"
                            value={ticket.quantity}
                            onChange={(e) => handleTicketTypeChange(index, 'quantity', e.target.value)}
                            required
                            inputProps={{ min: 1 }}
                          />
                        </Stack>

                        <Stack direction="row" spacing={2}>
                          <TextField
                            fullWidth
                            label="Sales Start Date"
                            type="datetime-local"
                            value={ticket.sales_start_date}
                            onChange={(e) => handleTicketTypeChange(index, 'sales_start_date', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                          />
                          <TextField
                            fullWidth
                            label="Sales End Date"
                            type="datetime-local"
                            value={ticket.sales_end_date}
                            onChange={(e) => handleTicketTypeChange(index, 'sales_end_date', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
          </Stack>
        );

      case 3:
        return (
          <Stack spacing={3}>
            <Typography variant="h6">Review Your Event</Typography>
            
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="h5">{formData.title}</Typography>
                  <Typography variant="body1" color="text.secondary">
                    {formData.short_description}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Chip label={categories.find(c => c.id === parseInt(formData.category_id))?.name} />
                    {formData.is_featured && <Chip label="Featured" color="primary" />}
                    {formData.is_public ? <Chip label="Public" color="success" /> : <Chip label="Private" color="warning" />}
                  </Stack>
                  <Typography variant="body2">
                    <strong>Venue:</strong> {formData.venue_name}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Address:</strong> {formData.venue_address}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Start:</strong> {new Date(formData.start_date).toLocaleString()}
                  </Typography>
                  <Typography variant="body2">
                    <strong>End:</strong> {new Date(formData.end_date).toLocaleString()}
                  </Typography>
                  {formData.max_attendees && (
                    <Typography variant="body2">
                      <strong>Max Attendees:</strong> {formData.max_attendees}
                    </Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>

            {formData.ticket_types.length > 0 && (
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>Ticket Types</Typography>
                  <Stack spacing={2}>
                    {formData.ticket_types.map((ticket, index) => (
                      <Box key={index} sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Box>
                            <Typography variant="subtitle1">{ticket.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {ticket.description}
                            </Typography>
                          </Box>
                          <Box textAlign="right">
                            <Typography variant="h6">${ticket.price}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              Qty: {ticket.quantity}
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            )}
          </Stack>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={4}>
        {/* Header */}
        <Box>
          <Typography variant="h4" sx={{ mb: 1 }}>
            Create New Event
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Fill in the details below to create your event.
          </Typography>
        </Box>

        {/* Stepper */}
        <Card>
          <CardContent>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </CardContent>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Step Content */}
        <Card>
          <CardContent>
            {renderStepContent(activeStep)}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <Stack direction="row" justifyContent="space-between">
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
          >
            Back
          </Button>

          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              onClick={() => navigate(paths.organizer.root)}
            >
              Cancel
            </Button>

            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
                startIcon={loading ? <Iconify icon="eva:loader-outline" /> : <Iconify icon="eva:checkmark-fill" />}
              >
                {loading ? 'Creating...' : 'Create Event'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
              >
                Next
              </Button>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
}
