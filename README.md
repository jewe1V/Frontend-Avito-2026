# Avito AI Assistant

Веб-приложение — личный кабинет продавца с интегрированным AI-ассистентом, который помогает улучшать описания объявлений.

## 🚀 Особенности

- ⚡ Streaming API
- 🌙 Темная тема
- ⏳ SkeletonLoader 

---

## 🛠 Стек технологий
- Node.js v20+
- React v18+
- Vite
- Feature-Sliced Design (FSD)  
- Docker Compose  
- Zustand
- Material UI (MUI)  
- Axios
- Ollama 

---

## ⚙️ Запуск проекта

1. Установите [Ollama](https://ollama.com/)
2. Загрузите модель:
   ```bash
   ollama pull llama3
   ```
3. Убедитесь, что Ollama запущена:
   ```bash
   ollama serve
   ```
4. Запустить проект:
  ```bash
  docker compose up --build
  ```
5. Открыть в браузере
http://localhost:5173/

