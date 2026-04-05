import { Box, Typography, Paper, useTheme } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import type { Item } from '../../../shared/api/types';

// Форматирование меток
const formatLabel = (key: string): string => {
    const labels: Record<string, string> = {
        brand: 'Бренд',
        model: 'Модель',
        yearOfManufacture: 'Год выпуска',
        transmission: 'Коробка передач',
        mileage: 'Пробег',
        enginePower: 'Мощность двигателя',
        type: 'Тип',
        address: 'Адрес',
        area: 'Площадь',
        floor: 'Этаж',
        condition: 'Состояние',
        color: 'Цвет'
    };
    return labels[key] || key;
};

// Форматирование значений
const formatValue = (value: string | number | boolean): string => {
    if (typeof value === 'number') {
        return value.toLocaleString('ru-RU');
    }
    const valueLabels: Record<string, string> = {
        'automatic': 'Автоматическая',
        'manual': 'Механическая',
        'flat': 'Квартира',
        'house': 'Дом',
        'room': 'Комната',
        'phone': 'Телефон',
        'laptop': 'Ноутбук',
        'misc': 'Прочее',
        'new': 'Новое',
        'used': 'Б/у'
    };
    return valueLabels[String(value)] || String(value);
};

interface AdDetailsInfoProps {
    ad: Item & { needsRevision: boolean };
}

export const AdDetailsInfo = ({ ad }: AdDetailsInfoProps) => {
    const theme = useTheme();

    // Преобразование params в массив характеристик
    const characteristics = Object.entries(ad.params)
        .filter(([, value]) => value !== undefined && value !== null && value !== '')
        .map(([key, value]) => ({
            label: formatLabel(key),
            value: formatValue(value)
        }));

    return (
        <Box>
            {ad.needsRevision && ad.missingFields && ad.missingFields.length > 0 && (
                <Paper sx={{
                    px: "16px",
                    py: "12px",
                    mb: 3,
                    backgroundColor: theme.palette.mode === 'dark'
                        ? 'rgba(255, 152, 0, 0.1)'
                        : '#FDF4EB',
                    borderRadius: '12px',
                    boxShadow: 'none'
                }}>
                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                        <ErrorIcon sx={{ color: '#FF9800', mt: '2px' }} />
                        <Box>
                            <Typography sx={{ fontWeight: 600, color: theme.palette.text.primary, mb: 1 }}>
                                Требуются доработки
                            </Typography>
                            <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                                У объявления не заполнены поля:
                            </Typography>
                            <Box component="ul" sx={{ m: 0, mt: 0.5, pl: 2.5, color: theme.palette.text.primary }}>
                                {ad.missingFields.map((field) => (
                                    <li key={field}><Typography variant="body2">{field}</Typography></li>
                                ))}
                            </Box>
                        </Box>
                    </Box>
                </Paper>
            )}

            {characteristics.length > 0 && (
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: theme.palette.text.primary }}>
                        Характеристики
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: "6px" }}>
                        {characteristics.map((char) => (
                            <Box key={char.label} sx={{ display: 'flex', gap: "6px" }}>
                                <Typography variant="body1" sx={{ width: 152, flexShrink: 0, color: theme.palette.text.secondary }}>
                                    {char.label}
                                </Typography>
                                <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
                                    {char.value}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
            )}
        </Box>
    );
};
