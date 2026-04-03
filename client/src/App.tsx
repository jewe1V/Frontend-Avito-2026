import { Routes, Route} from 'react-router-dom';
import { AdsPage } from './pages/AdsPage/ui/AdsPage';
import { useMemo } from 'react';
import {createTheme, CssBaseline, ThemeProvider} from '@mui/material';
import { useAdsStore } from './entities/ad/model/useAdsStore';
import {AdDetailsPage} from "./pages/AdDetails/ui/AdDetailsPage.tsx";
import { AdEditPage } from './pages/AdEdit/ui/AdEditPage.tsx';

function App() {
    const isDarkMode = useAdsStore((state) => state.isDarkMode);
    const theme = useMemo(() => createTheme({
        palette: {
            mode: isDarkMode ? 'dark' : 'light',
            background: {
                default: isDarkMode ? '#121212' : '#F7F5F8',
                paper: isDarkMode ? '#1e1e1e' : '#ffffff',
            },
        },
        typography: { fontFamily: 'Inter, sans-serif' },
    }), [isDarkMode]);

  return (
      <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<AdsPage />} />
            {/* Маршрут для детальной страницы товара, когда она будет готова */}
            <Route path="/ads/:id" element={<AdDetailsPage />} />
              <Route path="/ads/:id" element={<AdDetailsPage />} />
              <Route path="/ads/create" element={<AdEditPage />} />
              <Route path="/ads/:id/edit" element={<AdEditPage />} />
          </Routes>
      </ThemeProvider>
  );
}

export default App;
