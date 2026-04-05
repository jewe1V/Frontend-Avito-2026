import { useState, type MouseEvent, useEffect } from 'react';
import {
    Box, Container, Typography, Button, MenuItem,
    Stack, Popover, CircularProgress, Snackbar, Alert,
    OutlinedInput, InputAdornment, IconButton, Divider, Select
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import CachedIcon from '@mui/icons-material/Cached';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useNavigate, useParams } from 'react-router-dom';
import { itemsApi } from '../../../shared/api/itemsApi';
import type { Category, ItemParams } from '../../../shared/api/types';

// --- Вспомогательный компонент для AI-попапа ---
interface AIPopoverProps {
    anchorEl: HTMLElement | null;
    onClose: () => void;
    onApply: (text: string) => void;
    isLoading: boolean;
    hasError: boolean;
    content: string;
    applyValue: string;
}

const AIPopover = ({ anchorEl, onClose, onApply, isLoading, hasError, content, applyValue }: AIPopoverProps) => (
    <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{ sx: { ml: 2, p: 2, width: 320, borderRadius: 2, boxShadow: 3 } }}
    >
        {isLoading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1 }}>
                <CircularProgress size={20} />
                <Typography variant="body2">Выполняется запрос...</Typography>
            </Box>
        ) : hasError ? (
            <Box sx={{ color: 'error.main' }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>Произошла ошибка при запросе к AI</Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>Попробуйте повторить запрос или закройте уведомление.</Typography>
                <Button size="small" variant="contained" color="error" onClick={onClose} sx={{ textTransform: 'none' }}>Закрыть</Button>
            </Box>
        ) : (
            <Box>
                <Typography variant="body2" sx={{ mb: 2, fontWeight: 500 }}>Ответ AI:</Typography>
                <Typography variant="body2" sx={{ mb: 2, whiteSpace: 'pre-line' }}>{content}</Typography>
                <Stack direction="row" spacing={1}>
                    <Button size="small" variant="contained" onClick={() => { onApply(applyValue); onClose(); }} sx={{ textTransform: 'none', bgcolor: '#1890ff' }}>
                        Применить
                    </Button>
                    <Button size="small" variant="outlined" color="inherit" onClick={onClose} sx={{ textTransform: 'none' }}>
                        Скрыть
                    </Button>
                </Stack>
            </Box>
        )}
    </Popover>
);

// --- Вспомогательные функции ---
function formatOptionLabel(value: string): string {
    const labels: Record<string, string> = {
        'automatic': 'Автоматическая',
        'manual': 'Механическая',
        'flat': 'Квартира',
        'house': 'Дом',
        'room': 'Комната',
        'phone': 'Телефон',
        'laptop': 'Ноутбук',
        'misc': 'Прочее',
        'new': 'Новое',
        'used': 'Б/У' // Обновлено под макет
    };
    return labels[value] || value;
}

// Компонент для лейблов полей формы
const CustomLabel = ({ children, required }: { children: React.ReactNode, required?: boolean }) => (
    <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#2b2b2b', mb: 1, display: 'flex', alignItems: 'center' }}>
        {required && <span style={{ color: '#ff4d4f', marginRight: '4px', fontSize: '14px' }}>*</span>}
        {children}
    </Typography>
);

// Общие стили
const inputSx = {
    borderRadius: '6px',
    backgroundColor: '#fff',
    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#D9D9D9' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#D9D9D9' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#1890ff', borderWidth: '1px' },
    '& .MuiOutlinedInput-input': { py: '9px', px: '14px', fontSize: '14px', color: '#1a1a1a' },
};

const aiButtonSx = {
    backgroundColor: '#FCF3E8',
    color: '#F49342',
    textTransform: 'none',
    borderRadius: '6px',
    boxShadow: 'none',
    fontSize: '14px',
    fontWeight: 500,
    px: 2,
    py: '9px',
    flexShrink: 0,
    '&:hover': {
        backgroundColor: '#FDE6D1',
        boxShadow: 'none',
    },
    '& .MuiButton-startIcon': {
        marginRight: '6px'
    }
};

