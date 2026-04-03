import { Box, Container, Typography, Button, Paper, Grid } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined';
import {useNavigate, useParams} from "react-router-dom";

const mockAd = {
    id: '1',
    title: 'MacBook Pro 16"',
    price: 64000,
    publishedAt: '10 марта 22:39',
    editedAt: '10 марта 23:12',
    description: 'Продаю свой MacBook Pro 16" (2021) на чипе M1 Pro.\nСостояние отличное, работал бережно. Мощности хватает на всё: от сложного монтажа до кода, при этом ноутбук почти не греется.',
    needsRevision: true,
    missingFields: ['Цвет', 'Состояние'],
    characteristics: [
        { label: 'Тип', value: 'Ноутбук' },
        { label: 'Бренд', value: 'Apple' },
        { label: 'Модель', value: 'M1 Pro' },
    ]
};

export const AdDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                        {mockAd.title}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                        {mockAd.price.toLocaleString('ru-RU')} ₽
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        sx={{ textTransform: 'none', borderRadius: 1.5, px: 3 }}
                        onClick={() => navigate(`/ads/${id}/edit`)}
                    >
                        Редактировать
                    </Button>
                    <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body2" color="text.secondary">
                            Опубликовано: {mockAd.publishedAt}
                        </Typography>
                        {mockAd.editedAt && (
                            <Typography variant="body2" color="text.secondary">
                                Отредактировано: {mockAd.editedAt}
                            </Typography>
                        )}
                    </Box>
                </Box>
            </Box>

            {/* ================= MAIN CONTENT ================= */}
            <Grid container spacing={4}>

                {/* Левая колонка: Фото и Описание */}
                <Grid size={{ xs: 12, md: 7 }}>
                    {/* Заглушка для фото */}
                    <Box sx={{
                        width: '100%',
                        height: 400,
                        backgroundColor: 'background.paper',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 2,
                        mb: 4,
                        border: '1px solid',
                        borderColor: 'divider'
                    }}>
                        <InsertPhotoOutlinedIcon sx={{ fontSize: 100, color: 'text.disabled' }} />
                    </Box>

                    {/* Описание */}
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        Описание
                    </Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                        {mockAd.description}
                    </Typography>
                </Grid>

                {/* Правая колонка: Предупреждения и Характеристики */}
                <Grid size={{ xs: 12, md: 5 }}>

                    {/* Блок предупреждения (рендерится только если needsRevision = true) */}
                    {mockAd.needsRevision && mockAd.missingFields && (
                        <Paper sx={{
                            p: 3,
                            mb: 4,
                            backgroundColor: '#fff4e5', // Светло-оранжевый фон из макета
                            color: '#663c00', // Темно-оранжевый текст
                            borderRadius: 2,
                            boxShadow: 'none'
                        }}>
                            <Box sx={{ display: 'flex', gap: 1.5, mb: 1 }}>
                                <ErrorOutlineIcon color="warning" />
                                <Typography sx={{ fontWeight: 600 }}>
                                    Требуются доработки
                                </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ ml: 4, mb: 1 }}>
                                У объявления не заполнены поля:
                            </Typography>
                            <Box component="ul" sx={{ m: 0, pl: 6 }}>
                                {mockAd.missingFields.map((field) => (
                                    <Typography component="li" variant="body2" key={field}>
                                        {field}
                                    </Typography>
                                ))}
                            </Box>
                        </Paper>
                    )}

                    {/* Характеристики */}
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        Характеристики
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        {mockAd.characteristics.map((char) => (
                            <Box key={char.label} sx={{ display: 'flex' }}>
                                <Typography variant="body2" color="text.secondary" sx={{ width: 140, flexShrink: 0 }}>
                                    {char.label}
                                </Typography>
                                <Typography variant="body2">
                                    {char.value}
                                </Typography>
                            </Box>
                        ))}
                    </Box>

                </Grid>
            </Grid>
        </Container>
    );
};
