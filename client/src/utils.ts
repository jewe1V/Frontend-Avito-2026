export const formatLabel = (key: string): string => {
    const labels: Record<string, string> = {
        brand: 'Бренд',
        model: 'Модель',
        yearOfManufacture: 'Год выпуска',
        transmission: 'Коробка передач',
        mileage: 'Пробег',
        enginePower: 'Мощность двигателя',
        type: 'Тип',
        address: 'Адрес',
        area: 'Площадь',
        floor: 'Этаж',
        condition: 'Состояние',
        color: 'Цвет'
    };
    return labels[key] || key;
};

export const formatValue = (value: string | number | boolean): string => {
    if (typeof value === 'number') {
        return value.toLocaleString('ru-RU');
    }
    const valueLabels: Record<string, string> = {
        'automatic': 'Автоматическая',
        'manual': 'Механическая',
        'flat': 'Квартира',
        'house': 'Дом',
        'room': 'Комната',
        'phone': 'Телефон',
        'laptop': 'Ноутбук',
        'misc': 'Прочее',
        'new': 'Новое',
        'used': 'Б/у'
    };
    return valueLabels[String(value)] || String(value);
};
