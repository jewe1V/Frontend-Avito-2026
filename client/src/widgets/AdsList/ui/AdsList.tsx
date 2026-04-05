import { Stack, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAdsStore } from '../../../entities/ad/model/useAdsStore';
import { AdCardRow } from '../../AdsAdItems/ui/AdCardRow';
import { AdCardGrid } from '../../AdsAdItems/ui/AdCardGrid';
import {AdCardGridSkeleton} from "../../AdsAdItems/ui/AdCardGridSkeleton.tsx";
import {AdCardRowSkeleton} from "../../AdsAdItems/ui/AdCardRowSkeleton.tsx";
import {AdsPagination} from "../../AdsPagination";

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

    const limit = filters.limit || 10;
    const totalPages = Math.ceil(total / limit);

    if (error) {
        return (
            <Typography color="error" sx={{ py: 2 }}>
                Ошибка при загрузке объявлений: {error}
            </Typography>
        );
    }

    const renderContent = () => {
        if (loading) {
            const skeletons = Array.from(new Array(limit));

            if (viewMode === 'grid') {
                return (
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, 1fr)',
                            md: 'repeat(3, 1fr)',
                            lg: 'repeat(4, 1fr)',
                            xl: 'repeat(5, 1fr)'
                        },
                        gap: 2
                    }}>
                        {skeletons.map((_, index) => <AdCardGridSkeleton key={index} />)}
                    </Box>
                );
            }

            return (
                <Stack spacing={2}>
                    {skeletons.map((_, index) => <AdCardRowSkeleton key={index} />)}
                </Stack>
            );
        }

        if (ads.length === 0) {
            return (
                <Typography color="text.secondary" sx={{ py: 2 }}>
                    Объявления не найдены
                </Typography>
            );
        }

        if (viewMode === 'grid') {
            return (
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)',
                        lg: 'repeat(4, 1fr)',
                        xl: 'repeat(5, 1fr)'
                    },
                    gap: 2
                }}>
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

            {totalPages > 1 && (
                <Box sx={{ flexShrink: 0, display: 'flex', justifyContent: 'flex-start', pt: 1, pb: 2 }}>
                    <AdsPagination
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
