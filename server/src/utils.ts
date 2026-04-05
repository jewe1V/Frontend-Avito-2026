import type { Item } from './types.ts';
import {
  AutoItemParamsSchema,
  ElectronicsEstateItemParamsSchema,
  RealEstateItemParamsSchema,
  AutoItemParamsMinimalSchema,
  ElectronicsEstateItemParamsMinimalSchema,
  RealEstateItemParamsMinimalSchema,
} from './validation.ts';

export const doesItemNeedRevision = (item: Item): boolean =>
  !Boolean(item.description) ||
  !(() => {
    if (item.category === 'auto')
      return AutoItemParamsSchema.safeParse(item.params).success;
    if (item.category === 'real_estate')
      return RealEstateItemParamsSchema.safeParse(item.params).success;

    return ElectronicsEstateItemParamsSchema.safeParse(item.params).success;
  })();

/**
 * Получить список пропущенных обязательных полей для объявления
 */
export const getMissingFields = (item: Item): string[] => {
  const missing: string[] = [];

  // Check description
  if (!item.description) {
    missing.push('Описание');
  }

  // Check fields based on category
  const fieldsLabels: Record<string, string> = {
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

  let schema;
  if (item.category === 'auto') {
    schema = AutoItemParamsSchema;
  } else if (item.category === 'real_estate') {
    schema = RealEstateItemParamsSchema;
  } else {
    schema = ElectronicsEstateItemParamsSchema;
  }

  const result = schema.safeParse(item.params);
  if (!result.success && result.error) {
    result.error.issues.forEach((error) => {
      const field = error.path[0] as string;
      const label = fieldsLabels[field] || field;
      if (!missing.includes(label)) {
        missing.push(label);
      }
    });
  }

  return missing;
};
