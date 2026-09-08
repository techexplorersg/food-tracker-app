# Roadmap

## Phase 0 — Foundation (this scaffold)
- [x] Repo structure, navigation, screen skeletons
- [x] Supabase schema
- [x] Nutrition math + Open Food Facts/USDA client stubs
- [ ] Create your free Supabase project, run `schema.sql`, plug keys into
      `app/src/lib/supabase.ts`
- [ ] Get a free USDA API key, plug into `app/src/lib/usda.ts`
- [ ] Run `npx expo start` and confirm the app boots on your phone via
      Expo Go

## Phase 1 — Barcode scanning end-to-end (the easy win, do this first)
- [ ] Wire `BarcodeScanScreen` "Add to today's log" button to write into
      `packaged_scans`
- [ ] Show today's packaged-food entries on `MealLogScreen`
- This path has no ML risk — it's the fastest way to a genuinely working
  feature and a good forcing function for auth + DB wiring.

## Phase 2 — On-device food classifier (the risky piece)
- [ ] Get a pretrained/fine-tuned food classification model (Food-101
      based, MobileNetV2, or similar — free options exist via TF Hub /
      Kaggle notebooks)
- [ ] Export to `.tflite` (Android) and Core ML (iOS)
- [ ] Replace the stub in `app/src/lib/foodClassifier.ts` with real
      inference, keeping the same function signature
- [ ] Build the portion-size confirm/edit UI in `CameraScreen`
      (reference-object or small/medium/large slider)
- [ ] Wire confirmed items → `nutrition.ts` → save `Meal` to Supabase

## Phase 3 — Multi-plate meals
- [ ] "Add another plate" flow in `CameraScreen` — group photos under one
      `meal_id`, tag with `plateIndex`
- [ ] Meal summary view showing all plates + combined total

## Phase 4 — Daily calorie limit + water reminders
- [x] Local notification scheduling (already in scaffold, zero backend
      cost)
- [ ] Persist `user_settings` to Supabase, load on app start
- [ ] Visual daily-limit progress bar on `MealLogScreen`

## Phase 5 — Polish
- [ ] Real UI design pass (this scaffold uses bare React Native styling —
      see the earlier design note: worth a dedicated pass once flows work)
- [ ] Offline queueing (log meals with no network, sync later)
- [ ] Image compression before upload (control Supabase storage costs)

## Suggested order to actually build in
Phase 1 → Phase 4 (both low-risk, fast wins that make the app feel real)
→ Phase 2 (the hard part, now with a working app around it to test in)
→ Phase 3 → Phase 5.
