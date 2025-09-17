import { Box, Card, Button, CardMedia, Typography, CardContent } from '@mui/material';

import { RouterLink } from 'src/routes/components';

type Props = {
  id: number;
  title: string;
  cover?: string;
  price?: number;
  date?: string;
  location?: string;
};

export default function EventCard({ id, title, cover, price, date, location }: Props) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {cover ? (
        <CardMedia component="img" height="160" image={cover} alt={title} />
      ) : (
        <Box sx={{ height: 160, bgcolor: 'action.hover' }} />
      )}
      <CardContent sx={{ flexGrow: 1, display: 'grid', gap: 0.5 }}>
        <Typography variant="subtitle1">{title}</Typography>
        {date && <Typography variant="caption">{date}</Typography>}
        {location && <Typography variant="caption">{location}</Typography>}
        {price != null && <Typography variant="subtitle2">SAR {price}</Typography>}
      </CardContent>

      <Box sx={{ p: 2, pt: 0 }}>
        <Button
          fullWidth
          component={RouterLink}
          href={`/events/${id}`}
          variant="outlined"
          size="small"
        >
          View details
        </Button>
      </Box>
    </Card>
  );
}
