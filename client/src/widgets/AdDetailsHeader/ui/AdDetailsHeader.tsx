import { Box, Typography, IconButton, useTheme } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useAdsStore } from '../../../entities/ad/model/useAdsStore';

interface AdDetailsHeaderProps {
    title: string;
    price: number;
}

export const AdDetailsHeader = ({ title, price }: AdDetailsHeaderProps) => {
    const theme = useTheme();
    const isDarkMode = useAdsStore((state) => state.isDarkMode);
    const toggleDarkMode = useAdsStore((state) => state.toggleDarkMode);

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography sx={{ fontWeight: 500, color: theme.palette.text.primary, lineHeight: "40px", fontSize: "30px", fontFamily: "Roboto" }}>
                {title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ fontWeight: 500, color: theme.palette.text.primary, lineHeight: "40px", fontSize: "30px", fontFamily: "Roboto" }}>
                    {price.toLocaleString('ru-RU')} ₽
                </Typography>
                <IconButton
                    onClick={toggleDarkMode}
                    sx={{
                        color: theme.palette.text.primary,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: '8px',
                        padding: '4px',
                        lineHeight: "40px",
                        '&:hover': {
                            backgroundColor: theme.palette.action.hover,
                        }
                    }}
                >
                    {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
            </Box>
        </Box>
    );
};
