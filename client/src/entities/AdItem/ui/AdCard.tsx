import { Box, Card, Typography, Chip } from '@mui/material';
import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined';
import { type AdItem } from '../../../shared/api/types';

const categoryLabels: Record<string, string> = {
    auto: 'Авто',
    real_estate: 'Недвижимость',
    electronics: 'Электроника',
};

interface AdCardProps {
    item: AdItem;
    viewMode: 'list' | 'grid';
}

export const AdCard = ({ item, viewMode }: AdCardProps) => {
    return (
        <Card
            sx={{
                display: 'flex',
                flexDirection: viewMode === 'list' ? 'row' : 'column',
                p: 2,
                gap: 3,
                boxShadow: 'none',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
            }}
        >
            {/* Имитация картинки */}
            <Box
                sx={{
                    width: viewMode === 'list' ? 160 : '100%',
                    height: 120,
                    backgroundColor: 'action.hover',
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'text.secondary',
                }}
            >
                <InsertPhotoOutlinedIcon fontSize="large" />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    {categoryLabels[item.category]}
                </Typography>
                <Typography variant="h6" component="h2" sx={{ fontWeight: 500, mb: 0.5 }}>
                    {item.title}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    {item.price.toLocaleString('ru-RU')} ₽
                </Typography>

                {item.needsRevision && (
                    <Box sx={{ mt: 'auto' }}>
                        <Chip
                            label="Требует доработок"
                            size="small"
                            sx={{
                                backgroundColor: 'warning.light',
                                color: 'warning.dark',
                                fontWeight: 500
                            }}
                        />
                    </Box>
                )}
            </Box>
        </Card>
    );
};
