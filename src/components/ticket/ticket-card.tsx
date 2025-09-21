import { useState } from 'react';

import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  QRCodeSVG,
} from '@mui/material';
import type { Ticket } from 'src/types/order';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type TicketCardProps = {
  ticket: Ticket;
  onDownload?: (ticket: Ticket) => void;
  onShare?: (ticket: Ticket) => void;
};

export function TicketCard({ ticket, onDownload, onShare }: TicketCardProps) {
  const [showQR, setShowQR] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'used':
        return 'info';
      case 'cancelled':
        return 'error';
      case 'refunded':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <>
      <Card
        sx={{
          border: 1,
          borderColor: 'divider',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: 4,
            transform: 'translateY(-2px)',
          },
        }}
      >
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {ticket.event.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {ticket.ticket_type.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ticket #{ticket.ticket_number}
              </Typography>
            </Box>
            
            <Chip
              label={ticket.status.toUpperCase()}
              color={getStatusColor(ticket.status)}
              size="small"
            />
          </Stack>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Event Date
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {formatDate(ticket.event.start_date)}
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Venue
            </Typography>
            <Typography variant="body1">
              📍 {ticket.event.venue_name || 'Venue TBD'}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Iconify icon="eva:qr-code-outline" />}
              onClick={() => setShowQR(true)}
              disabled={ticket.status !== 'active'}
            >
              Show QR
            </Button>
            
            {onDownload && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<Iconify icon="eva:download-outline" />}
                onClick={() => onDownload(ticket)}
              >
                Download
              </Button>
            )}
            
            {onShare && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<Iconify icon="eva:share-outline" />}
                onClick={() => onShare(ticket)}
              >
                Share
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* QR Code Dialog */}
      <Dialog
        open={showQR}
        onClose={() => setShowQR(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon="eva:qr-code-outline" />
            <Typography variant="h6">Ticket QR Code</Typography>
          </Stack>
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Show this QR code at the event entrance
            </Typography>
            
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                p: 2,
                                bgcolor: 'background.paper',
                borderRadius: 2,
                border: 1,
                borderColor: 'divider',
              }}
            >
              <QRCodeSVG
                value={ticket.qr_code}
                size={200}
                level="M"
              />
            </Box>
            
            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
              Ticket #{ticket.ticket_number}
            </Typography>
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setShowQR(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
