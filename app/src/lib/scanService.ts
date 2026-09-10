import { supabase } from './supabase';
import { PackagedFoodScanResult } from '../types';

export async function logPackagedScan(scan: PackagedFoodScanResult): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not signed in');

  const { error } = await supabase.from('packaged_scans').insert({
    user_id: user.id,
    barcode: scan.barcode,
    product_name: scan.productName,
    calories_per_100g: scan.caloriesPer100g,
    nutri_score: scan.nutriScore,
    nova_group: scan.novaGroup,
  });

  if (error) throw error;
}

export async function fetchTodaysScans(): Promise<PackagedFoodScanResult[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from('packaged_scans')
    .select('barcode, product_name, calories_per_100g, nutri_score, nova_group')
    .eq('user_id', user.id)
    .gte('logged_at', startOfDay.toISOString());

  if (error || !data) return [];

  return data.map((s: any) => ({
    barcode: s.barcode,
    productName: s.product_name,
    caloriesPer100g: s.calories_per_100g,
    nutriScore: s.nutri_score,
    novaGroup: s.nova_group,
    ingredientsText: null,
  }));
}
