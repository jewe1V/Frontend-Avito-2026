import { Popover, Box, Typography, Button, CircularProgress, useTheme } from '@mui/material';

interface AIPopoverProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  isLoading: boolean;
  hasError: boolean;
  content: string;
  applyValue: string;
  onApply: (value: string) => void;
}

export const AIPopover = ({
  anchorEl,
  onClose,
  isLoading,
  hasError,
  content,
  applyValue,
  onApply,
}: AIPopoverProps) => {
  const theme = useTheme();
  const open = Boolean(anchorEl);

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      <Box
        sx={{
          p: 2,
          minWidth: '300px',
          maxWidth: '400px',
          backgroundColor: theme.palette.background.paper,
        }}
      >
        {isLoading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={20} />
            <Typography>Генерируем...</Typography>
          </Box>
        ) : hasError ? (
          <Typography color="error">Ошибка при генерации</Typography>
        ) : (
          <>
            <Typography variant="body2" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
              {content || applyValue}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                size="small"
                onClick={() => onApply(applyValue)}
                disabled={!applyValue}
              >
                Применить
              </Button>
              <Button size="small" onClick={onClose}>
                Закрыть
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Popover>
  );
};
