import { useState } from 'react';

import type { Event, TicketType } from 'src/types/event';

import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Button,
  Divider,
  TextField,
  IconButton,
  Alert,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type OrderItem = {
  ticket_type_id: number;
  quantity: number;
  ticket_type: TicketType;
};

type OrderSummaryProps = {
  event: Event;
  items: OrderItem[];
  onQuantityChange: (ticketTypeId: number, quantity: number) => void;
  onRemoveItem: (ticketTypeId: number) => void;
  onProceedToPayment: () => void;
  loading?: boolean;
};

export function OrderSummary({
  event,
  items,
  onQuantityChange,
  onRemoveItem,
  onProceedToPayment,
  loading = false,
}: OrderSummaryProps) {
  const [promoCode, setPromoCode] = useState('');
  const [promoCodeError, setPromoCodeError] = useState<string | null>(null);

  const subtotal = items.reduce(
    (total, item) => total + parseFloat(item.ticket_type.price) * item.quantity,
    0
  );

  const taxRate = 0.05; // 5% tax
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;

  const handlePromoCodeSubmit = () => {
    // TODO: Implement promo code validation
    setPromoCodeError('Promo code validation not implemented yet');
  };

  const isOrderValid = items.length > 0 && items.every(item => item.quantity > 0);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Order Summary
        </Typography>

        {/* Event Info */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            {event.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
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
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Order Items */}
        {items.length === 0 ? (
          <Alert severity="info" sx={{ mb: 3 }}>
            No tickets selected. Please select tickets to continue.
          </Alert>
        ) : (
          <Stack spacing={2} sx={{ mb: 3 }}>
            {items.map((item) => (
              <Box
                key={item.ticket_type_id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 2,
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {item.ticket_type.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.ticket_type.price} OMR each
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => onQuantityChange(item.ticket_type_id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <Iconify icon="eva:minus-outline" />
                  </IconButton>
                  
                  <TextField
                    size="small"
                    value={item.quantity}
                    onChange={(e) => {
                      const newQuantity = parseInt(e.target.value) || 0;
                      if (newQuantity >= 0 && newQuantity <= item.ticket_type.quantity_available) {
                        onQuantityChange(item.ticket_type_id, newQuantity);
                      }
                    }}
                    sx={{ width: 60, textAlign: 'center' }}
                    inputProps={{ style: { textAlign: 'center' } }}
                  />
                  
                  <IconButton
                    size="small"
                    onClick={() => onQuantityChange(item.ticket_type_id, item.quantity + 1)}
                    disabled={item.quantity >= item.ticket_type.quantity_available}
                  >
                    <Iconify icon="eva:plus-outline" />
                  </IconButton>

                  <IconButton
                    size="small"
                    onClick={() => onRemoveItem(item.ticket_type_id)}
                    color="error"
                  >
                    <Iconify icon="eva:trash-2-outline" />
                  </IconButton>
                </Box>

                <Typography variant="subtitle2" sx={{ minWidth: 80, textAlign: 'right' }}>
                  {(parseFloat(item.ticket_type.price) * item.quantity).toFixed(2)} OMR
                </Typography>
              </Box>
            ))}
          </Stack>
        )}

        {/* Promo Code */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Promo Code
          </Typography>
          <Stack direction="row" spacing={1}>
            <TextField
              size="small"
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              error={!!promoCodeError}
              helperText={promoCodeError}
              sx={{ flex: 1 }}
            />
            <Button
              variant="outlined"
              onClick={handlePromoCodeSubmit}
              disabled={!promoCode.trim()}
            >
              Apply
            </Button>
          </Stack>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Price Breakdown */}
        <Stack spacing={1} sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2">Subtotal</Typography>
            <Typography variant="body2">{subtotal.toFixed(2)} OMR</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2">Tax (5%)</Typography>
            <Typography variant="body2">{taxAmount.toFixed(2)} OMR</Typography>
          </Box>
          <Divider />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6">Total</Typography>
            <Typography variant="h6">{total.toFixed(2)} OMR</Typography>
          </Box>
        </Stack>

        {/* Proceed Button */}
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={onProceedToPayment}
          disabled={!isOrderValid || loading}
          startIcon={<Iconify icon="eva:credit-card-outline" />}
        >
          {loading ? 'Processing...' : 'Proceed to Payment'}
        </Button>

        {/* Security Notice */}
        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block', textAlign: 'center' }}>
          🔒 Your payment information is secure and encrypted
        </Typography>
      </CardContent>
    </Card>
  );
}
