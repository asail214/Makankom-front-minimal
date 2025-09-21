import { useState, useEffect } from 'react';

import {
  Container,
  Typography,
  Box,
  Stack,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Skeleton,
  Button,
} from '@mui/material';

import type { Event, TicketType, Order } from 'src/types/event';

import { Iconify } from 'src/components/iconify';
import { paths } from 'src/routes/paths';
import { useParams, useNavigate } from 'src/routes/hooks';
import { useAuthContext } from 'src/auth/hooks';
import { eventsApi, ordersApi } from 'src/lib/api/events';
import { OrderSummary } from 'src/components/order/order-summary';
import { PaymentGateway } from 'src/components/payment/payment-gateway';
import { TicketSelection } from 'src/components/order/ticket-selection';

// ----------------------------------------------------------------------

type OrderItem = {
  ticket_type_id: number;
  quantity: number;
  ticket_type: TicketType;
};

const steps = ['Select Tickets', 'Review Order', 'Payment'];

export default function EventBookingPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { authenticated, user } = useAuthContext();

  const [event, setEvent] = useState<Event | null>(null);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (!authenticated) {
      navigate(paths.auth.customer.signIn);
      return;
    }

    const fetchEventData = async () => {
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
          setTicketTypes(foundEvent.ticket_types || []);
        } else {
          setError('Event not found');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [slug, authenticated, navigate]);

  const handleNext = () => {
    if (activeStep === 0 && selectedItems.length === 0) {
      setError('Please select at least one ticket to continue');
      return;
    }

    if (activeStep === 1) {
      // Create order before proceeding to payment
      createOrder();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const createOrder = async () => {
    try {
      setLoading(true);
      setError(null);

      const orderData = {
        event_id: event!.id,
        items: selectedItems.map(item => ({
          ticket_type_id: item.ticket_type_id,
          quantity: item.quantity,
        })),
      };

      const response = await ordersApi.createOrder(orderData);
      setOrderId(response.data.data.order_number);
      setActiveStep(2);
    } catch (err: any) {
      setError(err.message || 'Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (paymentData: any) => {
    // Redirect to order confirmation page
    navigate(paths.customer.orderDetails(orderId!));
  };

  const handlePaymentError = (paymentError: string) => {
    setError(paymentError);
  };

  const getTotalAmount = () =>
    selectedItems.reduce(
      (total, item) => total + parseFloat(item.ticket_type.price) * item.quantity,
      0
    );

  if (!authenticated) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">
          Please log in to book tickets for this event.
        </Alert>
      </Container>
    );
  }

  if (loading && !event) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={3}>
          <Skeleton variant="text" height={40} />
          <Skeleton variant="rectangular" height={200} />
          <Skeleton variant="rectangular" height={300} />
        </Stack>
      </Container>
    );
  }

  if (error && !event) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate(paths.events.root)}
        >
          Back to Events
        </Button>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Event not found.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<Iconify icon="eva:arrow-back-outline" />}
          onClick={() => navigate(paths.events.details(event.slug))}
          sx={{ mb: 2 }}
        >
          Back to Event
        </Button>
        
        <Typography variant="h4" sx={{ mb: 1 }}>
          Book Tickets
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {event.title} - {new Date(event.start_date).toLocaleDateString()}
        </Typography>
      </Box>

      {/* Stepper */}
      <Box sx={{ mb: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Content */}
      <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', lg: 'row' } }}>
        {/* Main Content */}
        <Box sx={{ flex: 1 }}>
          {activeStep === 0 && (
            <TicketSelection
              event={event}
              ticketTypes={ticketTypes}
              selectedItems={selectedItems}
              onItemChange={setSelectedItems}
              loading={loading}
            />
          )}

          {activeStep === 1 && (
            <Box>
              <Typography variant="h5" sx={{ mb: 3 }}>
                Review Your Order
              </Typography>
              <Alert severity="info" sx={{ mb: 3 }}>
                Please review your order details before proceeding to payment.
              </Alert>
              {/* Order details will be shown in the summary component */}
            </Box>
          )}

          {activeStep === 2 && orderId && (
            <PaymentGateway
              amount={getTotalAmount()}
              orderId={orderId}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
              loading={loading}
            />
          )}
        </Box>

        {/* Sidebar */}
        <Box sx={{ width: { xs: '100%', lg: 400 } }}>
          {activeStep < 2 && (
            <OrderSummary
              event={event}
              items={selectedItems}
              onQuantityChange={(ticketTypeId, quantity) => {
                const newItems = selectedItems.map(item =>
                  item.ticket_type_id === ticketTypeId
                    ? { ...item, quantity }
                    : item
                ).filter(item => item.quantity > 0);
                setSelectedItems(newItems);
              }}
              onRemoveItem={(ticketTypeId) => {
                setSelectedItems(selectedItems.filter(item => item.ticket_type_id !== ticketTypeId));
              }}
              onProceedToPayment={handleNext}
              loading={loading}
            />
          )}
        </Box>
      </Box>

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          startIcon={<Iconify icon="eva:arrow-back-outline" />}
        >
          Back
        </Button>

        {activeStep < 2 && (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={selectedItems.length === 0 || loading}
            endIcon={<Iconify icon="eva:arrow-forward-outline" />}
          >
            {activeStep === 0 ? 'Review Order' : 'Create Order'}
          </Button>
        )}
      </Box>
    </Container>
  );
}
