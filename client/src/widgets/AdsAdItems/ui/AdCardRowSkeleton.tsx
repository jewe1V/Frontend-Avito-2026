import { Box, Card, Skeleton, useTheme } from '@mui/material';

export const AdCardRowSkeleton = () => {
    const theme = useTheme();

    return (
        <Card sx={{
            display: 'flex',
            gap: 3,
            boxShadow: 'none',
            border: `1px solid ${theme.palette.mode === 'dark' ? '#333' : '#F0F0F0'}`,
            borderRadius: "16px",
            height: 132
        }}>
            <Skeleton
                variant="rectangular"
                sx={{
                    width: 179,
                    height: 132,
                    borderRadius: "8px",
                    flexShrink: 0
                }}
            />

            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, marginTop: 2, pb: 2 }}>
                <Skeleton variant="text" width={100} sx={{ fontSize: '14px', mb: 0.5 }} />
                <Skeleton variant="text" width="40%" sx={{ fontSize: '16px', mb: 0.5 }} />
                <Skeleton variant="text" width={120} sx={{ fontSize: '16px'}} />
            </Box>
        </Card>
    );
};
