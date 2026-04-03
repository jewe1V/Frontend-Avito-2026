import { Box, Typography, Checkbox, FormControlLabel, FormGroup, Switch, Button, Paper } from '@mui/material';
import type { Category } from '../../../shared/api/types';
import { useAdsStore } from '../../../entities/ad/model/useAdsStore';

export const Sidebar = () => {
    const { filters, setFilters, resetFilters } = useAdsStore();

    const handleCategoryToggle = (category: Category) => {
        const current = filters.categories;
        const updated = current.includes(category)
            ? current.filter((c) => c !== category)
            : [...current, category];

        setFilters({ categories: updated, page: 1 });
    };

    return (
        <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 'none', border: '1px solid', borderColor: 'divider',  textAlign: "left", gap: 24}}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Фильтры</Typography>

            <Typography variant="subtitle2" sx={{}}>Категория</Typography>
            <FormGroup sx={{ mb: 3 }}>
                <FormControlLabel
                    control={<Checkbox checked={filters.categories.includes('auto')} onChange={() => handleCategoryToggle('auto')} />}
                    label="Авто"
                />
                <FormControlLabel
                    control={<Checkbox checked={filters.categories.includes('electronics')} onChange={() => handleCategoryToggle('electronics')} />}
                    label="Электроника"
                />
                <FormControlLabel
                    control={<Checkbox checked={filters.categories.includes('real_estate')} onChange={() => handleCategoryToggle('real_estate')} />}
                    label="Недвижимость"
                />
            </FormGroup>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="body2" sx={{ maxWidth: '60%' }}>Только требующие доработок</Typography>
                <Switch
                    checked={filters.needsRevision}
                    onChange={(e) => setFilters({ needsRevision: e.target.checked, page: 1 })}
                />
            </Box>

            <Button variant="outlined" fullWidth onClick={resetFilters} sx={{ textTransform: 'none' }}>
                Сбросить фильтры
            </Button>
        </Paper>
    );
};
