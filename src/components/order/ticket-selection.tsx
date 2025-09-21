import { useState } from 'react';

import type { Event, TicketType } from 'src/types/event';

import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Button,
  Chip,
  Alert,
  Skeleton,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type OrderItem = {
  ticket_type_id: number;
  quantity: number;
  ticket_type: TicketType;
};

type TicketSelectionProps = {
  event: Event;
  ticketTypes: TicketType[];
  selectedItems: OrderItem[];
  onItemChange: (items: OrderItem[]) => void;
  loading?: boolean;
};

export function TicketSelection({
  event,
  ticketTypes,
  selectedItems,
  onItemChange,
  loading = false,
}: TicketSelectionProps) {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const handleQuantityChange = (ticketTypeId: number, quantity: number) => {
    const existingItemIndex = selectedItems.findIndex(item => item.ticket_type_id === ticketTypeId);
    
    if (quantity === 0) {
      // Remove item
      const newItems = selectedItems.filter(item => item.ticket_type_id !== ticketTypeId);
      onItemChange(newItems);
    } else {
      // Update or add item
      const ticketType = ticketTypes.find(tt => tt.id === ticketTypeId);
      if (!ticketType) return;

      const newItem: OrderItem = {
        ticket_type_id: ticketTypeId,
        quantity,
        ticket_type: ticketType,
      };

      if (existingItemIndex >= 0) {
        // Update existing item
        const newItems = [...selectedItems];
        newItems[existingItemIndex] = newItem;
        onItemChange(newItems);
      } else {
        // Add new item
        onItemChange([...selectedItems, newItem]);
      }
    }
  };

  const getSelectedQuantity = (ticketTypeId: number) => {
    const selectedItem = selectedItems.find(item => item.ticket_type_id === ticketTypeId);
    return selectedItem ? selectedItem.quantity : 0;
  };

  const getTotalSelectedTickets = () =>
    selectedItems.reduce((total, item) => total + item.quantity, 0);

  if (loading) {
    return (
      <Stack spacing={3}>
        {[...Array(3)].map((_, index) => (
          <Card key={index}>
            <CardContent>
              <Skeleton variant="text" height={32} />
              <Skeleton variant="text" height={20} />
              <Skeleton variant="text" height={20} />
              <Skeleton variant="rectangular" height={40} sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        ))}
      </Stack>
    );
  }

  if (ticketTypes.length === 0) {
    return (
      <Alert severity="info">
        No ticket types available for this event.
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ mb: 1 }}>
          Select Tickets
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Choose your tickets for {event.title}
        </Typography>
        {getTotalSelectedTickets() > 0 && (
          <Chip
            label={`${getTotalSelectedTickets()} ticket(s) selected`}
            color="primary"
            sx={{ mt: 1 }}
          />
        )}
      </Box>

      <Stack spacing={2}>
        {ticketTypes.map((ticketType) => {
          const isExpanded = expandedCard === ticketType.id;
          const selectedQuantity = getSelectedQuantity(ticketType.id);
          const isAvailable = ticketType.quantity_available > 0;

          return (
            <Card
              key={ticketType.id}
              sx={{
                border: selectedQuantity > 0 ? 2 : 1,
                borderColor: selectedQuantity > 0 ? 'primary.main' : 'divider',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: 4,
                },
              }}
            >
              <CardContent>
                <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      {ticketType.name}
                    </Typography>
                    
                    <Typography variant="h4" color="primary.main" sx={{ mb: 1 }}>
                      {ticketType.price} OMR
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {ticketType.description || 'Standard ticket for this event'}
                    </Typography>

                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                      <Chip
                        label={`${ticketType.quantity_available} available`}
                        size="small"
                        color={isAvailable ? 'success' : 'error'}
                        variant="outlined"
                      />
                      {ticketType.quantity_sold > 0 && (
                        <Chip
                          label={`${ticketType.quantity_sold} sold`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Stack>

                    {!isAvailable && (
                      <Alert severity="warning" sx={{ mb: 2 }}>
                        This ticket type is sold out
                      </Alert>
                    )}

                    {isExpanded && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                          Additional Information
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Sales end: {ticketType.sales_end_date 
                            ? new Date(ticketType.sales_end_date).toLocaleDateString()
                            : 'End of event'
                          }
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    {isAvailable && (
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleQuantityChange(ticketType.id, selectedQuantity - 1)}
                          disabled={selectedQuantity <= 0}
                        >
                          <Iconify icon="eva:minus-outline" />
                        </Button>
                        
                        <Typography variant="h6" sx={{ minWidth: 40, textAlign: 'center' }}>
                          {selectedQuantity}
                        </Typography>
                        
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleQuantityChange(ticketType.id, selectedQuantity + 1)}
                          disabled={selectedQuantity >= ticketType.quantity_available}
                        >
                          <Iconify icon="eva:plus-outline" />
                        </Button>
                      </Stack>
                    )}

                    <Button
                      variant={selectedQuantity > 0 ? 'contained' : 'outlined'}
                      size="small"
                      onClick={() => setExpandedCard(isExpanded ? null : ticketType.id)}
                      startIcon={<Iconify icon={isExpanded ? 'eva:arrow-up-outline' : 'eva:arrow-down-outline'} />}
                    >
                      {isExpanded ? 'Less' : 'More'}
                    </Button>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          );
        })}
      </Stack>

      {getTotalSelectedTickets() === 0 && (
        <Alert severity="info" sx={{ mt: 3 }}>
          Please select at least one ticket to continue with your order.
        </Alert>
      )}
    </Box>
  );
}
