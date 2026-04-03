import {Box, Container, Typography} from '@mui/material';

import { Sidebar } from '../../../widgets/AdsFilter/ui/Sidebar';
import { AdsToolbar } from '../../../widgets/AdsToolbar/ui/AdsToolbar';
import { AdsList } from '../../../widgets/AdsList/ui/AdsList';

export const AdsPage = () => {


    return (
        <Container sx={{ py: 4 }}>
            {/* Шапка страницы */}
            <Box sx={{ mb: 3, textAlign: 'left' }}>
                <Typography variant="h5" sx={{ fontWeight: 500 }}>
                    Мои объявления
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 400, marginTop: -.5 }}>
                    42 объявления
                </Typography>
            </Box>

            {/* Сборка виджетов (Layout) */}
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                {/* Сайдбар — теперь без пропсов, он сам "умный" */}
                <Box sx={{ width: 280, flexShrink: 0 }}>
                    <Sidebar />
                </Box>

                {/* Основной контент */}
                <Box sx={{ flexGrow: 1 }}>
                    <AdsToolbar />
                    <AdsList />
                </Box>
            </Box>
        </Container>
    );
};
