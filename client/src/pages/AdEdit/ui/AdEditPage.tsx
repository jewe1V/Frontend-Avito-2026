import { useState, type MouseEvent } from 'react';
import {
    Box, Container, Typography, TextField, Button, MenuItem,
    Stack, Popover, CircularProgress, Snackbar, Alert, Paper
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useNavigate } from 'react-router-dom';

// --- Вспомогательный компонент для AI-попапа (в идеале вынести в features/ai-assistant) ---
interface AIPopoverProps {
    anchorEl: HTMLElement | null;
    onClose: () => void;
    onApply: (text: string) => void;
    isLoading: boolean;
    hasError: boolean;
    content: string;
    applyValue: string; // Значение, которое подставится при клике "Применить"
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
                    <Button size="small" variant="contained" onClick={() => { onApply(applyValue); onClose(); }} sx={{ textTransform: 'none' }}>
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

// --- Основная страница ---
export const AdEditPage = () => {
    const navigate = useNavigate();

    // Состояние формы
    const [formData, setFormData] = useState({
        category: 'electronics',
        title: 'MacBook Pro 16"',
        price: '',
        type: 'Ноутбук',
        brand: 'Apple',
        model: 'M1 Pro',
        color: '',
        condition: '',
        description: 'Продаю свой MacBook Pro 16" (2021) на чипе M1 Pro. Состояние отличное, работал бережно. Мощности хватает на всё: от сложного монтажа до кода, при этом ноутбук почти не греется.'
    });

    // Состояние валидации (красные ошибки блокируют сохранение)
    const [errors, setErrors] = useState<{ title?: boolean; price?: boolean }>({});

    // Состояние доработок (оранжевые предупреждения не блокируют сохранение)
    // В реальном приложении придет с бека. Имитируем макет: цвет и состояние пустые
    const fieldsNeedingRevision = ['color', 'condition'];

    // Состояния AI
    const [aiPriceAnchor, setAiPriceAnchor] = useState<HTMLElement | null>(null);
    const [aiDescAnchor, setAiDescAnchor] = useState<HTMLElement | null>(null);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiError, setAiError] = useState(false);

    // Состояние уведомлений (Toast)
    const [toast, setToast] = useState<{ open: boolean, type: 'success' | 'error', text: string }>({ open: false, type: 'success', text: '' });

