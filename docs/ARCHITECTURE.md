# Architecture

## Constraints driving every decision
- Scale: thousands of users
- Budget: $0 target
- These two together mean: **ML inference must run on-device**, not in the
  cloud, or per-scan costs will exceed the free tier quickly.

## Components
- **Mobile app** (Expo/React Native) — camera/upload, on-device food
  classifier, barcode/QR scanner, local water-reminder notifications.
- **Backend** (Supabase free tier) — auth, Postgres, storage, thin edge
  functions. See `backend/schema.sql`.
- **External free data** — Open Food Facts (barcode → product/ingredients/
  Nutri-Score/NOVA), USDA FoodData Central (food name → nutrition/100g).

## Hard parts (in priority order)
1. **Portion/weight estimation from a photo has no ground truth without a
   reference object.** The app always treats this as a user-confirmed
   estimate, never as an exact measurement — same approach every major
   calorie-tracking app uses.
2. **"$0 + thousands of users" caps what's possible for photo ML.**
   On-device inference is what makes this work; a cloud vision API would
   not survive real usage on a free tier.
3. **Multi-photo meal aggregation** — a meal groups N photos (one per
   plate) without double-counting. Modeled via `meals` → `meal_photos`
   (one-to-many) in the schema.
4. **Ingredient name → nutrition database mapping is ambiguous.** USDA
   search returns multiple candidates; the UI should let the user pick,
   not silently take the first result.
5. **Health/preservative scoring uses Nutri-Score + NOVA** (established,
   peer-reviewed systems already in Open Food Facts data) instead of a
   custom-invented formula.

## The riskiest piece: photo → ingredients → weight → calories
Two approaches were compared:

- **A — On-device classify + user-confirmed portion (chosen default).**
  $0 marginal cost, offline, infinite scale. Weaker on mixed/composite
  dishes; accuracy comes mostly from the user confirmation step.
- **B — Cloud vision/LLM ingredient decomposition (future "smart scan").**
  Better ingredient breakdown on complex plates, but costs money per call
  and won't survive at this budget/scale as the default path. Reserve as
  a limited quota feature later.
