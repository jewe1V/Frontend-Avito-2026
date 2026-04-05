import {Box, Container, Typography} from '@mui/material';
import { useEffect } from 'react';
import { useAdsStore } from '../../../entities/ad/model/useAdsStore';
import { Sidebar } from '../../../widgets/AdsFilter/ui/Sidebar';
import { AdsToolbar } from '../../../widgets/AdsToolbar';
import { AdsList } from '../../../widgets/AdsList';

export const AdsPage = () => {
    const total = useAdsStore((state) => state.total);

    useEffect(() => {
        document.title = "Мои объявления";
    }, []);

    return (
        <Container
            maxWidth={false}
            sx={{
                maxWidth: '1399px',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                py: 2,
                px: 0,
                boxSizing: 'border-box'
            }}
        >
            <Box sx={{ flexShrink: 0 }}>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 500 }}>
                        Мои объявления
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {total} объявлений
                    </Typography>
                </Box>
                <AdsToolbar />
            </Box>

            <Box sx={{
                display: 'flex',
                gap: 2.5,
                flexGrow: 1,
                minHeight: 0,
                mt: 0.5
            }}>
                <Box sx={{ flexShrink: 0 }}>
                    <Sidebar />
                </Box>

                <Box sx={{ flexGrow: 1, minWidth: 0, height: '100%' }}>
                    <AdsList />
                </Box>
            </Box>
        </Container>
    );
};