    // Обработчик изменения полей
    const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
        if (errors[field as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [field]: false }));
        }
    };

    // Имитация запроса к AI
    const handleAiRequest = (setter: React.Dispatch<React.SetStateAction<HTMLElement | null>>, event: MouseEvent<HTMLElement>, shouldFail = false) => {
        setter(event.currentTarget);
        setIsAiLoading(true);
        setAiError(false);
        setTimeout(() => {
            setIsAiLoading(false);
            if (shouldFail) setAiError(true);
        }, 1500);
    };

    // Сохранение формы
    const handleSave = () => {
        const newErrors = {
            title: !formData.title.trim(),
            price: !formData.price.trim(), // Допустим, цена тоже обязательна
        };

        if (newErrors.title || newErrors.price) {
            setErrors(newErrors);
            setToast({ open: true, type: 'error', text: 'Ошибка сохранения: заполните обязательные поля' });
            return;
        }

        // Если всё ок
        setToast({ open: true, type: 'success', text: 'Изменения сохранены' });
        setTimeout(() => navigate('/'), 1500); // Редирект после успеха
    };

    // Вспомогательная функция для подсветки полей "К доработке"
    const getWarningProps = (fieldName: string) => {
        const isWarning = fieldsNeedingRevision.includes(fieldName) && !formData[fieldName as keyof typeof formData];
        return isWarning ? {
            color: 'warning' as const,
            focused: true, // Принудительно держим фокус для оранжевой рамки из макета
            sx: { '& .MuiOutlinedInput-root': { backgroundColor: '#fff4e5' } }
        } : {};
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 4 }}>Редактирование объявления</Typography>

            <Paper sx={{ p: 4, borderRadius: 2, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                <Stack spacing={4}>

                    {/* Категория */}
                    <TextField
                        select fullWidth label="Категория"
                        value={formData.category} onChange={handleChange('category')}
                    >
                        <MenuItem value="electronics">Электроника</MenuItem>
                        <MenuItem value="auto">Авто</MenuItem>
                        <MenuItem value="real_estate">Недвижимость</MenuItem>
                    </TextField>

                    {/* Название (Обязательное) */}
                    <TextField
                        fullWidth label="Название *"
                        value={formData.title} onChange={handleChange('title')}
                        error={errors.title}
                        helperText={errors.title ? 'Название не может быть пустым' : ''}
                    />

                    {/* Цена + AI */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <TextField
                            fullWidth label="Цена *" type="number"
                            value={formData.price} onChange={handleChange('price')}
                            error={errors.price}
                        />
                        <Button
                            variant="contained" color="warning"
                            startIcon={<AutoAwesomeIcon />}
                            onClick={(e) => handleAiRequest(setAiPriceAnchor, e)}
                            sx={{ flexShrink: 0, height: 56, textTransform: 'none', backgroundColor: '#fff3e0', color: '#e65100', '&:hover': { backgroundColor: '#ffe0b2' }, boxShadow: 'none' }}
                        >
                            Узнать рыночную цену
                        </Button>
                    </Box>

                    {/* Характеристики */}
                    <Box>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Характеристики</Typography>
                        <Stack spacing={3}>
                            <TextField fullWidth label="Тип" value={formData.type} onChange={handleChange('type')} />
                            <TextField fullWidth label="Бренд" value={formData.brand} onChange={handleChange('brand')} />
                            <TextField fullWidth label="Модель" value={formData.model} onChange={handleChange('model')} />

                            {/* Поля с предупреждениями (требуют доработки) */}
                            <TextField
                                fullWidth label="Цвет"
                                value={formData.color} onChange={handleChange('color')}
                                {...getWarningProps('color')}
                            />
                            <TextField
                                fullWidth label="Состояние"
                                value={formData.condition} onChange={handleChange('condition')}
                                {...getWarningProps('condition')}
                            />
                        </Stack>
                    </Box>

                    {/* Описание + AI */}
                    <Box>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Описание</Typography>
                        <TextField
                            fullWidth multiline rows={6}
                            value={formData.description} onChange={handleChange('description')}
                            sx={{ mb: 2 }}
                        />
                        <Button
                            variant="contained" color="warning"
                            startIcon={<AutoAwesomeIcon />}
                            onClick={(e) => handleAiRequest(setAiDescAnchor, e)}
                            sx={{ textTransform: 'none', backgroundColor: '#fff3e0', color: '#e65100', '&:hover': { backgroundColor: '#ffe0b2' }, boxShadow: 'none' }}
                        >
                            Улучшить описание
                        </Button>
                    </Box>

                    {/* Кнопки действий */}
                    <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
                        <Button variant="contained" size="large" onClick={handleSave} sx={{ textTransform: 'none', px: 4 }}>
                            Сохранить
                        </Button>
                        <Button variant="outlined" size="large" color="inherit" onClick={() => navigate('/')} sx={{ textTransform: 'none', px: 4 }}>
                            Отменить
                        </Button>
                    </Stack>
                </Stack>
            </Paper>

            <AIPopover
                anchorEl={aiPriceAnchor}
                onClose={() => setAiPriceAnchor(null)}
                isLoading={isAiLoading} hasError={aiError}
                content="Средняя цена на MacBook Pro 16 (M1 Pro, 512GB):\n• 115 000 — 125 000 ₽ — отличное состояние\n• От 140 000 ₽ — идеальное, новые АКБ"
                applyValue="120000"
                onApply={(val) => setFormData(p => ({ ...p, price: val }))}
            />

            <AIPopover
                anchorEl={aiDescAnchor}
                onClose={() => setAiDescAnchor(null)}
                isLoading={isAiLoading} hasError={aiError}
                content="Продаю мощный и надежный MacBook Pro 16 дюймов (2021) на процессоре M1 Pro. Идеальный инструмент для профессионалов: легко справляется с тяжелым видеомонтажом, компиляцией кода и 3D-графикой. Состояние отличное, использовался крайне бережно. Ноутбук работает абсолютно бесшумно и практически не нагревается даже при высоких нагрузках."
                applyValue="Продаю мощный и надежный MacBook Pro 16 дюймов (2021)... [сгенерированный текст]" // В реале сюда передается content
                onApply={(val) => setFormData(p => ({ ...p, description: val }))}
            />
            <Snackbar
                open={toast.open}
                autoHideDuration={4000}
                onClose={() => setToast({ ...toast, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert severity={toast.type} variant="filled" sx={{ width: '100%' }}>
                    {toast.text}
                </Alert>
            </Snackbar>

        </Container>
    );
};
