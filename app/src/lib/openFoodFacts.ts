import { PackagedFoodScanResult } from '../types';

// Open Food Facts is a free, open, community-maintained product database.
// No API key required. Docs: https://openfoodfacts.github.io/api-documentation/
const BASE_URL = 'https://world.openfoodfacts.org/api/v2/product';

export async function lookupBarcode(
  barcode: string
): Promise<PackagedFoodScanResult | null> {
  const res = await fetch(`${BASE_URL}/${barcode}.json`);
  const data = await res.json();

  if (data.status !== 1 || !data.product) {
    return null; // not found in the database
  }

  const p = data.product;

  return {
    barcode,
    productName: p.product_name || 'Unknown product',
    caloriesPer100g: p.nutriments?.['energy-kcal_100g'] ?? null,
    nutriScore: p.nutriscore_grade ?? null,
    novaGroup: p.nova_group ?? null,
    ingredientsText: p.ingredients_text ?? null,
  };
}

/**
 * Turns Open Food Facts data into a simple health score.
 * Deliberately NOT inventing a proprietary scoring formula — Nutri-Score and
 * NOVA are established, peer-reviewed classification systems. We just
 * surface them clearly instead of re-deriving our own.
 */
export function describeHealthScore(result: PackagedFoodScanResult): string {
  const parts: string[] = [];

  if (result.nutriScore) {
    parts.push(`Nutri-Score ${result.nutriScore.toUpperCase()}`);
  }
  if (result.novaGroup) {
    const novaLabels: Record<number, string> = {
      1: 'unprocessed/minimally processed',
      2: 'processed culinary ingredient',
      3: 'processed food',
      4: 'ultra-processed food',
    };
    parts.push(novaLabels[result.novaGroup]);
  }

  return parts.length > 0 ? parts.join(' · ') : 'No health data available';
}
