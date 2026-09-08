// USDA FoodData Central — free public nutrition database.
// Get a free API key (instant, no cost) at https://fdc.nal.usda.gov/api-key-signup.html
const USDA_API_KEY = 'hzb9BIADcPR7PdEeon6ivitgeFOk2Ty5BRMhmiud';
const BASE_URL = 'https://api.nal.usda.gov/fdc/v1';

export interface UsdaFoodMatch {
  description: string;
  caloriesPer100g: number;
  fdcId: number;
}

/**
 * Looks up a food by name (e.g. "grilled chicken breast") and returns the
 * best match's calories per 100g. This is a naive first match — in
 * practice you'll want to show the user the top 3-5 matches and let them
 * pick, since "chicken" is ambiguous (fried vs grilled vs skin-on, etc).
 * See ARCHITECTURE.md, hard part #4.
 */
export async function searchFood(query: string): Promise<UsdaFoodMatch[]> {
  const url = `${BASE_URL}/foods/search?query=${encodeURIComponent(
    query
  )}&pageSize=5&api_key=${USDA_API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  return (data.foods || []).map((f: any) => {
    const energy = f.foodNutrients?.find(
      (n: any) => n.nutrientName === 'Energy' && n.unitName === 'KCAL'
    );
    return {
      description: f.description,
      caloriesPer100g: energy?.value ?? 0,
      fdcId: f.fdcId,
    };
  });
}
