import { useState, type MouseEvent, useEffect } from 'react';

import {

  Box, Container, Typography, Button, MenuItem,

  Stack, Popover, CircularProgress, Snackbar, Alert,

  OutlinedInput, InputAdornment, IconButton, Divider, Select, useTheme

} from '@mui/material';

import CancelIcon from '@mui/icons-material/Cancel';

import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { useNavigate, useParams } from 'react-router-dom';

import { itemsApi } from '../../../shared/api/itemsApi';

import type { Category, ItemParams } from '../../../shared/api/types';

import lampIcon from "../../../shared/assets/lamp-icon.svg"

import {AdEditSkeleton} from "./AdEditSkeleton.tsx";


export const AIPopover = ({ anchorEl, onClose, onApply, isLoading, hasError, content, applyValue }: AIPopoverProps) => {
  const theme = useTheme();

  return (
      <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={onClose}
          // Позиционирование над кнопкой, как на макете
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          slotProps={{
            paper: {
              sx: {
                overflow: 'visible',
                mt: -1.5, // Отступ для хвостика
                p: '20px',
                width: 340,
                borderRadius: '8px',
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
                border: '1px solid #f0f0f0',
                bgcolor: theme.palette.background.paper,
                // Хвостик (Arrow)
                '&::before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  bottom: -6,
                  left: 24,
                  width: 12,
                  height: 12,
                  bgcolor: theme.palette.background.paper,
                  transform: 'rotate(45deg)',
                  borderBottom: '1px solid #f0f0f0',
                  borderRight: '1px solid #f0f0f0',
                },
              }
            }
          }}
      >
        {isLoading && !content ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CircularProgress size={18} thickness={5} sx={{ color: '#1890ff' }} />
              <Typography sx={{ fontSize: '14px', color: '#262626' }}>Выполняется запрос...</Typography>
            </Box>
        ) : hasError ? (
            <Box>
              <Typography sx={{ mb: 1, fontWeight: 600, fontSize: '14px', color: '#ff4d4f' }}>Ошибка AI</Typography>
              <Button size="small" variant="outlined" color="error" onClick={onClose} sx={{ textTransform: 'none' }}>Закрыть</Button>
            </Box>
        ) : (
            <Box>
              <Typography sx={{
                mb: 1.5,
                fontWeight: 700,
                fontSize: '16px',
                color: theme.palette.mode === 'dark' ? '#fff' : '#262626',
                lineHeight: '24px'
              }}>
                Ответ AI:
              </Typography>

              <Typography sx={{
                mb: 2.5,
                fontSize: '15px',
                lineHeight: '22px',
                color: theme.palette.mode === 'dark' ? alpha('#fff', 0.85) : '#262626',
                whiteSpace: 'pre-line'
              }}>
                {content}
                {isLoading && (
                    <CircularProgress size={10} sx={{ ml: 1, color: '#1890ff' }} />
                )}
              </Typography>

              <Stack direction="row" spacing={1.5}>
                <Button
                    onClick={() => { onApply(applyValue); onClose(); }}
                    disabled={isLoading}
                    sx={{
                      bgcolor: '#1890ff',
                      color: '#fff',
                      textTransform: 'none',
                      borderRadius: '4px',
                      px: '15px',
                      py: '5px',
                      fontSize: '14px',
                      fontWeight: 400,
                      boxShadow: 'none',
                      '&:hover': { bgcolor: '#40a9ff', boxShadow: 'none' },
                      '&:disabled': { bgcolor: '#bae7ff', color: '#fff' }
                    }}
                >
                  Применить
                </Button>
                <Button
                    onClick={onClose}
                    sx={{
                      color: '#262626',
                      bgcolor: '#fff',
                      border: '1px solid #d9d9d9',
                      textTransform: 'none',
                      borderRadius: '4px',
                      px: '15px',
                      py: '5px',
                      fontSize: '14px',
                      fontWeight: 400,
                      boxShadow: 'none',
                      '&:hover': { bgcolor: '#f5f5f5', borderColor: '#d9d9d9' }
                    }}
                >
                  Закрыть
                </Button>
              </Stack>
            </Box>
        )}
      </Popover>
  );
};

