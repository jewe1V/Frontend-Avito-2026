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
    console.log('generatePrice запрос:', { model: 'llama3', prompt: prompt.substring(0, 100) });
    
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

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let fullResponse = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.trim()) continue;
        
        try {
          const json = JSON.parse(line);
          if (json.response) {
            fullResponse += json.response;
            onStream(json.response);
          }
        } catch (e) {
          console.warn('Не удалось распарсить JSON строку:', line);
        }
      }
    }

    // Обработаем оставшийся буфер
    if (buffer.trim()) {
      try {
        const json = JSON.parse(buffer);
        if (json.response) {
          fullResponse += json.response;
          onStream(json.response);
        }
      } catch (e) {
        console.warn('Не удалось распарсить финальный буфер:', buffer);
      }
    }

    console.log('generatePrice ответ:', fullResponse);
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
    console.log('generateDescription запрос:', { model: 'llama3', prompt: prompt.substring(0, 100) });
    
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

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let fullResponse = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.trim()) continue;
        
        try {
          const json = JSON.parse(line);
          if (json.response) {
            fullResponse += json.response;
            onStream(json.response);
          }
        } catch (e) {
          console.warn('Не удалось распарсить JSON строку:', line);
        }
      }
    }

    // Обработаем оставшийся буфер
    if (buffer.trim()) {
      try {
        const json = JSON.parse(buffer);
        if (json.response) {
          fullResponse += json.response;
          onStream(json.response);
        }
      } catch (e) {
        console.warn('Не удалось распарсить финальный буфер:', buffer);
      }
    }

    console.log('generateDescription ответ:', fullResponse);
    return fullResponse.trim();
  } catch (error) {
    console.error('Ошибка при генерации описания:', error);
    throw error;
  }
};
