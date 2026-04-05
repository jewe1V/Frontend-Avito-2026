import { z } from 'zod';
import { ITEM_CATEGORIES } from './constants.ts';
import { ItemSortColumn, SortDirection } from './types.ts';

const AutoTransmissionSchema = z.enum(['automatic', 'manual']);

// Обязательные схемы для видимости объявления (без .partial())
export const AutoItemParamsSchema = z.strictObject({
  brand: z.string().nonempty(),
  model: z.string().nonempty(),
  yearOfManufacture: z.number().int().positive(),
  transmission: AutoTransmissionSchema,
  mileage: z.number().positive(),
  enginePower: z.number().int().positive(),
});

const RealEstateTypeSchema = z.enum(['flat', 'house', 'room']);

export const RealEstateItemParamsSchema = z.strictObject({
  type: RealEstateTypeSchema,
  address: z.string().nonempty(),
  area: z.number().positive(),
  floor: z.number().int().positive(),
});

const ElectronicsTypeSchema = z.enum(['phone', 'laptop', 'misc']);
const ElectronicsConditionSchema = z.enum(['new', 'used']);

export const ElectronicsEstateItemParamsSchema = z.strictObject({
  type: ElectronicsTypeSchema,
  brand: z.string().nonempty(),
  model: z.string().nonempty(),
  condition: ElectronicsConditionSchema,
  color: z.string().nonempty(),
});

// Минимально требуемые поля для каждой категории
export const AutoItemParamsMinimalSchema = z.strictObject({
  brand: z.string().nonempty().optional(),
  model: z.string().nonempty().optional(),
  yearOfManufacture: z.number().int().positive().optional(),
  transmission: AutoTransmissionSchema.optional(),
  mileage: z.number().positive().optional(),
  enginePower: z.number().int().positive().optional(),
}).refine(
  (data) => {
    const hasAtLeastOne = Object.values(data).some(val => val !== undefined && val !== null && val !== '');
    return hasAtLeastOne;
  },
  { message: 'At least one field must be filled' }
);

export const RealEstateItemParamsMinimalSchema = z.strictObject({
  type: RealEstateTypeSchema.optional(),
  address: z.string().nonempty().optional(),
  area: z.number().positive().optional(),
  floor: z.number().int().positive().optional(),
}).refine(
  (data) => {
    const hasAtLeastOne = Object.values(data).some(val => val !== undefined && val !== null && val !== '');
    return hasAtLeastOne;
  },
  { message: 'At least one field must be filled' }
);

export const ElectronicsEstateItemParamsMinimalSchema = z.strictObject({
  type: ElectronicsTypeSchema.optional(),
  brand: z.string().nonempty().optional(),
  model: z.string().nonempty().optional(),
  condition: ElectronicsConditionSchema.optional(),
  color: z.string().nonempty().optional(),
}).refine(
  (data) => {
    const hasAtLeastOne = Object.values(data).some(val => val !== undefined && val !== null && val !== '');
    return hasAtLeastOne;
  },
  { message: 'At least one field must be filled' }
);

const CategorySchema = z.enum(Object.values(ITEM_CATEGORIES));

export const ItemsGetInQuerySchema = z.object({
  q: z.string().trim().optional().default(''),
  limit: z
    .string()
    .optional()
    .transform(val => (val ? parseInt(val, 10) : undefined))
    .pipe(z.number().int().positive().optional().default(20)),
  skip: z
    .string()
    .optional()
    .transform(val => (val ? parseInt(val, 10) : undefined))
    .pipe(z.number().int().min(0).optional().default(0)),
  categories: z
    .string()
    .optional()
    .transform(val => (val ? val.split(',').map(s => s.trim()) : undefined))
    .pipe(z.array(CategorySchema).optional()),
  needsRevision: z
    .string()
    .optional()
    .transform(val => {
      if (!val) return undefined;
      return val === 'true' || val === '1';
    })
    .pipe(z.boolean().optional().default(false)),
  sortColumn: z.enum<ItemSortColumn[]>(['title', 'createdAt']).optional(),
  sortDirection: z.enum<SortDirection[]>(['asc', 'desc']).optional(),
});

export const ItemUpdateInSchema = z
  .object({
    category: CategorySchema,
    title: z.string(),
    description: z.string().optional(),
    price: z.number().min(0),
  })
  .and(
    z.discriminatedUnion('category', [
      z.object({
        category: z.literal(ITEM_CATEGORIES.AUTO),
        params: AutoItemParamsSchema.partial(),
      }),
      z.object({
        category: z.literal(ITEM_CATEGORIES.REAL_ESTATE),
        params: RealEstateItemParamsSchema.partial(),
      }),
      z.object({
        category: z.literal(ITEM_CATEGORIES.ELECTRONICS),
        params: ElectronicsEstateItemParamsSchema.partial(),
      }),
    ]),
  );
