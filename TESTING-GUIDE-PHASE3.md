# Руководство по тестированию Фазы 3

## 🧪 Быстрое локальное тестирование

### 1. Запуск сервера
```bash
cd /Users/evgenij/Development/WEB/gartenbau
python3 -m http.server 8000
```

Открыть: http://localhost:8000

---

## ✅ Чек-лист функциональности

### FAQ Секция
- [ ] Секция FAQ отображается перед формой контактов
- [ ] 7 вопросов видны
- [ ] Клик на вопрос открывает ответ
- [ ] Иконка "+" меняется на "×" при раскрытии
- [ ] Только один FAQ открыт одновременно
- [ ] Повторный клик закрывает FAQ
- [ ] Анимация плавная (300ms)

### Мобильная версия (iPhone/Android)
```bash
# Chrome DevTools
# F12 → Toggle Device Toolbar (Ctrl+Shift+M)
# Выбрать: iPhone 12 Pro (390×844)
```

- [ ] FAQ читается на мобилах
- [ ] Кнопки достаточно большие для тапа (44×44px)
- [ ] Текст не обрезается
- [ ] Анимация работает плавно

### Доступность (Accessibility)
```bash
# Тестирование клавиатурой
# Tab - переход между FAQ
# Enter/Space - открытие FAQ
# Shift+Tab - назад
```

- [ ] FAQ доступны через клавиатуру
- [ ] `aria-expanded` меняется (true/false)
- [ ] Screen reader читает вопросы корректно

---

## 🔍 Schema.org Валидация

### Google Rich Results Test

**URL для теста:**
https://search.google.com/test/rich-results

**Что тестировать:**
1. Вставить весь код из `index.html`
2. Или ввести URL: `https://gartenbauzm.de/` (после деплоя)

**Ожидаемые результаты:**

#### ✅ LocalBusiness
```
✓ Valid LocalBusiness schema found
✓ name: "Gartenbau Z.M."
✓ address: Lerchenrain 9, 71686 Remseck am Neckar
✓ telephone: +49 178 2747470
✓ geo: 48.8951, 9.2742
✓ aggregateRating: 5.0 (25 reviews)
```

#### ✅ BreadcrumbList
```
✓ Valid BreadcrumbList schema found
✓ 5 items:
  - Position 1: Home
  - Position 2: Leistungen
  - Position 3: Über uns
  - Position 4: Projekte
  - Position 5: Kontakt
```

#### ✅ FAQPage
```
✓ Valid FAQPage schema found
✓ 7 questions:
  1. Welche Dienstleistungen bietet Gartenbau Z.M. an?
  2. In welchen Regionen sind Sie tätig?
  3. Bieten Sie kostenlose Beratung und Kostenvoranschläge an?
  4. Wie lange dauert ein typisches Gartenbau-Projekt?
  5. Welche Materialien verwenden Sie für Natursteinarbeiten?
  6. Übernehmen Sie auch Wartung und Pflege nach Projektabschluss?
  7. Welche Zahlungsmöglichkeiten bieten Sie an?
```

#### ✅ Service Offers (7)
```
✓ Valid Offers found (7)
  1. Gartengestaltung (Landscaping)
  2. Natursteinarbeiten (Masonry)
  3. Terrassen & Plätze (Construction)
  4. Wege und Zufahrten (Paving)
  5. Landschaftsbau (Landscaping)
  6. Rollrasen-Verlegung (Landscaping)
  7. Hausmeisterservice (Maintenance)
```

---

## 🎨 Lighthouse Audit

```bash
# Chrome DevTools
# F12 → Lighthouse → Generate report
```

### Целевые показатели:
- **Performance:** 90+ ✅
- **Accessibility:** 95+ ✅ (с ARIA labels)
- **Best Practices:** 95+ ✅
- **SEO:** 100 ✅ (Schema.org полный)

### Проверка SEO метрик:
- [ ] `<title>` оптимизирован
- [ ] `<meta description>` уникален
- [ ] Canonical URL установлен
- [ ] Schema.org валиден
- [ ] Geo meta-теги установлены
- [ ] llm.txt доступен

---

## 🌐 Кросс-браузерное тестирование

### Desktop
- [ ] Chrome (последняя версия)
- [ ] Firefox (последняя версия)
- [ ] Safari (macOS)
- [ ] Edge (последняя версия)

### Mobile
- [ ] Safari iOS (iPhone)
- [ ] Chrome Android (Galaxy/Pixel)
- [ ] Samsung Internet

### Что проверять:
- FAQ аккордеон работает
- Анимация плавная
- CSS Grid/Flexbox правильно отображается
- Шрифты загружаются

---

## 📱 Реальные устройства

### iPhone/iPad
```
Safari → http://192.168.x.x:8000
# (IP адрес компьютера в локальной сети)
```

