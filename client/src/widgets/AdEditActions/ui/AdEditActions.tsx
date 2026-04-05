import { Button, Stack, CircularProgress, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface AdEditActionsProps {
  isSaving: boolean;
  onSave: () => void;
}

export const AdEditActions = ({ isSaving, onSave }: AdEditActionsProps) => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Stack direction="row" spacing={2} sx={{ mt: 4, mb: 4 }}>
      <Button
        variant="contained"
        onClick={onSave}
        disabled={isSaving}
        sx={{
          bgcolor: '#1677ff',
          color: '#fff',
          textTransform: 'none',
          borderRadius: '6px',
          px: 3,
          py: 1,
          fontSize: '15px',
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': { bgcolor: '#0958d9', boxShadow: 'none' },
          '&:disabled': { 
            bgcolor: theme.palette.action.disabledBackground, 
            color: theme.palette.action.disabled 
          }
        }}
      >
        {isSaving ? <CircularProgress size={24} color="inherit" /> : 'Сохранить'}
      </Button>
      <Button
        variant="contained"
        onClick={() => navigate('/')}
        disabled={isSaving}
        sx={{
          bgcolor: theme.palette.action.disabledBackground,
          color: theme.palette.text.secondary,
          textTransform: 'none',
          borderRadius: '6px',
          px: 3,
          py: 1,
          fontSize: '15px',
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': { 
            bgcolor: theme.palette.action.hover, 
            boxShadow: 'none' 
          }
        }}
      >
        Отменить
      </Button>
    </Stack>
  );
};
