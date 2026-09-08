import { FoodItem, Meal } from '../types';

export function calculateItemCalories(item: FoodItem): number {
  return (item.caloriesPer100g / 100) * item.estimatedGrams;
}

export function calculateMealCalories(items: FoodItem[]): number {
  return Math.round(
    items.reduce((sum, item) => sum + calculateItemCalories(item), 0)
  );
}

export function calculateDailyTotal(meals: Meal[]): number {
  return meals.reduce((sum, meal) => sum + meal.totalCalories, 0);
}

export function remainingCalories(
  dailyLimit: number,
  meals: Meal[]
): number {
  return dailyLimit - calculateDailyTotal(meals);
}
