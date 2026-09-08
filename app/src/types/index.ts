// Core domain types shared across screens and lib functions.

export interface FoodItem {
  name: string;
  /** grams — user-confirmed, not assumed exact. See ARCHITECTURE.md */
  estimatedGrams: number;
  caloriesPer100g: number;
  source: 'usda' | 'openfoodfacts' | 'manual';
}

export interface MealPhoto {
  id: string;
  uri: string;
  /** which "plate" this photo belongs to within a multi-plate meal */
  plateIndex: number;
}

export interface Meal {
  id: string;
  userId: string;
  createdAt: string; // ISO timestamp
  photos: MealPhoto[];
  items: FoodItem[];
  totalCalories: number;
  /** null until the classifier + user confirmation step completes */
  confirmed: boolean;
}

export interface PackagedFoodScanResult {
  barcode: string;
  productName: string;
  caloriesPer100g: number | null;
  nutriScore: 'a' | 'b' | 'c' | 'd' | 'e' | null;
  novaGroup: 1 | 2 | 3 | 4 | null; // processing level, from Open Food Facts
  ingredientsText: string | null;
}

export interface UserSettings {
  dailyCalorieLimit: number;
  waterReminderIntervalMinutes: number;
}
