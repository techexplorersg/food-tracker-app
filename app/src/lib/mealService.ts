import { supabase } from './supabase';
import { FoodItem, Meal } from '../types';
import { calculateMealCalories } from './nutrition';

/**
 * Saves a confirmed meal (one or more food items, from one or more plate
 * photos) to Supabase. Photo upload to Supabase Storage isn't wired in yet
 * — see docs/ROADMAP.md Phase 5 — this saves the nutrition data, which is
 * what calorie totals actually depend on.
 */
export async function createMealWithItems(items: FoodItem[]): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not signed in');

  const totalCalories = calculateMealCalories(items);

  const { data: meal, error: mealError } = await supabase
    .from('meals')
    .insert({ user_id: user.id, total_calories: totalCalories, confirmed: true })
    .select()
    .single();
  if (mealError) throw mealError;

  if (items.length > 0) {
    const { error: itemsError } = await supabase.from('meal_items').insert(
      items.map((item) => ({
        meal_id: meal.id,
        name: item.name,
        estimated_grams: item.estimatedGrams,
        calories_per_100g: item.caloriesPer100g,
        source: item.source,
      }))
    );
    if (itemsError) throw itemsError;
  }

  return meal.id;
}

/** Fetches every meal logged today for the signed-in user, newest first. */
export async function fetchTodaysMeals(): Promise<Meal[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const { data: meals, error } = await supabase
    .from('meals')
    .select(
      'id, created_at, total_calories, confirmed, meal_items(name, estimated_grams, calories_per_100g, source)'
    )
    .eq('user_id', user.id)
    .gte('created_at', startOfDay.toISOString())
    .order('created_at', { ascending: false });

  if (error) {
    console.log('fetchTodaysMeals error:', error.message);
    return [];
  }

  return (meals || []).map((m: any) => ({
    id: m.id,
    userId: user.id,
    createdAt: m.created_at,
    photos: [],
    items: (m.meal_items || []).map((i: any) => ({
      name: i.name,
      estimatedGrams: i.estimated_grams,
      caloriesPer100g: i.calories_per_100g,
      source: i.source,
    })),
    totalCalories: m.total_calories,
    confirmed: m.confirmed,
  }));
}