const CustomLabelWithTheme = ({ children, required, weight = 600 }: { children: React.ReactNode, required?: boolean, weight?: number }) => {
  const theme = useTheme();
  return (
      <Typography sx={{ fontSize: '14px', fontWeight: weight, color: theme.palette.text.primary, mb: 1, display: 'flex', alignItems: 'center' }}>
        {required && <span style={{ color: '#ff4d4f', marginRight: '4px', fontSize: '14px' }}>*</span>}
        {children}
      </Typography>
  );
};
// API функции для Ollama с Streaming

const ollama_api_url = 'http://localhost:11434/api/generate';



const generatePrice = async (title: string, category: string, onStream: (chunk: string) => void): Promise<string> => {

  const prompt = `Укажите рекомендуемую рыночную цену для объявления, основываясь только на названии товара и категории. Ответь только на русском языке. Ответьте ТОЛЬКО цифрой без описания, примеры: 5000 или 25500.



Название товара: "${title}"

Категория: "${category}"



Цена:`;



  try {

    const response = await fetch(ollama_api_url, {

      method: 'POST',

      headers: { 'Content-Type': 'application/json' },

      body: JSON.stringify({

        model: 'llama3',

        prompt: prompt,

        stream: true,

        temperature: 0.7

      })

    });



    if (!response.ok) throw new Error('API ошибка');


    const reader = response.body?.getReader();

    const decoder = new TextDecoder();

    let fullResponse = '';



    if (!reader) throw new Error('No response body');



    while (true) {

      const { done, value } = await reader.read();

      if (done) break;



      const text = decoder.decode(value);

      const lines = text.split('\n').filter(line => line.trim());



      for (const line of lines) {

        try {

          const json = JSON.parse(line);

          if (json.response) {

            fullResponse += json.response;

            onStream(json.response);

          }

        } catch (e) {

// Пропускаем строки, которые не являются JSON

        }

      }

    }



    const price = fullResponse.trim().match(/\d+/)?.[0] || '';

    return price;

  } catch (error) {

    console.error('Ошибка при генерации цены:', error);

    throw error;

  }

};



const generateDescription = async (title: string, category: string, onStream: (chunk: string) => void): Promise<string> => {

  const prompt = `Напиши краткое привлекательное описание товара для интернет-магазина на русском языке. Отвори только в 1-2 предложения, максимум 100 слов. Будь конкретен и практичен.



Название товара: "${title}"

Категория: "${category}"



Описание:`;



  try {

    const response = await fetch(ollama_api_url, {

      method: 'POST',

      headers: { 'Content-Type': 'application/json' },

      body: JSON.stringify({

        model: 'llama3',

        prompt: prompt,

        stream: true,

        temperature: 0.7

      })

    });



    if (!response.ok) throw new Error('API ошибка');


    const reader = response.body?.getReader();

    const decoder = new TextDecoder();

    let fullResponse = '';



    if (!reader) throw new Error('No response body');



    while (true) {

      const { done, value } = await reader.read();

      if (done) break;



      const text = decoder.decode(value);

      const lines = text.split('\n').filter(line => line.trim());



      for (const line of lines) {

        try {

          const json = JSON.parse(line);

          if (json.response) {

            fullResponse += json.response;

            onStream(json.response);

          }

        } catch {

// Пропускаем строки, которые не являются JSON

        }

      }

    }



    return fullResponse.trim();

  } catch (error) {

    console.error('Ошибка при генерации описания:', error);

    throw error;

  }

};



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



// Перемещен в компонент AdEditPage для использования theme



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



// --- Основная страница ---

export const AdEditPage = () => {

  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

  const theme = useTheme();




// Динамические стили для инпутов

  const getInputSx = () => ({

    maxWidth: '456px',

    height: '32px',

    borderRadius: '6px',

    backgroundColor: theme.palette.background.paper,

    '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.mode === 'dark' ? '#434343' : '#D9D9D9' },

    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.mode === 'dark' ? '#595959' : '#D9D9D9' },

    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#1890ff', borderWidth: '1px' },

    '& .MuiOutlinedInput-input': { py: '9px', px: '14px', fontSize: '14px', color: theme.palette.text.primary },

    '& .MuiOutlinedInput-input::placeholder': { color: theme.palette.text.secondary, opacity: 0.7 },

  });



