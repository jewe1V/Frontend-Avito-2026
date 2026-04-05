const OLLAMA_API_URL = 'http://localhost:11434/api/generate';

interface FormData {
  category: string;
  title: string;
  price?: string;
  description?: string;
  [key: string]: string | number | undefined;
}

const buildFormDataString = (formData: FormData): string => {
  const lines: string[] = [];
  
  const fieldLabels: Record<string, string> = {
    title: 'Название товара',
    category: 'Категория',
    price: 'Цена',
    description: 'Описание',
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

  Object.entries(formData).forEach(([key, value]) => {
    if (value && value !== '') {
      const label = fieldLabels[key] || key;
      lines.push(`${label}: ${value}`);
    }
  });

  return lines.join('\n');
};

export const generatePrice = async (
  formData: FormData,
  onStream: (chunk: string) => void
): Promise<string> => {
  const formDataStr = buildFormDataString(formData);
  
  const prompt = `Укажите рекомендуемую рыночную цену для объявления на основе предоставленной информации. Ответьте ТОЛЬКО цифрой без описания, примеры: 5000 или 25500.

${formDataStr}

Рекомендуемая цена:`;

  try {
    const response = await fetch(OLLAMA_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3',
        prompt: prompt,
        stream: true,
        temperature: 0.7
      })
    });

    if (!response.ok) throw new Error('API ошибка');

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';

    if (!reader) throw new Error('No response body');

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const text = decoder.decode(value);
      const lines = text.split('\n').filter(line => line.trim());

      for (const line of lines) {
        try {
          const json = JSON.parse(line);
          if (json.response) {
            fullResponse += json.response;
            onStream(json.response);
          }
        } catch {
          // Пропускаем строки, которые не являются JSON
        }
      }
    }

    const price = fullResponse.trim().match(/\d+/)?.[0] || '';
    return price;
  } catch (error) {
    console.error('Ошибка при генерации цены:', error);
    throw error;
  }
};

export const generateDescription = async (
  formData: FormData,
  onStream: (chunk: string) => void
): Promise<string> => {
  const formDataStr = buildFormDataString(formData);
  
  const prompt = `Напиши краткое привлекательное описание товара для интернет-магазина на русском языке. Ответь только в 1-2 предложения, максимум 100 слов. Будь конкретен и практичен.

${formDataStr}

Описание:`;

  try {
    const response = await fetch(OLLAMA_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3',
        prompt: prompt,
        stream: true,
        temperature: 0.7
      })
    });

    if (!response.ok) throw new Error('API ошибка');

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';

    if (!reader) throw new Error('No response body');

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const text = decoder.decode(value);
      const lines = text.split('\n').filter(line => line.trim());

      for (const line of lines) {
        try {
          const json = JSON.parse(line);
          if (json.response) {
            fullResponse += json.response;
            onStream(json.response);
          }
        } catch {
          // Пропускаем строки, которые не являются JSON
        }
      }
    }

    return fullResponse.trim();
  } catch (error) {
    console.error('Ошибка при генерации описания:', error);
    throw error;
  }
};
