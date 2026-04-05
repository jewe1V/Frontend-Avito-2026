import { Box, Container, Skeleton, Stack, Divider, useTheme } from '@mui/material';

export const AdEditSkeleton = () => {
    const theme = useTheme();

    return (
        <Box sx={{ bgcolor: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.background.default, minHeight: '100vh', py: 2 }}>
            <Container maxWidth={false} sx={{ maxWidth: '1399px', mx: 'auto', px: 2, fontFamily: 'Inter, sans-serif' }}>
                <Box>
                    {/* Заголовок */}
                    <Skeleton variant="text" width="300px" height={40} sx={{ mb: 2.5 }} />

                    {/* Категория */}
                    <Box sx={{ mb: 2 }}>
                        <Skeleton variant="text" width="80px" height={20} sx={{ mb: 1 }} />
                        <Skeleton variant="rounded" width="100%" height={32} sx={{ maxWidth: '456px', borderRadius: '6px' }} />
                    </Box>

                    <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />

                    {/* Название */}
                    <Box sx={{ mt: -1, mb: 2 }}>
                        <Skeleton variant="text" width="100px" height={20} sx={{ mb: 1 }} />
                        <Skeleton variant="rounded" width="100%" height={32} sx={{ maxWidth: '456px', borderRadius: '6px' }} />
                    </Box>

                    <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />

                    {/* Цена */}
                    <Box sx={{ mt: -1, mb: 2 }}>
                        <Skeleton variant="text" width="80px" height={20} sx={{ mb: 1 }} />
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                            <Skeleton variant="rounded" width="100%" height={32} sx={{ maxWidth: '456px', borderRadius: '6px' }} />
                            <Skeleton variant="rounded" width="252px" height={34} sx={{ flexShrink: 0, borderRadius: '8px' }} />
                        </Box>
                    </Box>

                    <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />

                    {/* Характеристики */}
                    <Box sx={{ mt: 1, mb: 2 }}>
                        <Skeleton variant="text" width="150px" height={24} sx={{ mb: 1 }} />
                        <Stack spacing={2}>
                            {[1, 2, 3, 4, 5].map((index) => (
                                <Box key={index}>
                                    <Skeleton variant="text" width="120px" height={18} sx={{ mb: 0.8 }} />
                                    <Skeleton variant="rounded" width="100%" height={32} sx={{ maxWidth: '456px', borderRadius: '6px' }} />
                                </Box>
                            ))}
                        </Stack>
                    </Box>

                    <Divider sx={{ my: 2.5, borderColor: theme.palette.divider }} />

                    {/* Описание */}
                    <Box sx={{ mt: 2, maxWidth: '942px', mb: 2 }}>
                        <Skeleton variant="text" width="120px" height={24} sx={{ mb: 1 }} />
                        <Skeleton variant="rounded" width="100%" height={32} sx={{ borderRadius: '6px', mb: 1.5 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Skeleton variant="rounded" width="204px" height={34} sx={{ borderRadius: '8px' }} />
                            <Skeleton variant="text" width="80px" height={20} />
                        </Box>
                    </Box>

                    {/* Кнопки действий */}
                    <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                        <Skeleton variant="rounded" width="120px" height={40} sx={{ borderRadius: '6px' }} />
                        <Skeleton variant="rounded" width="120px" height={40} sx={{ borderRadius: '6px' }} />
                    </Stack>
                </Box>
            </Container>
        </Box>
    );
};
