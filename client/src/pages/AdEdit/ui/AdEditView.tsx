import { Container, Typography, Snackbar, Alert, useTheme, Box } from '@mui/material';
import { AdEditSkeleton } from './AdEditSkeleton';
import { AdEditForm } from '../../../widgets/AdEditForm';
import { AIPopover } from '../../../widgets/AdEditAI';
import { AdEditActions } from '../../../widgets/AdEditActions';
import { useState } from 'react';
import type { MouseEvent } from 'react';
import { generatePrice, generateDescription } from '../../../features/AdEditAI/model/ollamaApi';
import type { Category } from '../../../shared/api/types';

interface FormDataType {
  category: Category;
  title: string;
  price: string;
  description: string;
  [key: string]: string | number | undefined;
}

interface AdEditViewProps {
  formData: FormDataType;
  setFormData: (data: FormDataType) => void;
  errors: { title?: boolean; price?: boolean };
  isLoading: boolean;
  isSaving: boolean;
  toast: { open: boolean; type: 'success' | 'error'; text: string };
  setToast: (toast: { open: boolean; type: 'success' | 'error'; text: string }) => void;
  onFieldChange: (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: (field: string) => void;
  getParamFields: () => string[];
  getParamLabel: (param: string) => string;
  getParamInputType: (param: string) => string;
  getParamOptions: (param: string) => string[] | null;
  onSave: () => void;
}

export const AdEditView = ({
  formData,
  setFormData,
  errors,
  isLoading,
  isSaving,
  toast,
  setToast,
  onFieldChange,
  onClear,
  getParamFields,
  getParamLabel,
  getParamInputType,
  getParamOptions,
  onSave,
}: AdEditViewProps) => {
  const theme = useTheme();
  const [aiPriceAnchor, setAiPriceAnchor] = useState<HTMLElement | null>(null);
  const [aiDescAnchor, setAiDescAnchor] = useState<HTMLElement | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState(false);
  const [aiPriceContent, setAiPriceContent] = useState('');
  const [aiPriceValue, setAiPriceValue] = useState('');
  const [aiDescContent, setAiDescContent] = useState('');
  const [aiDescValue, setAiDescValue] = useState('');

  const handleAiRequest = async (
    type: 'price' | 'description',
    setter: React.Dispatch<React.SetStateAction<HTMLElement | null>>,
    event: MouseEvent<HTMLElement>
  ) => {
    setter(event.currentTarget);
    setIsAiLoading(true);
    setAiError(false);

    try {
      if (type === 'price') {
        setAiPriceContent('');
        const price = await generatePrice(formData, (chunk: string) => {
          setAiPriceContent(prev => prev + chunk);
        });
        setAiPriceValue(price);
      } else {
        setAiDescContent('');
        const description = await generateDescription(formData, (chunk: string) => {
          setAiDescContent(prev => prev + chunk);
        });
        setAiDescValue(description);
      }
    } catch (error) {
      console.error('AI error:', error);
      setAiError(true);
      setToast({ open: true, type: 'error', text: 'Ошибка при обращении к AI' });
    } finally {
      setIsAiLoading(false);
    }
  };

  if (isLoading) {
    return <AdEditSkeleton />;
  }

  return (
    <>
      <Box sx={{
        bgcolor: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.background.default,
        minHeight: '100vh',
        py: 2
      }}>
        <Container maxWidth={false} sx={{ maxWidth: '1399px', mx: 'auto', px: 2, fontFamily: 'Inter, sans-serif' }}>
          <Typography variant="h4" sx={{
            fontWeight: 500,
            mb: 2.5,
            color: theme.palette.text.primary,
            fontSize: '30px',
            fontFamily: 'Roboto',
            lineHeight: '40px'
          }}>
            Редактирование объявления
          </Typography>

          <AdEditForm
            formData={formData}
            errors={errors}
            onFieldChange={onFieldChange}
            onClear={onClear}
            onAiPriceClick={(e) => handleAiRequest('price', setAiPriceAnchor, e)}
            onAiDescClick={(e) => handleAiRequest('description', setAiDescAnchor, e)}
            getParamFields={getParamFields}
            getParamLabel={getParamLabel}
            getParamInputType={getParamInputType}
            getParamOptions={getParamOptions}
          />

          <AdEditActions isSaving={isSaving} onSave={onSave} />
        </Container>
      </Box>

      <AIPopover
        anchorEl={aiPriceAnchor}
        onClose={() => setAiPriceAnchor(null)}
        isLoading={isAiLoading}
        hasError={aiError}
        content={aiPriceContent}
        applyValue={aiPriceValue}
        onApply={(val) => setFormData({ ...formData, price: val })}
      />

      <AIPopover
        anchorEl={aiDescAnchor}
        onClose={() => setAiDescAnchor(null)}
        isLoading={isAiLoading}
        hasError={aiError}
        content={aiDescContent}
        applyValue={aiDescValue}
        onApply={(val) => setFormData({ ...formData, description: val })}
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
    </>
  );
};