// --- Основная страница ---
export const AdEditPage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [formData, setFormData] = useState<{
        category: Category;
        title: string;
        price: string;
        description: string;
        [key: string]: string | number | undefined;
    }>({
        category: 'electronics',
        title: '',
        price: '',
        description: '',
    });

    const [errors, setErrors] = useState<{ title?: boolean; price?: boolean }>({});
    const [aiPriceAnchor, setAiPriceAnchor] = useState<HTMLElement | null>(null);
    const [aiDescAnchor, setAiDescAnchor] = useState<HTMLElement | null>(null);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiError, setAiError] = useState(false);
    const [toast, setToast] = useState<{ open: boolean, type: 'success' | 'error', text: string }>({ open: false, type: 'success', text: '' });
    const [isLoading, setIsLoading] = useState(!!id);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!id) return;
        const fetchAd = async () => {
            try {
                const response = await itemsApi.getItem(id);
                setFormData({
                    category: response.category,
                    title: response.title,
                    price: response.price.toString(),
                    description: response.description || '',
                    ...response.params,
                });
            } catch {
                setToast({ open: true, type: 'error', text: 'Ошибка при загрузке объявления' });
            } finally {
                setIsLoading(false);
            }
        };
        fetchAd();
    }, [id]);

    const getParamFields = () => {
        const baseParams = ['brand', 'model'];
        switch (formData.category) {
            case 'auto': return [...baseParams, 'yearOfManufacture', 'transmission', 'mileage', 'enginePower'];
            case 'real_estate': return ['type', 'address', 'area', 'floor'];
            case 'electronics': return [...baseParams, 'type', 'condition', 'color'];
            default: return [];
        }
    };

    const getParamLabel = (param: string): string => {
        const labels: Record<string, string> = {
            brand: 'Бренд', model: 'Модель', yearOfManufacture: 'Год выпуска', transmission: 'Коробка передач',
            mileage: 'Пробег (км)', enginePower: 'Мощность двигателя (л.с.)', type: 'Тип', address: 'Адрес',
            area: 'Площадь (м²)', floor: 'Этаж', condition: 'Состояние', color: 'Цвет'
        };
        return labels[param] || param;
    };

    const getParamInputType = (param: string): string => {
        return ['yearOfManufacture', 'mileage', 'enginePower', 'area', 'floor'].includes(param) ? 'number' : 'text';
    };

    const getParamOptions = (param: string): string[] | null => {
        const options: Record<string, string[]> = {
            transmission: ['automatic', 'manual'],
            type: formData.category === 'real_estate' ? ['flat', 'house', 'room'] : ['phone', 'laptop', 'misc'],
            condition: ['new', 'used'],
        };
        return options[param] || null;
    };

    const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
        if (errors[field as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [field]: false }));
        }
    };

    const handleClear = (field: string) => {
        setFormData(prev => ({ ...prev, [field]: '' }));
        if (errors[field as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [field]: false }));
        }
    };

    const renderClearButton = (field: string, value: any) => {
        if (!value) return null;
        return (
            <InputAdornment position="end">
                <IconButton size="small" onClick={() => handleClear(field)} edge="end" sx={{ p: '2px', mr: '-2px' }}>
                    <CancelIcon sx={{ color: '#c2c2c2', fontSize: 18 }} />
                </IconButton>
            </InputAdornment>
        );
    };

    const handleAiRequest = (setter: React.Dispatch<React.SetStateAction<HTMLElement | null>>, event: MouseEvent<HTMLElement>) => {
        setter(event.currentTarget);
        setIsAiLoading(true);
        setAiError(false);
        setTimeout(() => setIsAiLoading(false), 1500);
    };

    const buildParams = (): ItemParams => {
        const paramFields = getParamFields();
        const params: Record<string, string | number | undefined> = {};
        paramFields.forEach(field => {
            if (formData[field] !== undefined && formData[field] !== '') {
                const value = formData[field];
                if (['yearOfManufacture', 'mileage', 'enginePower', 'area', 'floor'].includes(field)) {
                    params[field] = isNaN(Number(value)) ? undefined : Number(value);
                } else {
                    params[field] = value;
                }
            }
        });
        return params as ItemParams;
    };

    const handleSave = async () => {
        const newErrors = { title: !formData.title.trim(), price: !String(formData.price).trim() };
        if (newErrors.title || newErrors.price) {
            setErrors(newErrors);
            setToast({ open: true, type: 'error', text: 'Ошибка сохранения: заполните обязательные поля' });
            return;
        }

        try {
            setIsSaving(true);
            const data = {
                category: formData.category, title: formData.title,
                description: formData.description || undefined, price: Number(formData.price),
                params: buildParams(),
            };

            if (id) await itemsApi.updateItem(id, data);

            setToast({ open: true, type: 'success', text: 'Изменения сохранены' });
            setTimeout(() => navigate('/'), 1500);
        } catch (error) {
            setToast({ open: true, type: 'error', text: error instanceof Error ? error.message : 'Ошибка при сохранении' });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <Container maxWidth={false} sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress />
            </Container>
        );
    }

    const paramFields = getParamFields();

    return (
        <Box sx={{ bgcolor: '#ffffff', minHeight: '100vh', py: 5 }}>
            <Container maxWidth={false} sx={{ maxWidth: '1399px', mx: 'auto', px: { xs: 2, md: 5 }, fontFamily: 'Inter, sans-serif' }}>

                <Box sx={{ maxWidth: '456px' }}>
                    <Typography variant="h4" sx={{ fontWeight: 500, mb: 4, color: '#000000D9', fontSize: '30px', fontFamily: 'Roboto', LineHeight: '40px' }}>
                        Редактирование объявления
                    </Typography>

                    {/* Категория */}
                    <Box sx={{ mb: 2}}>
                        <CustomLabel>Категория</CustomLabel>
                        <Select
                            fullWidth
                            size="small"
                            value={formData.category}
                            onChange={(e) => handleChange('category')({ target: { value: e.target.value } } as any)}
                            IconComponent={KeyboardArrowDownIcon}
                            sx={inputSx}
                        >
                            <MenuItem value="electronics">Электроника</MenuItem>
                            <MenuItem value="auto">Авто</MenuItem>
                            <MenuItem value="real_estate">Недвижимость</MenuItem>
                        </Select>
                    </Box>

                    <Divider sx={{ my: 4, borderColor: '#f2f2f2' }} />

                    {/* Название */}
                    <Box sx={{ mb: 3 }}>
                        <CustomLabel required>Название</CustomLabel>
                        <OutlinedInput
                            fullWidth
                            size="small"
                            value={formData.title}
                            onChange={handleChange('title')}
                            error={errors.title}
                            endAdornment={renderClearButton('title', formData.title)}
                            sx={inputSx}
                        />
                    </Box>

                    {/* Цена */}
                    <Box sx={{ mb: 3 }}>
                        <CustomLabel required>Цена</CustomLabel>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                            <OutlinedInput
                                fullWidth
                                size="small"
                                type="number"
                                value={formData.price}
                                onChange={handleChange('price')}
                                error={errors.price}
                                endAdornment={renderClearButton('price', formData.price)}
                                sx={inputSx}
                            />
                            <Button
                                variant="contained"
                                startIcon={<CachedIcon sx={{ fontSize: '18px !important' }} />}
                                onClick={(e) => handleAiRequest(setAiPriceAnchor, e)}
                                sx={aiButtonSx}
                            >
                                Повторить запрос
                            </Button>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 4, borderColor: '#f2f2f2' }} />

                    {/* Характеристики */}
                    {paramFields.length > 0 && (
                        <Box sx={{ mb: 3 }}>
                            <Typography sx={{ mb: 3, fontWeight: 700, color: '#2b2b2b', fontSize: '16px' }}>
                                Характеристики
                            </Typography>
                            <Stack spacing={3}>
                                {paramFields.map(field => {
                                    const options = getParamOptions(field);
                                    const isRequired = field === 'type'; // В макете у 'Тип' стоит звездочка

                                    return (
                                        <Box key={field}>
                                            <CustomLabel required={isRequired}>{getParamLabel(field)}</CustomLabel>
                                            {options ? (
                                                <Select
                                                    fullWidth
                                                    size="small"
                                                    displayEmpty
                                                    value={formData[field] || ''}
                                                    onChange={(e) => handleChange(field)({ target: { value: e.target.value } } as any)}
                                                    IconComponent={KeyboardArrowDownIcon}
                                                    sx={inputSx}
                                                >
                                                    {options.map(opt => (
                                                        <MenuItem key={opt} value={opt}>{formatOptionLabel(opt)}</MenuItem>
                                                    ))}
                                                </Select>
                                            ) : (
                                                <OutlinedInput
                                                    fullWidth
                                                    size="small"
                                                    type={getParamInputType(field)}
                                                    value={formData[field] || ''}
                                                    onChange={handleChange(field)}
                                                    endAdornment={field !== 'condition' ? renderClearButton(field, formData[field]) : null}
                                                    sx={inputSx}
                                                />
                                            )}
                                        </Box>
                                    );
                                })}
                            </Stack>
                        </Box>
                    )}

                    <Divider sx={{ my: 4, borderColor: '#f2f2f2' }} />

                    {/* Описание */}
                    <Box sx={{ mb: 4 }}>
                        <Typography sx={{ mb: 2, fontWeight: 700, color: '#2b2b2b', fontSize: '16px' }}>
                            Описание
                        </Typography>
                        <OutlinedInput
                            fullWidth
                            multiline
                            rows={4}
                            value={formData.description}
                            onChange={handleChange('description')}
                            sx={{
                                ...inputSx,
                                padding: 0,
                                '& .MuiOutlinedInput-input': { padding: '12px 14px', resize: 'vertical' }
                            }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mt: 1.5 }}>
                            <Button
                                variant="contained"
                                startIcon={<LightbulbOutlinedIcon sx={{ fontSize: '18px !important' }} />}
                                onClick={(e) => handleAiRequest(setAiDescAnchor, e)}
                                sx={aiButtonSx}
                            >
                                Придумать описание
                            </Button>
                            <Typography sx={{ fontSize: '13px', color: '#b3b3b3', mt: 0.5 }}>
                                {formData.description?.length || 0} / 1000
                            </Typography>
                        </Box>
                    </Box>

                    {/* Кнопки действий */}
                    <Stack direction="row" spacing={2} sx={{ pt: 2, pb: 4 }}>
                        <Button
                            variant="contained"
                            onClick={handleSave}
                            disabled={isSaving}
                            sx={{
                                bgcolor: '#1677ff', color: '#fff', textTransform: 'none',
                                borderRadius: '6px', px: 3, py: 1, fontSize: '15px',
                                fontWeight: 500, boxShadow: 'none',
                                '&:hover': { bgcolor: '#0958d9', boxShadow: 'none' }
                            }}
                        >
                            {isSaving ? <CircularProgress size={24} color="inherit" /> : 'Сохранить'}
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => navigate('/')}
                            disabled={isSaving}
                            sx={{
                                bgcolor: '#dbdbdb', color: '#4a4a4a', textTransform: 'none',
                                borderRadius: '6px', px: 3, py: 1, fontSize: '15px',
                                fontWeight: 500, boxShadow: 'none',
                                '&:hover': { bgcolor: '#c4c4c4', boxShadow: 'none' }
                            }}
                        >
                            Отменить
                        </Button>
                    </Stack>
                </Box>
            </Container>

            <AIPopover
                anchorEl={aiPriceAnchor}
                onClose={() => setAiPriceAnchor(null)}
                isLoading={isAiLoading}
                hasError={aiError}
                content="Средняя цена:\n• 100 000 — 120 000 ₽ — хорошее состояние\n• От 130 000 ₽ — отличное"
                applyValue="115000"
                onApply={(val) => setFormData(p => ({ ...p, price: val }))}
            />

            <AIPopover
                anchorEl={aiDescAnchor}
                onClose={() => setAiDescAnchor(null)}
                isLoading={isAiLoading}
                hasError={aiError}
                content="Продаю качественный товар. Состояние отличное, все работает без проблем. Торг возможен. Скидки при покупке нескольких товаров."
                applyValue="Продаю качественный товар. Состояние отличное, все работает без проблем. Торг возможен."
                onApply={(val) => setFormData(p => ({ ...p, description: val }))}
            />

            <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast({ ...toast, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <Alert severity={toast.type} variant="filled" sx={{ width: '100%' }}>{toast.text}</Alert>
            </Snackbar>
        </Box>
    );
};
