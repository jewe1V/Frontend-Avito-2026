import { Box, Button, Typography, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import editIcon from '../../../shared/assets/edit.svg';
import type { Item } from '../../../shared/api/types';

interface AdDetailsActionsProps {
    ad: Item & { needsRevision: boolean };
    id: string;
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const AdDetailsActions = ({ ad, id }: AdDetailsActionsProps) => {
    const navigate = useNavigate();
    const theme = useTheme();

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Button
                variant="contained"
                disableElevation
                sx={{
                    textTransform: 'none',
                    borderRadius: '8px',
                    paddingLeft: "12px",
                    paddingRight: "6px",
                    py: "6px",
                    fontWeight: 400,
                    fontSize: "16px",
                    backgroundColor: theme.palette.mode === 'light' ? '#1890FF' : '#7eaaed',
                    gap: "8px",
                }}
                onClick={() => navigate(`/ads/${id}/edit`)}
            >
                Редактировать
                <img src={editIcon} alt="edit" style={{
                    paddingRight: "6px",
                    width: "24px",
                    filter: theme.palette.mode === 'dark' ? 'invert(1)' : 'none'
                }} />
            </Button>
            <Box sx={{ textAlign: 'right', color: theme.palette.text.secondary}}>
                {ad.createdAt && (
                    <Typography variant="body2">
                        Опубликовано: {formatDate(ad.createdAt)}
                    </Typography>
                )}
                {ad.updatedAt && (
                    <Typography variant="body2">
                        Отредактировано: {formatDate(ad.updatedAt)}
                    </Typography>
                )}
            </Box>
        </Box>
    );
};