### Android
```
Chrome → http://192.168.x.x:8000
```

**Проверить:**
- [ ] Touch targets достаточно большие
- [ ] Scroll плавный
- [ ] Анимация не лагает
- [ ] FAQ читабельны

---

## 🔧 Инструменты для тестирования

### 1. Schema.org Validator
**URL:** https://validator.schema.org/

**Использование:**
1. Скопировать весь `<script type="application/ld+json">` блок
2. Вставить в "Code Snippet"
3. Run Test
4. Проверить "No Errors" ✅

### 2. Google Rich Results Test
**URL:** https://search.google.com/test/rich-results

**Использование:**
1. Вставить URL: `https://gartenbauzm.de/`
2. Test URL
3. Проверить "Valid items detected" ✅

### 3. Structured Data Testing Tool (deprecated, но работает)
**URL:** https://search.google.com/structured-data/testing-tool

### 4. axe DevTools (Accessibility)
**Chrome Extension:** axe DevTools - Web Accessibility Testing

**Использование:**
1. Открыть DevTools → axe tab
2. Scan All of My Page
3. Проверить "0 Violations" ✅

### 5. WAVE (Web Accessibility Evaluation Tool)
**URL:** https://wave.webaim.org/

**Использование:**
1. Ввести URL после деплоя
2. Проверить отсутствие ошибок
3. Убедиться что ARIA корректен

---

## 🐛 Типичные проблемы и решения

### FAQ не открывается
**Причина:** JavaScript не загрузился
**Решение:**
```javascript
// Проверить в Console
console.log(typeof initFAQ); // должно быть "function"

// Проверить инициализацию
document.addEventListener('DOMContentLoaded', () => {
  console.log('FAQ items:', document.querySelectorAll('.faq-item').length);
});
```

### Schema.org не валидируется
**Причина:** Синтаксическая ошибка в JSON
**Решение:**
```bash
# Проверить JSON синтаксис
cat index.html | grep -A 100 'application/ld+json' | head -150 | jq .
```

### FAQ анимация дёргается
**Причина:** Не установлен `max-height` достаточно большой
**Решение:**
```css
.faq-item.active .faq-answer {
  max-height: 500px; /* увеличить если нужно */
}
```

### ARIA не работает для Screen Readers
**Причина:** `aria-expanded` не обновляется
**Решение:**
```javascript
// Проверить в initFAQ():
question.setAttribute('aria-expanded', 'true'); // при открытии
question.setAttribute('aria-expanded', 'false'); // при закрытии
```

---

## ✅ Финальный чек-лист перед деплоем

### Локальное тестирование
- [ ] Python сервер запущен
- [ ] FAQ аккордеон работает (все 7)
- [ ] Анимация плавная
- [ ] Мобильная версия корректна
- [ ] Клавиатурная навигация работает

### Schema.org валидация
- [ ] LocalBusiness - VALID
- [ ] BreadcrumbList - VALID
- [ ] FAQPage - VALID (7 items)
- [ ] Service schemas - VALID (7 items)

### Performance
- [ ] Lighthouse: Performance 90+
- [ ] Lighthouse: Accessibility 95+
- [ ] Lighthouse: SEO 100
- [ ] No console errors

### Cross-browser
- [ ] Chrome - OK
- [ ] Firefox - OK
- [ ] Safari - OK
- [ ] Mobile Safari - OK
- [ ] Chrome Android - OK

### Git
- [ ] Все изменения закоммичены
- [ ] Commit message информативен
- [ ] Git log чистый

---

## 🚀 Деплой

```bash
# Финальная проверка
git status
git log --oneline -5

# Push в production
git push origin main

# После деплоя (через 5-10 минут):
# 1. Открыть https://gartenbauzm.de/
# 2. Проверить FAQ работает
# 3. Rich Results Test с реальным URL
# 4. Google Search Console → Submit sitemap
```

---

## 📊 Мониторинг после деплоя

### Google Search Console
1. Зайти в GSC: https://search.google.com/search-console
2. Добавить property (если ещё нет): `gartenbauzm.de`
3. Submit sitemap: `https://gartenbauzm.de/sitemap.xml`
4. Мониторинг Rich Results:
   - Coverage → Valid
   - Enhancements → FAQ (должны появиться через 2-4 недели)

### Метрики для отслеживания
- **Impressions:** Рост за счёт FAQ Rich Results
- **CTR:** +15-25% для страниц с FAQ
- **Average Position:** Улучшение для "gartenbau stuttgart faq"
- **FAQ Rich Results:** Появление в течение 2-4 недель

---

**Время тестирования:** ~30-60 минут
**Критичность:** HIGH (перед production деплоем)
**Ответственный:** Разработчик + QA

**Дата создания:** 15.02.2026
**Последнее обновление:** 15.02.2026
