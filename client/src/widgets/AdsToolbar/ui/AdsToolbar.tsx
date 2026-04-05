import {
    Box,
    TextField,
    InputAdornment,
    ToggleButton,
    ToggleButtonGroup,
    Select,
    MenuItem,
    FormControl,
    styled,
    useTheme
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ViewListIcon from '@mui/icons-material/ViewList';
import GridViewIcon from '@mui/icons-material/GridView';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useAdsStore } from '../../../entities/ad/model/useAdsStore';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#f5f5f5',
    borderRadius: '12px',
    padding: '4px',
    border: 'none',
    '& .MuiToggleButtonGroup-grouped': {
        border: 0,
        borderRadius: '8px',
        margin: '0 2px',
        '&.Mui-selected': {
            backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#fff',
            color: '#1976d2',
            boxShadow: '0px 2px 4px rgba(0,0,0,0.05)',
            '&:hover': {
                backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#fff',
            },
        },
    },
}));

export const AdsToolbar = () => {
    const theme = useTheme();
    const { filters, viewMode, setFilters, setViewMode, isDarkMode, toggleDarkMode } = useAdsStore();

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5, width: '100%', backgroundColor: theme.palette.background.paper, p: "12px", borderRadius: '8px' }}>

            {/* Поисковая строка */}
            <TextField
                fullWidth
                placeholder="Найти объявление...."
                size="small"
                value={filters.q || ''}
                onChange={(e) => setFilters({ q: e.target.value, page: 1 })}
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <SearchIcon sx={{ color: theme.palette.mode === 'dark' ? '#999' : '#555', fontSize: 20 }} />
                            </InputAdornment>
                        ),
                    }
                }}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#f5f5f5',
                        borderRadius: '12px',
                        '& fieldset': { border: 'none' },
                        '&:hover fieldset': { border: 'none' },
                        '&.Mui-focused fieldset': { border: 'none' },
                    },
                    '& .MuiInputBase-input': {
                        paddingLeft: '16px',
                        fontSize: '15px'
                    }
                }}
            />

            <StyledToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(_, val) => val && setViewMode(val)}
                size="small"
            >
                <ToggleButton value="grid">
                    <GridViewIcon sx={{ fontSize: 20 }} />
                </ToggleButton>
                <ToggleButton value="list">
                    <ViewListIcon sx={{ fontSize: 20 }} />
                </ToggleButton>
            </StyledToggleButtonGroup>

            {/* Сортировка (как на макете) */}
            <FormControl size="small" sx={{ minWidth: 240 }}>
                <Select
                    value={`${filters.sortColumn}|${filters.sortDirection}`}
                    onChange={(e) => {
                        const [column, direction] = e.target.value.split('|');
                        setFilters({ sortColumn: column as 'title' | 'createdAt', sortDirection: direction as 'asc' | 'desc', page: 1 });
                    }}
                    IconComponent={KeyboardArrowDownIcon}
                    sx={{
                        borderRadius: '12px',
                        backgroundColor: theme.palette.background.paper,
                        fontSize: '14px',
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.mode === 'dark' ? '#444' : '#eee',
                        },
                    }}
                >
                    <MenuItem value="createdAt|desc">По новизне (сначала новые)</MenuItem>
                    <MenuItem value="createdAt|asc">По новизне (сначала старые)</MenuItem>
                    <MenuItem value="title|asc">По названию (A-Z)</MenuItem>
                    <MenuItem value="title|desc">По названию (Z-A)</MenuItem>
                </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
                <Select
                    value={isDarkMode ? 'dark' : 'light'}
                    onChange={(e) => {
                        const newTheme = e.target.value;
                        const shouldBeDark = newTheme === 'dark';
                        if (shouldBeDark !== isDarkMode) {
                            toggleDarkMode();
                        }
                    }}
                    IconComponent={KeyboardArrowDownIcon}
                    sx={{
                        borderRadius: '12px',
                        backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#f5f5f5',
                        fontSize: '14px',
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.mode === 'dark' ? '#444' : '#eee',
                        },
                    }}
                >
                    <MenuItem value="light">Светлая</MenuItem>
                    <MenuItem value="dark">Тёмная</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
};