// Динамические стили для AI кнопок

  const getAiButtonSx = () => ({

    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 169, 64, 0.12)' : '#F9F1E6',

    color: '#FFA940',

    textTransform: 'none',

    borderRadius: '8px',

    boxShadow: 'none',

    fontSize: '14px',

    lineHeight: '22px',

    fontWeight: 500,

    px: 2.3,

    flexShrink: 0,

    '&:hover': {

      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 169, 64, 0.24)' : '#FDE6D1',

      boxShadow: 'none',

    },

    '& .MuiButton-startIcon': {

      marginRight: '6px'

    }

  });


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

  const [aiPriceContent, setAiPriceContent] = useState('');

  const [aiPriceValue, setAiPriceValue] = useState('');

  const [aiDescContent, setAiDescContent] = useState('');

  const [aiDescValue, setAiDescValue] = useState('');

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

      case 'electronics': return ['type', ...baseParams, 'condition', 'color'];

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



  const handleAiRequest = async (type: 'price' | 'description', setter: React.Dispatch<React.SetStateAction<HTMLElement | null>>, event: MouseEvent<HTMLElement>) => {

    setter(event.currentTarget);

    setIsAiLoading(true);

    setAiError(false);



    try {

      if (type === 'price') {

        setAiPriceContent(''); // Очищаем перед началом

        const price = await generatePrice(formData.title, formData.category, (chunk) => {

          setAiPriceContent(prev => prev + chunk); // Накапливаем контент

        });

        setAiPriceValue(price);

      } else {

        setAiDescContent(''); // Очищаем перед началом

        const description = await generateDescription(formData.title, formData.category, (chunk) => {

          setAiDescContent(prev => prev + chunk); // Накапливаем контент

        });

        setAiDescValue(description);

      }

    } catch (error) {

      setAiError(true);

      setToast({ open: true, type: 'error', text: 'Ошибка при обращении к AI. Убедитесь, что Ollama запущена на localhost:11434' });

    } finally {

      setIsAiLoading(false);

    }

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

        <AdEditSkeleton />

    );

  }



  const paramFields = getParamFields();



  return (

      <Box sx={{ bgcolor: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.background.default, minHeight: '100vh', py: 2 }}>

        <Container maxWidth={false} sx={{ maxWidth: '1399px', mx: 'auto', px: 2, fontFamily: 'Inter, sans-serif' }}>



          <Box sx={{ }}>

            <Typography variant="h4" sx={{ fontWeight: 500, mb: 2.5, color: theme.palette.text.primary, fontSize: '30px', fontFamily: 'Roboto', lineHeight: '40px' }}>

              Редактирование объявления

            </Typography>



            {/* Категория */}

            <Box sx={{mb: 2,}}>

              <CustomLabelWithTheme weight={600}>Категория</CustomLabelWithTheme>

              <Select

                  fullWidth

                  size="small"

                  value={formData.category}

                  onChange={(e) => handleChange('category')({ target: { value: e.target.value } } as any)}

                  IconComponent={KeyboardArrowDownIcon}

                  sx={getInputSx()}

              >

                <MenuItem value="electronics">Электроника</MenuItem>

                <MenuItem value="auto">Авто</MenuItem>

                <MenuItem value="real_estate">Недвижимость</MenuItem>

              </Select>

            </Box>



            <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />



            {/* Название */}

            <Box sx={{mt: -1,}}>

              <CustomLabelWithTheme required weight={600}>Название</CustomLabelWithTheme>

              <OutlinedInput

                  fullWidth

                  size="small"

                  value={formData.title}

                  onChange={handleChange('title')}

                  error={errors.title}

                  endAdornment={renderClearButton('title', formData.title)}

                  sx={getInputSx()}

              />

            </Box>

            <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />

            {/* Цена */}

            <Box sx={{mt: -1,}}>

              <CustomLabelWithTheme required weight={600}>Цена</CustomLabelWithTheme>

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>

                <OutlinedInput

                    fullWidth

                    size="small"

                    type="number"

                    value={formData.price}

                    onChange={handleChange('price')}

                    error={errors.price}

                    endAdornment={renderClearButton('price', formData.price)}

                    sx={getInputSx()}

                />

                <Button

                    variant="contained"

                    startIcon={<img src={lampIcon} alt={"Запрос к ии"} style={{marginLeft: "-4px", width: "18px"}}/>}

                    onClick={(e) => handleAiRequest('price', setAiPriceAnchor, e)}

                    sx={getAiButtonSx()}

                >

                  Узнать рыночную стоимость

                </Button>

              </Box>

            </Box>



            <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />



            {/* Характеристики */}

            {paramFields.length > 0 && (

                <Box sx={{mt: 1,}}>

                  <Typography sx={{ mb: 1, fontWeight: 700, color: theme.palette.text.primary, fontSize: '16px' }}>

                    Характеристики

                  </Typography>

                  <Stack spacing={1}>

                    {paramFields.map(field => {

                      const options = getParamOptions(field);

                      return (

                          <Box key={field}>

                            <CustomLabelWithTheme weight={400}>{getParamLabel(field)}</CustomLabelWithTheme>

                            {options ? (

                                <Select

                                    fullWidth

                                    size="small"

                                    displayEmpty

                                    value={formData[field] || ''}

                                    onChange={(e) => handleChange(field)({ target: { value: e.target.value } } as any)}

                                    IconComponent={KeyboardArrowDownIcon}

                                    sx={getInputSx()}

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

                                    sx={getInputSx()}

                                />

                            )}

                          </Box>

                      );

                    })}

                  </Stack>

                </Box>

            )}



            <Divider sx={{ my: 2.5, borderColor: theme.palette.divider }} />



            {/* Описание */}

            <Box sx={{ mt: 2, maxWidth: '942px' }}> {/* <-- Ограничиваем ширину контейнера, чтобы счетчик был под инпутом */}

              <Typography sx={{ mb: 1, fontWeight: 700, color: theme.palette.text.primary, fontSize: '16px' }}>

                Описание

              </Typography>

              <OutlinedInput

                  fullWidth

                  multiline

                  minRows={1}

                  value={formData.description}

                  onChange={handleChange('description')}

                  sx={{

                    ...getInputSx(),

                    maxWidth: '100%',

                    minHeight: "32px",

                    height: 'auto',

                    padding: 0,

                    '& .MuiOutlinedInput-input': {

                      padding: '5px 16px',

                      color: theme.palette.text.primary,

                      resize: 'vertical' // Оставляем, если хочешь, чтобы пользователь мог тянуть инпут за уголок

                    }

                  }}

              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mt: 1.5 }}>

                <Button

                    variant="contained"

                    startIcon={<LightbulbOutlinedIcon sx={{ fontSize: '18px !important' }} />}

                    onClick={(e) => handleAiRequest('description', setAiDescAnchor, e)}

                    sx={getAiButtonSx()}

                >

                  Придумать описание

                </Button>

                <Typography sx={{ fontSize: '13px', color: theme.palette.text.secondary, mt: 0.5 }}>

                  {formData.description?.length || 0} / 1000

                </Typography>

              </Box>

            </Box>



            {/* Кнопки действий */}

            <Stack direction="row" spacing={2} sx={{ mt: 4, mb: 4}}>

              <Button

                  variant="contained"

                  onClick={handleSave}

                  disabled={isSaving}

                  sx={{

                    bgcolor: '#1677ff', color: '#fff', textTransform: 'none',

                    borderRadius: '6px', px: 3, py: 1, fontSize: '15px',

                    fontWeight: 500, boxShadow: 'none',

                    '&:hover': { bgcolor: '#0958d9', boxShadow: 'none' },

                    '&:disabled': { bgcolor: theme.palette.action.disabledBackground, color: theme.palette.action.disabled }

                  }}

              >

                {isSaving ? <CircularProgress size={24} color="inherit" /> : 'Сохранить'}

              </Button>

              <Button

                  variant="contained"

                  onClick={() => navigate('/')}

                  disabled={isSaving}

                  sx={{

                    bgcolor: theme.palette.action.disabledBackground, color: theme.palette.text.secondary, textTransform: 'none',

                    borderRadius: '6px', px: 3, py: 1, fontSize: '15px',

                    fontWeight: 500, boxShadow: 'none',

                    '&:hover': { bgcolor: theme.palette.action.hover, boxShadow: 'none' }

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

            content={aiPriceContent}

            applyValue={aiPriceValue}

            onApply={(val) => setFormData(p => ({ ...p, price: val }))}

        />



        <AIPopover

            anchorEl={aiDescAnchor}

            onClose={() => setAiDescAnchor(null)}

            isLoading={isAiLoading}

            hasError={aiError}

            content={aiDescContent}

            applyValue={aiDescValue}

            onApply={(val) => setFormData(p => ({ ...p, description: val }))}

        />



        <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast({ ...toast, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>

          <Alert severity={toast.type} variant="filled" sx={{ width: '100%' }}>{toast.text}</Alert>

        </Snackbar>

      </Box>

  );

};

