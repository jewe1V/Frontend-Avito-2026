import { Stack, Box, CircularProgress, Typography, Pagination, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAdsStore } from '../../../entities/ad/model/useAdsStore';
import { AdCardRow } from '../../../entities/ad/ui/AdCardRow';
import { AdCardGrid } from '../../../entities/ad/ui/AdCardGrid';

// Стилизуем пагинацию в точности как на макете
const StyledPagination = styled(Pagination)(({ theme }) => ({
    '& .MuiPaginationItem-root': {
        borderRadius: '8px', // Скругленные углы
        border: '1px solid #d9d9d9', // Серая рамка по умолчанию
        backgroundColor: '#fff',
        color: '#333',
        margin: '0 4px',
        fontWeight: 500,
        fontSize: '16px',
        height: '40px',
        minWidth: '40px',
        // Состояние при наведении
        '&:hover': {
            backgroundColor: '#f5f5f5',
            borderColor: '#1677ff',
            color: '#1677ff',
        },
        // Активное состояние (выбранная страница)
        '&.Mui-selected': {
            backgroundColor: '#fff', // Белый фон, а не синий
            borderColor: '#1677ff', // Синяя рамка
            color: '#1677ff',       // Синий текст
            '&:hover': {
                backgroundColor: '#fff',
            },
        },
        // Иконки < и >
        '&.MuiPaginationItem-previousNext': {
            color: '#999',
            '&:hover': {
                borderColor: '#1677ff',
                color: '#1677ff',
            }
        },
    },
}));

export const AdsList = () => {
    const viewMode = useAdsStore((state) => state.viewMode);
    const ads = useAdsStore((state) => state.ads);
    const loading = useAdsStore((state) => state.loading);
    const error = useAdsStore((state) => state.error);
    const fetchAds = useAdsStore((state) => state.fetchAds);
    const filters = useAdsStore((state) => state.filters);
    const setFilters = useAdsStore((state) => state.setFilters);
    const total = useAdsStore((state) => state.total);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAds();
    }, [fetchAds]);

    const handleCardClick = (id: number) => {
        navigate(`/ads/${id}`);
    };

    const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
        setFilters({ page });
    };

    const limit = filters.limit || 20;
    const totalPages = Math.ceil(total / limit);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4, height: '100%' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Typography color="error" sx={{ py: 2 }}>
                Ошибка при загрузке объявлений: {error}
            </Typography>
        );
    }

    if (ads.length === 0) {
        return (
            <Typography color="text.secondary" sx={{ py: 2 }}>
                Объявления не найдены
            </Typography>
        );
    }

    // Функция для рендера самого списка (чтобы не дублировать код обертки)
    const renderContent = () => {
        if (viewMode === 'grid') {
            return (
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 2 }}>
                    {ads.map((item) => (
                        <Box key={item.id} onClick={() => handleCardClick(item.id)} sx={{ cursor: 'pointer', height: '100%' }}>
                            <AdCardGrid item={item} />
                        </Box>
                    ))}
                </Box>
            );
        }

        return (
            <Stack spacing={2}>
                {ads.map((item) => (
                    <Box key={item.id} onClick={() => handleCardClick(item.id)} sx={{ cursor: 'pointer' }}>
                        <AdCardRow item={item} />
                    </Box>
                ))}
            </Stack>
        );
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

            {/* 1. Блок со скроллом */}
            <Box sx={{
                flexGrow: 1,
                overflowY: 'auto',
                overflowX: 'hidden',
                pr: 1,
                mb: 2,
                '&::-webkit-scrollbar': { width: '4px' },
                '&::-webkit-scrollbar-thumb': { backgroundColor: '#848388', borderRadius: '2px' }
            }}>
                {renderContent()}
            </Box>

            {/* 2. Фиксированная пагинация внизу */}
            {totalPages > 1 && (
                <Box sx={{ flexShrink: 0, display: 'flex', justifyContent: 'flex-start', pt: 1, pb: 2 }}>
                    <StyledPagination
                        count={totalPages}
                        page={filters.page || 1}
                        onChange={handlePageChange}
                        variant="outlined"
                        shape="rounded"
                    />
                </Box>
            )}

        </Box>
    );
};
