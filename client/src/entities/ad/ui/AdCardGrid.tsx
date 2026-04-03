import { Box, Card, Typography, Chip } from '@mui/material';
import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined';
import type { AdItem } from '../../../shared/api/types';

export const AdCardGrid = ({ item }: { item: AdItem }) => (
    <Card sx={{ display: 'flex', flexDirection: 'column', p: 2, gap: 2, boxShadow: 'none', border: '1px solid', borderColor: 'divider', borderRadius: 2, height: '100%' }}>
        <Box sx={{ width: '100%', height: 160, backgroundColor: 'action.hover', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary',cursor: 'pointer', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
            <InsertPhotoOutlinedIcon fontSize="large" />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
                {item.category}
            </Typography>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 500, mb: 0.5, color: 'text.primary' }}>{item.title}</Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>{item.price.toLocaleString('ru-RU')} ₽</Typography>
            {item.needsRevision && (
                <Box sx={{ mt: 'auto', pt: 2 }}>
                    <Chip label="Требует доработок" size="small" sx={{ backgroundColor: 'warning.light', color: 'warning.dark', fontWeight: 500 }} />
                </Box>
            )}
        </Box>
    </Card>
);
