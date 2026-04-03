import { Box, Card, Typography, Chip } from '@mui/material';
import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined';
import type { AdItem } from '../../../shared/api/types';

export const AdCardRow = ({ item }: { item: AdItem }) => (
    <Card sx={{ display: 'flex', p: 2, gap: 3, boxShadow: 'none', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Box sx={{ width: 160, height: 120, backgroundColor: 'action.hover', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
            <InsertPhotoOutlinedIcon fontSize="large" />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
                {item.category}
            </Typography>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 500, mb: 0.5 }}>{item.title}</Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>{item.price.toLocaleString('ru-RU')} ₽</Typography>
            {item.needsRevision && (
                <Box sx={{ mt: 'auto' }}>
                    <Chip label="Требует доработок" size="small" sx={{ backgroundColor: 'warning.light', color: 'warning.dark', fontWeight: 500 }} />
                </Box>
            )}
        </Box>
    </Card>
);
