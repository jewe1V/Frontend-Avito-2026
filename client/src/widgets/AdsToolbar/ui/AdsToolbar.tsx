import {Box, TextField, InputAdornment, ToggleButton, ToggleButtonGroup, Button, IconButton} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ViewListIcon from '@mui/icons-material/ViewList';
import GridViewIcon from '@mui/icons-material/GridView';
import { useNavigate } from 'react-router-dom';
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import { useAdsStore } from '../../../entities/ad/model/useAdsStore';

export const AdsToolbar = () => {
    const { filters, viewMode, setFilters, setViewMode } = useAdsStore();
    const navigate = useNavigate();
    const { isDarkMode, toggleDarkMode } = useAdsStore();

    return (
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
                fullWidth
                placeholder="Найти объявление..."
                size="small"
                value={filters.q}
                onChange={(e) => setFilters({ q: e.target.value, page: 1 })}
                slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> } }}
                sx={{ backgroundColor: 'background.paper', borderRadius: 1 }}
            />

            <ToggleButtonGroup value={viewMode} exclusive onChange={(_, val) => val && setViewMode(val)} size="small" sx={{ backgroundColor: 'background.paper' }}>
                <ToggleButton value="grid"><GridViewIcon /></ToggleButton>
                <ToggleButton value="list"><ViewListIcon /></ToggleButton>
            </ToggleButtonGroup>
            <IconButton onClick={toggleDarkMode}>
                {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            <Button
                variant="contained"
                onClick={() => navigate('/ads/create')}
                sx={{ ml: 'auto', textTransform: 'none' }}
            >
                Создать объявление
            </Button>
        </Box>
    );
};
