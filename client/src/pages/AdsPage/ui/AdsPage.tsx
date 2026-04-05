import {Box, Container, Typography, useTheme} from '@mui/material';
import { useEffect } from 'react';
import { useAdsStore } from '../../../entities/ad/model/useAdsStore';
import { Sidebar } from '../../../widgets/AdsFilter/ui/Sidebar';
import { AdsToolbar } from '../../../widgets/AdsToolbar';
import { AdsList } from '../../../widgets/AdsList';

export const AdsPage = () => {
    const total = useAdsStore((state) => state.total);
    const theme = useTheme();
    useEffect(() => {
        document.title = "Мои объявления";
    }, []);

    return (
        <Box sx={{
            bgcolor: theme.palette.mode === 'light' ? '#F7F5F8' : theme.palette.background.default,
            minHeight: '100vh',
            width: '100%'
        }}>
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
        </Box>
    );
};
