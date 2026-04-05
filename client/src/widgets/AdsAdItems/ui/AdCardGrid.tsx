import { Box, Card, Typography, Chip, useTheme } from '@mui/material';
import placeholderImage from '../../../shared/assets/placeholder.png';
import type { AdItem } from '../../../shared/api/types';
import {categoryLabels} from "../../../consts.ts";

export const AdCardGrid = ({ item }: { item: AdItem }) => {
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

            <Box sx={{
                width: "100%",
                height: "150px",
                backgroundColor: 'action.hover',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
            }}>
                <img alt={`Изображение ${item.title}`} src={placeholderImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </Box>

            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                textAlign: 'left',
                padding: "0 16px 12px 16px",
                position: 'relative'
            }}>

                <Typography sx={{
                    width: 'fit-content',
                    marginTop: "-10px",
                    padding: "0 12px",
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.mode === 'dark' ? '#555' : '#D9D9D9'}`,
                    borderRadius: "6px",
                    fontSize: "12px",
                    zIndex: 1
                }} color="text.secondary">
                    {categoryLabels[item.category] || item.category}
                </Typography>

                <Typography color="textPrimary" sx={{ fontWeight: 400, fontSize: '15px', mt: 1, lineHeight: 1.1, display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis' }}>
                    {item.title}
                </Typography>

                <Typography sx={{ color: theme.palette.mode === 'dark' ? '#ccc' : '#00000073', fontSize: "16px", fontWeight: 600, mt: 0.5 }}>
                    {item.price.toLocaleString('ru-RU')} ₽
                </Typography>

                {/* Блок с чипом, прижатый к низу */}
                {item.needsRevision && (
                    <Box sx={{ marginTop: 'auto', pt: 0.5 }}>
                        <Chip
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: "4px" }}>
                                    <span style={{ fontSize: "18px", lineHeight: 0 }}>•</span>
                                    <span>Требует доработок</span>
                                </Box>
                            }
                            size="small"
                            sx={{
                                backgroundColor: theme.palette.mode === 'dark' ? '#4a3a1a' : '#F9F1E6',
                                color: theme.palette.mode === 'dark' ? '#FFB84D' : '#FAAD14',
                                fontWeight: 400,
                                fontSize: "12px",
                                borderRadius: "6px",
                                height: '24px',
                                '& .MuiChip-label': { px: '8px' }
                            }}
                        />
                    </Box>
                )}
            </Box>
        </Card>
    );
};
