# Gartenbau Z.M. — Design System «Werkplan» (v8)

Дизайн-направление: сайт садово-ландшафтной фирмы как **рабочий чертёж / Werkplan**.
Точность, ремесло, честные фото реальных объектов. Никакого «AI-люкса»
(кремовый фон + серифы + терракота — ЗАПРЕЩЕНО, это прошлая тема).

## Токены (Tailwind 4 @theme, уже в src/styles/global.css)

Цвета:
- `paper`   #FAFAF8 — фон страницы (почти белый)
- `ink`     #14201A — основной текст, футер
- `pine`    #183527 — тёмно-еловый: тёмные секции, hero-баннеры подстраниц
- `pine-light` #224A36 — поверхности на pine (карточки отзывов)
- `moss`    #2E6B40 — средне-зелёный: ссылки, интерактив, hover
- `marker`  #F3C614 — маркировочный жёлтый (Markierungsfarbe со стройки): главный CTA, акценты, подчёркивания
- `marker-dark` #D9AD07 — hover жёлтого
- `stone`   #EFEDE6 — светло-серый фон чередующихся секций (НЕ кремовый)
- `line`    #DBD9CF — тонкие линии/бордеры
- `bark`    #55605A — приглушённый текст

Правила контраста: текст на marker — только ink. На pine/ink — белый и marker.

Шрифты (Google Fonts, подключены в MainLayout):
- `--font-display`: 'Archivo' (variable, wdth 100..125, wght 400..900) — заголовки.
  H1/H2 секций: UPPERCASE, `font-stretch:118%`, wght 750, tracking -0.01em, класс `font-display`.
  Заголовки карточек: обычный регистр, wght 700, stretch 110%.
- `--font-body`: 'Instrument Sans' — текст (400/500/600).
- `--font-mono`: 'IBM Plex Mono' (400/500) — ярлыки, коды, цифры, breadcrumbs, подписи фото, лейблы форм.

## Фирменные паттерны (классы уже в global.css)

- `.eyebrow` — mono-ярлык секции: 12px uppercase tracking .18em, перед ним жёлтая
  плашка 20×3px. Пример: `<p class="eyebrow">Leistungen</p>`
- `.mark-marker` — жёлтая маркерная подсветка слова в заголовке (как текстмаркер).
  На load/reveal — анимация «прокраса» слева направо. Используется 1 раз на страницу (hero).
- `.dim-line` — «размерная линия» с засечками по краям (как на чертеже) + mono-подпись.
- `.photo-frame` — фото с рамкой-«визирными уголками» (survey corner marks) и
  mono-подписью снизу: `ОБЪЕКТ · МЕСТО`. Уголки — жёлтые на тёмном, ink на светлом.
- `.lv-row` — строка «Leistungsverzeichnis»: mono-код `LV 01`, название (display 700),
  описание, стрелка →. Hover: фон stone + жёлтая полоса слева.
- Кнопки: `.btn` база (rounded-md=6px, font-semibold, px-7 py-3.5);
  `.btn-primary` — marker bg + ink text; `.btn-dark` — pine bg + white;
  `.btn-outline` — прозрачная с бордером (на светлом: border-ink/25 text-ink; на тёмном: border-white/30 text-white).
  Никаких rounded-full пилюль, никаких shimmer/sweep эффектов.

## Макро-паттерны страниц

- Header: fixed, фон paper/92 + blur, нижняя hairline `border-line`. Логотип:
  жёлтый квадратик 10px + «GARTENBAU Z.M.» (display, 800, stretch 118%). Нав-ссылки:
  mono uppercase 12.5px, активная — жёлтое подчёркивание 2px. Справа CTA-кнопка телефона (btn-primary, компактная).
- Hero подстраниц: тёмная секция `bg-pine text-white pt-32 pb-16`: mono-breadcrumb
  (серо-зелёный, `/` разделители), H1 display uppercase, подзаголовок bark-светлый,
  справа/снизу опционально mono-факты. Без волнистых SVG-разделителей (удалены навсегда).
- Секции контента: чередование `bg-paper` и `bg-stone`, py-20 md:py-28.
  Заголовок секции: `.eyebrow` + H2 display uppercase text-3xl/4xl + короткий подзаголовок text-bark.
- Чеклисты: квадратный жёлтый маркер-тик `✓` (mono) вместо терракотовых галочек.
- FAQ: details/summary, вопрос — body 600 (не серифы), `+` mono жёлтый в квадратной рамке line.
- CTA-band внизу страниц: bg-pine, H2 display uppercase white, btn-primary + btn-outline (белая).
- Footer: bg-ink, mono-заголовки колонок (uppercase, bark→marker hover), верхняя жёлтая
  полоса 3px. Внизу hairline, copyright + Impressum/Datenschutz.
- Фото: rounded-lg (8px), `border border-line`, mono-подписи. Реальные фото работ.
  ЗАПРЕЩЕНО: ken burns, floating svg-веточки, grain-оверлей.
- Reveal-анимации: только лёгкий fade-up 12px (класс `.reveal`, JS уже в MainLayout).
  Задержки каскада ≤ 100ms. Уважать prefers-reduced-motion (уже в global.css).

## Копирайтинг

Тон: уверенный мастер, короткие фразы, конкретика, немецкий «Sie».
Числа и факты — в mono. Кнопки называют действие: «Kostenlose Beratung anfragen»,
«Projekte ansehen». Никаких «Traumgarten»-клише в заголовках, вместо этого
конкретика: материал, место, срок.

## Данные компании (не менять)

Телефон +49 178 2747470 · info@gartenbauzm.de · Remseck am Neckar
Mo–Fr 08–18, Sa 09–14 · WhatsApp wa.me/491782747470
Google reviews: https://g.page/r/CZk_BZnPcSqHEB0/review (47 отзывов, 5.0)
Formspree action: https://formspree.io/f/xkgnqkwa

## Новые фото (public/img/)

- `baustelle-einfahrt.webp` — подготовка основания въезда (вертикальное)
- `baustelle-verdichtung.webp` — рабочий с виброплитой (вертикальное, РЕАЛЬНАЯ команда — использовать в «Über uns» вместо ai-шного team-arbeit.webp)
- `baustelle-randsteine.webp` — бетонирование бордюров + столбы забора
- `projekt-hangterrassen.webp` — готовые террасы с подпорными стенками и лестницей
- `projekt-rasen-fertig.webp` — газон с деревянным забором (готовый объект)
- `projekt-l-steine.webp` — монтаж L-образных блоков, мини-экскаватор (широкое)
- `projekt-garten-vorher.webp` — участок до работ (vorher)
Hero главной: `/img/image_20.webp` (готовый сад: газон + дорожка). 
