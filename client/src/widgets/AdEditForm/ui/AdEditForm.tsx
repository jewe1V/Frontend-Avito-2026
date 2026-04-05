import {
  Box,
  Select,
  MenuItem,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Divider,
  Stack,
  Typography,
  Button,
  useTheme
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import type { Category } from '../../../shared/api/types';
import lampIcon from '../../../shared/assets/lamp-icon.svg';

interface FormDataType {
  category: Category;
  title: string;
  price: string;
  description: string;
  [key: string]: string | number | undefined;
}

interface AdEditFormProps {
  formData: FormDataType;
  errors: { title?: boolean; price?: boolean };
  onFieldChange: (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: (field: string) => void;
  onAiPriceClick: (e: React.MouseEvent<HTMLElement>) => void;
  onAiDescClick: (e: React.MouseEvent<HTMLElement>) => void;
  getParamFields: () => string[];
  getParamLabel: (param: string) => string;
  getParamInputType: (param: string) => string;
  getParamOptions: (param: string) => string[] | null;
}

const CustomLabel = ({
  children,
  required,
  weight = 600
}: {
  children: React.ReactNode
  required?: boolean
  weight?: number
}) => (
  <Typography sx={{ fontWeight: weight, mb: 1, display: 'flex', alignItems: 'center' }}>
    {required && <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>}
    {children}
  </Typography>
);

const formatOptionLabel = (value: string): string => {
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
    'used': 'Б/У'
  };
  return labels[value] || value;
};

export const AdEditForm = ({
  formData,
  errors,
  onFieldChange,
  onClear,
  onAiPriceClick,
  onAiDescClick,
  getParamFields,
  getParamLabel,
  getParamInputType,
  getParamOptions
}: AdEditFormProps) => {
  const theme = useTheme();

  const getInputSx = (value: string | number, isRequired: boolean = false) => {
    const isEmpty = !value || value.toString().trim() === '';
    const isWarning = !isRequired && isEmpty; // Желтый, если не обязательное и пустое

    return {
      maxWidth: '456px',
      height: '32px',
      borderRadius: '6px',
      backgroundColor: theme.palette.background.paper,
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: isWarning
            ? '#FFA940'
            : (theme.palette.mode === 'dark' ? '#434343' : '#D9D9D9')
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: isWarning ? '#FFA940' : (theme.palette.mode === 'dark' ? '#595959' : '#D9D9D9')
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: isWarning ? '#FFA940' : '#1890ff',
        borderWidth: '1px'
      },
      '& .MuiOutlinedInput-input': {
        py: '9px',
        px: '14px',
        fontSize: '14px',
        color: theme.palette.text.primary
      },
    };
  };

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
  });

  const renderClearButton = (field: string, value: string | number | undefined) => {
    if (!value) return null;
    return (
      <InputAdornment position="end">
        <IconButton size="small" onClick={() => onClear(field)} edge="end" sx={{ p: '2px', mr: '-2px' }}>
          <CancelIcon sx={{ color: '#c2c2c2', fontSize: 18 }} />
        </IconButton>
      </InputAdornment>
    );
  };

  const paramFields = getParamFields();

  return (
      <Box>
        <Box sx={{ mb: 2 }}>
          <CustomLabel weight={600}>Категория</CustomLabel>
          <Select
              fullWidth
              size="small"
              value={formData.category}
              onChange={(e) => onFieldChange('category')({ target: { value: e.target.value } } as React.ChangeEvent<HTMLInputElement>)}
              IconComponent={KeyboardArrowDownIcon}
              sx={getInputSx(formData.category, false)}
          >
            <MenuItem value="electronics">Электроника</MenuItem>
            <MenuItem value="auto">Авто</MenuItem>
            <MenuItem value="real_estate">Недвижимость</MenuItem>
          </Select>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mt: -1 }}>
          <CustomLabel required>Название</CustomLabel>
          <OutlinedInput
              fullWidth
              size="small"
              value={formData.title}
              onChange={onFieldChange('title')}
              error={errors.title}
              endAdornment={renderClearButton('title', formData.title)}
              sx={getInputSx(formData.title, true)}
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mt: -1 }}>
          <CustomLabel required>Цена</CustomLabel>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <OutlinedInput
                fullWidth
                size="small"
                type="number"
                value={formData.price}
                onChange={onFieldChange('price')}
                error={errors.price}
                endAdornment={renderClearButton('price', formData.price)}
                sx={getInputSx(formData.price, true)}
            />
            <Button
                variant="contained"
                startIcon={<img src={lampIcon} alt="" style={{ marginLeft: "-4px", width: "18px" }} />}
                onClick={onAiPriceClick}
                sx={getAiButtonSx()}
            >
              Узнать рыночную стоимость
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {paramFields.length > 0 && (
            <Box sx={{ mt: 1 }}>
              <Typography sx={{ mb: 1, fontWeight: 700, fontSize: '16px' }}>
                Характеристики
              </Typography>
              <Stack spacing={1}>
                {paramFields.map(field => {
                  const options = getParamOptions(field);
                  const value = formData[field];
                  return (
                      <Box key={field}>
                        <CustomLabel weight={400}>{getParamLabel(field)}</CustomLabel>
                        {options ? (
                            <Select
                                fullWidth
                                size="small"
                                displayEmpty
                                value={value || ''}
                                onChange={(e) => onFieldChange(field)({ target: { value: e.target.value } } as React.ChangeEvent<HTMLInputElement>)}
                                IconComponent={KeyboardArrowDownIcon}
                                sx={getInputSx(value as string, false)}
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
                                value={value || ''}
                                onChange={onFieldChange(field)}
                                endAdornment={renderClearButton(field, value)}
                                sx={getInputSx(value as string, false)}
                            />
                        )}
                      </Box>
                  );
                })}
              </Stack>
            </Box>
        )}

        <Divider sx={{ my: 2.5 }} />

        <Box sx={{ mt: 2, maxWidth: '942px' }}>
          <Typography sx={{ mb: 1, fontWeight: 700, fontSize: '16px' }}>
            Описание
          </Typography>
          <OutlinedInput
              fullWidth
              multiline
              minRows={1}
              value={formData.description}
              onChange={onFieldChange('description')}
              sx={{
                ...getInputSx(formData.description, false),
                maxWidth: '100%',
                minHeight: "32px",
                height: 'auto',
                padding: 0,
                '& .MuiOutlinedInput-input': {
                  padding: '5px 16px',
                  color: theme.palette.text.primary,
                  resize: 'vertical'
                }
              }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mt: 1.5 }}>
            <Button
                variant="contained"
                startIcon={<LightbulbOutlinedIcon sx={{ fontSize: '18px !important' }} />}
                onClick={onAiDescClick}
                sx={getAiButtonSx()}
            >
              Придумать описание
            </Button>
            <Typography sx={{ fontSize: '13px', color: theme.palette.text.secondary, mt: 0.5 }}>
              {formData.description?.length || 0} / 1000
            </Typography>
          </Box>
        </Box>
      </Box>
  );
};
