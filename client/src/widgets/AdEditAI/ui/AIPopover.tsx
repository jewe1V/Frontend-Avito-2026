import { Popover, Box, Typography, Button, CircularProgress, useTheme, Stack } from '@mui/material';

interface AIPopoverProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  isLoading: boolean;
  hasError: boolean;
  content: string;
  applyValue: string;
  onApply: (value: string) => void;
}

export const AIPopover = ({ anchorEl, onClose, onApply, isLoading, hasError, content, applyValue }: AIPopoverProps) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            slotProps={{
                paper: {
                    sx: {
                        overflow: 'visible',
                        mt: -1.5,
                        p: '20px',
                        width: 340,
                        borderRadius: '8px',
                        boxShadow: isDark ? '0px 4px 20px rgba(0, 0, 0, 0.4)' : '0px 4px 20px rgba(0, 0, 0, 0.08)',
                        border: `1px solid ${theme.palette.divider}`,
                        bgcolor: theme.palette.background.paper,
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
                            borderBottom: `1px solid ${theme.palette.divider}`,
                            borderRight: `1px solid ${theme.palette.divider}`,
                        },
                    }
                }
            }}
        >
            {isLoading && !content ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CircularProgress size={18} thickness={5} sx={{ color: theme.palette.primary.main }} />
                    <Typography sx={{ fontSize: '14px', color: theme.palette.text.primary }}>
                        Выполняется запрос...
                    </Typography>
                </Box>
            ) : hasError ? (
                (() => { onClose(); return null; })()
            ) : (
                <Box>
                    <Typography sx={{
                        mb: 1.5,
                        fontWeight: 700,
                        fontSize: '16px',
                        color: theme.palette.text.primary,
                        lineHeight: '24px'
                    }}>
                        Ответ AI:
                    </Typography>

                    <Typography sx={{
                        mb: 2.5,
                        fontSize: '15px',
                        lineHeight: '22px',
                        color: theme.palette.text.secondary,
                        whiteSpace: 'pre-line'
                    }}>
                        {content}
                        {isLoading && (
                            <CircularProgress size={10} sx={{ ml: 1, color: theme.palette.primary.main }} />
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
                                '&:disabled': { bgcolor: isDark ? '#1d39c4' : '#bae7ff', color: 'rgba(255,255,255,0.6)' }
                            }}
                        >
                            Применить
                        </Button>
                        <Button
                            onClick={onClose}
                            sx={{
                                color: theme.palette.text.primary,
                                bgcolor: 'transparent',
                                border: `1px solid ${theme.palette.divider}`,
                                textTransform: 'none',
                                borderRadius: '4px',
                                px: '15px',
                                py: '5px',
                                fontSize: '14px',
                                fontWeight: 400,
                                boxShadow: 'none',
                                '&:hover': { 
                                    bgcolor: theme.palette.action.hover, 
                                    borderColor: theme.palette.text.secondary 
                                }
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
