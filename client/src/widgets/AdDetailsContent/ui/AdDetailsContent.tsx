import {Box, Paper, Typography, useTheme, Grid} from '@mui/material';
import type { Item } from '../../../shared/api/types';
import placeholder from "../../../shared/assets/placeholder.png";
import {formatLabel, formatValue} from "../../../utils.ts";
import ErrorIcon from "@mui/icons-material/Error";

interface AdDetailsContentProps {
    ad: Item & { needsRevision: boolean };
}

export const AdDetailsContent = ({ ad }: AdDetailsContentProps) => {
    const theme = useTheme();

    const characteristics = Object.entries(ad.params)
        .filter(([, value]) => value !== undefined && value !== null && value !== '')
        .map(([key, value]) => ({
            label: formatLabel(key),
            value: formatValue(value)
        }));

    return (
        <Grid container spacing={5} alignItems="flex-start">
            <Grid size={{ xs: 12, md: 7 }}>
                <Box sx={{
                    width: '100%',
                    maxWidth: '800px',
                    height: 'auto',
                    aspectRatio: '4/3',
                    backgroundColor: theme.palette.action.hover,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '12px',
                    mb: 4,
                    overflow: 'hidden'
                }}>
                    <img src={placeholder} alt="placeholder" style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: theme.palette.mode === 'dark' ? 'invert(1)' : 'none'
                    }} />
                </Box>
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: theme.palette.text.primary }}>
                        Описание
                    </Typography>
                    {ad.description ? (
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-line', color: theme.palette.text.primary, lineHeight: 1.6 }}>
                            {ad.description}
                        </Typography>
                    ) : (
                        <Typography variant="body1" sx={{ color: theme.palette.text.secondary, fontStyle: 'italic' }}>
                            Отсутствует
                        </Typography>
                    )}
                </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
                <Box sx={{ maxWidth: '400px' }}>
                    {ad.needsRevision && ad.missingFields && ad.missingFields.length > 0 && (
                        <Paper sx={{
                            px: "20px",
                            py: "16px",
                            mb: 4,
                            backgroundColor: theme.palette.mode === 'dark'
                                ? 'rgba(255, 152, 0, 0.1)'
                                : '#FDF4EB',
                            borderRadius: '12px',
                            boxShadow: 'none',
                            border: theme.palette.mode === 'dark' ? '1px solid rgba(255, 152, 0, 0.2)' : 'none'
                        }}>
                            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                                <ErrorIcon sx={{ color: '#FF9800', fontSize: '20px', mt: '3px' }} />
                                <Box>
                                    <Typography sx={{ fontWeight: 600, color: theme.palette.text.primary, mb: 0.5 }}>
                                        Требуются доработки
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: theme.palette.text.primary, mb: 0.5 }}>
                                        У объявления не заполнены поля:
                                    </Typography>
                                    <Box component="ul" sx={{ m: 0, pl: 2, color: theme.palette.text.primary }}>
                                        {ad.missingFields.map((field) => (
                                            <li key={field}>
                                                <Typography variant="body2">{field}</Typography>
                                            </li>
                                        ))}
                                    </Box>
                                </Box>
                            </Box>
                        </Paper>
                    )}

                    {characteristics.length > 0 && (
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: theme.palette.text.primary }}>
                                Характеристики
                            </Typography>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: "12px" }}>
                                {characteristics.map((char) => (
                                    <Box key={char.label} sx={{ display: 'flex', alignItems: 'baseline' }}>
                                        <Typography variant="body1" sx={{ width: 140, flexShrink: 0, color: theme.palette.text.secondary }}>
                                            {char.label}
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>
                                            {char.value}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    )}
                </Box>
            </Grid>
        </Grid>
    );
};
