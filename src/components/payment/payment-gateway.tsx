import { useState } from 'react';

import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type PaymentMethod = 'thawani' | 'amwalpay' | 'credit_card' | 'bank_transfer';

type PaymentGatewayProps = {
  amount: number;
  orderId: string;
  onPaymentSuccess: (paymentData: any) => void;
  onPaymentError: (error: string) => void;
  loading?: boolean;
};

export function PaymentGateway({
  amount,
  orderId,
  onPaymentSuccess,
  onPaymentError,
  loading = false,
}: PaymentGatewayProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('thawani');
  const [processing, setProcessing] = useState(false);

  const handlePayment = async () => {
    try {
      setProcessing(true);

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // TODO: Integrate with actual payment gateways
      switch (selectedMethod) {
        case 'thawani':
          await processThawaniPayment();
          break;
        case 'amwalpay':
          await processAmwalPayPayment();
          break;
        case 'credit_card':
          await processCreditCardPayment();
          break;
        case 'bank_transfer':
          await processBankTransfer();
          break;
        default:
          throw new Error('Invalid payment method');
      }
    } catch (error: any) {
      onPaymentError(error.message || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const processThawaniPayment = async () => {
    // TODO: Implement Thawani payment integration
    console.log('Processing Thawani payment for order:', orderId);
    
    // Simulate successful payment
    onPaymentSuccess({
      payment_method: 'thawani',
      transaction_id: `thawani_${Date.now()}`,
      amount,
      status: 'success',
    });
  };

  const processAmwalPayPayment = async () => {
    // TODO: Implement AmwalPay payment integration
    console.log('Processing AmwalPay payment for order:', orderId);
    
    // Simulate successful payment
    onPaymentSuccess({
      payment_method: 'amwalpay',
      transaction_id: `amwalpay_${Date.now()}`,
      amount,
      status: 'success',
    });
  };

  const processCreditCardPayment = async () => {
    // TODO: Implement credit card payment integration
    console.log('Processing credit card payment for order:', orderId);
    
    // Simulate successful payment
    onPaymentSuccess({
      payment_method: 'credit_card',
      transaction_id: `cc_${Date.now()}`,
      amount,
      status: 'success',
    });
  };

  const processBankTransfer = async () => {
    // TODO: Implement bank transfer payment
    console.log('Processing bank transfer for order:', orderId);
    
    // Simulate successful payment
    onPaymentSuccess({
      payment_method: 'bank_transfer',
      transaction_id: `bt_${Date.now()}`,
      amount,
      status: 'pending', // Bank transfers are usually pending
    });
  };

  const paymentMethods = [
    {
      value: 'thawani',
      label: 'Thawani',
      description: 'Pay with Thawani - Oman\'s leading payment gateway',
      icon: '🏦',
      available: true,
    },
    {
      value: 'amwalpay',
      label: 'AmwalPay',
      description: 'Secure payment with AmwalPay',
      icon: '💳',
      available: true,
    },
    {
      value: 'credit_card',
      label: 'Credit Card',
      description: 'Pay with Visa, Mastercard, or American Express',
      icon: '💳',
      available: true,
    },
    {
      value: 'bank_transfer',
      label: 'Bank Transfer',
      description: 'Direct bank transfer (Manual verification required)',
      icon: '🏛️',
      available: true,
    },
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Payment Method
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" color="primary.main" sx={{ mb: 1 }}>
            {amount.toFixed(2)} OMR
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Order #{orderId}
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <FormControl component="fieldset">
          <FormLabel component="legend" sx={{ mb: 2 }}>
            Select Payment Method
          </FormLabel>
          <RadioGroup
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value as PaymentMethod)}
          >
            <Stack spacing={2}>
              {paymentMethods.map((method) => (
                <Card
                  key={method.value}
                  sx={{
                    border: selectedMethod === method.value ? 2 : 1,
                    borderColor: selectedMethod === method.value ? 'primary.main' : 'divider',
                    cursor: 'pointer',
                    opacity: method.available ? 1 : 0.6,
                  }}
                  onClick={() => method.available && setSelectedMethod(method.value as PaymentMethod)}
                >
                  <CardContent sx={{ p: 2 }}>
                    <FormControlLabel
                      value={method.value}
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography variant="h6">{method.icon}</Typography>
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {method.label}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {method.description}
                            </Typography>
                          </Box>
                        </Box>
                      }
                      disabled={!method.available}
                      sx={{ m: 0, width: '100%' }}
                    />
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </RadioGroup>
        </FormControl>

        <Alert severity="info" sx={{ mt: 3, mb: 3 }}>
          <Typography variant="body2">
            <strong>Secure Payment:</strong> Your payment information is encrypted and secure. 
            We use industry-standard SSL encryption to protect your data.
          </Typography>
        </Alert>

        <Stack direction="row" spacing={2}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handlePayment}
            disabled={loading || processing}
            startIcon={
              processing ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <Iconify icon="eva:credit-card-outline" />
              )
            }
          >
            {processing ? 'Processing Payment...' : `Pay ${amount.toFixed(2)} OMR`}
          </Button>
        </Stack>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block', textAlign: 'center' }}>
          By proceeding, you agree to our Terms of Service and Privacy Policy
        </Typography>
      </CardContent>
    </Card>
  );
}
