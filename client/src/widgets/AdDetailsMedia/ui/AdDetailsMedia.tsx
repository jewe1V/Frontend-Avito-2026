import { Box, Typography, useTheme } from '@mui/material';
import placeholder from '../../../shared/assets/placeholder.png';

interface AdDetailsMediaProps {
    description?: string;
}

export const AdDetailsMedia = ({ description }: AdDetailsMediaProps) => {
    const theme = useTheme();

    return (
        <Box>
            <Box sx={{
                width: '480px',
                height: '360px',
                backgroundColor: theme.palette.action.hover,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '12px',
                mb: 4
            }}>
                <img src={placeholder} alt="placeholder" style={{
                    width: '100%',
                    filter: theme.palette.mode === 'dark' ? 'invert(1)' : 'none'
                }} />
            </Box>

            <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: theme.palette.text.primary }}>
                    Описание
                </Typography>
                {description ? (
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-line', color: theme.palette.text.primary, lineHeight: 1.6 }}>
                        {description}
                    </Typography>
                ) : (
                    <Typography variant="body1" sx={{ color: theme.palette.text.secondary, fontStyle: 'italic' }}>
                        Отсутствует
                    </Typography>
                )}
            </Box>
        </Box>
    );
};
