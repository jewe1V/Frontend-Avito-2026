import { Container, Typography, Divider, Grid, useTheme } from '@mui/material';
import { useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import { itemsApi } from '../../../shared/api/itemsApi';
import { Box } from '@mui/material';
import type { Item } from '../../../shared/api/types';
import { AdDetailsHeader } from '../../../widgets/AdDetailsHeader';
import { AdDetailsActions } from '../../../widgets/AdDetailsActions';
import { AdDetailsMedia } from '../../../widgets/AdDetailsMedia';
import { AdDetailsInfo } from '../../../widgets/AdDetailsInfo';
import { AdDetailsSkeleton } from '../../../widgets/AdDetailsSkeleton';

export const AdDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const theme = useTheme();
    const [ad, setAd] = useState<(Item & { needsRevision: boolean }) | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchAd = async () => {
            try {
                setLoading(true);
                const response = await itemsApi.getItem(id);
                setAd(response);
            } catch(e) {
                console.error('Error loading ad:', e);
                setAd(null);
            } finally {
                setLoading(false);
            }
        };

        fetchAd();
    }, [id]);

    if (loading) {
        return <AdDetailsSkeleton />;
    }

    if (!ad) {
        return (
            <Container maxWidth={false} sx={{ py: 4 }}>
                <Typography color="error">Объявление не найдено</Typography>
            </Container>
        );
    }

    return (
        <Container
            maxWidth={false}
            sx={{
                py: 4,
                height: "100vh",
                maxWidth: '1399px',
                mx: 'auto',
                backgroundColor: theme.palette.background.default,
            }}
        >
            <Box sx={{ mb: 3 }}>
                <AdDetailsHeader title={ad.title} price={ad.price} />

                <Box sx={{ mt: 2 }}>
                    <AdDetailsActions ad={ad} id={id!} />
                </Box>
            </Box>

            <Divider sx={{ mb: 4, borderColor: theme.palette.divider }} />

            <Grid container spacing={5}>
                <Grid>
                    <AdDetailsMedia description={ad.description} />
                </Grid>

                <Grid size={{ xs: 12, md: 5 }}>
                    <AdDetailsInfo ad={ad} />
                </Grid>
            </Grid>
        </Container>
    );
};
