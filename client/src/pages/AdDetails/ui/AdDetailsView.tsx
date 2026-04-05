import { Container, Typography, Divider, useTheme } from '@mui/material';
import { Box } from '@mui/material';
import type { Item } from '../../../shared/api/types';
import { AdDetailsHeader } from '../../../widgets/AdDetailsHeader';
import { AdDetailsActions } from '../../../widgets/AdDetailsActions';
import { AdDetailsContent } from '../../../widgets/AdDetailsContent';
import { AdDetailsSkeleton } from '../../../widgets/AdDetailsSkeleton';

interface AdDetailsViewProps {
  id: string | undefined;
  ad: (Item & { needsRevision: boolean }) | null;
  loading: boolean;
  error: string | null;
}

export const AdDetailsView = ({ id, ad, loading, error }: AdDetailsViewProps) => {
  const theme = useTheme();

  if (loading) {
    return <AdDetailsSkeleton />;
  }

  if (error || !ad) {
    return (
      <Container maxWidth={false} sx={{ py: 4 }}>
        <Typography color="error">
          {error || 'Объявление не найдено'}
        </Typography>
      </Container>
    );
  }

  return (
      <Box sx={{
          bgcolor: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.background.default,
          minHeight: '100vh',
          width: '100%'
      }}>
        <Container
          maxWidth={false}
          sx={{
            py: 4,
            minHeight: '100vh',
            maxWidth: '1399px',
            mx: 'auto',
            bgcolor: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.background.default
          }}
        >
          <Box sx={{ mb: 3 }}>
            <AdDetailsHeader title={ad.title} price={ad.price} />

            <Box sx={{ mt: 2 }}>
              <AdDetailsActions ad={ad} id={id!} />
            </Box>
          </Box>

          <Divider sx={{ mb: 4, borderColor: theme.palette.divider }} />

          <AdDetailsContent ad={ad} />
        </Container>
      </Box>
  );
};
