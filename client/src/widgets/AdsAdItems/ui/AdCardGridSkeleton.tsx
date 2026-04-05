import { Box, Card, Skeleton, useTheme } from '@mui/material';

export const AdCardGridSkeleton = () => {
    const theme = useTheme();

    return (
        <Card sx={{
            width: "200px",
            height: "268px",
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'none',
            border: `1px solid ${theme.palette.mode === 'dark' ? '#333' : '#F0F0F0'}`,
            borderRadius: "16px",
            overflow: 'hidden'
        }}>
            <Skeleton
                variant="rectangular"
                width="100%"
                height="150px"
                sx={{ flexShrink: 0 }}
            />

            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                padding: "0 16px 12px 16px",
                position: 'relative'
            }}>
                <Box sx={{ mt: 2 }}>
                    <Skeleton variant="text" width="90%" sx={{ fontSize: '15px', mb: -1 }} />
                    <Skeleton variant="text" width="60%" sx={{ fontSize: '15px' }} />
                </Box>
                <Skeleton variant="text" width="40%" sx={{ fontSize: '16px' }} />

                <Box sx={{ marginTop: 'auto', pt: 0.5 }}>
                    <Skeleton
                        variant="rectangular"
                        width={130}
                        height={24}
                        sx={{ borderRadius: "6px" }}
                    />
                </Box>
            </Box>
        </Card>
    );
};
