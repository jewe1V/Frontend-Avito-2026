import { Box, Skeleton, Divider, Grid, useTheme, Container } from '@mui/material';

export const AdDetailsSkeleton = () => {
    const theme = useTheme();

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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: -1.8 }}>
                    <Skeleton
                        variant="text"
                        width="30%"
                        height={50}
                        sx={{ backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.11)' : 'rgba(0, 0, 0, 0.11)' }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Skeleton
                            variant="text"
                            width={150}
                            height={50}
                            sx={{ backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.11)' : 'rgba(0, 0, 0, 0.11)' }}
                        />
                        <Skeleton
                            variant="rectangular"
                            width={30}
                            height={30}
                            sx={{ borderRadius: "8px", backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.11)' : 'rgba(0, 0, 0, 0.11)' }}
                        />
                    </Box>
                </Box>

                {/* Actions Section */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mt: 2 }}>
                    <Skeleton
                        variant="rounded"
                        width={120}
                        height={36}
                        sx={{ backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.11)' : 'rgba(0, 0, 0, 0.11)' }}
                    />
                    <Box sx={{ textAlign: 'right' }}>
                        <Skeleton
                            variant="text"
                            width={200}
                            height={20}
                            sx={{ mb: 0.5, backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.11)' : 'rgba(0, 0, 0, 0.11)' }}
                        />
                        <Skeleton
                            variant="text"
                            width={200}
                            height={20}
                            sx={{ backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.11)' : 'rgba(0, 0, 0, 0.11)' }}
                        />
                    </Box>
                </Box>
            </Box>

            <Divider sx={{ mb: 4, borderColor: theme.palette.divider }} />

            {/* Main Content Grid */}
            <Grid container spacing={5}>
                {/* Left Column - Media & Description */}
                <Grid>
                    {/* Image Placeholder */}
                    <Skeleton
                        variant="rectangular"
                        width={480}
                        height={360}
                        sx={{
                            borderRadius: "12px",
                            mb: 4,
                            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.11)' : 'rgba(0, 0, 0, 0.11)'
                        }}
                    />

                    {/* Description Title */}
                    <Skeleton
                        variant="text"
                        width={150}
                        height={28}
                        sx={{
                            mb: 2,
                            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.11)' : 'rgba(0, 0, 0, 0.11)'
                        }}
                    />

                    {/* Description Text Lines */}
                    {[...Array(4)].map((_, i) => (
                        <Skeleton
                            key={`desc-${i}`}
                            variant="text"
                            width="100%"
                            height={20}
                            sx={{
                                mb: 1,
                                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.11)' : 'rgba(0, 0, 0, 0.11)'
                            }}
                        />
                    ))}
                </Grid>

                {/* Right Column - Info & Characteristics */}
                <Grid size={{ xs: 12, md: 5 }}>
                    {/* Warning Banner Skeleton */}
                    <Box sx={{
                        p: 2,
                        mb: 3,
                        borderRadius: '12px',
                        backgroundColor: theme.palette.mode === 'dark'
                            ? 'rgba(255, 152, 0, 0.1)'
                            : '#FDF4EB',
                    }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Skeleton
                                variant="circular"
                                width={24}
                                height={24}
                                sx={{ flexShrink: 0, backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.11)' : 'rgba(0, 0, 0, 0.11)' }}
                            />
                            <Box sx={{ flex: 1 }}>
                                <Skeleton
                                    variant="text"
                                    width="80%"
                                    height={24}
                                    sx={{
                                        mb: 1,
                                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.11)' : 'rgba(0, 0, 0, 0.11)'
                                    }}
                                />
                                {[...Array(2)].map((_, i) => (
                                    <Skeleton
                                        key={`warning-${i}`}
                                        variant="text"
                                        width="90%"
                                        height={18}
                                        sx={{
                                            mb: 0.5,
                                            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.11)' : 'rgba(0, 0, 0, 0.11)'
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>
                    </Box>

                    {/* Characteristics Section */}
                    <Box>
                        {/* Title */}
                        <Skeleton
                            variant="text"
                            width={200}
                            height={28}
                            sx={{
                                mb: 3,
                                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.11)' : 'rgba(0, 0, 0, 0.11)'
                            }}
                        />

                        {/* Characteristics Items */}
                        {[...Array(5)].map((_, i) => (
                            <Box key={`char-${i}`} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                <Skeleton
                                    variant="text"
                                    width={120}
                                    height={20}
                                    sx={{ flexShrink: 0, backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.11)' : 'rgba(0, 0, 0, 0.11)' }}
                                />
                                <Skeleton
                                    variant="text"
                                    width="60%"
                                    height={20}
                                    sx={{ backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.11)' : 'rgba(0, 0, 0, 0.11)' }}
                                />
                            </Box>
                        ))}
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
};
