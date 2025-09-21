import { useState, useEffect } from 'react';

import {
  Container,
  Typography,
  Box,
  Stack,
  Button,
  Tabs,
  Tab,
  Alert,
  Skeleton,
  Grid,
  Chip,
  TextField,
  InputAdornment,
  Card,
  CardContent,
} from '@mui/material';

import type { Ticket } from 'src/types/order';

import { Iconify } from 'src/components/iconify';
import { useAuthContext } from 'src/auth/hooks';
import { ticketsApi } from 'src/lib/api/tickets';
import { TicketCard } from 'src/components/ticket/ticket-card';

// ----------------------------------------------------------------------

type TabPanelProps = {
  children?: React.ReactNode;
  index: number;
  value: number;
};

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tickets-tabpanel-${index}`}
      aria-labelledby={`tickets-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function CustomerTicketsPage() {
  const { user, role } = useAuthContext();
  
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await ticketsApi.getCustomerTickets();
        setTickets(response.data.data || []);
        setFilteredTickets(response.data.data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load tickets');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  useEffect(() => {
    let filtered = tickets;

    // Filter by tab
    switch (activeTab) {
      case 0: // All
        break;
      case 1: // Active
        filtered = filtered.filter(ticket => ticket.status === 'active');
        break;
      case 2: // Used
        filtered = filtered.filter(ticket => ticket.status === 'used');
        break;
      case 3: // Cancelled
        filtered = filtered.filter(ticket => ticket.status === 'cancelled');
        break;
      default:
        break;
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(ticket =>
        ticket.event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.ticket_number.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTickets(filtered);
  }, [tickets, activeTab, searchQuery]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleDownloadTicket = (ticket: Ticket) => {
    // TODO: Implement ticket download functionality
    console.log('Downloading ticket:', ticket.ticket_number);
  };

  const handleShareTicket = (ticket: Ticket) => {
    // TODO: Implement ticket sharing functionality
    console.log('Sharing ticket:', ticket.ticket_number);
  };

  if (role !== 'customer') {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Access denied. This page is only available for customers.
        </Alert>
      </Container>
    );
  }

  const getTabCount = (status: string) => {
    if (status === 'all') return tickets.length;
    return tickets.filter(ticket => ticket.status === status).length;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          My Tickets
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage and view all your event tickets
        </Typography>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search tickets by event name or ticket number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-outline" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab
            label={
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography>All</Typography>
                <Chip label={getTabCount('all')} size="small" />
              </Stack>
            }
          />
          <Tab
            label={
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography>Active</Typography>
                <Chip label={getTabCount('active')} size="small" color="success" />
              </Stack>
            }
          />
          <Tab
            label={
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography>Used</Typography>
                <Chip label={getTabCount('used')} size="small" color="info" />
              </Stack>
            }
          />
          <Tab
            label={
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography>Cancelled</Typography>
                <Chip label={getTabCount('cancelled')} size="small" color="error" />
              </Stack>
            }
          />
        </Tabs>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Content */}
      {loading ? (
        <Grid container spacing={3}>
          {[...Array(4)].map((_, index) => (
            <Grid xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" height={32} />
                  <Skeleton variant="text" height={20} />
                  <Skeleton variant="text" height={20} />
                  <Skeleton variant="rectangular" height={40} sx={{ mt: 2 }} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : filteredTickets.length > 0 ? (
        <Grid container spacing={3}>
          {filteredTickets.map((ticket) => (
            <Grid xs={12} sm={6} md={4} key={ticket.id}>
              <TicketCard
                ticket={ticket}
                onDownload={handleDownloadTicket}
                onShare={handleShareTicket}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Iconify icon="eva:ticket-outline" width={64} sx={{ color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            {searchQuery ? 'No tickets found' : 'No tickets yet'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {searchQuery 
              ? 'Try adjusting your search criteria'
              : 'Start exploring events and book your first tickets!'
            }
          </Typography>
          {!searchQuery && (
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:calendar-outline" />}
            >
              Browse Events
            </Button>
          )}
        </Box>
      )}
    </Container>
  );
}
