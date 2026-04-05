import { Box, Typography, useTheme } from '@mui/material';

interface AdDetailsHeaderProps {
    title: string;
    price: number;
}

export const AdDetailsHeader = ({ title, price }: AdDetailsHeaderProps) => {
    const theme = useTheme();

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography sx={{ fontWeight: 500, color: theme.palette.text.primary, lineHeight: "40px", fontSize: "30px", fontFamily: "Roboto" }}>
                {title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ fontWeight: 500, color: theme.palette.text.primary, lineHeight: "40px", fontSize: "30px", fontFamily: "Roboto" }}>
                    {price.toLocaleString('ru-RU')} ₽
                </Typography>
            </Box>
        </Box>
    );
};
