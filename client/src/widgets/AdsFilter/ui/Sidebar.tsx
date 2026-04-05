import {
    Box,
    Typography,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Switch,
    Button,
    Paper,
    Divider,
    styled,
    useTheme
} from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import type { Category } from '../../../shared/api/types';
import { useAdsStore } from '../../../entities/ad/model/useAdsStore';

const AndroidSwitch = styled(Switch)(({ theme }) => ({
    width: 44,
    height: 24,
    padding: 0,
    display: 'flex',
    '& .MuiSwitch-switchBase': {
        padding: 3,
        '&.Mui-checked': {
            transform: 'translateX(20px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                backgroundColor: '#1976d2',
                opacity: 1,
                border: 0,
            },
        },
    },
    '& .MuiSwitch-thumb': {
        width: 18,
        height: 18,
        boxShadow: 'none',
        backgroundColor: '#fff',
    },
    '& .MuiSwitch-track': {
        borderRadius: 24 / 2,
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#555' : '#C6C6C6',
        boxSizing: 'border-box',
    },
}));

export const Sidebar = () => {
    const theme = useTheme();
    const { filters, setFilters, resetFilters } = useAdsStore();

    const handleCategoryToggle = (category: Category) => {
        const current = filters.categories || [];
        const updated = current.includes(category)
            ? current.filter((c) => c !== category)
            : [...current, category];

        setFilters({ categories: updated, page: 1 });
    };

    return (
        <>
        <Paper
            sx={{
                borderRadius: "8px",
                boxShadow: 'none',
                textAlign: "left",
                padding: "18px 16px",
                width: "256px",
                height: "247px",
                boxSizing: 'border-box',
                backgroundColor: theme.palette.background.paper
            }}
        >
            <Typography
                variant="h6"
                sx={{ mb: 1, fontWeight: 700, fontSize: '16px', color: theme.palette.text.primary }}
            >
                Фильтры
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography sx={{ fontSize: '14px', color: theme.palette.text.primary }}>
                    Категория
                </Typography>
                <ExpandLessIcon sx={{ color: theme.palette.text.primary }} />
            </Box>

            <FormGroup sx={{ mb: 1, mt: -1.5, display: 'flex' }}>
                <FormControlLabel
                    sx={{ ml: -1 }}
                    control={
                        <Checkbox
                            size="small"
                            checked={filters.categories?.includes('auto') || false}
                            onChange={() => handleCategoryToggle('auto')}
                        />
                    }
                    label={<Typography sx={{ fontSize: '14px', color: theme.palette.text.primary }}>Авто</Typography>}
                />
                <FormControlLabel
                    sx={{ ml: -1, mt: -1 }}
                    control={
                        <Checkbox
                            size="small"
                            checked={filters.categories?.includes('electronics') || false}
                            onChange={() => handleCategoryToggle('electronics')}
                        />
                    }
                    label={<Typography sx={{ fontSize: '14px', color: theme.palette.text.primary }}>Электроника</Typography>}
                />
                <FormControlLabel
                    sx={{ ml: -1, mt: -1 }}
                    control={
                        <Checkbox
                            size="small"
                            checked={filters.categories?.includes('real_estate') || false}
                            onChange={() => handleCategoryToggle('real_estate')}
                        />
                    }
                    label={<Typography sx={{ fontSize: '14px', color: theme.palette.text.primary }}>Недвижимость</Typography>}
                />
            </FormGroup>

            <Divider sx={{ mb: 1, borderColor: theme.palette.mode === 'dark' ? '#444' : '#f0f0f0' }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <Typography
                    sx={{
                        fontWeight: 600,
                        fontSize: '14px',
                        lineHeight: 1.4,
                        color: theme.palette.text.primary,
                        maxWidth: '70%'
                    }}
                >
                    Только требующие<br/>доработок
                </Typography>
                <AndroidSwitch
                    checked={filters.needsRevision || false}
                    onChange={(e) => setFilters({ needsRevision: e.target.checked ? true : undefined, page: 1 })}
                />
            </Box>
        </Paper>
            <Button
                variant="text"
                fullWidth
                onClick={resetFilters}
                disableRipple
                sx={{
                    width: "256px",
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: '8px',
                    padding: "8px",
                    marginTop: '10px',
                    textTransform: 'none',
                    color: theme.palette.mode === 'dark' ? '#999' : '#848388',
                    fontSize: '14px',
                    '&:hover': {
                        backgroundColor: 'transparent',
                        color: theme.palette.mode === 'dark' ? '#ccc' : '#555'
                    }
                }}
            >
                Сбросить фильтры
            </Button>
        </>
    );
};
