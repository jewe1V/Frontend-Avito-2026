import { Box, Card, Typography, Chip, useTheme } from '@mui/material';
import type { AdItem } from '../../../shared/api/types';
import placeholderImage from '../../../shared/assets/placeholder.png';

const categoryLabels: Record<string, string> = {
    auto: 'Авто',
    real_estate: 'Недвижимость',
    electronics: 'Электроника',
};

export const AdCardRow = ({ item }: { item: AdItem }) => {
    const theme = useTheme();
    return (
    <Card sx={{ display: 'flex', gap: 3, boxShadow: 'none', border: `1px solid ${theme.palette.mode === 'dark' ? '#333' : '#F0F0F0'}`, borderRadius: "16px" }}>
        <Box sx={{ width: 179, height: 132, backgroundColor: 'action.hover', borderRadius: "8px" , display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
            <img alt={`Изображение ${item.title}`} src={placeholderImage} style={{ width: '100%' }} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, textAlign: 'left', marginTop: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom sx={{fontWeight: 400, fontSize: '14px'}}>
                {categoryLabels[item.category] || item.category}
            </Typography>
            <Typography color="textPrimary" sx={{ fontWeight: 400, fontFamily: "Roboto", fontSize: '16px'}}>{item.title}</Typography>
            <Typography sx={{ color: theme.palette.mode === 'dark' ? '#ccc' : '#00000073', fontSize: "16px", fontWeight: 600 }}>{item.price.toLocaleString('ru-RU')} ₽</Typography>
            {item.needsRevision && (
                <Box sx={{  }}>
                    <Chip
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: "4px" }}>
                                <span style={{fontSize: "20px"}}>•</span>
                                <span>Требует доработок</span>
                            </Box>
                        }
                        size="small"
                        sx={{ backgroundColor: theme.palette.mode === 'dark' ? '#4a3a1a' : '#F9F1E6', color: theme.palette.mode === 'dark' ? '#FFB84D' : '#FAAD14', fontWeight: 400, fontSize: "14px", fontFamily: "Roboto", borderRadius: "8px", padding: "2px 8px 2px 4px" }}
                    />
                </Box>
            )}
        </Box>
    </Card>
    );
};
