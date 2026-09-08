# Food Tracker App

Photo-based calorie & nutrition tracker. Take/upload a picture of a meal, get
an estimated ingredient + calorie breakdown, scan packaged food barcodes for
instant nutrition + health scoring, track a daily calorie budget, and get
water-intake reminders.

Full design discussion (scale decisions, hard parts, tradeoffs) lives in
`docs/ARCHITECTURE.md`. Build order lives in `docs/ROADMAP.md`.

## Repo layout

```
food-tracker-app/
├── app/                  # React Native (Expo) mobile app — iOS + Android
│   └── src/
│       ├── screens/      # UI screens
│       ├── lib/          # API clients, business logic (nutrition math, etc.)
│       └── types/        # Shared TypeScript types
├── backend/               # Supabase project: DB schema + edge functions
│   ├── schema.sql
│   └── functions/
├── docs/
│   ├── ARCHITECTURE.md
│   └── ROADMAP.md
└── .gitignore
```

## Why this stack (given: small scale, $0 budget)

- **Expo (React Native)** — one codebase for iOS + Android, free, no Mac
  required for Android builds, free OTA-ish dev workflow via Expo Go while
  building.
- **Supabase free tier** — Postgres DB, auth, storage, edge functions, all
  in one free project. (Firebase is an equally valid free alternative —
  swap `app/src/lib/supabase.ts` if you'd rather use that.)
- **On-device food classification** (TFLite/Core ML) — the only way to keep
  ML inference at $0 marginal cost regardless of user count.
- **Open Food Facts + USDA FoodData Central** — free, open nutrition
  databases, no API key cost.

## Getting started

```bash
cd app
npm install
npx expo start
```

Scan the QR code with Expo Go (iOS/Android) to run it on your phone.

You'll need to create a free Supabase project at supabase.com, run
`backend/schema.sql` in its SQL editor, and drop your project URL + anon key
into `app/src/lib/supabase.ts`.
