# 🐳 Docker Development Server

Быстрый способ запустить локальный сервер для разработки сайта Gartenbau Z.M.

## 🚀 Быстрый старт

### Обычный режим (только веб-сервер):
```bash
docker-compose up -d
```
Сайт будет доступен по адресу: **http://localhost:3000**

### Режим разработки с live-reload:
```bash
docker-compose --profile dev up -d
```
- Основной сайт: **http://localhost:3000**
- Live-reload сервер: **http://localhost:3001** (автоматически перезагружается при изменениях)

## 🛠 Команды

```bash
# Запустить сервер
docker-compose up -d

# Запустить с live-reload для разработки
docker-compose --profile dev up -d

# Остановить сервер
docker-compose down

# Пересобрать контейнер после изменений
docker-compose up --build -d

# Посмотреть логи
docker-compose logs -f

# Войти в контейнер
docker-compose exec gartenbau-website sh
```

## 📁 Что включено

- **Nginx** веб-сервер для статических файлов
- **Gzip** сжатие для оптимизации
- **Кэширование** статических ресурсов
- **Security headers** для безопасности
- **Live-reload** для разработки (опционально)
- **Volume mapping** для изменений в реальном времени

## 🔧 Конфигурация

- **Port 3000**: Основной веб-сервер
- **Port 3001**: Live-reload сервер (только в dev режиме)
- **nginx.conf**: Настройки веб-сервера
- **docker-compose.yml**: Конфигурация контейнеров

## 📝 Примечания

- Все изменения в файлах автоматически отражаются в контейнере
- Для production использовать только основной профиль без `--profile dev`
- Логи nginx доступны через `docker-compose logs`