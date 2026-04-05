import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { itemsApi } from '../../../shared/api/itemsApi';
import type { Category, ItemParams } from '../../../shared/api/types';

interface FormDataType {
  category: Category;
  title: string;
  price: string;
  description: string;
  [key: string]: string | number | undefined;
}

export const useAdEditForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState<FormDataType>({
    category: 'electronics',
    title: '',
    price: '',
    description: '',
  });

  const [errors, setErrors] = useState<{ title?: boolean; price?: boolean }>({});
  const [isLoading, setIsLoading] = useState(!!id);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; type: 'success' | 'error'; text: string }>({
    open: false,
    type: 'success',
    text: '',
  });

  useEffect(() => {
    if (!id) return;
    const fetchAd = async () => {
      try {
        const response = await itemsApi.getItem(id);
        setFormData({
          category: response.category,
          title: response.title,
          price: response.price.toString(),
          description: response.description || '',
          ...response.params,
        });
      } catch {
        setToast({ open: true, type: 'error', text: 'Ошибка при загрузке объявления' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchAd();
  }, [id]);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleClear = (field: string) => {
    setFormData(prev => ({ ...prev, [field]: '' }));
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  const getParamFields = () => {
    const baseParams = ['brand', 'model'];
    switch (formData.category) {
      case 'auto':
        return [...baseParams, 'yearOfManufacture', 'transmission', 'mileage', 'enginePower'];
      case 'real_estate':
        return ['type', 'address', 'area', 'floor'];
      case 'electronics':
        return ['type', ...baseParams, 'condition', 'color'];
      default:
        return [];
    }
  };

  const getParamLabel = (param: string): string => {
    const labels: Record<string, string> = {
      brand: 'Бренд',
      model: 'Модель',
      yearOfManufacture: 'Год выпуска',
      transmission: 'Коробка передач',
      mileage: 'Пробег (км)',
      enginePower: 'Мощность двигателя (л.с.)',
      type: 'Тип',
      address: 'Адрес',
      area: 'Площадь (м²)',
      floor: 'Этаж',
      condition: 'Состояние',
      color: 'Цвет'
    };
    return labels[param] || param;
  };

  const getParamInputType = (param: string): string => {
    return ['yearOfManufacture', 'mileage', 'enginePower', 'area', 'floor'].includes(param)
      ? 'number'
      : 'text';
  };

  const getParamOptions = (param: string): string[] | null => {
    const options: Record<string, string[]> = {
      transmission: ['automatic', 'manual'],
      type: formData.category === 'real_estate' ? ['flat', 'house', 'room'] : ['phone', 'laptop', 'misc'],
      condition: ['new', 'used'],
    };
    return options[param] || null;
  };

  const buildParams = (): ItemParams => {
    const paramFields = getParamFields();
    const params: Record<string, string | number> = {};

    paramFields.forEach(field => {
      if (formData[field] !== undefined && formData[field] !== '') {
        const value = formData[field];
        if (['yearOfManufacture', 'mileage', 'enginePower', 'area', 'floor'].includes(field)) {
          const numValue = Number(value);
          if (!isNaN(numValue)) {
            params[field] = numValue;
          }
        } else {
          params[field] = value;
        }
      }
    });

    return params as ItemParams;
  };

  const handleSave = async () => {
    const newErrors = { title: !formData.title.trim(), price: !String(formData.price).trim() };
    if (newErrors.title || newErrors.price) {
      setErrors(newErrors);
      setToast({ open: true, type: 'error', text: 'Ошибка сохранения: заполните обязательные поля' });
      return;
    }

    try {
      setIsSaving(true);

      const data = {
        category: formData.category,
        title: formData.title,
        price: Number(formData.price),
        params: buildParams(),
      };

      if (formData.description && formData.description.trim()) {
        (data as Record<string, unknown>).description = formData.description.trim();
      }

      if (id) {
        await itemsApi.updateItem(id, data);
        setToast({ open: true, type: 'success', text: 'Изменения сохранены' });
      } else {
        setToast({ open: true, type: 'error', text: 'Ошибка: не найден ID объявления' });
        return;
      }

      setTimeout(() => navigate(`/ads/${id}`), 500);
    } catch (error) {
      console.error('Ошибка при сохранении:', error);
      const errorMessage = error instanceof Error ? error.message : 'Ошибка при сохранении';
      setToast({ open: true, type: 'error', text: errorMessage });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    id,
    formData,
    setFormData: (data: typeof formData) => setFormData(data),
    errors,
    isLoading,
    isSaving,
    toast,
    setToast,
    handleChange,
    handleClear,
    getParamFields,
    getParamLabel,
    getParamInputType,
    getParamOptions,
    handleSave,
  };
};
