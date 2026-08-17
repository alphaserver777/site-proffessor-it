# Маркетинговый сайт «Профессор IT»

Актуально на 17 августа 2026 года.

Astro-сайт продукта: продажник тест-драйва, четырёхчастный лонгрид, публичная
форма и страницы результата Prodamus. Рабочий backend и CRM находятся в
соседнем репозитории `/home/admsys/Work/lesson_record_bot`; стратегия и
операционные runbook — в `/home/admsys/Work/Marketing_proffessor_it`.

## Локальный запуск

```bash
npm ci
npm run dev
```

Production build:

```bash
npm run build
```

Основные маршруты:

- `/` — тест-драйв профессии за 1 000 ₽;
- `/guide/kak-voiti-v-it/`, `/2/`, `/3/`, `/4/` — лид-магнит;
- `/payment/success/`, `/payment/failed/` — Prodamus;
- `/resume.html`, `/business.html` — сохранённые legacy-страницы.

## Production

Сайт работает в VM 201 `192.168.50.111` российского Proxmox. TLS завершает
Traefik CT 202. Публикация выполняется immutable-релизом:

```bash
cd infra/ansible
./deploy.sh
```

Не использовать старые rsync-команды на `vm-robots-dev1` и каталог
`site-preview-current`: они относятся к выведенному контуру.

После deploy проверять минимум:

```bash
curl -fsS https://professorit.ru/ >/dev/null
curl -fsS https://professorit.ru/guide/kak-voiti-v-it/ >/dev/null
curl -fsS https://professorit.ru/payment/failed/ >/dev/null
```

Подробности: `infra/ansible/README.md` и
`../Marketing_proffessor_it/PLAN/14-production-infrastructure.md`.

## Аналитика

`src/scripts/article-series.ts` сохраняет first-touch UTM/campaign ID и
отправляет события глубины, активного чтения, переходов и CTA в
`POST /api/public/events`. Операционный runbook:
`../Marketing_proffessor_it/PLAN/26-site-analytics-runbook.md`.

## Правила

- секретов и админских токенов во frontend нет;
- CTA и внутренние ссылки сохраняют UTM и `campaign_id`;
- success redirect не подтверждает платёж — это делает webhook;
- изменения выкладываются только из чистого закоммиченного состояния;
- после визуального изменения проверить desktop, 390 px, reduced motion и
  отсутствие CLS/невидимого первого экрана.

