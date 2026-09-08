// Supabase Edge Function (Deno runtime). Deploy with:
//   supabase functions deploy score-meal
//
// This is intentionally thin — the heavy lifting (classification) already
// happened on-device. This function's job is just to take the
// user-confirmed ingredient list, look up authoritative nutrition data,
// and persist the final meal. Keeping it thin keeps it inside the free
// tier's function-invocation limits.

// @ts-ignore - Deno global available in Supabase Edge runtime
Deno.serve(async (req: Request) => {
  const { mealId, items } = await req.json();

  // items: { name: string, estimatedGrams: number }[]
  // TODO: for each item, call USDA FoodData Central (or reuse a cached
  // lookup) to get calories_per_100g, then compute total and write to
  // the meal_items + meals tables via the Supabase service client.

  const totalCalories = 0; // placeholder until USDA lookups are wired in

  return new Response(
    JSON.stringify({ mealId, totalCalories, status: 'stub - not yet implemented' }),
    { headers: { 'Content-Type': 'application/json' } }
  );
});
