import {Pagination, styled} from "@mui/material";

export const AdsPagination = styled(Pagination)(({ theme }) => ({
    '& .MuiPaginationItem-root': {
        borderRadius: '8px',
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        margin: '0 4px',
        fontWeight: 500,
        fontSize: '16px',
        height: '32px',
        minWidth: '32px',
        transition: 'all 0.2s ease',
        '&:hover': {
            backgroundColor: theme.palette.action.hover,
            borderColor: '#1677ff',
            color: '#1677ff',
        },
        '&.Mui-selected': {
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(22, 119, 255, 0.1)' : '#fff',
            borderColor: '#1677ff',
            color: '#1677ff',
            '&:hover': {
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(22, 119, 255, 0.2)' : '#f5f5f5',
            },
        },
        '&.MuiPaginationItem-previousNext': {
            color: theme.palette.text.secondary,
            '&:hover': {
                borderColor: '#1677ff',
                color: '#1677ff',
                backgroundColor: theme.palette.action.hover,
            }
        },
    },
}));
