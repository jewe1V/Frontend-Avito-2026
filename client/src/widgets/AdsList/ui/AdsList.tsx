import { Stack, Box, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Импортируем хук навигации
import { useAdsStore } from '../../../entities/ad/model/useAdsStore';
import { AdCardRow } from '../../../entities/ad/ui/AdCardRow';
import { AdCardGrid } from '../../../entities/ad/ui/AdCardGrid';

const mockItems = [
    { id: '1', category: 'electronics', title: 'Наушники', price: 2990, needsRevision: false },
    { id: '2', category: 'auto', title: 'Volkswagen Polo', price: 1100000, needsRevision: true },
    { id: '3', category: 'real_estate', title: 'Студия, 25м²', price: 15000000, needsRevision: false },
];

export const AdsList = () => {
    const viewMode = useAdsStore((state) => state.viewMode);
    const navigate = useNavigate();

    const items = mockItems as any[];

    // Общий обработчик клика
    const handleCardClick = (id: string) => {
        navigate(`/ads/${id}`); // Переходим на страницу деталей по ID
    };

    if (viewMode === 'grid') {
        return (
            <Grid container spacing={2} sx={{ mb: 4 }}>
                {items.map((item) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
                        <Box
                            onClick={() => handleCardClick(item.id)}
                            sx={{ cursor: 'pointer', height: '100%' }}
                        >
                            <AdCardGrid item={item} />
                        </Box>
                    </Grid>
                ))}
            </Grid>
        );
    }

    return (
        <Stack spacing={2} sx={{ mb: 4 }}>
            {items.map((item) => (
                <Box
                    key={item.id}
                    onClick={() => handleCardClick(item.id)}
                    sx={{ cursor: 'pointer' }}
                >
                    <AdCardRow item={item} />
                </Box>
            ))}
        </Stack>
    );
};
